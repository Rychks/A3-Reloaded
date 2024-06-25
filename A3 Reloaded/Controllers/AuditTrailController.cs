using A3_Reloaded.Clases;
using A3_Reloaded.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class AuditTrailController : Controller
    {
        Clases.AuditTrail AT = new Clases.AuditTrail();
        // GET: AuditTrail
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult obtenerTotalPagAuditTrail(string Fecha1, string Fecha2, string Usuario, string Accion, string Anterior,
            string Actual, string Justificacion, int Index = 0, int NumRegistros = 100)
        {
            int TotalPaginas = 0;
            try
            {
                TotalPaginas = AT.obtener_TotalPagAuditTrail(Fecha1, Fecha2, Usuario, Accion, Anterior, Actual, Justificacion, NumRegistros);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(TotalPaginas);
        }
        public void reporteAT(string Fecha1, string Fecha2, string Usuario, string Accion)
        {
            //string Responsable = US.obtener_Nombre_Usuario(HttpContext.User.Identity.Name, "A");
            string Impresion = Convert.ToDateTime(DateTime.Now).ToString("MM/dd/yyyy HH:mm:ss");
            DataTable datos = AT.Reporte_AuditTrail(Fecha1, Fecha2, Usuario, Accion);
            // Setup DataSet
            //DataTable datos = CM.reporte_CodigosMaestros(Codigo, Producto, MPI, Activo, Fecha1, Fecha2, Usuario);
            // Create Report DataSource
            ReportDataSource dt_AT = new ReportDataSource("DT_AuditTrail", datos);

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

            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_AT.rdlc");
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Fecha", Mensajes.Fecha));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Usuario", Mensajes.Usuario));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Accion", Mensajes.Accion));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Actual", Mensajes.Actual));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Anterior", Mensajes.Anterior));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Justificacion", Mensajes.Justificacion));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Modificacion", Mensajes.Modificacion));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Insercion", Mensajes.Insercion));
            viewer.LocalReport.SetParameters(new ReportParameter("Idioma_Eliminacion", Mensajes.Eliminacion));
            viewer.ProcessingMode = ProcessingMode.Local;
            viewer.LocalReport.ReportPath = Server.MapPath(@"/Assets/Reporte/Reporte_AT.rdlc");

            //viewer.LocalReport.DataSources.Add(Secciones_CA);
            //viewer.LocalReport.DataSources.Add(Secciones_CB);
            //viewer.LocalReport.DataSources.Add(Secciones_CC); // Add datasource here

            byte[] bytes = viewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            string creationDate = DateTime.Now.ToString("dd-MM-yyyy-HH:mm");
            string Filename = "Reporte_Audit_Trail" + creationDate;
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
        public JsonResult mostrarAuditTrail(string Fecha1, string Fecha2, string Usuario, string Accion, string Anterior,
            string Actual, string Justificacion, int Index = 0, int NumRegistros = 100)
        {
            List<AuditTrailModel> list = new List<AuditTrailModel>();
            try
            {
                DataTable datos = AT.mostrar_AuditTrail(Fecha1, Fecha2, Usuario, Accion, Anterior, Actual, Justificacion, Index, NumRegistros);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AuditTrailModel
                    {
                        RowNumber = data["RowNumber"].ToString(),
                        Fecha = data["Fecha"].ToString(),
                        Usuario = data["Usuario"].ToString(),
                        Accion = data["Accion"].ToString(),
                        Anterior = data["Anterior"].ToString(),
                        Actual = data["Actual"].ToString(),
                        Justificacion = data["Justificacion"].ToString()
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