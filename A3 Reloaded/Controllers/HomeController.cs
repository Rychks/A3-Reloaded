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
        Home _home = new Home();
        Templates template = new Templates();
        Lenguaje lenguaje = new Lenguaje();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult get_list_status(string Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                string CWID = HttpContext.User.Identity.Name.ToUpper();
                string ID_Language = lenguaje.obtener_Idioma_Usuario(CWID);
                DataTable datos = template.get_list_status(ID_Language);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ListaModel
                    {
                        ID = Convert.ToInt32(data["Ds_status"]),
                        Opcion = data["Ds_text"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_TotalPag_BandejaA3(string Fecha1, string Fecha2, string Linea, string Folio, string TipoA3,string CWID, string CWID_Logged, string Estatus, string Idioma, string PalabraClave, int NumRegistros = 50)
        {
            string User_cwid = HttpContext.User.Identity.Name.ToUpper();
            string ID_Language = lenguaje.obtener_Idioma_Usuario(User_cwid);
            return Json(_home.obtener_TotalPag_BandejaA3_v2(Fecha1, Fecha2, Linea, Folio, TipoA3, CWID, CWID_Logged, Estatus, ID_Language,PalabraClave,NumRegistros));
        }
        public JsonResult obtenerRegistros_BandejaA3(string Fecha1, string Fecha2, string Linea, string Folio, string TipoA3, string CWID, string CWID_Logged, string Estatus, string Idioma, string PalabraClave, int Index = 0, int NumRegistros = 50)
        {
            List<HomeModel> list = new List<HomeModel>();
            try
            {
                string User_cwid = HttpContext.User.Identity.Name.ToUpper();
                string ID_Language = lenguaje.obtener_Idioma_Usuario(User_cwid);
                DataTable datos = _home.obtenerRegistros_BandejaA3_v2(Fecha1, Fecha2, Linea, Folio, TipoA3, CWID, CWID_Logged, Estatus, ID_Language, PalabraClave, Index, NumRegistros);
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new HomeModel
                    {
                        RowNumber = Convert.ToInt32(dr["RowNumber"]),
                        Estatus_Id = Convert.ToInt32(dr["Estatus_Id"]),
                        Folio = Convert.ToInt32(dr["Folio"]),
                        Tipo = dr["Tipo"].ToString(),
                        Version = Convert.ToInt32(dr["Version"]),
                        Owner = dr["Owner"].ToString(),
                        FechaInicio = Convert.ToDateTime(dr["FechaInicio"]).ToString("dd.MM.yyyy HH:mm:ss"),
                        Problema = dr["Problema"].ToString(),
                        Concecuencia = dr["Concecuencia"].ToString(),
                        Rol = dr["Rol"].ToString(),
                        EstatusA3 = dr["EstatusA3"].ToString(),
                        Lineas = dr["Lineas"].ToString(),
                        Estatus = dr["Estatus"].ToString()
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