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
    public class SeccionesController : Controller
    {

        // GET: Secciones
        Clases.AuditTrail AT = new Clases.AuditTrail();
        Clases.Secciones SE = new Clases.Secciones();
        Clases.Usuarios US = new Clases.Usuarios();
        Notificaciones noti = new Notificaciones();
        public ActionResult Index()
        {
            return View();
        }
        private Dictionary<string, string> compararDatos(DataTable Anterior, DataTable Actual)
        {
            var Comparacion = new Dictionary<string, string>();
            Comparacion["Anterior"] = "";
            Comparacion["Actual"] = "";
            for (int i = 0; i < Anterior.Rows.Count; i++)
            {
                foreach (DataColumn col in Anterior.Columns)
                {
                    if (Anterior.Rows[i][col.ColumnName.ToString()].ToString() != Actual.Rows[i][col.ColumnName.ToString()].ToString())
                    {
                        string columna = col.ColumnName.ToString();
                        if (col.ColumnName.ToString() == "Activo")
                        {
                            string Activo = "Inactivo", Activo2 = "Inactivo";
                            if (Anterior.Rows[i][col.ColumnName.ToString()].ToString() == "1")
                            {
                                Activo = "Activo";
                            }
                            if (Actual.Rows[i][col.ColumnName.ToString()].ToString() == "1")
                            {
                                Activo2 = "Activo";
                            }
                            Comparacion["Anterior"] += Activo + ", ";
                            Comparacion["Actual"] += Activo2 + ", ";
                        }
                    }
                }
            }

            //if (Comparacion["Anterior"].Substring(Comparacion["Anterior"].Length - 2, 2) == ", ")
            //{
            //    Comparacion["Anterior"] = Comparacion["Anterior"].Remove(Comparacion["Anterior"].Length - 2, 2);
            //}
            //if (Comparacion["Actual"].Substring(Comparacion["Actual"].Length - 2, 2) == ", ")
            //{
            //    Comparacion["Actual"] = Comparacion["Actual"].Remove(Comparacion["Actual"].Length - 2, 2);
            //}
            return Comparacion;
        }
        public JsonResult actualizarSeccion(int ID, string Nombre, string Descripcion, string Posicion, string Cuadrante, string Template, string Activo)
        {
            try
            {
                string Usuario = Request["BYTOST"];
                string Pass = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(Usuario, Pass);
                if (firma)
                {
                    DataTable datosAnterior = SE.obtener_SeccionID(ID);

                    string v = datosAnterior.Rows[0]["ID"].ToString();
                    string datos = SE.actualizar_Seccion(ID, Nombre,Descripcion, Convert.ToInt32(Posicion), Convert.ToInt32(Cuadrante), Convert.ToInt32(Template), Convert.ToInt32(Activo));
                    if (datos == "guardado")
                    {
                        noti.Mensaje =Mensajes.template_modificado;
                        noti.Tipo = "success";

                        DataTable datosActual = SE.obtener_SeccionID(ID);
                        string Actual = string.Empty;
                        string Anterior = string.Empty;
                        for (int i = 0; i < datosAnterior.Rows.Count; i++)
                        {
                            foreach (DataColumn dc_acterior in datosAnterior.Columns)
                            {
                                string dato_anterior = datosAnterior.Rows[i][dc_acterior.ColumnName.ToString()].ToString();
                                string dato_actual = datosActual.Rows[i][dc_acterior.ColumnName.ToString()].ToString();
                                string Columna = dc_acterior.ColumnName.ToString();
                                if (dato_anterior != dato_actual)
                                {
                                    if (Columna == "Activo")
                                    {
                                        string Activo_Anterior = string.Empty;
                                        string Activo_Actual = string.Empty;
                                        if (dato_anterior == "1") { Activo_Anterior = "Activo"; } else { Activo_Anterior = "Inactivo"; }
                                        if (dato_actual == "1") { Activo_Actual = "Activo"; } else { Activo_Actual = "Inactivo"; }
                                        if (string.IsNullOrEmpty(Anterior))
                                        {
                                            Anterior = Activo_Anterior;
                                            Actual = Activo_Actual;
                                        }
                                        else
                                        {
                                            Anterior = Anterior + ", " + Activo_Anterior;
                                            Actual = Actual + ", " + Activo_Actual;
                                        }
                                    }
                                    else
                                    {
                                        if (string.IsNullOrEmpty(Anterior))
                                        {
                                            Anterior = dato_anterior;
                                            Actual = dato_actual;
                                        }
                                        else
                                        {
                                            Anterior = Anterior + ", " + dato_anterior;
                                            Actual = Actual + ", " + dato_actual;
                                        }
                                    }
                                }
                            }
                        }
                        AT.registrarAuditTrail(Registro, Usuario, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Template_modificado_error;
                        noti.Tipo = "warning";
                    }
                }
                else
                {
                    AT.registrarAuditTrail(Registro, Usuario, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
                    noti.Mensaje = Mensajes.contrasena_incorrecta;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Template_modificado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardarSecciones(string Nombre, string Descripcion, string Cuadrante, string Template, string Activo)
        {
            try
            {
                //string BYTOST = Request["BYTOST"];
                //string ZNACKA = Request["ZNACKA"];
                string BYTOST = HttpContext.User.Identity.Name.ToUpper();
                DateTime Registro = DateTime.Now;
                string datos = SE.registrar_Seccion(Nombre, Descripcion, 1, Convert.ToInt32(Cuadrante), Convert.ToInt32(Template), Convert.ToInt32(Activo));
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Seccion_guardar;
                    noti.Tipo = "success";
                    AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Sección: " + Nombre + "", "N/A");
                }
                else
                {
                    noti.Mensaje = Mensajes.Seccion_guardar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Seccion_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerSeccion(int ID)
        {
            List<SeccionModel> list = new List<SeccionModel>();
            try
            {
                DataTable datos = SE.obtener_SeccionID(ID);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        private List<SeccionModel> organizarDatos(DataTable Datos)
        {
            List<SeccionModel> list = new List<SeccionModel>();
            try
            {
                foreach (DataRow data in Datos.Rows)
                {
                    if (Datos.Columns.Contains("RowNumber"))
                    {
                        list.Add(new SeccionModel
                        {
                            RowNumber = Convert.ToInt32(data["RowNumber"]),
                            ID = Convert.ToInt32(data["ID"]),
                            Nombre = data["Nombre"].ToString(),
                            Descripcion = data["Descripcion"].ToString(),
                            Posicion = Convert.ToInt32(data["Posicion"]),
                            Cuadrante =  data["Cuadrante"].ToString(),
                            Template = data["Template"].ToString(),
                            Activo = Convert.ToInt32(data["Activo"])
                        });
                    }
                    else
                    {
                        list.Add(new SeccionModel
                        {
                            ID = Convert.ToInt32(data["ID"]),
                            Nombre = data["Nombre"].ToString(),
                            Descripcion = data["Descripcion"].ToString(),
                            Posicion = Convert.ToInt32(data["Posicion"]),
                            Cuadrante = data["Cuadrante"].ToString(),
                            Template = data["Template"].ToString(),
                            Activo = Convert.ToInt32(data["Activo"])
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
        public JsonResult obtenerTotalPagSeccion(string Nombre, string Descripcion,string Posicion, string Cuadrante, string Template, string Activo, int NumRegistros = 50)
        {
            return Json(SE.obtener_TotalPagSeccion(Nombre, Descripcion, Posicion, Cuadrante,Template, Activo, NumRegistros), JsonRequestBehavior.AllowGet);
        }
        public JsonResult mostrarSecciones(string Nombre, string Descripcion, string Posicion, string Cuadrante, string Template, string Activo, int Index = 0, int NumRegistros = 50)
        {
            List<SeccionModel> list = new List<SeccionModel>();
            try
            {
                DataTable datos = SE.mostrar_Secciones(Nombre,Descripcion, Posicion, Cuadrante,Template, Activo, Index, NumRegistros);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_template_sections_by_id_cuadrant(int id_cuadrante)
        {
            List<SeccionModel> list = new List<SeccionModel>();
            try
            {
                DataTable datos = SE.get_template_sections_by_id_cuadrant(id_cuadrante);

                foreach (DataRow row in datos.Rows)
                {
                    list.Add(new SeccionModel
                    {
                        id_seccion = Convert.ToInt32(row["ID"]),
                        Nombre = row["Nombre"].ToString(),
                        Descripcion = row["Descripcion"].ToString(),
                        Posicion = Convert.ToInt32(row["Posicion"]),
                        id_cuadrante = Convert.ToInt32(row["id_cuadrante"]),
                        id_template = Convert.ToInt32(row["id_template"]),
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