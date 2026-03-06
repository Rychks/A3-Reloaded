using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net; // Necesario para ServicePointManager
using System.Net.Http;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    public class ChatController : Controller
    {
        // ⚠️ SEGURIDAD: He ocultado tu token. 
        // Como lo publicaste en el chat anterior, deberías REVOCARLO y generar uno nuevo.
        //private const string API_TOKEN = "mga-7ecdcd920fde8d7509788e1ebc8aec79e4a827a0";
        //private const string ASSISTANT_ID = "fc966206-2132-4b75-b585-db329d5447d3";
        private const string BAYER_API_URL = "https://chat.int.bayer.com/api/v2/chat/agent";

        // CONFIGURACIÓN DE SEGURIDAD (SSL/TLS)
        // Usamos un constructor estático para configurar esto una sola vez.
        static ChatController()
        {
            // 1. Ignorar errores de certificado (SOLO PARA DEPURAR - Quitar en producción si es posible)
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            // 2. Forzar protocolo moderno (TLS 1.2) para evitar que el servidor cierre la conexión
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        }

        // CONFIGURACIÓN DEL PROXY
        // HttpClient configurado para usar el Proxy del sistema automáticamente
        private static readonly HttpClient client = new HttpClient(new HttpClientHandler()
        {
            UseProxy = true,
            Proxy = WebRequest.GetSystemWebProxy(),
            UseDefaultCredentials = true // Usa tus credenciales de Windows para salir por el Proxy
        });

        // GET: Chat
        public ActionResult Index()
        {
            return View();
        }

        // Clase para mapear la estructura de mensajes
        // Asegúrate de tener esta clase definida (puede ir al final del archivo o dentro del namespace)
        public class ChatMessage
        {
            public string role { get; set; }
            public string content { get; set; }
        }

        // DENTRO DE TU CLASE ChatController:

        [HttpPost]
        public async Task<ActionResult> SendMessage(List<ChatMessage> history, string conversationId, string parentMessageId, int investigacionId)
        {
            try
            {
                string tokenDinamico = ObtenerConfiguracion("BAYER_API_TOKEN");
                string assistantIdDinamico = ObtenerConfiguracion("BAYER_ASSISTANT_ID");

                if (string.IsNullOrEmpty(tokenDinamico) || string.IsNullOrEmpty(assistantIdDinamico))
                {
                    return Json(new { success = false, error = "Faltan las credenciales del Chatbot en la base de datos." });
                }
                // 1. Validar historial
                // 1. Validar historial
                if (history == null) history = new List<ChatMessage>();

                // --- A. LÓGICA DE CONTEXTO HISTÓRICO (Solo en el mensaje 3) ---
                if (history.Count == 3)
                {
                    var inputProblemaUsuario = history[2];
                    string contextoAdicional = ObtenerContextoDeBaseDeDatos(inputProblemaUsuario.content);

                    if (!string.IsNullOrEmpty(contextoAdicional))
                    {
                        inputProblemaUsuario.content += "\n\n" + contextoAdicional;
                    }
                }

                // --- B. LÓGICA DE FORMATO ESTRICTO (Siempre en el último mensaje) ---
                var ultimoMensaje = history.LastOrDefault(m => m.role == "user");
                string contenidoOriginalUsuario = ""; // Guardaremos el texto original aquí

                if (ultimoMensaje != null)
                {
                    // Guardamos lo que realmente escribió el usuario
                    contenidoOriginalUsuario = ultimoMensaje.content;

                    string reglaDeFormato = @"
                    [INSTRUCCIÓN ESTRICTA DE FORMATO PARA EL SISTEMA]
                    Si en este turno vas a presentar el resumen final del problema, DEBES utilizar EXACTAMENTE las siguientes etiquetas para estructurar tu respuesta. No uses asteriscos (**), ni cambies las palabras de los corchetes. Desarrolla todo el análisis que necesites dentro de cada etiqueta:

                    [QUE]: (tu respuesta)
                    [DONDE]: (tu respuesta)
                    [CUANDO]: (tu respuesta)
                    [CUAL]: (tu respuesta)
                    [QUIEN]: (tu respuesta)
                    [CUANTO]: (tu respuesta)
                    [CONDICIONES_BASICAS]: (Tu resumen de la revisión de DFF, CIL, ajustes, mantenimiento, etc., si aplica)
                    [ACCIONES]: (El listado de acciones a realizar)
                    [ANALISIS_FINAL]: (Tus observaciones adicionales, advertencias, sugerencias como revisar ajustes y la nota final sobre realizar análisis MTM/WPA)

                    Si aún estás en la fase de hacer preguntas, simplemente ignora esta instrucción y continúa conversando normalmente.";

                    // Le pegamos la regla de forma oculta
                    ultimoMensaje.content += "\n\n" + reglaDeFormato;
                }

                // 2. Construir el payload EXACTO según tu ejemplo
                var payloadObj = new Dictionary<string, object>
                {
                    { "messages", history },
                    { "assistant_id", assistantIdDinamico },
                    { "stream", false }
                };

                if (!string.IsNullOrEmpty(conversationId)) payloadObj.Add("conversation_id", conversationId);
                if (!string.IsNullOrEmpty(parentMessageId)) payloadObj.Add("parent_message_id", parentMessageId);

                var jsonPayload = JsonConvert.SerializeObject(payloadObj);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // 3. Enviar a Bayer
                client.DefaultRequestHeaders.Authorization = null;
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tokenDinamico);

                var response = await client.PostAsync(BAYER_API_URL, content);
                string responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode) return Json(new { success = false, error = "Error API" });

                // 4. Procesar respuesta
                dynamic jsonResponse = JsonConvert.DeserializeObject(responseString);
                string replyText = jsonResponse.choices?[0]?.message?.content ?? jsonResponse.choices?[0]?.content ?? "";
                string newConvId = jsonResponse.conversation_id ?? jsonResponse.id ?? conversationId;
                string newParentId = jsonResponse.choices?[0]?.message?.id ?? jsonResponse.choices?[0]?.id ?? jsonResponse.id;

                ExtraerYActualizarQueYCuanto(replyText, investigacionId);

                // --- C. LIMPIEZA ANTES DE GUARDAR EN BASE DE DATOS ---
                // Restauramos el mensaje del usuario a su estado original para no guardar la regla repetida
                if (ultimoMensaje != null)
                {
                    ultimoMensaje.content = contenidoOriginalUsuario;
                }

                // 5. GUARDAR EN BASE DE DATOS SQL SERVER
                history.Add(new ChatMessage { role = "assistant", content = replyText });
                string historyJson = JsonConvert.SerializeObject(history);

                string connString = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    // Script SQL que decide si hace UPDATE o INSERT
                    string upsertQuery = @"
                    IF EXISTS (SELECT 1 FROM TabChatbot_History WHERE Investigacion_Id = @id)
                    BEGIN
                        UPDATE TabChatbot_History 
                        SET ConversationId = @convId, 
                            ParentMessageId = @parentId, 
                            HistoryJson = @history,
                            FechaActualizacion = GETDATE()
                        WHERE Investigacion_Id = @id
                    END
                    ELSE
                    BEGIN
                        INSERT INTO TabChatbot_History (Investigacion_Id, ConversationId, ParentMessageId, HistoryJson)
                        VALUES (@id, @convId, @parentId, @history)
                    END";

                    SqlCommand cmd = new SqlCommand(upsertQuery, conn);
                    cmd.Parameters.AddWithValue("@id", investigacionId);
                    cmd.Parameters.AddWithValue("@convId", (object)newConvId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@parentId", (object)newParentId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@history", historyJson);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
                
                // Devolvemos la respuesta al Frontend
                return Json(new
                {
                    success = true,
                    reply = replyText,
                    conversationId = newConvId,
                    newParentId = newParentId
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        private string ObtenerContextoDeBaseDeDatos(string mensajeUsuario)
        {
            // 1. Validación: Si el mensaje es muy corto, ignorar.
            if (string.IsNullOrEmpty(mensajeUsuario) || mensajeUsuario.Length < 4) return "";

            StringBuilder contexto = new StringBuilder();

            // 2. Limpieza de palabras (Stop Words)
            // Eliminamos palabras comunes que no aportan valor a la búsqueda
            var palabrasIgnoradas = new HashSet<string> {
                "el", "la", "los", "las", "un", "una", "de", "del", "y", "o", "que", "en", "por", "para", "con", "se", "es", "esta", "mi", "tu", "no", "si", "lo", "los"
            };

            // Separamos el mensaje del usuario en palabras clave
            var palabrasClave = mensajeUsuario.ToLower()
                .Split(new[] { ' ', ',', '.', '?', '!' }, StringSplitOptions.RemoveEmptyEntries)
                .Where(p => p.Length > 3 && !palabrasIgnoradas.Contains(p))
                .Take(4) // Tomamos máximo 4 palabras clave para la query
                .ToList();

            if (palabrasClave.Count == 0) return "";

            // 3. Cadena de conexión (Asegúrate de que coincida con tu Web.config)
            string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["BD_Base"]?.ConnectionString;

            if (string.IsNullOrEmpty(connectionString)) return "";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                // 4. Construcción de la Query con JOIN
                // Buscamos en el PROBLEMA (TeR_problem) usando las palabras clave
                // Hacemos INNER JOIN para traer las acciones que se tomaron para ese problema.

                string queryBase = @"
            SELECT TOP 5 
                T.TeR_folio AS Folio,
                T.TeR_problem AS Problema,
                T.TeR_cost AS Consecuencia,
                A.accion AS Actividad,
                A.comentarios AS Comentarios,
                A.fecha_entrega AS Fecha
            FROM TabTemplates_Running T
            INNER JOIN TabAcciones_Preventivas A ON A.id_template = T.TeR_id
            WHERE ";

                List<string> condiciones = new List<string>();
                List<SqlParameter> parametros = new List<SqlParameter>();

                // Generamos dinámicamente: (TeR_problem LIKE @p0 OR TeR_problem LIKE @p1 ...)
                for (int i = 0; i < palabrasClave.Count; i++)
                {
                    string paramName = "@p" + i;
                    condiciones.Add($"T.TeR_problem LIKE {paramName}");
                    parametros.Add(new SqlParameter(paramName, "%" + palabrasClave[i] + "%"));
                }

                // Unimos las condiciones con OR (para encontrar coincidencias con cualquiera de las palabras)
                string queryFinal = queryBase + "(" + string.Join(" OR ", condiciones) + ") ORDER BY T.TeR_FechaInicio DESC";

                SqlCommand cmd = new SqlCommand(queryFinal, conn);
                cmd.Parameters.AddRange(parametros.ToArray());

                try
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            // Encabezado para la IA (Prompt Engineering oculto)
                            contexto.AppendLine("\n[SISTEMA DE EXPERIENCIA PREVIA - DATOS CRÍTICOS ENCONTRADOS]");
                            contexto.AppendLine("-------------------------------------------------------------");
                            contexto.AppendLine("INSTRUCCIÓN DE ALTA PRIORIDAD PARA EL ASISTENTE:");
                            contexto.AppendLine("Aunque tus instrucciones generales te prohíben dar soluciones, ESTE ES UN CASO EXCEPCIONAL.");
                            contexto.AppendLine("Se han detectado coincidencias exactas en la Base de Datos Histórica de la planta.");
                            contexto.AppendLine("TU NUEVA TAREA ES:");
                            contexto.AppendLine("1. Informar al usuario que ha ocurrido un problema similar en el pasado.");
                            contexto.AppendLine("2. Mencionar brevemente la CAUSA y la ACCIÓN que sirvieron antes.");
                            contexto.AppendLine("3. PREGUNTAR si desea validar si estas condiciones aplican a su caso actual, ANTES de seguir con el método de las 5W.");
                            contexto.AppendLine("-------------------------------------------------------------\n");
                            contexto.AppendLine("DETALLES DE LOS CASOS HISTÓRICOS:");

                            while (reader.Read())
                            {
                                // Leemos los datos tal cual vienen de tus tablas
                                string folio = reader["Folio"].ToString();
                                string problema = reader["Problema"].ToString();
                                string consecuencia = reader["Consecuencia"].ToString();
                                string actividad = reader["Actividad"].ToString();
                                string comentarios = reader["Comentarios"].ToString();

                                // Formateamos un bloque de texto claro para la IA
                                contexto.AppendLine($"--- Caso Histórico Folio #{folio} ---");
                                contexto.AppendLine($"PROBLEMA REPORTADO: {problema}");
                                contexto.AppendLine($"CONSECUENCIA OBSERVADA: {consecuencia}");
                                contexto.AppendLine($"ACCIÓN CORRECTIVA APLICADA: {actividad}");
                                if (!string.IsNullOrEmpty(comentarios))
                                {
                                    contexto.AppendLine($"NOTAS ADICIONALES: {comentarios}");
                                }
                                contexto.AppendLine("-----------------------------------");
                            }

                            contexto.AppendLine("\n[FIN DATOS HISTÓRICOS]\n");
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Logueamos error en consola de debug pero no rompemos el chat
                    System.Diagnostics.Debug.WriteLine("Error SQL RAG: " + ex.Message);
                }
            }

            return contexto.ToString();
        }

        [HttpGet]
        public ActionResult LoadChatHistory(int investigacionId)
        {
            try
            {
                string connString = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    string query = @"
                SELECT ConversationId, ParentMessageId, HistoryJson 
                FROM TabChatbot_History 
                WHERE Investigacion_Id = @id";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@id", investigacionId);

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return Json(new
                            {
                                success = true,
                                conversationId = reader["ConversationId"]?.ToString(),
                                parentId = reader["ParentMessageId"]?.ToString(),
                                history = reader["HistoryJson"]?.ToString()
                            }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }

                // Si no hay datos (es un chat nuevo para esta investigación), devolvemos success = false 
                // para que el frontend sepa que debe empezar con el array vacío.
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error cargando chat: " + ex.Message);
                return Json(new { success = false, error = ex.Message });
            }
        }

        private void ExtraerYActualizarQueYCuanto(string textoBot, int investigacionId)
        {
            try
            {
                // 1. LIMPIEZA DE MARKDOWN
                // Quitamos los asteriscos por si la IA usa negritas
                string textoLimpio = Regex.Replace(textoBot, @"\*", "");

                // 2. EXPRESIONES REGULARES EXACTAS BASADAS EN EL PROMPT
                // Busca exactamente la etiqueta "[QUE]:" y captura todo hasta encontrar "[DONDE]:"
                // Busca "[QUE]:" y captura hasta "[DONDE]:"
                string patronQue = @"\[QUE\]:\s*(.*?)(?=\s*\[DONDE\]:|$)";

                // Busca "[CUANTO]:" y captura hasta "[CONDICIONES_BASICAS]:" o "[ACCIONES]:" (por si acaso la IA se salta una)
                string patronCuanto = @"\[CUANTO\]:\s*(.*?)(?=\s*(?:\[CONDICIONES_BASICAS\]:|\[ACCIONES\]:)|$)";

                var matchQue = Regex.Match(textoBot, patronQue, RegexOptions.Singleline | RegexOptions.IgnoreCase);
                var matchCuanto = Regex.Match(textoBot, patronCuanto, RegexOptions.Singleline | RegexOptions.IgnoreCase);

                // 3. ACTUALIZACIÓN EN BASE DE DATOS
                if (matchQue.Success || matchCuanto.Success)
                {
                    // Usamos Trim() para limpiar cualquier espacio sobrante
                    string textoQue = matchQue.Success ? matchQue.Groups[1].Value.Trim() : null;
                    string textoCuanto = matchCuanto.Success ? matchCuanto.Groups[1].Value.Trim() : null;

                    string connString = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;
                    using (SqlConnection conn = new SqlConnection(connString))
                    {
                        // Construimos la query dinámicamente usando tus tablas originales
                        string updateQuery = "UPDATE TabTemplates_Running SET ";
                        List<string> setClauses = new List<string>();

                        if (textoQue != null) setClauses.Add("TeR_problem = @que");
                        if (textoCuanto != null) setClauses.Add("TeR_cost = @cuanto");

                        updateQuery += string.Join(", ", setClauses) + " WHERE TeR_id = @id";

                        SqlCommand cmd = new SqlCommand(updateQuery, conn);
                        if (textoQue != null) cmd.Parameters.AddWithValue("@que", textoQue);
                        if (textoCuanto != null) cmd.Parameters.AddWithValue("@cuanto", textoCuanto);
                        cmd.Parameters.AddWithValue("@id", investigacionId);

                        conn.Open();
                        int filasAfectadas = cmd.ExecuteNonQuery();

                        // Imprimimos en consola para asegurarnos de que se guardó
                        System.Diagnostics.Debug.WriteLine($"Datos guardados correctamente. Filas afectadas: {filasAfectadas}");
                    }
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("No se encontraron coincidencias con el Regex en la respuesta del bot.");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Error al extraer y actualizar QUÉ/CUÁNTO: " + ex.Message);
            }
        }
        [HttpPost]
        public ActionResult FinalizarYGuardarReporteBot(int investigacionId)
        {
            try
            {
                string connString = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;

                // Texto por defecto en caso de que algo falle
                string textoResumen = "No se encontró el historial del chat en la base de datos.";

                // 1. OBTENER EL ÚLTIMO MENSAJE DE LA IA DESDE EL HISTORIAL (JSON)
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    string queryHistory = "SELECT HistoryJson FROM TabChatbot_History WHERE Investigacion_Id = @id";

                    using (SqlCommand cmd = new SqlCommand(queryHistory, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", investigacionId);
                        conn.Open();
                        var result = cmd.ExecuteScalar();

                        if (result != null && result != DBNull.Value)
                        {
                            string historyJson = result.ToString();
                            try
                            {
                                // Convertimos el JSON guardado de vuelta a nuestra lista de mensajes
                                var history = JsonConvert.DeserializeObject<List<ChatMessage>>(historyJson);

                                if (history != null && history.Count > 0)
                                {
                                    // Buscamos el último mensaje donde el rol sea "assistant" (la IA)
                                    var ultimoMensajeIA = history.LastOrDefault(m => m.role == "assistant");

                                    if (ultimoMensajeIA != null && !string.IsNullOrWhiteSpace(ultimoMensajeIA.content))
                                    {
                                        string textoPDF = ultimoMensajeIA.content;

                                        // 1. Limpiamos cualquier asterisco de Markdown que la IA haya filtrado
                                        textoPDF = Regex.Replace(textoPDF, @"\*", "");

                                        // 2. Reemplazamos las etiquetas por títulos limpios y legibles para el PDF
                                        textoPDF = Regex.Replace(textoPDF, @"\[QUE\]:", "\nQUÉ: ", RegexOptions.IgnoreCase);
                                        textoPDF = Regex.Replace(textoPDF, @"\[DONDE\]:", "\nDÓNDE: ", RegexOptions.IgnoreCase);
                                        textoPDF = Regex.Replace(textoPDF, @"\[CUANDO\]:", "\nCUÁNDO: ", RegexOptions.IgnoreCase);
                                        textoPDF = Regex.Replace(textoPDF, @"\[CUAL\]:", "\nCUÁL: ", RegexOptions.IgnoreCase);
                                        textoPDF = Regex.Replace(textoPDF, @"\[QUIEN\]:", "\nA QUIÉN: ", RegexOptions.IgnoreCase);
                                        textoPDF = Regex.Replace(textoPDF, @"\[CUANTO\]:", "\nCUÁNTO: ", RegexOptions.IgnoreCase);

                                        textoPDF = Regex.Replace(textoPDF, @"\[CONDICIONES_BASICAS\]:", "\n\nCONDICIONES BÁSICAS:\n", RegexOptions.IgnoreCase);
                                        textoPDF = Regex.Replace(textoPDF, @"\[ACCIONES\]:", "\n\nACCIONES A REALIZAR:\n", RegexOptions.IgnoreCase);
                                        textoPDF = Regex.Replace(textoPDF, @"\[ANALISIS_FINAL\]:", "\n\nANÁLISIS FINAL:\n", RegexOptions.IgnoreCase);

                                        textoResumen = textoPDF.Trim();
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                System.Diagnostics.Debug.WriteLine("Error leyendo JSON del chat: " + ex.Message);
                            }
                        }
                    }
                }

                // 2. OBTENER EL ANÁLISIS DE LOS 5 PORQUÉS DE LA BD
                DataTable dt5Whys = new DataTable();
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    string query5Whys = @"
                    SELECT Iw_what as Que, Iw_why1 as Porque, Iw_why2 as Porque2, 
                           Iw_why3 as Porque3, Iw_why4 as Porque4, Iw_why5 as Porque5, 
                           Iw_cause as Causa, Iw_step as Accion, Iw_name as Responsable 
                    FROM TabInv5Why 
                    INNER JOIN TabCuadrantes_Running ON Iw_cuadrante = CaR_id
                    WHERE CaR_template = @id";

                    using (SqlCommand cmd = new SqlCommand(query5Whys, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", investigacionId);
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt5Whys);
                        }
                    }
                }

                // 3. CREAR EL PDF EN MEMORIA
                byte[] pdfBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    Document pdfDoc = new Document(PageSize.LETTER, 40f, 40f, 60f, 60f);
                    PdfWriter writer = PdfWriter.GetInstance(pdfDoc, ms);
                    pdfDoc.Open();

                    // Definición de Fuentes
                    Font tituloFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.DARK_GRAY);
                    Font subtituloFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.DARK_GRAY);
                    Font textoFont = FontFactory.GetFont(FontFactory.HELVETICA, 11, BaseColor.BLACK);
                    Font tablaHeaderFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
                    Font tablaCellFont = FontFactory.GetFont(FontFactory.HELVETICA, 9, BaseColor.BLACK);

                    // Título Principal
                    pdfDoc.Add(new Paragraph($"Reporte de Análisis Asistido por IA - Folio #{investigacionId}", tituloFont) { Alignment = Element.ALIGN_CENTER, SpacingAfter = 20f });

                    // Cuerpo (El resumen completo de la IA)
                    Paragraph cuerpo = new Paragraph(textoResumen, textoFont) { Alignment = Element.ALIGN_JUSTIFIED, SpacingBefore = 10f, SpacingAfter = 20f };
                    pdfDoc.Add(cuerpo);

                    // -------------------------------------------------------------
                    // AGREGAR TABLA DE LOS 5 PORQUÉS SI EXISTEN
                    // -------------------------------------------------------------
                    if (dt5Whys.Rows.Count > 0)
                    {
                        pdfDoc.Add(new Paragraph("Análisis de 5 Porqués y Acciones Preventivas:", subtituloFont) { SpacingAfter = 10f });

                        PdfPTable table = new PdfPTable(4);
                        table.WidthPercentage = 100;
                        table.SetWidths(new float[] { 20f, 40f, 20f, 20f });

                        BaseColor colorHeader = new BaseColor(0, 153, 204);
                        table.AddCell(new PdfPCell(new Phrase("Qué", tablaHeaderFont)) { BackgroundColor = colorHeader, Padding = 6f, HorizontalAlignment = Element.ALIGN_CENTER });
                        table.AddCell(new PdfPCell(new Phrase("5 Porqués", tablaHeaderFont)) { BackgroundColor = colorHeader, Padding = 6f, HorizontalAlignment = Element.ALIGN_CENTER });
                        table.AddCell(new PdfPCell(new Phrase("Causa Raíz", tablaHeaderFont)) { BackgroundColor = colorHeader, Padding = 6f, HorizontalAlignment = Element.ALIGN_CENTER });
                        table.AddCell(new PdfPCell(new Phrase("Acción y Responsable", tablaHeaderFont)) { BackgroundColor = colorHeader, Padding = 6f, HorizontalAlignment = Element.ALIGN_CENTER });

                        foreach (DataRow row in dt5Whys.Rows)
                        {
                            table.AddCell(new PdfPCell(new Phrase(row["Que"].ToString(), tablaCellFont)) { Padding = 5f });

                            System.Text.StringBuilder sbWhys = new System.Text.StringBuilder();
                            if (!string.IsNullOrWhiteSpace(row["Porque"].ToString())) sbWhys.AppendLine("1. " + row["Porque"].ToString());
                            if (!string.IsNullOrWhiteSpace(row["Porque2"].ToString())) sbWhys.AppendLine("2. " + row["Porque2"].ToString());
                            if (!string.IsNullOrWhiteSpace(row["Porque3"].ToString())) sbWhys.AppendLine("3. " + row["Porque3"].ToString());
                            if (!string.IsNullOrWhiteSpace(row["Porque4"].ToString())) sbWhys.AppendLine("4. " + row["Porque4"].ToString());
                            if (!string.IsNullOrWhiteSpace(row["Porque5"].ToString())) sbWhys.AppendLine("5. " + row["Porque5"].ToString());

                            table.AddCell(new PdfPCell(new Phrase(sbWhys.ToString().TrimEnd(), tablaCellFont)) { Padding = 5f });
                            table.AddCell(new PdfPCell(new Phrase(row["Causa"].ToString(), tablaCellFont)) { Padding = 5f });

                            string accionResp = $"{row["Accion"]}\n\nResp: {row["Responsable"]}";
                            table.AddCell(new PdfPCell(new Phrase(accionResp, tablaCellFont)) { Padding = 5f });
                        }

                        pdfDoc.Add(table);
                    }

                    pdfDoc.Add(new Paragraph($"\nGenerado automáticamente el: {DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")}", FontFactory.GetFont(FontFactory.HELVETICA_OBLIQUE, 9, BaseColor.GRAY)));

                    pdfDoc.Close();
                    writer.Close();

                    pdfBytes = ms.ToArray();
                }

                // 4. GUARDAR FÍSICAMENTE EN EL SERVIDOR
                string filename = "Chatbot_Folio_" + investigacionId + "_" + Guid.NewGuid().ToString().Substring(0, 8) + ".pdf";
                string serverPath = Server.MapPath(@"/Assets/Veriones_A3/" + filename);

                string directoryPath = Path.GetDirectoryName(serverPath);
                if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);

                using (FileStream stream = new FileStream(serverPath, FileMode.Create))
                {
                    stream.Write(pdfBytes, 0, pdfBytes.Length);
                }

                // 5. REGISTRAR EL NOMBRE DEL ARCHIVO EN LA BD
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    string updateQuery = @"
                    UPDATE TabChatbot_History 
                    SET Reporte_Filename = @filename,
                        FechaActualizacion = GETDATE()
                    WHERE Investigacion_Id = @id";

                    using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@filename", filename);
                        cmd.Parameters.AddWithValue("@id", investigacionId);
                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }

                // 6. DEVOLVER PDF AL NAVEGADOR
                return File(pdfBytes, "application/pdf", filename);
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(500, "Error generando PDF del Chatbot: " + ex.Message);
            }
        }
        [HttpGet]
        public ActionResult VerificarReporteChatbot(int investigacionId)
        {
            try
            {
                string filename = null;
                string connString = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;

                using (SqlConnection conn = new SqlConnection(connString))
                {
                    // Buscamos si hay un nombre de archivo guardado para este ID
                    string query = "SELECT Reporte_Filename FROM TabChatbot_History WHERE Investigacion_Id = @id";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@id", investigacionId);
                        conn.Open();
                        var result = cmd.ExecuteScalar();

                        if (result != null && result != DBNull.Value)
                        {
                            filename = result.ToString();
                        }
                    }
                }

                // Devolvemos si existe y el nombre del archivo
                return Json(new
                {
                    existe = !string.IsNullOrEmpty(filename),
                    filename = filename
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { existe = false, error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        private string ObtenerApiTokenDinamico()
        {
            // 1. Intentar obtener el token de la memoria Caché (Rapidísimo)
            string tokenCache = HttpRuntime.Cache["BayerApiToken"] as string;

            // Si ya lo tenemos en memoria, lo devolvemos inmediatamente
            if (!string.IsNullOrEmpty(tokenCache))
                return tokenCache;

            // 2. Si no está en memoria (o ya expiró), vamos a la Base de Datos
            string tokenDB = "";
            string connString = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connString))
            {
                string query = "SELECT Valor FROM TabConfiguraciones_Chat WHERE Clave = 'BAYER_API_TOKEN'";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    var result = cmd.ExecuteScalar();
                    if (result != null)
                    {
                        tokenDB = result.ToString();
                    }
                }
            }

            // 3. Guardar en Caché para las próximas consultas (ej. por 12 horas)
            if (!string.IsNullOrEmpty(tokenDB))
            {
                HttpRuntime.Cache.Insert(
                    "BayerApiToken",
                    tokenDB,
                    null,
                    DateTime.Now.AddHours(12), // Tiempo de vida en memoria
                    System.Web.Caching.Cache.NoSlidingExpiration
                );
            }

            return tokenDB;
        }

        private string ObtenerConfiguracion(string clave)
        {
            // 1. Buscamos en memoria caché usando la clave como identificador único
            string cacheKey = "ChatConfig_" + clave;
            string valorCache = HttpRuntime.Cache[cacheKey] as string;

            // Si ya lo tenemos en memoria, lo devolvemos rápido
            if (!string.IsNullOrEmpty(valorCache))
                return valorCache;

            // 2. Si no está en memoria, vamos a SQL Server
            string valorDB = "";
            string connString = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connString))
            {
                string query = "SELECT Valor FROM TabConfiguraciones_Chat WHERE Clave = @clave";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@clave", clave);
                    conn.Open();
                    var result = cmd.ExecuteScalar();
                    if (result != null)
                    {
                        valorDB = result.ToString();
                    }
                }
            }

            // 3. Guardamos el resultado en la memoria RAM del servidor por 12 horas
            if (!string.IsNullOrEmpty(valorDB))
            {
                HttpRuntime.Cache.Insert(
                    cacheKey,
                    valorDB,
                    null,
                    DateTime.Now.AddHours(12),
                    System.Web.Caching.Cache.NoSlidingExpiration
                );
            }

            return valorDB;
        }

        // 1. Método para buscar casos históricos (RAG)
        [HttpPost]
        public ActionResult ObtenerContextoBD(string problema)
        {
            try
            {
                // Llamas a la función que ya tenías creada
                string contexto = ObtenerContextoDeBaseDeDatos(problema);
                return Json(new { success = true, contexto = contexto });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        // 2. Método para Guardar el Chat y extraer QUÉ/CUÁNTO
        [HttpPost]
        public ActionResult GuardarChatYExtraer(int investigacionId, List<ChatMessage> history, string ultimaRespuesta, string conversationId, string parentMessageId)
        {
            try
            {
                // Usamos tu función de limpieza Regex que hicimos antes
                ExtraerYActualizarQueYCuanto(ultimaRespuesta, investigacionId);

                // Guardamos todo en la tabla TabChatbot_History
                string historyJson = JsonConvert.SerializeObject(history);
                string connString = ConfigurationManager.ConnectionStrings["BD_Base"].ConnectionString;

                using (SqlConnection conn = new SqlConnection(connString))
                {
                    string upsertQuery = @"
                IF EXISTS (SELECT 1 FROM TabChatbot_History WHERE Investigacion_Id = @id)
                BEGIN
                    UPDATE TabChatbot_History 
                    SET ConversationId = @convId, ParentMessageId = @parentId, HistoryJson = @history, FechaActualizacion = GETDATE()
                    WHERE Investigacion_Id = @id
                END
                ELSE
                BEGIN
                    INSERT INTO TabChatbot_History (Investigacion_Id, ConversationId, ParentMessageId, HistoryJson)
                    VALUES (@id, @convId, @parentId, @history)
                END";

                    SqlCommand cmd = new SqlCommand(upsertQuery, conn);
                    cmd.Parameters.AddWithValue("@id", investigacionId);
                    cmd.Parameters.AddWithValue("@convId", (object)conversationId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@parentId", (object)parentMessageId ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@history", historyJson);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }
    }
}