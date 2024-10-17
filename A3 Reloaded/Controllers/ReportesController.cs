using System.IO;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using A3_Reloaded.Clases;
using Microsoft.Reporting.WebForms;
using System.Data;
using System.Runtime.ConstrainedExecution;
using A3_Reloaded.Models;
using System.Text;
using System.Web.UI;
using System.Globalization;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class ReportesController : Controller
    {
        Reportes reporte = new Reportes();
        Notificaciones noti = new Notificaciones();
        AuditTrail auditTrail = new AuditTrail();
        Usuarios usuario = new Usuarios();
        TemplatesRunning template_running = new TemplatesRunning();
        Templates template = new Templates();
        // GET: Reportes
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult registrar_firma_reabrir_A3(int id_template)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = usuario.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    int actual_version_template = template_running.get_actual_version_template(id_template);
                    int is_aproval_flow_complete = template_running.is_aproval_flow_complete(id_template, actual_version_template);
                    if(is_aproval_flow_complete > 0)
                    {
                        string is_template_wp = template_running.valida_template_wp(id_template.ToString());
                        string filename = string.Empty;
                        if (is_template_wp == "1")
                        {
                            filename = SaveReporte_A3_WP(id_template.ToString());
                        }
                        else
                        {
                            filename = SaveReporte_A3(id_template.ToString());
                        }
                        template_running.registrar_version_anterior(filename, actual_version_template.ToString(), id_template.ToString());

                    }
                    string datos = template_running.Reopen_investigation(id_template, actual_version_template);
                    if (datos == "success")
                    {
                        template_running.Update_estatus_templateRunning(Convert.ToInt32(id_template), 9);                      
                        noti.Mensaje = Mensajes.Documento_firmado;
                        noti.Tipo = "success";
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Documento_firmado_error;
                        noti.Tipo = "warning";
                    }
                }
                else
                {
                    auditTrail.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
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
        public string SaveReporte_A3(string ID_Template)
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable dt = template_running.obtener_Template_RunningID(Convert.ToInt32(ID_Template));
            string Responsable = dt.Rows[0]["Responsable"].ToString();
            string Folio = dt.Rows[0]["Folio"].ToString();
            string TipoA3 = dt.Rows[0]["TipoA3"].ToString();
            string Problema = dt.Rows[0]["Problema"].ToString();
            string Costo = dt.Rows[0]["Costo"].ToString();
            string Version = dt.Rows[0]["Versionn"].ToString();
            string FechaInicio = dt.Rows[0]["FechaInicio"].ToString();
            string FechaFin = dt.Rows[0]["FechaFin"].ToString();
            string Id_CA = template_running.obtener_id_cuadranteRunning(ID_Template, "A");
            string Id_CB = template_running.obtener_id_cuadranteRunning(ID_Template, "B");
            string Id_CC = template_running.obtener_id_cuadranteRunning(ID_Template, "C");
            string Id_CD = template_running.obtener_id_cuadranteRunning(ID_Template, "D");
            string Fecha_CA = template_running.obtener_fecha_ultima_modificacion(Id_CA);
            string Fecha_CB = template_running.obtener_fecha_ultima_modificacion(Id_CB == "" || Id_CB == null ? "" : Id_CB);
            string Fecha_CC = template_running.obtener_fecha_ultima_modificacion(Id_CC == "" || Id_CC == null ? "" : Id_CC);
            string Fecha_CD = template_running.obtener_fecha_ultima_modificacion(Id_CD);
            DataTable dt_Res = template_running.obtener_Result(Convert.ToInt32(Id_CD));
            string Nota1 = string.Empty;
            string Nota2 = string.Empty;
            if (dt_Res.Rows.Count > 0)
            {
                Nota1 = dt_Res.Rows[0]["Nota1"].ToString();
                Nota2 = dt_Res.Rows[0]["Nota2"].ToString();
            }
            DataTable dt_cost = template_running.obtener_Cost(Convert.ToInt32(Id_CD));
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

            DataTable dt_CA = template_running.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CA));
            DataTable dt_CB = template_running.obtener_secciones_CuadranteRunning_ID_for_report(Id_CB);
            DataTable dt_CC = template_running.obtener_secciones_CuadranteRunning_ID_for_report(Id_CC);
            DataTable dt_why = template_running.obtener_5w_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_standard = template_running.obtener_Standard_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_evaluadores = template_running.obtener_evaluadores_template_ID(Convert.ToInt32(ID_Template));

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
        public string SaveReporte_A3_WP(string ID_Template)
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable dt = template_running.obtener_Template_RunningID(Convert.ToInt32(ID_Template));
            string Responsable = dt.Rows[0]["Responsable"].ToString();
            string Folio = dt.Rows[0]["Folio"].ToString();
            string TipoA3 = dt.Rows[0]["TipoA3"].ToString();
            string Problema = dt.Rows[0]["Problema"].ToString();
            string Costo = dt.Rows[0]["Costo"].ToString();
            string Version = dt.Rows[0]["Versionn"].ToString();
            string FechaInicio = dt.Rows[0]["FechaInicio"].ToString();
            string FechaFin = dt.Rows[0]["FechaFin"].ToString();
            string Id_CA = template_running.obtener_id_cuadranteRunning(ID_Template, "A");
            string Id_CB = template_running.obtener_id_cuadranteRunning(ID_Template, "B");
            string Id_CC = template_running.obtener_id_cuadranteRunning(ID_Template, "C");
            string Id_CD = template_running.obtener_id_cuadranteRunning(ID_Template, "D");
            string Fecha_CA = template_running.obtener_fecha_ultima_modificacion(Id_CA);
            string Fecha_CB = template_running.obtener_fecha_ultima_modificacion(Id_CB);
            string Fecha_CC = template_running.obtener_fecha_ultima_modificacion(Id_CC);
            string Fecha_CD = template_running.obtener_fecha_ultima_modificacion(Id_CD);
            DataTable dt_Res = template_running.obtener_Result(Convert.ToInt32(Id_CD));
            string Nota1 = string.Empty;
            string Nota2 = string.Empty;
            if (dt_Res.Rows.Count > 0)
            {
                Nota1 = dt_Res.Rows[0]["Nota1"].ToString();
                Nota2 = dt_Res.Rows[0]["Nota2"].ToString();
            }
            DataTable dt_cost = template_running.obtener_Cost(Convert.ToInt32(Id_CD));
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

            DataTable dt_CA = template_running.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CA));
            DataTable dt_CB = template_running.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CB));
            DataTable dt_CC = template_running.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CC));
            DataTable dt_why = template_running.obtener_5w_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_Risk = template_running.obtener_risk_cuadrante_id(Convert.ToInt32(Id_CD));
            DataTable dt_standard = template_running.obtener_Standard_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_evaluadores = template_running.obtener_evaluadores_template_ID(Convert.ToInt32(ID_Template));

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
        public JsonResult Finish_investigation_process(string id_template)
        {
            try
            {
                string BYTOST = HttpContext.User.Identity.Name;
                //string BYTOST = Request["BYTOST"];
                //string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;

                string datos = reporte.actualizar_registro_firma_template(BYTOST, id_template, "N/A", "3");
                if (datos == "guardado")
                {
                    template_running.Update_estatus_templateRunning(Convert.ToInt32(id_template), 6);
                    int num_rev = Convert.ToInt32(template_running.verifica_firmas_template_num(id_template, "1"));
                    int num_apr = Convert.ToInt32(template_running.verifica_firmas_template_num(id_template, "2"));
                    if (num_rev > 0)
                    {
                        DataTable dt = template_running.obtener_evaluadores_tipo_ID(Convert.ToInt32(id_template), 1);
                        foreach (DataRow dr in dt.Rows)
                        {
                            string Correo = dr["Correo"].ToString();
                            string Nombre = dr["Nombre"].ToString();
                            StringBuilder mailBody = new StringBuilder();
                            mailBody.AppendFormat("<h1>A3 Revisión</h1>");
                            mailBody.AppendFormat("Estimado(a) {0},", Nombre);
                            mailBody.AppendFormat("<br />");
                            mailBody.AppendFormat("<p>La investigación A3 con folio: <b>" + id_template + "</b> fue finalizada y se encuentra lista para su <b>Revisión</b> para lo cual debera seguir las siguientes instrucciones:</p>");
                            mailBody.AppendFormat("1. Ingrese en la liga: http://mx-cloud-a3ler.aws.cnb/ <br />");
                            mailBody.AppendFormat("2. Dirijase a apartado 'Home' o 'Inicio' <br />");
                            mailBody.AppendFormat("3. Ingrese el folio de la investigación en la caja de texto 'Folio' dentro del área de Filtros de Información <br />");
                            mailBody.AppendFormat("4. Presione el botón 'Search' o 'Buscar' <br />");
                            mailBody.AppendFormat("5. Identifique la investigación en la Tabla y presione el botón verde ubicado en la columna 'Options' u 'Opciones'<br />");
                            mailBody.AppendFormat("6. Valide su usuario y presione 'Firmar' o 'Sign'<br />");
                            mailBody.AppendFormat("7. Cierre la página emergente<br />");
                            mailBody.AppendFormat("8. Abra la investigación y confirme que ha sido firmado.<br />");
                            template.enviarCorreo(Correo, "A3 Revisión", mailBody.ToString(), null, null, null);
                        }
                    }
                    else
                    {
                        DataTable dt = template_running.obtener_evaluadores_tipo_ID(Convert.ToInt32(id_template), 2);
                        foreach (DataRow dr in dt.Rows)
                        {
                            string Correo = dr["Correo"].ToString();
                            string Nombre = dr["Nombre"].ToString();
                            StringBuilder mailBody = new StringBuilder();
                            mailBody.AppendFormat("<h1>A3 Aprobación</h1>");
                            mailBody.AppendFormat("Estimado(a) {0},", Nombre);
                            mailBody.AppendFormat("<br />");
                            mailBody.AppendFormat("<p>La investigación A3 con folio: <b>" + id_template + "</b> fue finalizada y se encuentra lista para su <b>Aprobación</b> para lo cual debera seguir las siguientes instrucciones:</p>");
                            mailBody.AppendFormat("1. Ingrese en la liga: http://mx-cloud-a3ler.aws.cnb/ <br />");
                            mailBody.AppendFormat("2. Dirijase a apartado 'Home' o 'Inicio' <br />");
                            mailBody.AppendFormat("3. Ingrese el folio de la investigación en la caja de texto 'Folio' dentro del área de Filtros de Información <br />");
                            mailBody.AppendFormat("4. Presione el botón 'Search' o 'Buscar' <br />");
                            mailBody.AppendFormat("5. Identifique la investigación en la Tabla y presione el botón verde ubicado en la columna 'Options' u 'Opciones'<br />");
                            mailBody.AppendFormat("6. Valide su usuario y presione 'Firmar' o 'Sign'<br />");
                            mailBody.AppendFormat("7. Cierre la página emergente<br />");
                            mailBody.AppendFormat("8. Abra la investigación y confirme que ha sido firmado.<br />");
                            template.enviarCorreo(Correo, "A3 Aprobación", mailBody.ToString(), null, null, null);
                        }
                    }
                    noti.Mensaje = Mensajes.Documento_firmado;
                    noti.Tipo = "success";
                }
                else
                {
                    noti.Mensaje = Mensajes.Documento_firmado_error;
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
        public JsonResult obtener_version_documento(string documento,string id_temnplate)
        {
            return Json(reporte.obtener_version_documento(documento,id_temnplate), JsonRequestBehavior.AllowGet);
        }
        public JsonResult valida_firma_Evaluador(string ID)
        {
            List<UsuarioModel> list = new List<UsuarioModel>();
            try
            {
                string CWID = HttpContext.User.Identity.Name;
                DataTable datos = template_running.valida_usuario_evaluador(ID, CWID);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new UsuarioModel
                    {
                        Nombre = data["Nombre"].ToString(),
                        Rol = data["Tipo"].ToString()
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult validar_template_WP_id(string ID)
        {
            try
            {
                //noti.Mensaje = "Se produjo un error al tratar de guardar la información";
                noti.Id = template_running.valida_template_wp(ID);
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
        public JsonResult obtener_firmas_reporte_a3(string id_template, string version_template)
        {
            List<FirmasReporteModel> list = new List<FirmasReporteModel>();
            try
            {
                DataTable datos = reporte.obtener_firmas_reporte_a3(id_template, version_template);
                foreach (DataRow row in datos.Rows) {

                    list.Add(new FirmasReporteModel
                    {
                           Usuario = row["Usuario"].ToString(),
                           Comentarios = row["Comentarios"].ToString(),
                           Estatus = row["Estatus"].ToString(),
                           Fecha = row["Fecha"].ToString(),
                           Razon = row["Razon"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_version_actual_documento(string id_template)
        {
            return Json(reporte.obtener_version_actual_documento(id_template), JsonRequestBehavior.AllowGet);
        }

        public void reporteA3(string ID_Template)
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable dt = template_running.obtener_Template_RunningID(Convert.ToInt32(ID_Template));
            string Responsable = dt.Rows[0]["Responsable"].ToString();
            string Folio = dt.Rows[0]["Folio"].ToString();
            string TipoA3 = dt.Rows[0]["TipoA3"].ToString();
            string Problema = dt.Rows[0]["Problema"].ToString();
            string Costo = dt.Rows[0]["Costo"].ToString();
            string Version = dt.Rows[0]["Versionn"].ToString();
            string FechaInicio = dt.Rows[0]["FechaInicio"].ToString();
            string FechaFin = dt.Rows[0]["FechaFin"].ToString();
            string Id_CA = template_running.obtener_id_cuadranteRunning(ID_Template, "A");
            string Id_CB = template_running.obtener_id_cuadranteRunning(ID_Template, "B");
            string Id_CC = template_running.obtener_id_cuadranteRunning(ID_Template, "C");
            string Id_CD = template_running.obtener_id_cuadranteRunning(ID_Template, "D");
            string Fecha_CA = template_running.obtener_fecha_ultima_modificacion(Id_CA);
            string Fecha_CB = template_running.obtener_fecha_ultima_modificacion(Id_CB == "" || Id_CB == null ? "" : Id_CB);
            string Fecha_CC = template_running.obtener_fecha_ultima_modificacion(Id_CC == "" || Id_CC == null ? "" : Id_CC);
            string Fecha_CD = template_running.obtener_fecha_ultima_modificacion(Id_CD);
            DataTable dt_Res = template_running.obtener_Result(Convert.ToInt32(Id_CD));
            string Nota1 = string.Empty;
            string Nota2 = string.Empty;
            if (dt_Res.Rows.Count > 0)
            {
                Nota1 = dt_Res.Rows[0]["Nota1"].ToString();
                Nota2 = dt_Res.Rows[0]["Nota2"].ToString();
            }
            DataTable dt_cost = template_running.obtener_Cost(Convert.ToInt32(Id_CD));
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

            DataTable dt_CA = template_running.obtener_secciones_CuadranteRunning_ID_for_report(Id_CA);
            DataTable dt_CB = template_running.obtener_secciones_CuadranteRunning_ID_for_report(Id_CB);
            DataTable dt_CC = template_running.obtener_secciones_CuadranteRunning_ID_for_report(Id_CC);
            DataTable dt_why = template_running.obtener_5w_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_standard = template_running.obtener_Standard_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_evaluadores = template_running.obtener_evaluadores_template_ID(Convert.ToInt32(ID_Template));

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

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            string creationDate = DateTime.Now.ToString("dd-MM-yyyy-HH:mm");
            string Filename = "Reporte_A3" + creationDate;
            // Now that you have all the bytes representing the PDF report, buffer it and send it to the client.
            //Response.Buffer = true;
            //Response.Clear();
            //Response.ContentType = "Reporte Códigos Maestros";
            ////inline or attachment
            //Response.AddHeader("content-disposition", "inline; filename=" + Filename + "." + extension);
            //Response.BinaryWrite(bytes); // create the file
            ////AT.registrarAuditTrail(DateTime.Now, HttpContext.User.Identity.Name, "I", "N/A", "Reporte PDF Código Maestro", "N/A");
            //Response.Flush(); // send it to the client to download        
            Response.ContentType = "application/pdf";
            string pdfName = "User";
            Response.AddHeader("Content-Disposition", "inline; filename=" + pdfName + ".pdf");
            Response.Buffer = true;
            Response.Cache.SetCacheability(System.Web.HttpCacheability.NoCache);
            Response.BinaryWrite(bytes);
            Response.End();
            Response.Close();
            Response.Flush();
        }
        public void reporteA3_WP(string ID_Template)
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable dt = template_running.obtener_Template_RunningID(Convert.ToInt32(ID_Template));
            string Responsable = dt.Rows[0]["Responsable"].ToString();
            string Folio = dt.Rows[0]["Folio"].ToString();
            string TipoA3 = dt.Rows[0]["TipoA3"].ToString();
            string Problema = dt.Rows[0]["Problema"].ToString();
            string Costo = dt.Rows[0]["Costo"].ToString();
            string Version = dt.Rows[0]["Versionn"].ToString();
            string FechaInicio = dt.Rows[0]["FechaInicio"].ToString();
            string FechaFin = dt.Rows[0]["FechaFin"].ToString();
            string Id_CA = template_running.obtener_id_cuadranteRunning(ID_Template, "A");
            string Id_CB = template_running.obtener_id_cuadranteRunning(ID_Template, "B");
            string Id_CC = template_running.obtener_id_cuadranteRunning(ID_Template, "C");
            string Id_CD = template_running.obtener_id_cuadranteRunning(ID_Template, "D");
            string Fecha_CA = template_running.obtener_fecha_ultima_modificacion(Id_CA);
            string Fecha_CB = template_running.obtener_fecha_ultima_modificacion(Id_CB);
            string Fecha_CC = template_running.obtener_fecha_ultima_modificacion(Id_CC);
            string Fecha_CD = template_running.obtener_fecha_ultima_modificacion(Id_CD);
            DataTable dt_Res = template_running.obtener_Result(Convert.ToInt32(Id_CD));
            string Nota1 = string.Empty;
            string Nota2 = string.Empty;
            if (dt_Res.Rows.Count > 0)
            {
                Nota1 = dt_Res.Rows[0]["Nota1"].ToString();
                Nota2 = dt_Res.Rows[0]["Nota2"].ToString();
            }
            DataTable dt_cost = template_running.obtener_Cost(Convert.ToInt32(Id_CD));
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

            DataTable dt_CA = template_running.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CA));
            DataTable dt_CB = template_running.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CB));
            DataTable dt_CC = template_running.obtener_secciones_CuadranteRunning_ID(Convert.ToInt32(Id_CC));
            DataTable dt_why = template_running.obtener_5w_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_Risk = template_running.obtener_risk_cuadrante_id(Convert.ToInt32(Id_CD));
            DataTable dt_standard = template_running.obtener_Standard_ID_Cuadrante(Convert.ToInt32(Id_CD));
            DataTable dt_evaluadores = template_running.obtener_evaluadores_template_ID(Convert.ToInt32(ID_Template));

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

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            string creationDate = DateTime.Now.ToString("dd-MM-yyyy-HH:mm");
            string Filename = "Reporte_A3" + creationDate;
            // Now that you have all the bytes representing the PDF report, buffer it and send it to the client.
            //Response.Buffer = true;
            //Response.Clear();
            //Response.ContentType = "Reporte Códigos Maestros";
            ////inline or attachment
            //Response.AddHeader("content-disposition", "inline; filename=" + Filename + "." + extension);
            //Response.BinaryWrite(bytes); // create the file
            ////AT.registrarAuditTrail(DateTime.Now, HttpContext.User.Identity.Name, "I", "N/A", "Reporte PDF Código Maestro", "N/A");
            //Response.Flush(); // send it to the client to download        
            Response.ContentType = "application/pdf";
            string pdfName = "User";
            Response.AddHeader("Content-Disposition", "inline; filename=" + pdfName + ".pdf");
            Response.Buffer = true;
            Response.Cache.SetCacheability(System.Web.HttpCacheability.NoCache);
            Response.BinaryWrite(bytes);
            Response.End();
            Response.Close();
            Response.Flush();
        }
        void SubReporte_A3Processing(object sender, SubreportProcessingEventArgs e)
        {
            string pathR = e.ReportPath;
            string dataS = string.Empty;
            DataTable dt = new DataTable();
            if (pathR == "SubReporte_Standard")
            {
                int ID_Standard = int.Parse(e.Parameters["ID_Standard"].Values[0].ToString());
                dt = template_running.obtener_Standard_ID_info(ID_Standard);
                dataS = "Standard_info";
            }
            else
            {
                int Seccion_ID = int.Parse(e.Parameters["Seccion_ID"].Values[0].ToString());
                dt = template_running.obtener_items_seccionID(Seccion_ID);
                dataS = "Items_Seccion";
            }
            ReportDataSource ds = new ReportDataSource(dataS, dt);
            e.DataSources.Add(ds);
        }
    }
}