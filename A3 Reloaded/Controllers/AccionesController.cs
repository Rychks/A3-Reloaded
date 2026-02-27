using A3_Reloaded.Clases;
using A3_Reloaded.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using Antlr.Runtime.Misc;
using System.Text;
using System.Web.UI;
using System.IO;
using Microsoft.Ajax.Utilities;
using Microsoft.Win32;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class AccionesController : Controller
    {
        Acciones accion = new Acciones();
        AuditTrail audit = new AuditTrail();
        Notificaciones noti = new Notificaciones();
        Lenguaje lenguaje = new Lenguaje();
        Usuarios usuario = new Usuarios();
        Templates template = new Templates();
        // GET: Acciones
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult _cancelar_actividad_preventiva(int id_actividad)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string ZMYSEL = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = usuario.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    int status_actividad = 10;
                    //reporte.actualizar_registro_firma_template(BYTOST, id_template.ToString(), ZMYSEL, "2");
                    //int is_aproval_flow_complete = template_running.is_aproval_flow_complete(id_template, actual_version_template);
                    string datos = accion.update_estatus_activdades_preventivas(id_actividad, status_actividad);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Documento_firmado;
                        noti.Tipo = "success";
                        audit.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Actividad folio: " + id_actividad.ToString() + " cancelada", ZMYSEL);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Documento_firmado_error;
                        noti.Tipo = "warning";
                    }
                    //noti.Id = actual_version_template.ToString();
                }
                else
                {
                    audit.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
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
        public JsonResult aprobar_actividad_preventiva (int id_actividad)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string ZMYSEL = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = usuario.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    int status_actividad = 7;
                    //reporte.actualizar_registro_firma_template(BYTOST, id_template.ToString(), ZMYSEL, "2");
                    //int is_aproval_flow_complete = template_running.is_aproval_flow_complete(id_template, actual_version_template);
                    string datos = accion.update_estatus_activdades_preventivas(id_actividad, status_actividad);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Documento_firmado;
                        noti.Tipo = "success";
                        audit.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Actividad folio: " + id_actividad.ToString() + " aprobada", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Documento_firmado_error;
                        noti.Tipo = "warning";
                    }
                    //noti.Id = actual_version_template.ToString();
                }
                else
                {
                    audit.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
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
        public JsonResult  insert_accion_preventiva(int id_template,string accion_text,string fecha, int resposable)
        {
            try
            {
                string cwid = HttpContext.User.Identity.Name;
                string asignado_por = usuario.obtener_Nombre_Usuario(cwid, "R");
                string datos = accion.insert_accion_preventiva(id_template, accion_text, fecha, resposable, asignado_por,cwid);
                if (datos == "guardado")
                {
                    DataTable user_info = usuario.obtener_UsuarioID(resposable);

                    foreach (DataRow data in user_info.Rows)
                    {
                        //ID = Convert.ToInt32(data["ID"]),
                        //    CWID = data["CWID"].ToString(),
                        string user_name = data["Nombre"].ToString();
                        string user_email = data["Correo"].ToString();
                        //    App = data["App"].ToString(),
                        StringBuilder mailBody = new StringBuilder();
                        mailBody.AppendFormat("<h1>Tarea asignada - A3 Reloaded</h1>");
                        mailBody.AppendFormat("Estimado(a) {0},", user_name);
                        mailBody.AppendFormat("<br />");
                        mailBody.AppendFormat("<p>Tarea asignada correspondiente a la investigación con folio: <b>" + id_template + "</b></p>");
                        mailBody.AppendFormat("<p>Descripción: "+accion_text+"</p>");
                        template.enviarCorreo(user_email, "Tarea asignada - A3 Reloaded", mailBody.ToString(), null, null, null);
                    }

                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Equipo: " + Nombre + " ", "N/A");
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
        private void enviar_mensaje(string Accion)
        {
            using (var httpClient = new HttpClient())
            {
                using (var request = new HttpRequestMessage(new HttpMethod("POST"), "https://bayergroup.webhook.office.com/webhookb2/a8393f27-2a7c-49af-a8b5-f80238c5f1b3@fcb2b37b-5da0-466b-9b83-0014b67a7c78/IncomingWebhook/19393b1de3d142c08e84becaa2214e4c/0bbf43ff-7497-4e18-ba51-e8372d008d2e/V2HF8XXWstvNMt180RrgH5BxqVCSrS5brg0A1pAccuodg1"))
                {
                    request.Content = new StringContent("{'text':'Se agrego la siguiente tarea: "+ Accion + "'}");
                    request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");

                    //var response = await httpClient.SendAsync(request);
                }
            }
        }
        public JsonResult delete_accion_preventiva(int id_accion)
        {
            try
            {
                string BYTOST = HttpContext.User.Identity.Name;
                //string ZNACKA = Request["ZNACKA"];
                //string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                string datos = accion.delete_accion_preventiva(id_accion);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Registro_omitir;
                    noti.Tipo = "success";
                    audit.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Acción omitida", "Deleted");
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
        public JsonResult get_registros_accion_preventiva_by_id_template(int id_template)
        {
            int idioma = usuario.obtener_Idioma_Usuario(HttpContext.User.Identity.Name);
            List<AccionesModel> list = new List<AccionesModel>();
            try
            {
                DataTable datos = accion.get_registros_accion_preventiva_by_id_template(id_template, idioma);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AccionesModel
                    {
                        id_accion = Convert.ToInt32(data["id_accion"]),
                        id_template = Convert.ToInt32(data["id_template"]),
                        Responsable = data["responsable"].ToString(),
                        Estatus = data["estatus"].ToString(),
                        Fecha = Convert.ToDateTime(data["fecha_entrega"]).ToString("dd.MM.yyyy"),
                        Descripcion = data["accion"].ToString(),
                        
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_TotalPag_acciones_preventivas(string id_template, string id_usuario, string responsable, string estatus,string linea, int NumRegistros = 50)
        {
            return Json(accion.get_TotalPag_acciones_preventivas(id_template, id_usuario,responsable,estatus,linea, NumRegistros), JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_acciones_preventivas(string id_template, string id_usuario, string responsable, string estatus,string linea, int Index = 0, int NumRegistros = 50)
        {
            List<AccionesModel> list = new List<AccionesModel>();
            int idioma = usuario.obtener_Idioma_Usuario(HttpContext.User.Identity.Name);
            try
            {
                DataTable datos = accion.obtener_acciones_preventivas(id_template, id_usuario, responsable, estatus,linea,idioma, Index, NumRegistros);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AccionesModel
                    {
                        RowNumber = Convert.ToInt32(data["RowNumber"]),
                        ID = Convert.ToInt32(data["id_accion"]),
                        id_template = Convert.ToInt32(data["id_template"]),
                        Descripcion = data["accion"].ToString(),
                        fecha_ini = Convert.ToDateTime(data["fecha_ini"]).ToString("dd.MM.yyyy"),
                        Fecha = Convert.ToDateTime(data["fecha_entrega"]).ToString("dd.MM.yyyy"),
                        Responsable = data["responsable_name"].ToString(),
                        asignado_por = data["asignado_por"].ToString(),
                        Estatus = data["estatus"].ToString(),
                        estatus_text = data["estatus_text"].ToString(),
                        Responsable_ID = Convert.ToInt32(data["responsable_id"]),
                        AsignadoPor_ID = Convert.ToInt32(data["asignado_por_id"]),
                        Rol = data["Rol"].ToString(),
                        Linea = data["Lineas"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_accion_preventiva(int id_accion)
        {
            List<AccionesModel> list = new List<AccionesModel>();
            int idioma = usuario.obtener_Idioma_Usuario(HttpContext.User.Identity.Name);
            try
            {
                DataTable datos = accion.get_accion_preventiva(id_accion);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AccionesModel
                    {
                        ID = Convert.ToInt32(data["id_accion"]),
                        id_template = Convert.ToInt32(data["id_template"]),
                        Descripcion = data["accion"].ToString(),
                        fecha_ini = Convert.ToDateTime(data["fecha_creacion"]).ToString("dd.MM.yyyy"),
                        Fecha = Convert.ToDateTime(data["fecha_entrega"]).ToString("dd.MM.yyyy"),
                        Responsable = data["responsable"].ToString(),
                        comentarios = data["comentarios"].ToString(),
                        Estatus = data["estatus"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_list_status_acciones(string Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                string CWID = HttpContext.User.Identity.Name.ToUpper();
                string ID_Language = lenguaje.obtener_Idioma_Usuario(CWID);
                DataTable datos = template.get_status_list_acciones_preventivas(ID_Language);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ListaModel
                    {
                        ID = Convert.ToInt32(data["id_status"]),
                        Opcion = data["text_status"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_adjuntos_actividades_preventivas(int id_actividad)
        {
            List<AdjuntoModel> list = new List<AdjuntoModel>();
            try
            {
                DataTable datos = accion.get_adjuntos_actividades_preventivas(id_actividad);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AdjuntoModel
                    {
                        id_adjunto = Convert.ToInt32(data["id_adjunto"]),
                        nombre_archivo = data["nombre_archivo"].ToString(),
                        stream_archivo = data["stream_archivo"].ToString(),
                        fecha_creacion = Convert.ToDateTime(data["insert_timestamp"]).ToString("dd.MM.yyyy"),
                        id_actividad = Convert.ToInt32(data["id_actividad"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult insert_adjjunto_actividades_preventivas(int id_actividad, HttpPostedFileBase file = null)
        {
            try
            {
                
                string filename = "default.png";
                string nombre_archivo = string.Empty;
                if (Request.Files.Count > 0)
                {
                    string path = Server.MapPath("~/Atach/");
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    nombre_archivo = file.FileName;
                    filename = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    string filepath = "/Assets/Img/Templates/" + filename;
                    file.SaveAs(Path.Combine(Server.MapPath("/Assets/Adjuntos/Actividades_Preventivas"), filename));
                }
                string datos = accion.insert_adjunto_actividades_preventivas(nombre_archivo, filename, id_actividad);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.template_guardado;
                    noti.Tipo = "success";
                    audit.registrarAuditTrail(DateTime.Now, HttpContext.User.Identity.Name, "I", "N/A", "Archivo " + nombre_archivo +  " adjunto en actividad " + id_actividad.ToString(), "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.template_guardado_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.template_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult update_actividad_preventiva(int id_actividad, string comentarios)
        {
            try
            {
                string cwid = HttpContext.User.Identity.Name;
                string asignado_por = usuario.obtener_Nombre_Usuario(cwid, "A");
                string datos = accion.update_activdades_preventivas(id_actividad,comentarios);
                if (datos == "guardado")
                {
                    accion.update_estatus_activdades_preventivas(id_actividad, 6);
                    //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Equipo: " + Nombre + " ", "N/A");
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
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
        public JsonResult update_estatus_actividad_preventiva(int id_actividad, int estatus)
        {
            try
            {
                string cwid = HttpContext.User.Identity.Name;
                string datos = accion.update_estatus_activdades_preventivas(id_actividad, estatus);
                if (datos == "guardado")
                {                
                    //audit.registrarAuditTrail(DateTime.Now, BYTOST, "I", "N/A", "Nuevo Equipo: " + Nombre + " ", "N/A");
                    noti.Mensaje = Mensajes.Informacion_guardar;
                    noti.Tipo = "success";
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
    }
}