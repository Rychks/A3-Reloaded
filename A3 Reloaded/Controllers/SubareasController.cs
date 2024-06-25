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
    public class SubareasController : Controller
    {
        // GET: Subareas
        Usuarios US = new Usuarios();
        Notificaciones noti = new Notificaciones();
        AuditTrail AT = new AuditTrail();
        Subareas SA = new Subareas();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult SubareasIndex()
        {
            return View();
        }
        public JsonResult registro_Subarea(string Nombre, int Departamento, int Activo)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = SA.registrar_Subarea(Nombre, Departamento, Activo);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Registro_Subarea;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nueva Subarea: " + Nombre + " ", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Registro_Subarea_Error;
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
                noti.Mensaje = Mensajes.Registro_Subarea_Error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizar_Subarea(int ID,string Nombre, int Departamento, int Activo)
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
                    DataTable datosAnterior = SA.obtener_Subarea_ID(ID);

                    string datos = SA.actualizar_Subarea(ID,Nombre, Departamento, Activo);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Actualizar_Subarea;
                        noti.Tipo = "success";
                        string Anterior = string.Empty;
                        string Actual = string.Empty;
                        DataTable datosActual = SA.obtener_Subarea_ID(ID);
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
                                    else if (Columna == "Departamento")
                                    {
                                        string Dep_Anterior = US.obtener_Nombre_Departamento(dato_anterior);
                                        string Dep_Actual = US.obtener_Nombre_Departamento(dato_actual);
                                        if (string.IsNullOrEmpty(Anterior))
                                        {
                                            Anterior = Dep_Anterior;
                                            Actual = Dep_Actual;
                                        }
                                        else
                                        {
                                            Anterior = Anterior + ", " + Dep_Anterior;
                                            Actual = Actual + ", " + Dep_Actual;
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
                        noti.Mensaje = Mensajes.Actualizar_Subarea_Error;
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
                noti.Mensaje = Mensajes.Actualizar_Subarea_Error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerTotalPagSubarea(string Nombre, string Departamento, string Activo, int NumRegistros = 5)
        {
            return Json(SA.obtener_TotalPagSubareas(Nombre, Departamento, Activo, NumRegistros));
        }
        public JsonResult mostrarSubareas(string Nombre, string Departamento, string Activo, int Index = 0, int NumRegistros = 5)
        {
            List<SubareaModel> list = new List<SubareaModel>();
            try
            {
                DataTable datos = SA.mostrar_Subareas(Nombre,Departamento, Activo, Index, NumRegistros);
                foreach(DataRow data in datos.Rows)
                {
                    list.Add(new SubareaModel
                    {
                        RowNumber = Convert.ToInt32(data["RowNumber"]),
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
                        Departamento = data["Departamento"].ToString(),
                        Activo = Convert.ToInt32(data["Activo"])
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Subarea_ID(int ID)
        {
            List<SubareaModel> list = new List<SubareaModel>();
            try
            {
                DataTable datos = SA.obtener_Subarea_ID(ID);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new SubareaModel
                    {                      
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
                        ID_Departamento = Convert.ToInt32(data["Departamento"]),
                        Activo = Convert.ToInt32(data["Activo"])
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Lista_Subareas(int Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                DataTable datos = SA.obtener_lista_Subareas(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ListaModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Opcion = data["Nombre"].ToString(),
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