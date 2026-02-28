using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class ChatController : Controller
    {
        // GET: Chat
        public ActionResult Index()
        {
            return View();
        }

        private const string API_TOKEN = "mga-xxxxxxxxxxxxxxxxxxxxxxxx";
        private const string ASSISTANT_ID = "fc966206-2132-4b75-b585-db329d5447d3";
        private const string BAYER_API_URL = "https://chat.int.bayer.com/api/v2/chat/agent";

        // HttpClient debe ser estático para evitar agotar sockets en .NET Framework
        private static readonly HttpClient client = new HttpClient();

        [HttpPost]
        public async Task<ActionResult> SendMessage(string message)
        {
            try
            {
                // 1. Construir el payload que pide Bayer
                var payload = new
                {
                    messages = new[]
                    {
                        new { role = "user", content = message }
                    },
                    assistant_id = ASSISTANT_ID,
                    stream = false
                };

                var jsonPayload = JsonConvert.SerializeObject(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // 2. Configurar Headers
                // Limpiamos headers anteriores por si acaso
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", API_TOKEN);

                // 3. Llamar a la API de Bayer (Server-to-Server)
                var response = await client.PostAsync(BAYER_API_URL, content);

                // 4. Leer respuesta
                string responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, error = "Error en API Bayer: " + response.StatusCode });
                }

                // 5. Deserializar para extraer solo el texto (opcional, o devolver todo el JSON)
                dynamic jsonResponse = JsonConvert.DeserializeObject(responseString);

                // Dependiendo de la estructura exacta de Bayer, el texto suele estar aquí:
                string replyText = "";
                if (jsonResponse.choices != null && jsonResponse.choices[0] != null)
                {
                    // A veces viene en .content directo o dentro de .message.content
                    replyText = jsonResponse.choices[0].content ?? jsonResponse.choices[0].message?.content;
                }

                return Json(new { success = true, reply = replyText });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

    }
}