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
    public class EquiposController : Controller
    {
        // GET: Equipos
        Usuarios US = new Usuarios();
        Notificaciones noti = new Notificaciones();
        AuditTrail AT = new AuditTrail();
        Equipos EQ= new Equipos();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult EquipoIndex()
        {
            return View();
        }
        public JsonResult registro_Equipo(string Nombre, int Activo)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = EQ.registrar_Equipos(Nombre, Activo);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Registro_Equipo;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Equipo: " + Nombre + " ", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Registro_Equipo_Error;
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
                noti.Mensaje = Mensajes.Registro_Equipo_Error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizar_Equipo(int ID, string Nombre, int Activo)
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
                    DataTable datosAnterior = EQ.obtener_Equipos_ID(ID);

                    string datos = EQ.actualizar_Equipos(ID, Nombre, Activo);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Actualizar_Equipo;
                        noti.Tipo = "success";
                        string Anterior = string.Empty;
                        string Actual = string.Empty;
                        DataTable datosActual = EQ.obtener_Equipos_ID(ID);
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
                        noti.Mensaje = Mensajes.Actualizar_Equipo_Error;
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
                noti.Mensaje = Mensajes.Actualizar_Equipo_Error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerTotalPagEquipo(string Nombre, string Activo, int NumRegistros = 50)
        {
            return Json(EQ.obtener_TotalPagEquipos(Nombre, Activo, NumRegistros));
        }
        public JsonResult mostrarEquipos(string Nombre, string Departamento, string Activo, int Index = 0, int NumRegistros = 50)
        {
            List<SubareaModel> list = new List<SubareaModel>();
            try
            {
                DataTable datos = EQ.mostrar_Equipos(Nombre, Activo, Index, NumRegistros);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new SubareaModel
                    {
                        RowNumber = Convert.ToInt32(data["RowNumber"]),
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
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
        public JsonResult obtener_Equipo_ID(int ID)
        {
            List<SubareaModel> list = new List<SubareaModel>();
            try
            {
                DataTable datos = EQ.obtener_Equipos_ID(ID);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new SubareaModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
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
        public JsonResult Lista_Equipos(int Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                DataTable datos = EQ.obtener_lista_Equipos(Activo);
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