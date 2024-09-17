using A3_Reloaded.Clases;
using A3_Reloaded.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class OEEController : Controller
    {
        OEE oee = new OEE();
        // GET: OEE
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult get_top5Failures(string Linea)
        {
            List<OEEFallasModel> list = new List<OEEFallasModel>();
            try
            {
                DataTable datos = oee.obtener_top5Fallas(Linea);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new OEEFallasModel
                    {
                        Minutos = Convert.ToInt32(data["Minutos"]),
                        Linea = data["Linea"].ToString(),
                        Fecha = data["Fecha"].ToString(),
                        Maquina = data["Maquina"].ToString(),
                        Motivo = data["Motivo"].ToString(),
                        Clasificacion = data["ClasificacionParo"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_eventos_falla(string fecha,string linea,string maquina,string motivo,string clasificacion)
        {
            List<OEEFallasModel> list = new List<OEEFallasModel>();
            try
            {
                DataTable datos = oee.obtener_eventos_falla(fecha,linea,maquina,motivo,clasificacion);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new OEEFallasModel
                    {
                        Minutos = Convert.ToInt32(data["Minutos"]),
                        Linea = data["Linea"].ToString(),
                        Fecha = data["Fecha"].ToString(),
                        Maquina = data["Maquina"].ToString(),
                        Motivo = data["Motivo"].ToString(),
                        Clasificacion = data["ClasificacionParo"].ToString(),
                        Comentario = data["Comentario"].ToString(),
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