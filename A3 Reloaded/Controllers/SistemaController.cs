using A3_Reloaded.Clases;
using A3_Reloaded.Models;
using Microsoft.Ajax.Utilities;
using Microsoft.Reporting.WebForms;
using Microsoft.SqlServer.Server;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class SistemaController : Controller
    {
        TemplatesRunning TER = new TemplatesRunning();
        TemplatesRunning templateR = new TemplatesRunning();
        Templates TE = new Templates();
        Secciones SE = new Secciones();
        Items IT = new Items();
        Usuarios US = new Usuarios();
        Notificaciones noti = new Notificaciones();
        AuditTrail AT = new AuditTrail();
        Reponses responses = new Reponses();
        OEE oee= new OEE();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult InicioA3(int Id_a3 = 0)
        {
            ViewBag.Id = Id_a3;

            return View();
        }
        public ActionResult formatoA3()
        {
            return View();
        }
        public ActionResult HistorialA3()
        {
            return View();
        }
        public JsonResult getA3_type(int id_cuadrante)
        {
            return Json(TER.getA3_type(id_cuadrante));
        }
        public JsonResult get_clasificacion_Falla_by_id_template(int id_template)
        {
            return Json(TER.get_clasificacion_Falla_by_id_template(id_template));
        }
        public JsonResult get_modo_falla_by_id_template(int id_template)
        {
            return Json(TER.get_modo_falla_by_id_template(id_template));
        }
        public JsonResult insert_modofalla_running(int id_template, int id_codigo,int id_categoria,string codigo)
        {
            try
            {
                templateR.insert_modofalla_running(id_template,id_codigo,id_categoria,codigo);
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Investigacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult insert_falla_running(int id_template,string linea,string maquina,string motivo,string lote,string sku,string producto,string fecha,float minutos,string clasificacion)
        {
            try
            {
                templateR.insert_falla_running(id_template, linea, maquina, motivo, fecha, minutos, clasificacion,"",lote,sku,producto );
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Investigacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerTotalPagTemplatesRunning(string Folio, string TipoA3,string Problem, string Contact, string Estatus,int NumRegistros = 50)
        {
            return Json(TER.obtener_TotalPagTemplatesRunning(Folio, TipoA3, Problem,Contact, Estatus, NumRegistros));
        }
        public JsonResult mostrarTemplatesRunning(string Folio, string TipoA3,string Problem, string Contact, string Estatus, int Index = 0, int NumRegistros = 50)
        {
            List<TemplateModel> list = new List<TemplateModel>();
            try
            {
                DataTable datos = TER.mostrar_TemplatesRunning(Folio, TipoA3, Problem, Contact, Estatus, Index, NumRegistros);
                foreach(DataRow dr in datos.Rows)
                {
                    list.Add(new TemplateModel
                    {
                         RowNumber = Convert.ToInt32(dr["RowNumber"]),
                         ID = Convert.ToInt32(dr["ID"]),
                         Folio = dr["Folio"].ToString(),
                         TipoA3 = dr["TipoA3"].ToString(),
                         Version = Convert.ToInt32(dr["Version"]),
                         Contact = dr["Contact"].ToString(),
                         Descripcion = dr["Problem"].ToString(),
                         Estatus = Convert.ToInt32(dr["Estatus"])
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult comenzar_investigacion(string ID,string Folio, string TipoA3, string Contact, string Problem,string Cost)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.registrar_Template_Running(Folio, TipoA3, 1, Contact, Problem, Cost, 1);
                noti.Mensaje = Mensajes.Investigacion_guardar;
                noti.Tipo = "success";
                noti.Id = id;
                
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Investigacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult crear_estructuraInvestigacion(string template_id,string templateRunning_id)
        {
            try
            {
                string BYTOST = HttpContext.User.Identity.Name;
                DateTime Registro = DateTime.Now;
                DataTable cuadrantes = TE.obtener_cuadrantes_template_id(Convert.ToInt32(template_id));
                foreach (DataRow drC in cuadrantes.Rows)
                {
                    string Ca_nombre = drC["Nombre"].ToString();
                    string Ca_descripcion = drC["Descripcion"].ToString();
                    TER.registrar_cuadrante_Running(Ca_nombre, Convert.ToInt32(templateRunning_id), 0, Ca_descripcion);
                }
                DataTable TabSecciones = SE.obtener_Seccion_TemplateID(Convert.ToInt32(template_id));
                int i = 0;
                int j = TabSecciones.Rows.Count;
                foreach (DataRow dr in TabSecciones.Rows)
                {
                    string idSeccion = dr["ID"].ToString();
                    string nombre = dr["Nombre"].ToString();
                    string descripcion = dr["Descripcion"].ToString();
                    int posicion = Convert.ToInt32(dr["Posicion"]);
                    int cuadranteID = Convert.ToInt32(dr["CuadranteID"]);
                    string cuadranteNom = dr["Cuadrante"].ToString();
                    string idCuandranteRunning = TER.obtener_id_cuadranteRunning(templateRunning_id, cuadranteNom);
                    string idSeccionRunning = TER.registrar_Seccion_Running(nombre, descripcion, posicion, Convert.ToInt32(idCuandranteRunning), Convert.ToInt32(templateRunning_id), 0);
                    obtenerElementos(idSeccion, idSeccionRunning, templateRunning_id);
                    i++;
                }
                if (i == j)
                {
                    noti.Mensaje = Mensajes.Investigacion_guardar;
                    noti.Tipo = "success";
                    noti.Id = templateRunning_id;
                    AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nueva Investigación Folio: " + templateRunning_id + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Investigacion_guardar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Investigacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        private void obtenerElementos(string SeccionID, string SeccionRID, string id_template)
        {
            DataTable dt = IT.obtener_Items_Seccion_ID(SeccionID);
            foreach(DataRow dr in dt.Rows)
            {
                string ID_ELEMENTO = dr["ID_ELEMENTO"].ToString();
                string autofill = dr["autofill_enable"].ToString();
                string table = dr["autofill_table"].ToString();
                string column = dr["autofill_column"].ToString();
                string identifier = dr["autofill_identifier"].ToString();
                string response = string.Empty;
                if(autofill == "1")
                {
                    if(table == "function")
                    {
                        response = responses.getResponse_function(column, identifier, id_template);
                    }
                    else
                    {
                        response = responses.getResponse_table(table, column, identifier, id_template);
                    }
                }
                if (dr["Elemento"].ToString() == "Pregunta")
                {                    
                    ObtenerPregunta(SeccionID, SeccionRID, ID_ELEMENTO, response);

                }else if (dr["Elemento"].ToString() == "Nota")
                {
                    ObtenerNota(SeccionID, SeccionRID, ID_ELEMENTO);
                }else if(dr["Elemento"].ToString() == "Instruccion")
                {
                    ObtenerInstruccion(SeccionID, SeccionRID, ID_ELEMENTO);
                }
                else if(dr["Elemento"].ToString() == "Ishikawua")
                {
                    ObtenerIshikawua(SeccionID, SeccionRID, ID_ELEMENTO);
                }
                else if (dr["Elemento"].ToString() == "Hipotesis")
                {
                    ObtenerHipotesis(SeccionID, SeccionRID, ID_ELEMENTO);
                }else if(dr["Elemento"].ToString() == "Factor")
                {
                    ObtenerFactor(SeccionID, SeccionRID, ID_ELEMENTO);
                }
            }
            
        }
        private void ObtenerPregunta(string SeccionID,string SeccionRID, string ID_ELEMENTO, string response)
        {
            DataTable TabPreguntas = TER.obtener_items_pregunta_seccionsID(Convert.ToInt32(SeccionID), Convert.ToInt32(ID_ELEMENTO));
            foreach(DataRow dr in TabPreguntas.Rows)
            {
                string Nombre = dr["Pr_texto"].ToString();
                string Descripcion = dr["Pr_descripcion"].ToString();
                string tipo = dr["Pr_tipo"].ToString();
                string firma = dr["It_firma"].ToString();

                TER.registrar_Preguntas_Running(Nombre, Descripcion, Convert.ToInt32(tipo), response, 0, Convert.ToInt32(SeccionRID),Convert.ToInt32(firma));
                //TER.registrar_Item_Running("Pregunta", "TabPreguntas_Running", Convert.ToInt32(idPreguntaRunning), 0, Convert.ToInt32(SeccionRID), Nombre);
            }
        }
        private void ObtenerNota(string SeccionID, string SeccionRID, string ID_ELEMENTO)
        {
            DataTable TabPreguntas = TER.obtener_item_Nota_seccionsID(Convert.ToInt32(SeccionID), Convert.ToInt32(ID_ELEMENTO));
            foreach (DataRow dr in TabPreguntas.Rows)
            {
                string Titulo = dr["No_Titulo"].ToString();
                string Descripcion = dr["No_descripcion"].ToString();
                TER.registrar_Nota_Running(Titulo, Descripcion,0, Convert.ToInt32(SeccionRID));
                //TER.registrar_Item_Running("Pregunta", "TabPreguntas_Running", Convert.ToInt32(idPreguntaRunning), 0, Convert.ToInt32(SeccionRID), Nombre);
            }
        }
        private void ObtenerInstruccion(string SeccionID, string SeccionRID, string ID_ELEMENTO)
        {
            DataTable TabPreguntas = TER.obtener_item_Instruccion_seccionsID(Convert.ToInt32(SeccionID), Convert.ToInt32(ID_ELEMENTO));
            foreach (DataRow dr in TabPreguntas.Rows)
            {
                string Titulo = dr["In_Titulo"].ToString();
                string Descripcion = dr["In_descripcion"].ToString();
                TER.registrar_Instruccion_Running(Titulo, Descripcion, 0, Convert.ToInt32(SeccionRID));
                //TER.registrar_Item_Running("Pregunta", "TabPreguntas_Running", Convert.ToInt32(idPreguntaRunning), 0, Convert.ToInt32(SeccionRID), Nombre);
            }
        }
        private void ObtenerIshikawua(string SeccionID, string SeccionRID, string ID_ELEMENTO)
        {
            DataTable TabPreguntas = TER.obtener_item_Ishikawua_seccionsID(Convert.ToInt32(SeccionID), Convert.ToInt32(ID_ELEMENTO));
            foreach (DataRow dr in TabPreguntas.Rows)
            {
                string Titulo = dr["Is_Titulo"].ToString();
                string Descripcion = dr["Is_descripcion"].ToString();
                string ID_Ishikawua = dr["Is_id"].ToString();
                string ID_Ishikawua_Running = TER.registrar_Ishikawua_Running(Titulo, Descripcion, 0, Convert.ToInt32(SeccionRID));
                DataTable dt = TER.obtener_DetalleIshikawua_ID(Convert.ToInt32(ID_Ishikawua));
                foreach(DataRow drI in dt.Rows)
                {
                    string Rama = drI["Rama"].ToString();
                    string Descripcion_R = drI["Descripcion"].ToString();
                    TER.registrar_DetalleIshikawua_Running(Rama, Descripcion_R, Convert.ToInt32(ID_Ishikawua_Running), 0);
                }
                //TER.registrar_Item_Running("Pregunta", "TabPreguntas_Running", Convert.ToInt32(idPreguntaRunning), 0, Convert.ToInt32(SeccionRID), Nombre);
            }
        }
        private void ObtenerHipotesis(string SeccionID, string SeccionRID, string ID_ELEMENTO)
        {
            DataTable TabPreguntas = TER.obtener_item_hipotesis_seccionsID(Convert.ToInt32(SeccionID), Convert.ToInt32(ID_ELEMENTO));
            foreach (DataRow dr in TabPreguntas.Rows)
            {
                string Titulo = dr["Hi_Titulo"].ToString();
                string Descripcion = dr["Hi_descripcion"].ToString();
                TER.registrar_Hipotesis_Running(Titulo, Descripcion, Convert.ToInt32(SeccionRID));
                //TER.registrar_Item_Running("Pregunta", "TabPreguntas_Running", Convert.ToInt32(idPreguntaRunning), 0, Convert.ToInt32(SeccionRID), Nombre);
            }
        }
        private void ObtenerFactor(string SeccionID, string SeccionRID, string ID_ELEMENTO)
        {
            DataTable TabPreguntas = TER.obtener_item_Factor_seccionsID(Convert.ToInt32(SeccionID), Convert.ToInt32(ID_ELEMENTO));
            foreach (DataRow dr in TabPreguntas.Rows)
            {
                string Titulo = dr["Fa_Titulo"].ToString();
                string Descripcion = dr["Fa_descripcion"].ToString();
                TER.registrar_Factor_Running(Titulo, Descripcion, Convert.ToInt32(SeccionRID));
                //TER.registrar_Item_Running("Pregunta", "TabPreguntas_Running", Convert.ToInt32(idPreguntaRunning), 0, Convert.ToInt32(SeccionRID), Nombre);
            }
        }
        public JsonResult obtenerTemplateRunningID(string ID)
        {
            List<TemplateRunningModel> list = new List<TemplateRunningModel>();
            try
            {
                DataTable datos = TER.obtener_Template_RunningID(Convert.ToInt32(ID));
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        private List<TemplateRunningModel> organizarDatos(DataTable Datos)
        {
            List<TemplateRunningModel> list = new List<TemplateRunningModel>();
            try
            {
                foreach (DataRow data in Datos.Rows)
                {
                    if (Datos.Columns.Contains("RowNumber"))
                    {
                        list.Add(new TemplateRunningModel
                        {
                            RowNumber = Convert.ToInt32(data["RowNumber"]),
                            ID = Convert.ToInt32(data["ID"]),
                            Folio = data["Folio"].ToString(),
                            TipoA3 = data["TipoA3"].ToString(),
                            Version = Convert.ToInt32(data["Versionn"]),
                            Responsable = data["Responsable"].ToString(),
                            Problema = data["Problema"].ToString(),
                            Costo = data["Costo"].ToString(),
                            Estatus = Convert.ToInt32(data["Estatus"]),
                        });
                    }
                    else
                    {
                        list.Add(new TemplateRunningModel
                        {
                            ID = Convert.ToInt32(data["ID"]),
                            Folio = data["Folio"].ToString(),
                            TipoA3 = data["TipoA3"].ToString(),
                            Version = Convert.ToInt32(data["Versionn"]),
                            Responsable = data["Responsable"].ToString(),
                            Problema = data["Problema"].ToString(),
                            Costo = data["Costo"].ToString(),
                            Estatus = Convert.ToInt32(data["Estatus"]),
                        });
                    }
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return list;
        }
        public JsonResult obtenerCuadrantes_TemplateRunning(string ID)
        {
            List<CuadranteModel> list = new List<CuadranteModel>();
            try
            {
                DataTable datos = TER.obtener_Cuadrantes_Running_TemplateID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new CuadranteModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
                        Descripcion = data["Descripcion"].ToString(),
                        Estatus = Convert.ToInt32(data["Estatus"])
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerSecciones_CuadranteRunning(string ID)
        {
            List<SeccionModel> list = new List<SeccionModel>();
            try
            {
                TER.set_cuadrant_and_template_running_status(Convert.ToInt32(ID), 1);
                DataTable datos = TER.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new SeccionModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
                        Descripcion = data["Descripcion"].ToString(),
                        Posicion = Convert.ToInt32(data["Posicion"])
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_items_seccionID(string ID)
        {
            List<ItemModel> list = new List<ItemModel>();
            try
            {
                DataTable datos = TER.obtener_items_seccionID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ItemModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Elemento = data["Elemento"].ToString(),
                        Respuesta = data["Respuesta"].ToString(),
                        Tabla = data["Tabla"].ToString(),
                        TabId = Convert.ToInt32(data["ItemID"]),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Seccion = Convert.ToInt32(data["Seccion"]),
                        Texto = data["Texto"].ToString(),
                        Tipo = data["TypeItem"].ToString(),

                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult get_detail_item_running(string id_item)
        {
            List<ItemModel> list = new List<ItemModel>();
            try
            {
                DataTable datos = TER.get_detail_item_running(Convert.ToInt32(id_item));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ItemModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Elemento = data["Elemento"].ToString(),
                        Tabla = data["Tabla"].ToString(),
                        TabId = Convert.ToInt32(data["ItemID"]),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Seccion = Convert.ToInt32(data["Seccion"]),
                        Texto = data["Texto"].ToString(),
                        Respuesta = data["Respuesta"].ToString(),
                        Tipo = data["TypeItem"].ToString(),

                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_itemRunning_ID(string ID)
        {
            List<ItemModel> list = new List<ItemModel>();
            try
            {
                DataTable datos = TER.obtener_ItemRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ItemModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Elemento = data["Elemento"].ToString(),
                        Tabla = data["Tabla"].ToString(),
                        TabId = Convert.ToInt32(data["ItemID"]),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Seccion = Convert.ToInt32(data["Seccion"]),
                        Texto = data["Texto"].ToString(),

                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_PreguntaRunning_ID(string ID)
        {
            List<PreguntaModel> list = new List<PreguntaModel>();
            try
            {
                DataTable datos = TER.obtener_PreguntaRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new PreguntaModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Texto = data["Texto"].ToString(),
                        Descripcion = data["Descripcion"].ToString(),
                        Comentarios = data["Comentarios"].ToString(),
                        Tipo = Convert.ToInt32(data["Tipo"]),
                        Respuesta = data["Respuesta"].ToString(),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Seccion = Convert.ToInt32(data["Seccion"]),
                        Firma = Convert.ToInt32(data["Firma"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_NotaRunning_ID(string ID)
        {
            List<NotaModel> list = new List<NotaModel>();
            try
            {
                DataTable datos = TER.obtener_NotaRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new NotaModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Titulo = data["Titulo"].ToString(),
                        Descripcion = data["Descripcion"].ToString(),
                        Respuesta = data["Respuesta"].ToString(),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Seccion = Convert.ToInt32(data["Seccion"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_InstruccionRunning_ID(string ID)
        {
            List<InstruccionModel> list = new List<InstruccionModel>();
            try
            {
                DataTable datos = TER.obtener_InstruccionRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new InstruccionModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Titulo = data["Titulo"].ToString(),
                        Descripcion = data["Descripcion"].ToString(),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Seccion = Convert.ToInt32(data["Seccion"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_IshikawuaRunning_ID(string ID)
        {
            List<IshikawuaModel> list = new List<IshikawuaModel>();
            try
            {
                DataTable datos = TER.obtener_IshikawuaRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new IshikawuaModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Titulo = data["Titulo"].ToString(),
                        Descripcion = data["Descripcion"].ToString(),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Seccion = Convert.ToInt32(data["Seccion"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_HipotesisRunning_ID(string ID)
        {
            List<HipotesisModel> list = new List<HipotesisModel>();
            try
            {
                DataTable datos = TER.obtener_HipotesisRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new HipotesisModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Test = Convert.ToInt32(data["Test"]),
                        True = Convert.ToInt32(data["True"]),
                        Titulo = data["Titulo"].ToString(),
                        Descripcion = data["Descripcion"].ToString(),
                        Hipotesis = data["Hipotesis"].ToString(),
                        Rama = data["Rama"].ToString(),
                        Resultados = data["Resultados"].ToString(),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Seccion = Convert.ToInt32(data["Seccion"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_FactorRunning_ID(string ID)
        {
            List<FactorModel> list = new List<FactorModel>();
            try
            {
                DataTable datos = TER.obtener_FactorRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new FactorModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Titulo = data["Titulo"].ToString(),
                        Descripcion = data["Descripcion"].ToString(),
                        Estatus = Convert.ToInt32(data["Estatus"]),
                        Factor = data["Factor"].ToString(),
                        Formulate = data["Formulate"].ToString(),
                        Seccion = data["Seccion"].ToString(),
                        Tested = Convert.ToInt32(data["Tested"]),
                        Confirmacion = data["Confirmacion"].ToString(),
                        Valido = Convert.ToInt32(data["Valido"]),
                    }); ;
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_DetalleIshikawuaRunning_ID(string ID)
        {
            List<IshikawuaModel> list = new List<IshikawuaModel>();
            try
            {
                DataTable datos = TER.obtener_DetalleIshikawuaRunning_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new IshikawuaModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Rama = data["Rama"].ToString(),
                        Descripcion = data["Descripcion"].ToString().Replace(".", "." + Environment.NewLine).Replace("?","?"+Environment.NewLine),
                        Respuesta = Convert.ToInt32(data["Respuesta"]),
                        Ishikawua = Convert.ToInt32(data["Ishikawua"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardar_respuesta_firma(string IDItem, string ID, string Respuesta,string Comentarios)
        {
            try
            {
                string Res = string.Empty;
                if (!string.IsNullOrEmpty(Comentarios))
                {
                    Res = Respuesta + " , " + Comentarios;
                }
                else
                {
                    Res = Respuesta;
                }
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = TER.Update_preguntaRunning(Convert.ToInt32(ID), Respuesta, 1,Comentarios);
                    TER.Update_Item_estatus(Convert.ToInt32(IDItem), 1,Res);
                    noti.Mensaje = Mensajes.respuesta_guardada;
                    noti.Tipo = "success";
                    noti.Id = id;
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nueva Investigación Folio: ", "N/A");
                }
                else
                {
                    AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
                    noti.Mensaje = Mensajes.contrasena_incorrecta;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.respuesta_guardada_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardar_respuesta(string IDItem, string ID, string Respuesta, string Comentarios)
        {
            try
            {              
                string Res = string.Empty;
                if (!string.IsNullOrEmpty(Comentarios))
                {
                    Res = Respuesta + " , " + Comentarios;
                }
                else
                {
                    Res = Respuesta;
                }
                DateTime Registro = DateTime.Now;
                string id = TER.Update_preguntaRunning(Convert.ToInt32(ID), Respuesta, 1, Comentarios);
                TER.Update_Item_estatus(Convert.ToInt32(IDItem), 1, Res);
                noti.Mensaje = Mensajes.respuesta_guardada;
                noti.Tipo = "success";
                noti.Id = id;
                //AT.registrarAuditTrail(Registro, "Usuario", "I", "N/A", "Nueva Investigación Folio: ", "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.respuesta_guardada_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardar_respuesta_Nota(string IDItem, string ID,string Respuesta)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.Update_NotaRunning(Convert.ToInt32(ID), 1,Respuesta);
                TER.Update_Item_estatus(Convert.ToInt32(IDItem), 1, Respuesta);
                noti.Mensaje = Mensajes.respuesta_guardada;
                noti.Tipo = "success";
                noti.Id = id;
                //AT.registrarAuditTrail(Registro, "Usuario", "I", "N/A", "Nueva Investigación Folio: ", "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.respuesta_guardada_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardar_respuesta_Hipotesis(string IDItem, string ID, string Rama, string Hipotesis,string Resultados,string Test,string True)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.Update_HipotesisRunning(Convert.ToInt32(ID), 1,Hipotesis,Rama,Resultados, Convert.ToInt32(Test), Convert.ToInt32(True));
                TER.Update_Item_estatus(Convert.ToInt32(IDItem), 1, Hipotesis);
                noti.Mensaje = Mensajes.respuesta_guardada;
                noti.Tipo = "success";
                noti.Id = id;
                //AT.registrarAuditTrail(Registro, "Usuario", "I", "N/A", "Nueva Investigación Folio: ", "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.respuesta_guardada_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardar_respuesta_Factor(string IDItem, string ID, string Factor,string Formulate,string Tested,string Confirmacion,string Valido)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.Update_FactorRunning(Convert.ToInt32(ID), 1, Factor, Formulate, Confirmacion, Convert.ToInt32(Tested), Convert.ToInt32(Valido));
                TER.Update_Item_estatus(Convert.ToInt32(IDItem), 1, Factor);
                noti.Mensaje = Mensajes.respuesta_guardada;
                noti.Tipo = "success";
                noti.Id = id;
                //AT.registrarAuditTrail(Registro, "Usuario", "I", "N/A", "Nueva Investigación Folio: ", "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.respuesta_guardada_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardar_respuesta_Instruccion(string IDItem, string ID)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.Update_InstruccionRunning(Convert.ToInt32(ID), 1);
                TER.Update_Item_estatus(Convert.ToInt32(IDItem), 1, Mensajes.Contestado);
                noti.Mensaje = Mensajes.respuesta_guardada;
                noti.Tipo = "success";
                noti.Id = id;
                //AT.registrarAuditTrail(Registro, "Usuario", "I", "N/A", "Nueva Investigación Folio: ", "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.respuesta_guardada_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardar_respuesta_Ishikawua(string IDItem, string ID,string Respuesta)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.Update_IshikawuaRunning(Convert.ToInt32(ID), 1);
                TER.Update_Item_estatus(Convert.ToInt32(IDItem), 1, Respuesta);
                noti.Mensaje = Mensajes.respuesta_guardada;
                noti.Tipo = "success";
                noti.Id = id;
                //AT.registrarAuditTrail(Registro, "Usuario", "I", "N/A", "Nueva Investigación Folio: ", "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.respuesta_guardada_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardar_respuesta_DetalleIshikawua(string ID,string Respuesta)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.Update_DetalleIshikawuaRunning(Convert.ToInt32(ID), Convert.ToInt32(Respuesta));
                //TER.Update_Item_estatus(Convert.ToInt32(IDItem), 1, "Contestado");
                noti.Mensaje = Mensajes.respuesta_guardada;
                noti.Tipo = "success";
                noti.Id = id;
                //AT.registrarAuditTrail(Registro, "Usuario", "I", "N/A", "Nueva Investigación Folio: ", "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.respuesta_guardada_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        //Adjuntos
        public JsonResult guardar_adjunto(HttpPostedFileBase Archivo, string ID)
        {
            try
            {
                string BYTOST = HttpContext.User.Identity.Name;
                //string BYTOST = Request["BYTOST"];
                //string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;

                if (Request.Files.Count > 0)
                {
                    string filename = Guid.NewGuid() + Path.GetExtension(Archivo.FileName);
                    string tipo = Path.GetExtension(Archivo.FileName);
                    string filepath = "/Assets/Adjuntos/" + filename;
                    Archivo.SaveAs(Path.Combine(Server.MapPath("/Assets/Adjuntos/"), filename));
                    string datos = TER.registrar_Adjunto_Running(filename, tipo, Convert.ToInt32(ID));
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.archivo_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.archivo_guardado_error;
                        noti.Tipo = "warning";
                        noti.Error = datos;
                    }
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.archivo_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Adjuntos_Item_ID(string ID)
        {
            List<AdjuntoModel> list = new List<AdjuntoModel>();
            try
            {
                DataTable datos = TER.obtener_adjuntos_item_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AdjuntoModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
                        Tipo = data["Tipo"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Adjuntos_TemplateRunning_ID(string ID)
        {
            List<AdjuntoModel> list = new List<AdjuntoModel>();
            try
            {
                DataTable datos = TER.obtener_adjuntos_Template_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AdjuntoModel
                    {
                        Nombre = data["Nombre"].ToString(),
                        Tipo = data["Tipo"].ToString(),
                        Item = data["Item"].ToString(),
                        Seccion = data["Seccion"].ToString(),
                        Cuadrante = data["Cuadrante"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Adjuntos_TemplateRunning_Cuadrante_ID(string ID)
        {
            List<AdjuntoModel> list = new List<AdjuntoModel>();
            try
            {
                DataTable datos = TER.obtener_adjuntos_Template_Cuadrante_D_ID(Convert.ToInt32(ID));
                string seccion = string.Empty;
                foreach (DataRow data in datos.Rows)
                {
                    if(data["Seccion"].ToString() == "1")
                    {
                        seccion = "Transfer the results:";
                    }
                    else { seccion = "Showing the results: (0 error philosophy!)"; }
                    list.Add(new AdjuntoModel
                    {
                        Nombre = data["Nombre"].ToString(),
                        Tipo = "N/A",
                        Item = "N/A",
                        Seccion = seccion,
                        Cuadrante = data["Cuadrante"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult omitir_adjunto(string ID)
        {
            try
            {
                //string BYTOST = Request["BYTOST"];
                //string ZNACKA = Request["ZNACKA"];
                string BYTOST = HttpContext.User.Identity.Name;
                DateTime Registro = DateTime.Now;
                string datos = TER.omitir_Adjunto_Running(Convert.ToInt32(ID));
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.archivo_omitido;
                    noti.Tipo = "success";
                    AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.archivo_omitido_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.archivo_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult set_estatus_templateRunning(string ID,string Estatus)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = TER.Update_estatus_templateRunning(Convert.ToInt32(ID),Convert.ToInt32(Estatus));
                    if (datos == "guardado")
                    {
                        noti.Mensaje = "Archivo omitido correctamente";
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = "Se produjo un error al tratar de Omitir el Archivo";
                        noti.Tipo = "warning";
                    }
                }
                else
                {
                    noti.Mensaje = Mensajes.contrasena_incorrecta;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = "Se produjo un error al tratar de Omitir el Archivo";
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_firma_templateRunning(string Template, string Razon)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                int i = 0;
                if (firma)
                {
                    string estatus = TER.obtener_estatus_actual_template_running(Template);
                    string res = TER.valida_template_wp(Template);
                    string version = TER.obtener_version_Anterior_template_id(Template);
                    if (Razon == "2")
                    {
                        if (estatus == "1")
                        {
                            if (res == "1")
                            {

                                string filename = SaveReporte_A3_WP(Template);
                                string mgg = TER.registrar_version_anterior(filename, version, Template);
                                if (mgg == "guardado") { i = 1; } else { i = 0; }
                            }
                            else
                            {
                                string filename = SaveReporte_A3(Template);
                                string mgg = TER.registrar_version_anterior(filename, version, Template);
                                if (mgg == "guardado"){ i = 1; }else { i = 0; }
                            }
                        }
                        else { i = 1; }
                    }
                    else { i = 1; }

                    if(i == 1)
                    {
                        string datos = TER.registrar_firma_template_running(BYTOST, Convert.ToInt32(Template), Convert.ToInt32(Razon));
                        TER.Update_estatus_templateRunning(Convert.ToInt32(Template), Convert.ToInt32(Razon));
                        if (datos == "guardado")
                        {
                            noti.Mensaje = Mensajes.Documento_firmado;
                            noti.Tipo = "success";
                            AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma de Template con Folio: " + Template, "N/A");
                            if (Razon == "3")
                            {
                                int num_rev = Convert.ToInt32(TER.verifica_firmas_template_num(Template, "1"));
                                int num_apr = Convert.ToInt32(TER.verifica_firmas_template_num(Template, "2"));
                                if(num_rev > 0)
                                {
                                    DataTable dt = TER.obtener_evaluadores_tipo_ID(Convert.ToInt32(Template), 1);
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        string Correo = dr["Correo"].ToString();
                                        string Nombre = dr["Nombre"].ToString();
                                        StringBuilder mailBody = new StringBuilder();
                                        mailBody.AppendFormat("<h1>A3 Revisión</h1>");
                                        mailBody.AppendFormat("Estimado(a) {0},", Nombre);
                                        mailBody.AppendFormat("<br />");
                                        mailBody.AppendFormat("<p>La investigación A3 con folio: <b>" + Template + "</b> fue finalizada y se encuentra lista para su <b>Revisión</b> para lo cual debera seguir las siguientes instrucciones:</p>");
                                        mailBody.AppendFormat("1. Ingrese en la liga: http://mx-cloud-a3ler.aws.cnb/ <br />");
                                        mailBody.AppendFormat("2. Dirijase a apartado 'Home' o 'Inicio' <br />");
                                        mailBody.AppendFormat("3. Presione el botón identificado como 'A3 History' o 'Historial A3' <br />");
                                        mailBody.AppendFormat("4. Ingrese el folio de la investigación en la caja de texto 'Folio' dentro del área de Filtros de Información <br />");
                                        mailBody.AppendFormat("5. Presione el botón 'Search' o 'Buscar' <br />");
                                        mailBody.AppendFormat("6. Identifique la investigación en la Tabla y presione el botón verde ubicado en la columna 'Options' u 'Opciones'<br />");
                                        mailBody.AppendFormat("7. Valide su usuario y presione 'Firmar' o 'Sign'<br />");
                                        mailBody.AppendFormat("8. Cierre la página emergente<br />");
                                        mailBody.AppendFormat("9. Abra la investigación y confirme que ha sido firmado.<br />");
                                        TE.enviarCorreo(Correo, "A3 Revisión", mailBody.ToString(), null, null, null);
                                    }
                                }
                                else
                                {
                                    DataTable dt = TER.obtener_evaluadores_tipo_ID(Convert.ToInt32(Template), 2);
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        string Correo = dr["Correo"].ToString();
                                        string Nombre = dr["Nombre"].ToString();
                                        StringBuilder mailBody = new StringBuilder();
                                        mailBody.AppendFormat("<h1>A3 Aprobación</h1>");
                                        mailBody.AppendFormat("Estimado(a) {0},", Nombre);
                                        mailBody.AppendFormat("<br />");
                                        mailBody.AppendFormat("<p>La investigación A3 con folio: <b>" + Template + "</b> fue finalizada y se encuentra lista para su <b>Aprobación</b> para lo cual debera seguir las siguientes instrucciones:</p>");
                                        mailBody.AppendFormat("1. Ingrese en la liga: http://mx-cloud-a3ler.aws.cnb/ <br />");
                                        mailBody.AppendFormat("2. Dirijase a apartado 'Home' o 'Inicio' <br />");
                                        mailBody.AppendFormat("3. Presione el botón identificado como 'A3 History' o 'Historial A3' <br />");
                                        mailBody.AppendFormat("4. Ingrese el folio de la investigación en la caja de texto 'Folio' dentro del área de Filtros de Información <br />");
                                        mailBody.AppendFormat("5. Presione el botón 'Search' o 'Buscar' <br />");
                                        mailBody.AppendFormat("6. Identifique la investigación en la Tabla y presione el botón verde ubicado en la columna 'Options' u 'Opciones'<br />");
                                        mailBody.AppendFormat("7. Valide su usuario y presione 'Firmar' o 'Sign'<br />");
                                        mailBody.AppendFormat("8. Cierre la página emergente<br />");
                                        mailBody.AppendFormat("9. Abra la investigación y confirme que ha sido firmado.<br />");
                                        TE.enviarCorreo(Correo, "A3 Aprobación", mailBody.ToString(), null, null, null);
                                    }
                                }                                
                            }
                        }
                        else
                        {
                            noti.Mensaje = Mensajes.Documento_firmado_error;
                            noti.Tipo = "warning";
                        }
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Documento_firmado_error;
                        noti.Tipo = "warning";
                    }
                }
                else
                {
                    AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
                    noti.Mensaje = Mensajes.contrasena_incorrecta;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Documento_firmado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Verificar_Cuadrante_A(string ID)
        {
            int i = 0;
            try
            {
                int numCuadrantes = TER.getNum_CuadrantesRunning(Convert.ToInt32(ID));
                if(numCuadrantes > 0)
                {
                    noti.Id = "1";
                }
                else
                {
                    noti.Id = "0";
                    DataTable dt = TER.Valida_Cuadrante_A(Convert.ToInt32(ID));
                    foreach (DataRow dr in dt.Rows)
                    {
                        string Respuesta = dr["ItR_respuesta"].ToString();
                        if (Respuesta == "NO" || Respuesta == "NOT" || Respuesta == "No")
                        {
                            i++;
                        }
                    }
                    if (i > 0)
                    {
                        noti.Id = "1";
                    }
                }
                
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.error_mostrar_informacion;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti.Id, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_info_cuadrante(string ID_Template, string Nombre)
        {
            List<CuadranteModel> list = new List<CuadranteModel>();
            try
            {
                DataTable datos = TE.obtener_info_cuadrante(Convert.ToInt32(ID_Template), Nombre);
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new CuadranteModel
                    {
                         ID = Convert.ToInt32(dr["CaR_id"]),
                         Nombre = dr["CaR_nombre"].ToString()
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult valida_estatus_cuadrante(string ID_Template, string Nombre)
        {
            int i = 0;
            try
            {
                DataTable datos = TE.obtener_Estatus_cuadrante_running(Convert.ToInt32(ID_Template), Nombre);
                foreach (DataRow dr in datos.Rows)
                {
                    if(Convert.ToInt32(dr["ItR_Estatus"]) == 0)
                    {
                        i++;
                    }
                }
                
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(i, JsonRequestBehavior.AllowGet);
        }
        public JsonResult set_estatus_cuadrante(string Estatus,string ID_Template, string Nombre)
        {
            int i = 0;
            try
            {
                string datos = TE.set_estatus_cuadrante_running(Convert.ToInt32(Estatus),Convert.ToInt32(ID_Template), Nombre);
                if (datos == "guardado")
                {
                    i = 1;
                    //noti.Mensaje = "Archivo guardado correctamente";
                    //noti.Tipo = "success";
                    ////AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(i, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_cuadrante_running_ID(string ID)
        {
            string datos = string.Empty;
            try
            {
                datos = TE.obtener_cuadrante_running_ID(Convert.ToInt32(ID));
                
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(datos, JsonRequestBehavior.AllowGet);
        }
        //
        public JsonResult registrar_5w(string What, string Why1, string Why2, string Why3, string Why4,string Why5, string Cause, string Date, string Step, string Name, string Status, string Cuadrante)
        {
            try
            {
                string datos = TER.registrar_5w(What, Why1, Why2, Why3, Why4, Why5, Cause, Date, Step, Name, Status, Cuadrante);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizar_5w(string ID,string What, string Why1, string Why2, string Why3, string Why4, string Cause, string Date, string Step, string Name, string Status, string Cuadrante)
        {
            try
            {
                string datos = TER.actualizar_5w(ID, What, Why1, Why2, Why3, Why4, Cause, Date, Step, Name, Status, Cuadrante);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_5w_ID_info(string ID)
        {
            List<_5WModel> list = new List<_5WModel>();
            try
            {
                DataTable datos = TER.obtener_5w_ID_info(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new _5WModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        What = data["What"].ToString(),
                        Why1 = data["Why1"].ToString(),
                        Why2 = data["Why2"].ToString(),
                        Why3 = data["Why3"].ToString(),
                        Why4 = data["Why4"].ToString(),
                        Cause = data["Cause"].ToString(),
                        Step = data["Step"].ToString(),
                        Name = data["Name"].ToString(),
                        Date = Convert.ToDateTime(data["Date"]).ToString("yyyy-MM-dd"),
                        Status = data["Status"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_5w_ID_Cuadrante(string ID)
        {
            List<_5WModel> list = new List<_5WModel>();
            try
            {
                DataTable datos = TER.obtener_5w_ID_Cuadrante(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new _5WModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        What = data["What"].ToString(),
                        Why1 = data["Why1"].ToString(),
                        Why2 = data["Why2"].ToString(),
                        Why3 = data["Why3"].ToString(),
                        Why4 = data["Why4"].ToString(),
                        Cause = data["Cause"].ToString(),
                        Step = data["Step"].ToString(),
                        Name = data["Name"].ToString(),
                        Date = Convert.ToDateTime(data["Date"]).ToString("dd / MM / yyyy"),
                        Status = data["Status"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //
        public JsonResult registrar_Standard(string Standard, string Cuadrante, string Q1_Initial, string Q1_Simplied, string Q2_Initial, string Q2_Simplied,
             string Q3_Initial, string Q3_Simplied, string Q4_Initial, string Q4_Simplied, string Q5_Initial, string Q5_Simplied,
              string Total_Initial, string Total_Simplied)
        {
            try
            {
                string datos = TER.registrar_standard(Standard, Cuadrante, Q1_Initial, Q1_Simplied,Q2_Initial,Q2_Simplied, Q3_Initial, Q3_Simplied,
                    Q4_Initial, Q4_Simplied, Q5_Initial, Q5_Simplied, Total_Initial, Total_Simplied);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizar_Standard(string ID, string Standard, string Cuadrante, string Q1_Initial, string Q1_Simplied, string Q2_Initial, string Q2_Simplied,
             string Q3_Initial, string Q3_Simplied, string Q4_Initial, string Q4_Simplied, string Q5_Initial, string Q5_Simplied,
              string Total_Initial, string Total_Simplied)
        {
            try
            {
                string datos = TER.actualizar_Standard(ID, Standard, Cuadrante, Q1_Initial, Q1_Simplied, Q2_Initial, Q2_Simplied, Q3_Initial, Q3_Simplied,
                    Q4_Initial, Q4_Simplied, Q5_Initial, Q5_Simplied, Total_Initial, Total_Simplied);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Standard_ID_info(string ID)
        {
            List<StandardModel> list = new List<StandardModel>();
            try
            {
                DataTable datos = TER.obtener_Standard_ID_info(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new StandardModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Standard = data["Standard"].ToString(),
                        Cuadrante = Convert.ToInt32(data["Cuadrante"]),
                        Q1_Initial = Convert.ToInt32(data["Q1_Initial"]),
                        Q1_Simplied = Convert.ToInt32(data["Q1_Simplied"]),
                        Q2_Initial = Convert.ToInt32(data["Q2_Initial"]),
                        Q2_Simplied = Convert.ToInt32(data["Q2_Simplied"]),
                        Q3_Initial = Convert.ToInt32(data["Q3_Initial"]),
                        Q3_Simplied = Convert.ToInt32(data["Q3_Simplied"]),
                        Q4_Initial = Convert.ToInt32(data["Q4_Initial"]),
                        Q4_Simplied = Convert.ToInt32(data["Q4_Simplied"]),
                        Q5_Initial = Convert.ToInt32(data["Q5_Initial"]),
                        Q5_Simplied = Convert.ToInt32(data["Q5_Simplied"]),
                        Total_Initial = Convert.ToInt32(data["Total_Initial"]),
                        Total_Simplied = Convert.ToInt32(data["Total_Simplied"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Standard_ID_Cuadrante(string ID)
        {
            List<StandardModel> list = new List<StandardModel>();
            try
            {
                DataTable datos = TER.obtener_Standard_ID_Cuadrante(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new StandardModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Standard = data["Standard"].ToString(),
                        Cuadrante = Convert.ToInt32(data["Cuadrante"]),
                        Q1_Initial = Convert.ToInt32(data["Q1_Initial"]),
                        Q1_Simplied = Convert.ToInt32(data["Q1_Simplied"]),
                        Q2_Initial = Convert.ToInt32(data["Q2_Initial"]),
                        Q2_Simplied = Convert.ToInt32(data["Q2_Simplied"]),
                        Q3_Initial = Convert.ToInt32(data["Q3_Initial"]),
                        Q3_Simplied = Convert.ToInt32(data["Q3_Simplied"]),
                        Q4_Initial = Convert.ToInt32(data["Q4_Initial"]),
                        Q4_Simplied = Convert.ToInt32(data["Q4_Simplied"]),
                        Q5_Initial = Convert.ToInt32(data["Q5_Initial"]),
                        Q5_Simplied = Convert.ToInt32(data["Q5_Simplied"]),
                        Total_Initial = Convert.ToInt32(data["Total_Initial"]),
                        Total_Simplied = Convert.ToInt32(data["Total_Simplied"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_evluadores(string Usuario, string Tipo, string Template)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.registrar_evaluador(Usuario, Tipo, Template);
                noti.Mensaje = Mensajes.Evaluador_agregar;
                noti.Tipo = "success";
                noti.Id = id;
                AT.registrarAuditTrail(Registro, HttpContext.User.Identity.Name.ToUpper(), "I", "N/A", "Evaluador " + Usuario + " agregado a investigación con folio "+ Template, "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Evaluador_agregar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult omitir_evluador(string ID)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                string id = TER.omitir_evaluador(ID);
                noti.Mensaje = Mensajes.Evaluador_Omitir;
                noti.Tipo = "success";
                noti.Id = id;
                //AT.registrarAuditTrail(Registro, "Usuario", "I", "N/A", "Nueva Investigación Folio: ", "N/A");
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Evaluador_omitir_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_evaluadores_template_id(string ID)
        {
            List<UsuarioModel> list = new List<UsuarioModel>();
            try
            {
                DataTable datos = TER.obtener_evaluadores_template_ID(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new UsuarioModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
                        Rol = data["Tipo"].ToString(),
                        ID_Usuario = Convert.ToInt32(data["ID_Usuario"])
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult registrar_result(string Cuadrante, string Nota1, string Nota2)
        {
            try
            {
                DateTime Registro = DateTime.Now;
                //TER.registrar_Adjunto_Running(filename1, tipo, Convert.ToInt32(ID));
                string datos = TER.registrar_result(Convert.ToInt32(Cuadrante), Nota1, Nota2, "N/A", "N/A");
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                    noti.Error = datos;
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                noti.Error = e.Message;
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult update_result(string ID,string Cuadrante, string Nota1, string Nota2)
        {
            try
            {
                DataTable dt = TER.obtener_Result(Convert.ToInt32(Cuadrante));
                DateTime Registro = DateTime.Now;
                string datos = TER.actualizar_result(Convert.ToInt32(ID),Convert.ToInt32(Cuadrante), Nota1, Nota2, "N/A", "N/A");
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                    noti.Error = datos;
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_cost(string Cuadrante,string Cost,string Avoid,string Saving,string Solution)
        {
            try
            {
                string datos = TER.registrar_cost(Convert.ToInt32(Cuadrante), Cost, Avoid, Saving, Convert.ToInt32(Solution));
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                    noti.Error = datos;
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizar_cost(string ID,string Cuadrante, string Cost, string Avoid, string Saving, string Solution)
        {
            try
            {
                string datos = TER.actualizar_Cost(Convert.ToInt32(ID),Convert.ToInt32(Cuadrante), Cost, Avoid, Saving, Convert.ToInt32(Solution));
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                    noti.Error = datos;
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_result(string ID)
        {
            List<Result> list = new List<Result>();
            try
            {
                DataTable datos = TER.obtener_Result(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new Result
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Cuadrante = Convert.ToInt32(data["Cuadrante"]),
                        Nota1 = data["Nota1"].ToString(),
                        Nota2 = data["Nota2"].ToString(),
                        Archivo1 = data["Archivo1"].ToString(),
                        Archivo2 = data["Archivo2"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Cost(string ID)
        {
            List<Cost> list = new List<Cost>();
            try
            {
                DataTable datos = TER.obtener_Cost(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new Cost
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Cuadrante = Convert.ToInt32(data["Cuadrante"]),
                        Costs = data["Cost"].ToString(),
                        Avoid = data["Avoid"].ToString(),
                        Saving = data["Saving"].ToString(),
                        Solution = Convert.ToInt32(data["Solution"])
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult obtener_estatus_template(string ID)
        {
            try
            {
                //noti.Mensaje = "Se produjo un error al tratar de guardar la información";
                noti.Id = TER.obtener_estatus_template_running(ID);
                //noti.Error = datos;
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult firmar_reporte_template(string ID)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    
                    string ID_Usuario = TER.obtener_id_usuario(BYTOST);
                    string verifica_firma = TER.verifica_firma_reporte_template(ID, ID_Usuario);
                    if(verifica_firma == "0")
                    {
                        string datos = TER.firmar_reporte_template(ID, ID_Usuario, DateTime.Now);
                        if (datos == "guardado")
                        { 
                            int num_rev = Convert.ToInt32(TER.verifica_firmas_template_num(ID, "1"));
                            int num_apr = Convert.ToInt32(TER.verifica_firmas_template_num(ID, "2"));
                            string com_rev = TER.verifica_firmas_completas_template_num(ID, "1");
                            string com_apr = TER.verifica_firmas_completas_template_num(ID, "2");
                            string res = TER.verifica_firmas_completas_template(ID);
                            if(num_rev > 0)
                            {
                                if(com_rev == "1")
                                {
                                    if(num_apr > 0)
                                    {
                                        if(com_apr == "1")
                                        {
                                            TER.Update_estatus_templateRunning(Convert.ToInt32(ID), 1);

                                            DataTable dt = TER.obtener_evaluadores_template_ID(Convert.ToInt32(ID));
                                            foreach (DataRow dr in dt.Rows)
                                            {
                                                string Correo = dr["Correo"].ToString();
                                                string Nombre = dr["Nombre"].ToString();
                                                StringBuilder mailBody = new StringBuilder();
                                                mailBody.AppendFormat("<h1>A3 Finalizado</h1>");
                                                mailBody.AppendFormat("Estimado(a) {0},", Nombre);
                                                mailBody.AppendFormat("<br />");
                                                mailBody.AppendFormat("<p>La investigación A3 con folio: <b>" + ID + "</b> fue <b>Revisada, Aprobada</b> y se encuentra lista para su Visualización</p>");
                                                mailBody.AppendFormat("1. Ingrese en la liga: http://mx-cloud-a3ler.aws.cnb/ <br />");
                                                mailBody.AppendFormat("2. Dirijase a apartado 'Home' o 'Inicio' <br />");
                                                mailBody.AppendFormat("3. Presione el botón identificado como 'A3 History' o 'Historial A3' <br />");
                                                mailBody.AppendFormat("4. Ingrese el folio de la investigación en la caja de texto 'Folio' dentro del área de Filtros de Información <br />");
                                                mailBody.AppendFormat("5. Presione el botón 'Search' o 'Buscar' <br />");
                                                mailBody.AppendFormat("6. Identifique la investigación en la Tabla y presione el botón verde ubicado en la columna 'Options' u 'Opciones'<br />");
                                                TE.enviarCorreo(Correo, "A3 Finalizado", mailBody.ToString(), null, null, null);
                                            }
                                        }
                                        else
                                        {
                                            DataTable dt = TER.obtener_evaluadores_tipo_ID(Convert.ToInt32(ID),2);
                                            foreach (DataRow dr in dt.Rows)
                                            {
                                                string Correo = dr["Correo"].ToString();
                                                string Nombre = dr["Nombre"].ToString();
                                                StringBuilder mailBody = new StringBuilder();
                                                mailBody.AppendFormat("<h1>A3 Aprobación</h1>");
                                                mailBody.AppendFormat("Estimado(a) {0},", Nombre);
                                                mailBody.AppendFormat("<br />");
                                                mailBody.AppendFormat("<p>La investigación A3 con folio: <b>" + ID + "</b> fue Revisada y se encuentra lista para su <b>Aprobación</b></p>");
                                                mailBody.AppendFormat("1. Ingrese en la liga: http://mx-cloud-a3ler.aws.cnb/ <br />");
                                                mailBody.AppendFormat("2. Dirijase a apartado 'Home' o 'Inicio' <br />");
                                                mailBody.AppendFormat("3. Presione el botón identificado como 'A3 History' o 'Historial A3' <br />");
                                                mailBody.AppendFormat("4. Ingrese el folio de la investigación en la caja de texto 'Folio' dentro del área de Filtros de Información <br />");
                                                mailBody.AppendFormat("5. Presione el botón 'Search' o 'Buscar' <br />");
                                                mailBody.AppendFormat("6. Identifique la investigación en la Tabla y presione el botón verde ubicado en la columna 'Options' u 'Opciones'<br />");
                                                mailBody.AppendFormat("7. Valide su usuario y presione 'Firmar' o 'Sign'<br />");
                                                mailBody.AppendFormat("8. Cierre la página emergente<br />");
                                                mailBody.AppendFormat("9. Abra la investigación y confirme que ha sido firmado.<br />");
                                                TE.enviarCorreo(Correo, "A3 Aprobación", mailBody.ToString(), null, null, null);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        TER.Update_estatus_templateRunning(Convert.ToInt32(ID), 1);
                                        DataTable dt = TER.obtener_evaluadores_template_ID(Convert.ToInt32(ID));
                                        foreach (DataRow dr in dt.Rows)
                                        {
                                            string Correo = dr["Correo"].ToString();
                                            string Nombre = dr["Nombre"].ToString();
                                            StringBuilder mailBody = new StringBuilder();
                                            mailBody.AppendFormat("<h1>A3 Finalizado</h1>");
                                            mailBody.AppendFormat("Estimado(a) {0},", Nombre);
                                            mailBody.AppendFormat("<br />");
                                            mailBody.AppendFormat("<p>La investigación A3 con folio: <b>" + ID + "</b> fue <b>Revisada</b> y se encuentra lista para su Visualización</p>");
                                            mailBody.AppendFormat("1. Ingrese en la liga: http://mx-cloud-a3ler.aws.cnb/ <br />");
                                            mailBody.AppendFormat("2. Dirijase a apartado 'Home' o 'Inicio' <br />");
                                            mailBody.AppendFormat("3. Presione el botón identificado como 'A3 History' o 'Historial A3' <br />");
                                            mailBody.AppendFormat("4. Ingrese el folio de la investigación en la caja de texto 'Folio' dentro del área de Filtros de Información <br />");
                                            mailBody.AppendFormat("5. Presione el botón 'Search' o 'Buscar' <br />");
                                            mailBody.AppendFormat("6. Identifique la investigación en la Tabla y presione el botón verde ubicado en la columna 'Options' u 'Opciones'<br />");
                                            TE.enviarCorreo(Correo, "A3 Finalizado", mailBody.ToString(), null, null, null);
                                        }
                                    }
                                }
                            }
                            else
                            {
                                if(com_apr == "1")
                                {
                                    TER.Update_estatus_templateRunning(Convert.ToInt32(ID), 1);
                                    DataTable dt = TER.obtener_evaluadores_template_ID(Convert.ToInt32(ID));
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        string Correo = dr["Correo"].ToString();
                                        string Nombre = dr["Nombre"].ToString();
                                        StringBuilder mailBody = new StringBuilder();
                                        mailBody.AppendFormat("<h1>A3 Finalizado</h1>");
                                        mailBody.AppendFormat("Estimado(a) {0},", Nombre);
                                        mailBody.AppendFormat("<br />");
                                        mailBody.AppendFormat("<p>La investigación A3 con folio: <b>" + ID + "</b> fue <b>Aprobada</b> y se encuentra lista para su Visualización</p>");
                                        mailBody.AppendFormat("1. Ingrese en la liga: http://mx-cloud-a3ler.aws.cnb/ <br />");
                                        mailBody.AppendFormat("2. Dirijase a apartado 'Home' o 'Inicio' <br />");
                                        mailBody.AppendFormat("3. Presione el botón identificado como 'A3 History' o 'Historial A3' <br />");
                                        mailBody.AppendFormat("4. Ingrese el folio de la investigación en la caja de texto 'Folio' dentro del área de Filtros de Información <br />");
                                        mailBody.AppendFormat("5. Presione el botón 'Search' o 'Buscar' <br />");
                                        mailBody.AppendFormat("6. Identifique la investigación en la Tabla y presione el botón verde ubicado en la columna 'Options' u 'Opciones'<br />");
                                        TE.enviarCorreo(Correo, "A3 Finalizado", mailBody.ToString(), null, null, null);
                                    }
                                }
                            }

                            noti.Mensaje = Mensajes.Documento_firmado;
                            noti.Tipo = "success";
                            AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma de Template: " + ID + "", "N/A");                          
                        }
                        else
                        {
                            noti.Mensaje = Mensajes.Informacion_guardar_error;
                            noti.Tipo = "warning";
                            noti.Error = datos;
                        }
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Documento_firmado_listo;
                        noti.Tipo = "warning";
                    }
                    
                }
                else
                {
                    AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
                    noti.Mensaje = Mensajes.contrasena_incorrecta;
                    noti.Tipo = "warning";
                }
                
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Documento_firmado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult agregar_hipotesis(string Titulo,string Descripcion,string ID_Seccion)
        {
            try
            {
                string datos = TER.registrar_Hipotesis_Running(Titulo, Descripcion, Convert.ToInt32(ID_Seccion));
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Item_guardado;
                    noti.Tipo = "success";
                    DateTime Registro = DateTime.Now;
                    AT.registrarAuditTrail(Registro, HttpContext.User.Identity.Name.ToUpper(), "I", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Item_guardado_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                noti.Error = e.Message;
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult agregar_Factor(string Titulo, string Descripcion, string ID_Seccion)
        {
            try
            {
                string datos = TER.registrar_Factor_Running(Titulo, Descripcion, Convert.ToInt32(ID_Seccion));
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Item_guardado;
                    noti.Tipo = "success";
                    DateTime Registro = DateTime.Now;
                    AT.registrarAuditTrail(Registro, HttpContext.User.Identity.Name.ToUpper(), "I", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Item_guardado_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                noti.Error = e.Message;
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public void reporte_A3_Generado(string Folio, string TipoA3, string Contact, string Estatus)
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable datos = TER.mostrar_TemplatesRunning_Reporte(Folio, TipoA3, Contact, Estatus);
            // Setup DataSet
            //DataTable datos = CM.reporte_CodigosMaestros(Codigo, Producto, MPI, Activo, Fecha1, Fecha2, Usuario);
            // Create Report DataSource
            ReportDataSource dt_AT = new ReportDataSource("DT_datos", datos);

            // Variables
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;

            // Setup the report viewer object and get the array of bytes
            ReportViewer viewer = new ReportViewer();
            viewer.LocalReport.DataSources.Add(dt_AT);
            //viewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReporte_StandardProcessing);

            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_A3_Generados.rdlc");
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Folio", Mensajes.Folio));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_TipoA3", Mensajes.TipoA3));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Version", Mensajes.Version));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Contact", Mensajes.Responsable));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Estatus", Mensajes.Estatus));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_EnRevision", Mensajes.EnRevision));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_EnModificacion", Mensajes.EnModificacion));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_EnProceso", Mensajes.EnProceso));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Finalizado", Mensajes.Finalizado));
            viewer.ProcessingMode = ProcessingMode.Local;
            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_A3_Generados.rdlc");

            //viewer.LocalReport.DataSources.Add(Secciones_CA);
            //viewer.LocalReport.DataSources.Add(Secciones_CB);
            //viewer.LocalReport.DataSources.Add(Secciones_CC); // Add datasource here

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            string creationDate = DateTime.Now.ToString("dd-MM-yyyy-HH:mm");
            string Filename = "Reporte_A3" + creationDate;
            // Now that you have all the bytes representing the PDF report, buffer it and send it to the client.
            Response.Buffer = true;
            Response.Clear();
            Response.ContentType = "Reporte Códigos Maestros";
            //inline or attachment
            Response.AddHeader("content-disposition", "inline; filename=" + Filename + "." + extension);
            Response.BinaryWrite(bytes); // create the file
            //AT.registrarAuditTrail(DateTime.Now, HttpContext.User.Identity.Name, "I", "N/A", "Reporte PDF Código Maestro", "N/A");
            Response.Flush(); // send it to the client to download        
        }
        public void reporte_A3_Uso_App()
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable datos = TER.Reporte_Uso_App();
            // Setup DataSet
            //DataTable datos = CM.reporte_CodigosMaestros(Codigo, Producto, MPI, Activo, Fecha1, Fecha2, Usuario);
            // Create Report DataSource
            ReportDataSource dt_AT = new ReportDataSource("dt_uso", datos);

            // Variables
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;

            // Setup the report viewer object and get the array of bytes
            ReportViewer viewer = new ReportViewer();
            viewer.LocalReport.DataSources.Add(dt_AT);
            //viewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReporte_StandardProcessing);

            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_Uso_App.rdlc");
            viewer.ProcessingMode = ProcessingMode.Local;
            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_Uso_App.rdlc");

            //viewer.LocalReport.DataSources.Add(Secciones_CA);
            //viewer.LocalReport.DataSources.Add(Secciones_CB);
            //viewer.LocalReport.DataSources.Add(Secciones_CC); // Add datasource here

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            string creationDate = DateTime.Now.ToString("dd-MM-yyyy-HH:mm");
            string Filename = "Reporte_A3" + creationDate;
            // Now that you have all the bytes representing the PDF report, buffer it and send it to the client.
            Response.Buffer = true;
            Response.Clear();
            Response.ContentType = "Reporte Códigos Maestros";
            //inline or attachment
            Response.AddHeader("content-disposition", "inline; filename=" + Filename + "." + extension);
            Response.BinaryWrite(bytes); // create the file
            //AT.registrarAuditTrail(DateTime.Now, HttpContext.User.Identity.Name, "I", "N/A", "Reporte PDF Código Maestro", "N/A");
            Response.Flush(); // send it to the client to download        
        }
        public JsonResult verifica_tempate_wp(string ID)
        {
            try
            {
                //noti.Mensaje = "Se produjo un error al tratar de guardar la información";
                noti.Id = TER.validar_template_WP_id(ID);
                //noti.Error = datos;
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult omitir_adjunto_results(string ID, string Archivo)
        {
            try
            {
                string datos = TER.omitir_adjunto_results(Convert.ToInt32(ID), Archivo);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.archivo_omitido;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.archivo_omitido_error;
                    noti.Tipo = "warning";
                    noti.Error = datos;
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.archivo_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_risk(string Cause,string P1,string S1,string Initial,string P2,string S2,string Final,string Cuadrante)
        {
            try
            {
                string datos = TER.registrar_Risk(Cause, P1, S1, Initial, P2, S2, Final, Cuadrante);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult modificar_risk(string ID,string Cause, string P1, string S1, string Initial, string P2, string S2, string Final)
        {
            try
            {
                string datos = TER.modificar_risk(ID, Cause, P1, S1, Initial, P2, S2, Final);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_risk_cuadrante_id(string ID)
        {
            List<RiskModel> list = new List<RiskModel>();
            try
            {
                DataTable datos = TER.obtener_risk_cuadrante_id(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new RiskModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Cause = data["Cause"].ToString(),
                        P1 = Convert.ToInt32(data["P1"]),
                        S1 = Convert.ToInt32(data["S1"]),
                        Initial = Convert.ToInt32(data["Initial"]),
                        P2 = Convert.ToInt32(data["P2"]),
                        S2 = Convert.ToInt32(data["S2"]),
                        Final = Convert.ToInt32(data["Final"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_risk_id(string ID)
        {
            List<RiskModel> list = new List<RiskModel>();
            try
            {
                DataTable datos = TER.obtener_risk_id(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new RiskModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Cause = data["Cause"].ToString(),
                        P1 = Convert.ToInt32(data["P1"]),
                        S1 = Convert.ToInt32(data["S1"]),
                        Initial = Convert.ToInt32(data["Initial"]),
                        P2 = Convert.ToInt32(data["P2"]),
                        S2 = Convert.ToInt32(data["S2"]),
                        Final = Convert.ToInt32(data["Final"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_risk(string ID)
        {
            try
            {
                string datos = TER.eliminar_risk(ID);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Registro_omitir;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Registro_omitir_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Registro_omitir_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_5Why(string ID)
        {
            try
            {
                string datos = TER.eliminar_5Why(ID);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Registro_omitir;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Registro_omitir_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Registro_omitir_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_standard(string ID)
        {
            try
            {
                string datos = TER.eliminar_standard(ID);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Registro_omitir;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Registro_omitir_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Registro_omitir_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_hipotesis_running(string ID,string Item_ID)
        {
            try
            {
                string datos = TER.eliminar_hipotesis_running(ID, Item_ID);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Item_omitido;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Item_omitido_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_factor_running(string ID, string Item_ID)
        {
            try
            {
                string datos = TER.eliminar_factor_running(ID, Item_ID);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Item_omitido;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Item_omitido_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        //
        public JsonResult insert_adjuntos_cuadrante_D(HttpPostedFileBase Archivo, string Seccion,string Cuadrante)
        {
            try
            {
                if (Archivo != null && Archivo.ContentLength > 0)
                {
                    string filename = Guid.NewGuid() + Path.GetExtension(Archivo.FileName);
                    string tipo = Path.GetExtension(Archivo.FileName);
                    string filepath = "/Assets/Adjuntos/" + filename;
                    Archivo.SaveAs(Path.Combine(Server.MapPath("/Assets/Adjuntos/"), filename));
                    string datos = TER.insert_adjuntos_cuadrante_D(filename, Seccion, Cuadrante);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.archivo_guardado;
                        noti.Tipo = "success";
                        //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.archivo_guardado_error;
                        noti.Tipo = "warning";
                        noti.Error = datos;
                    }
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.archivo_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_adjuntos_cuadrante_D(string Cuadrante,string Seccion)
        {
            List<AdjuntoModel> list = new List<AdjuntoModel>();
            try
            {
                DataTable datos = TER.obtener_adjuntos_cuadrante_D(Cuadrante, Seccion);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AdjuntoModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
                        Seccion = data["Seccion"].ToString(),
                        Cuadrante = data["Cuadrante"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult omitir_adjuntos_cuadrante_D(string ID)
        {
            try
            {
                string datos = TER.omitir_adjuntos_cuadrante_D(ID);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.archivo_omitido;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "M", "N/A", "Archivo Adjunto Omitido", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.archivo_omitido_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.archivo_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }

        public JsonResult registrar_result_wp(string Cuadrante, string Nota1)
        {
            try
            {               
                //TER.registrar_Adjunto_Running(filename1, tipo, Convert.ToInt32(ID));
                string datos = TER.registrar_result(Convert.ToInt32(Cuadrante), Nota1, "", "", "");
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                    noti.Error = datos;
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                noti.Error = e.Message;
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult update_result_wp(string ID, string Cuadrante, string Nota1)
        {
            try
            {
                string datos = TER.actualizar_result(Convert.ToInt32(ID), Convert.ToInt32(Cuadrante), Nota1,"", "", "");
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Archivo Adjunto: " + filename + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Informacion_guardar_error;
                    noti.Tipo = "warning";
                    noti.Error = datos;
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_result_wp(string ID)
        {
            List<Result> list = new List<Result>();
            try
            {
                DataTable datos = TER.obtener_Result(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new Result
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Cuadrante = Convert.ToInt32(data["Cuadrante"]),
                        Nota1 = data["Nota1"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public string SaveReporte_A3(string ID_Template)
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable dt = TER.obtener_Template_RunningID(Convert.ToInt32(ID_Template));
            string Responsable = dt.Rows[0]["Responsable"].ToString();
            string Folio = dt.Rows[0]["Folio"].ToString();
            string TipoA3 = dt.Rows[0]["TipoA3"].ToString();
            string Problema = dt.Rows[0]["Problema"].ToString();
            string Costo = dt.Rows[0]["Costo"].ToString();
            string Version = dt.Rows[0]["Versionn"].ToString();
            string FechaInicio = dt.Rows[0]["FechaInicio"].ToString();
            string FechaFin = dt.Rows[0]["FechaFin"].ToString();
            string Id_CA = TER.obtener_id_cuadranteRunning(ID_Template, "A");
            string Id_CB = TER.obtener_id_cuadranteRunning(ID_Template, "B");
            string Id_CC = TER.obtener_id_cuadranteRunning(ID_Template, "C");
            string Id_CD = TER.obtener_id_cuadranteRunning(ID_Template, "D");
            string Fecha_CA = TER.obtener_fecha_ultima_modificacion(Id_CA);
            string Fecha_CB = TER.obtener_fecha_ultima_modificacion(Id_CB);
            string Fecha_CC = TER.obtener_fecha_ultima_modificacion(Id_CC);
            string Fecha_CD = TER.obtener_fecha_ultima_modificacion(Id_CD);
            DataTable dt_Res = TER.obtener_Result(Convert.ToInt32(Id_CD));
            string Nota1 = string.Empty;
            string Nota2 = string.Empty;
            if (dt_Res.Rows.Count > 0)
            {
                Nota1 = dt_Res.Rows[0]["Nota1"].ToString();
                Nota2 = dt_Res.Rows[0]["Nota2"].ToString();
            }
            DataTable dt_cost = TER.obtener_Cost(Convert.ToInt32(Id_CD));
            string Cost = string.Empty;
            string Avoid = string.Empty;
            string Saving = string.Empty;
            string Solution = string.Empty;
            if (dt_cost.Rows.Count > 0)
            {
                Cost = dt_cost.Rows[0]["Cost"].ToString();
                Avoid = dt_cost.Rows[0]["Avoid"].ToString();
                Saving = dt_cost.Rows[0]["Saving"].ToString();
                Solution = dt_cost.Rows[0]["Solution"].ToString();
            }

            DataTable dt_CA = TER.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CA));
            DataTable dt_CB = TER.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CB));
            DataTable dt_CC = TER.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CC));
            DataTable dt_why = TER.obtener_5w_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_standard = TER.obtener_Standard_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_evaluadores = TER.obtener_evaluadores_template_ID(Convert.ToInt32(ID_Template));

            // Setup DataSet
            //DataTable datos = CM.reporte_CodigosMaestros(Codigo, Producto, MPI, Activo, Fecha1, Fecha2, Usuario);
            // Create Report DataSource
            ReportDataSource Secciones_CA = new ReportDataSource("Secciones_CA", dt_CA);
            ReportDataSource Secciones_CB = new ReportDataSource("Secciones_CB", dt_CB);
            ReportDataSource Secciones_CC = new ReportDataSource("Secciones_CC", dt_CC);
            ReportDataSource why = new ReportDataSource("Why", dt_why);
            ReportDataSource standard = new ReportDataSource("standar", dt_standard);
            ReportDataSource evaluadores = new ReportDataSource("Evaluadores", dt_evaluadores);

            // Variables
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;

            // Setup the report viewer object and get the array of bytes
            ReportViewer viewer = new ReportViewer();
            viewer.LocalReport.DataSources.Add(Secciones_CA);
            viewer.LocalReport.DataSources.Add(Secciones_CB);
            viewer.LocalReport.DataSources.Add(Secciones_CC);
            viewer.LocalReport.DataSources.Add(why);
            viewer.LocalReport.DataSources.Add(standard);
            viewer.LocalReport.DataSources.Add(evaluadores);
            viewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReporte_A3Processing);
            //viewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReporte_StandardProcessing);

            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_A3.rdlc");
            viewer.LocalReport.SetParameters(new ReportParameter("Responsable", Responsable));
            viewer.LocalReport.SetParameters(new ReportParameter("Folio", Folio));
            viewer.LocalReport.SetParameters(new ReportParameter("Tipo", TipoA3));
            viewer.LocalReport.SetParameters(new ReportParameter("Problema", Problema));
            viewer.LocalReport.SetParameters(new ReportParameter("Costo", Costo));
            viewer.LocalReport.SetParameters(new ReportParameter("Version", Version));
            viewer.LocalReport.SetParameters(new ReportParameter("Nota1", Nota1));
            viewer.LocalReport.SetParameters(new ReportParameter("Nota2", Nota2));
            viewer.LocalReport.SetParameters(new ReportParameter("Cost", Cost));
            viewer.LocalReport.SetParameters(new ReportParameter("Avoid", Avoid));
            viewer.LocalReport.SetParameters(new ReportParameter("Saving", Saving));
            viewer.LocalReport.SetParameters(new ReportParameter("Solution", Solution));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Responsable", Mensajes.Responsable));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Folio", Mensajes.Folio));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Version", Mensajes.Version));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Problema", Mensajes.Cual_es_problema));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Costo", Mensajes.Costo));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Nombre", Mensajes.Nombre));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Tipo", Mensajes.Tipo_Firma));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Fecha", Mensajes.Fecha));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Cuadrante", Mensajes.Cuadrante));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Revisor", Mensajes.Revisor));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Aprobador", Mensajes.Aprobador));
            viewer.LocalReport.SetParameters(new ReportParameter("FechaInicio", FechaInicio));
            viewer.LocalReport.SetParameters(new ReportParameter("FechaFin", FechaFin));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_FechaFin", Mensajes.Fecha_Fin));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_FechaInicio", Mensajes.Fecha_Inicio));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_FechaModificacion", Mensajes.Fecha_Modificacion));
            viewer.LocalReport.SetParameters(new ReportParameter("Fecha_CA", Fecha_CA));
            viewer.LocalReport.SetParameters(new ReportParameter("Fecha_CB", Fecha_CB));
            viewer.LocalReport.SetParameters(new ReportParameter("Fecha_CC", Fecha_CC));
            viewer.LocalReport.SetParameters(new ReportParameter("Fecha_CD", Fecha_CD));
            viewer.ProcessingMode = ProcessingMode.Local;
            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_A3.rdlc");

            //viewer.LocalReport.DataSources.Add(Secciones_CA);
            //viewer.LocalReport.DataSources.Add(Secciones_CB);
            //viewer.LocalReport.DataSources.Add(Secciones_CC); // Add datasource here

            byte[] Bytes = viewer.LocalReport.Render(format: "PDF", deviceInfo: "");

            //byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            string filename = Guid.NewGuid() + ".pdf";
            using (FileStream stream = new FileStream(Server.MapPath(@"/Assets/Veriones_A3/" + filename), FileMode.Create))
            {
                stream.Write(Bytes, 0, Bytes.Length);
            }
            return filename;
        }
        void SubReporte_A3Processing(object sender, SubreportProcessingEventArgs e)
        {
            string pathR = e.ReportPath;
            string dataS = string.Empty;
            DataTable dt = new DataTable();
            if (pathR == "SubReporte_Standard")
            {
                int ID_Standard = int.Parse(e.Parameters["ID_Standard"].Values[0].ToString());
                dt = TER.obtener_Standard_ID_info(ID_Standard);
                dataS = "Standard_info";
            }
            else
            {
                int Seccion_ID = int.Parse(e.Parameters["Seccion_ID"].Values[0].ToString());
                dt = TER.obtener_items_seccionID(Seccion_ID);
                dataS = "Items_Seccion";
            }
            ReportDataSource ds = new ReportDataSource(dataS, dt);
            e.DataSources.Add(ds);
        }
        public string SaveReporte_A3_WP(string ID_Template)
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable dt = TER.obtener_Template_RunningID(Convert.ToInt32(ID_Template));
            string Responsable = dt.Rows[0]["Responsable"].ToString();
            string Folio = dt.Rows[0]["Folio"].ToString();
            string TipoA3 = dt.Rows[0]["TipoA3"].ToString();
            string Problema = dt.Rows[0]["Problema"].ToString();
            string Costo = dt.Rows[0]["Costo"].ToString();
            string Version = dt.Rows[0]["Versionn"].ToString();
            string FechaInicio = dt.Rows[0]["FechaInicio"].ToString();
            string FechaFin = dt.Rows[0]["FechaFin"].ToString();
            string Id_CA = TER.obtener_id_cuadranteRunning(ID_Template, "A");
            string Id_CB = TER.obtener_id_cuadranteRunning(ID_Template, "B");
            string Id_CC = TER.obtener_id_cuadranteRunning(ID_Template, "C");
            string Id_CD = TER.obtener_id_cuadranteRunning(ID_Template, "D");
            string Fecha_CA = TER.obtener_fecha_ultima_modificacion(Id_CA);
            string Fecha_CB = TER.obtener_fecha_ultima_modificacion(Id_CB);
            string Fecha_CC = TER.obtener_fecha_ultima_modificacion(Id_CC);
            string Fecha_CD = TER.obtener_fecha_ultima_modificacion(Id_CD);
            DataTable dt_Res = TER.obtener_Result(Convert.ToInt32(Id_CD));
            string Nota1 = string.Empty;
            string Nota2 = string.Empty;
            if (dt_Res.Rows.Count > 0)
            {
                Nota1 = dt_Res.Rows[0]["Nota1"].ToString();
                Nota2 = dt_Res.Rows[0]["Nota2"].ToString();
            }
            DataTable dt_cost = TER.obtener_Cost(Convert.ToInt32(Id_CD));
            string Cost = string.Empty;
            string Avoid = string.Empty;
            string Saving = string.Empty;
            string Solution = string.Empty;
            if (dt_cost.Rows.Count > 0)
            {
                Cost = dt_cost.Rows[0]["Cost"].ToString();
                Avoid = dt_cost.Rows[0]["Avoid"].ToString();
                Saving = dt_cost.Rows[0]["Saving"].ToString();
                Solution = dt_cost.Rows[0]["Solution"].ToString();
            }

            DataTable dt_CA = TER.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CA));
            DataTable dt_CB = TER.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CB));
            DataTable dt_CC = TER.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CC));
            DataTable dt_why = TER.obtener_5w_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_Risk = TER.obtener_risk_cuadrante_id(Convert.ToInt32(Id_CD));
            DataTable dt_standard = TER.obtener_Standard_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_evaluadores = TER.obtener_evaluadores_template_ID(Convert.ToInt32(ID_Template));

            // Setup DataSet
            //DataTable datos = CM.reporte_CodigosMaestros(Codigo, Producto, MPI, Activo, Fecha1, Fecha2, Usuario);
            // Create Report DataSource
            ReportDataSource Secciones_CA = new ReportDataSource("Secciones_CA", dt_CA);
            ReportDataSource Secciones_CB = new ReportDataSource("Secciones_CB", dt_CB);
            ReportDataSource Secciones_CC = new ReportDataSource("Secciones_CC", dt_CC);
            ReportDataSource why = new ReportDataSource("Why", dt_why);
            ReportDataSource standard = new ReportDataSource("standar", dt_standard);
            ReportDataSource evaluadores = new ReportDataSource("Evaluadores", dt_evaluadores);
            ReportDataSource Risk = new ReportDataSource("Risk", dt_Risk);
            // Variables
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;

            // Setup the report viewer object and get the array of bytes
            ReportViewer viewer = new ReportViewer();
            viewer.LocalReport.DataSources.Add(Secciones_CA);
            viewer.LocalReport.DataSources.Add(Secciones_CB);
            viewer.LocalReport.DataSources.Add(Secciones_CC);
            viewer.LocalReport.DataSources.Add(why);
            viewer.LocalReport.DataSources.Add(standard);
            viewer.LocalReport.DataSources.Add(evaluadores);
            viewer.LocalReport.DataSources.Add(Risk);
            viewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReporte_A3Processing);
            //viewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReporte_StandardProcessing);

            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_A3_WP.rdlc");
            viewer.LocalReport.SetParameters(new ReportParameter("Responsable", Responsable));
            viewer.LocalReport.SetParameters(new ReportParameter("Folio", Folio));
            viewer.LocalReport.SetParameters(new ReportParameter("Tipo", TipoA3));
            viewer.LocalReport.SetParameters(new ReportParameter("Problema", Problema));
            viewer.LocalReport.SetParameters(new ReportParameter("Costo", Costo));
            viewer.LocalReport.SetParameters(new ReportParameter("Version", Version));
            viewer.LocalReport.SetParameters(new ReportParameter("Nota2", Nota2));
            viewer.LocalReport.SetParameters(new ReportParameter("Cost", Cost));
            viewer.LocalReport.SetParameters(new ReportParameter("Avoid", Avoid));
            viewer.LocalReport.SetParameters(new ReportParameter("Saving", Saving));
            viewer.LocalReport.SetParameters(new ReportParameter("Solution", Solution));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Responsable", Mensajes.Responsable));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Folio", Mensajes.Folio));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Version", Mensajes.Version));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Problema", Mensajes.Cual_es_problema));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Costo", Mensajes.Costo));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Nombre", Mensajes.Nombre));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Tipo", Mensajes.Tipo_Firma));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Fecha", Mensajes.Fecha));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Cuadrante", Mensajes.Cuadrante));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Revisor", Mensajes.Revisor));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Aprobador", Mensajes.Aprobador));
            viewer.LocalReport.SetParameters(new ReportParameter("FechaInicio", FechaInicio));
            viewer.LocalReport.SetParameters(new ReportParameter("FechaFin", FechaFin));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_FechaFin", Mensajes.Fecha_Fin));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_FechaInicio", Mensajes.Fecha_Inicio));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_FechaModificacion", Mensajes.Fecha_Modificacion));
            viewer.LocalReport.SetParameters(new ReportParameter("Fecha_CA", Fecha_CA));
            viewer.LocalReport.SetParameters(new ReportParameter("Fecha_CB", Fecha_CB));
            viewer.LocalReport.SetParameters(new ReportParameter("Fecha_CC", Fecha_CC));
            viewer.LocalReport.SetParameters(new ReportParameter("Fecha_CD", Fecha_CD));
            viewer.ProcessingMode = ProcessingMode.Local;
            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_A3_WP.rdlc");

            //viewer.LocalReport.DataSources.Add(Secciones_CA);
            //viewer.LocalReport.DataSources.Add(Secciones_CB);
            //viewer.LocalReport.DataSources.Add(Secciones_CC); // Add datasource here

            byte[] Bytes = viewer.LocalReport.Render(format: "PDF", deviceInfo: "");

            //byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            string filename = Guid.NewGuid() + ".pdf";
            using (FileStream stream = new FileStream(Server.MapPath(@"/Assets/Veriones_A3/" + filename), FileMode.Create))
            {
                stream.Write(Bytes, 0, Bytes.Length);
            }
            return filename;
        }
        public void Reporte_Uso_App()
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");

            // Variables
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;

            // Setup the report viewer object and get the array of bytes
            ReportViewer viewer = new ReportViewer();

            //viewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReporte_A3Processing);
            //viewer.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(SubReporte_StandardProcessing);

            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_Uso_App.rdlc");
            viewer.ProcessingMode = ProcessingMode.Local;
            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_Uso_App.rdlc");

            //viewer.LocalReport.DataSources.Add(Secciones_CA);
            //viewer.LocalReport.DataSources.Add(Secciones_CB);
            //viewer.LocalReport.DataSources.Add(Secciones_CC); // Add datasource here

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            string creationDate = DateTime.Now.ToString("dd-MM-yyyy-HH:mm");
            string Filename = "Reporte_Uso_App " + creationDate;
            // Now that you have all the bytes representing the PDF report, buffer it and send it to the client.
            Response.Buffer = true;
            Response.Clear();
            Response.ContentType = "Reporte Códigos Maestros";
            //inline or attachment
            Response.AddHeader("content-disposition", "inline; filename=" + Filename + "." + extension);
            Response.BinaryWrite(bytes); // create the file
            //AT.registrarAuditTrail(DateTime.Now, HttpContext.User.Identity.Name, "I", "N/A", "Reporte PDF Código Maestro", "N/A");
            Response.Flush(); // send it to the client to download        
        }
        public JsonResult obtener_versiones_template_id(string ID)
        {
            List<TemplateModel> list = new List<TemplateModel>();
            try
            {
                DataTable datos = TER.obtener_versiones_template_id(Convert.ToInt32(ID));
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new TemplateModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Version = Convert.ToInt32(data["Versionn"]),
                        Descripcion = data["Nombre"].ToString()
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult obtener_Rol_usuario()
        {
            try
            {
                //noti.Mensaje = "Se produjo un error al tratar de guardar la información";
                noti.Id = US.obtener_Rol_Usuario(HttpContext.User.Identity.Name);
                //noti.Error = datos;
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }

        public JsonResult valida_responsable_usuario(string ID)
        {
            try
            {
                //noti.Mensaje = "Se produjo un error al tratar de guardar la información";
                string rol = US.obtener_Rol_Usuario(HttpContext.User.Identity.Name);
                string nombre = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "R");
                string Res = string.Empty;
                if(rol == "1")
                {
                    Res = "1";
                }
                else
                {
                    Res = TER.validar_responsable_template_running(ID, nombre);
                }
                //noti.Error = datos;
                noti.Id = Res;
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Informacion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_texto_notificacion(string label)
        {
            string Res = string.Empty;
            if (label == "txt_Idioma_Confirmacion_modificar")
            {
                Res = Mensajes.Confirmacion_Modificar;
            }
            if (label == "txt_Idioma_Confirmacion_modificar_title")
            {
                Res = Mensajes.Confirmacion_Modificar_Titulo;
            }
            else if (label == "txt_Idioma_sistema")
            {
                Res = Mensajes.Sistema;
            }
            else if (label == "txt_Idioma_Confirmacion_Omitir")
            {
                Res = Mensajes.Confirmacion_Omitir;
            }
            else if (label == "txt_Idioma_Confirmacion_Omitir_title")
            {
                Res = Mensajes.Confirmacion_Omitir_Titulo;
            }
            return Json(Res);
           
        }
        public JsonResult Validar_Respuesta_Seccion_31(int ID)
        {
            try
            {
                int Resultado = 0;
                int i = 0; ;
                DataTable datos = TER.validar_Respuesta_seccion_31(ID);
                int datos_num = datos.Rows.Count;
                foreach (DataRow dr in datos.Rows)
                {
                    Resultado = Convert.ToInt32(dr["Resultado"]);
                    if (Resultado > 0)
                    {
                        i++;
                    }
                }
                noti.Tipo = "success";
                if (datos_num == i)
                {
                    noti.Id = "1";
                }
                else
                {
                    noti.Id = "0";
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }

        //MODOS DE FALLA
        public JsonResult get_list_failure_mode_category(string is_enable)
        {
            List<FailureModeCategoryModel> list = new List<FailureModeCategoryModel>();
            try
            {
                DataTable datos = oee.get_list_failure_mode_category("1");
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new FailureModeCategoryModel
                    {
                        id_category = Convert.ToInt32(data["id_category"]),
                        name_category = data["name_category"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_list_failure_mode_by_id_category(string id_category,string is_enable)
        {
            List<FailureModeModel> list = new List<FailureModeModel>();
            try
            {
                DataTable datos = oee.get_list_failure_mode_by_id_category(id_category, "1");
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new FailureModeModel
                    {
                        id_category = Convert.ToInt32(data["id_category"]),
                        id_failure = Convert.ToInt32(data["id_codigo"]),
                        name_failure = data["name_codigo"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}
