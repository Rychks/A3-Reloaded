using A3_Reloaded.Clases;
using A3_Reloaded.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        TemplatesRunning a3 = new TemplatesRunning();
        Lenguaje lenguaje = new Lenguaje();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult obtener_TotalPag_BandejaA3(string Folio, string TipoA3, string Problem, string Contact, string Estatus,string Band, int NumRegistros = 50)
        {
            return Json(a3.obtener_TotalPag_BandejaA3(Folio, TipoA3, Problem, Contact, Estatus, Band, NumRegistros));
        }
        public JsonResult obtenerRegistros_BandejaA3(string Folio, string TipoA3, string Problem, string Contact, string Estatus,string Band, int Index = 0, int NumRegistros = 50)
        {
            List<TemplateModel> list = new List<TemplateModel>();
            try
            {
                string CWID = HttpContext.User.Identity.Name.ToUpper();
                string ID_Language = lenguaje.obtener_Idioma_Usuario(CWID);
                DataTable datos = a3.obtenerRegistros_BandejaA3(Folio, TipoA3, Problem, Contact, Estatus,Convert.ToInt16(ID_Language), Band, Index, NumRegistros);
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new TemplateModel
                    {
                        RowNumber = Convert.ToInt32(dr["RowNumber"]),
                        ID = Convert.ToInt32(dr["ID"]),
                        Folio = dr["Folio"].ToString(),
                        TipoA3 = dr["TipoA3"].ToString(),
                        Version = Convert.ToInt32(dr["Version"]),
                        Contact = dr["Contact"].ToString(),
                        Problem = dr["Problem"].ToString(),
                        Descripcion = dr["Problem"].ToString(),
                        Rol = dr["Rol"].ToString(),
                        Estatus = Convert.ToInt32(dr["Estatus"]),
                        Status_Text = dr["Status_Text"].ToString()
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