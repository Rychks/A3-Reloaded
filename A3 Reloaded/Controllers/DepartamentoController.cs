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
    public class DepartamentoController : Controller
    {
        Clases.AuditTrail AT = new Clases.AuditTrail();
        Clases.Departamentos DE = new Clases.Departamentos();
        Clases.Usuarios US = new Clases.Usuarios();
        Notificaciones noti = new Notificaciones();
        [Authorize]
        // GET: Departamento
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult obtenerDepartamento(int ID)
        {
            List<DepartamentoModel> list = new List<DepartamentoModel>();
            try
            {
                DataTable datos = DE.obtener_Departamento_ID(ID);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerTotalPagDepartamentos(string Nombre, string Activo, int NumRegistros = 5)
        {
            return Json(DE.obtener_TotalPag_Departamentos(Nombre,Activo, NumRegistros), JsonRequestBehavior.AllowGet);
        }
        public JsonResult mostrarDepartamentos(string Nombre, string Activo, int Index = 0, int NumRegistros = 5)
        {
            List<DepartamentoModel> list = new List<DepartamentoModel>();
            try
            {
                DataTable datos = DE.mostrar_Departamentos(Nombre, Activo, Index, NumRegistros);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        private List<DepartamentoModel> organizarDatos(DataTable Datos)
        {
            List<DepartamentoModel> list = new List<DepartamentoModel>();
            try
            {
                foreach (DataRow data in Datos.Rows)
                {
                    if (Datos.Columns.Contains("RowNumber"))
                    {
                        list.Add(new DepartamentoModel
                        {
                            RowNumber = Convert.ToInt32(data["RowNumber"]),
                            ID = Convert.ToInt32(data["ID"]),
                            Nombre = data["Nombre"].ToString(),
                            Activo = Convert.ToInt32(data["Activo"])
                        });
                    }
                    else
                    {
                        list.Add(new DepartamentoModel
                        {
                            ID = Convert.ToInt32(data["ID"]),
                            Nombre = data["Nombre"].ToString(),
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
                        if (col.ColumnName.ToString() == "Activo")
                        {
                            //string Activo = "Inactivo", Activo2 = "Inactivo";
                            //if (Anterior.Rows[i][col.ColumnName.ToString()].ToString() == "1")
                            //{
                            //    Activo = "Activo";
                            //}
                            //if (Actual.Rows[i][col.ColumnName.ToString()].ToString() == "1")
                            //{
                            //    Activo2 = "Activo";
                            //}
                            //Comparacion["Anterior"] += Activo + ", ";
                            //Comparacion["Actual"] += Activo2 + ", ";
                        }
                    }
                }
            }

            if (Comparacion["Anterior"].Substring(Comparacion["Anterior"].Length - 2, 2) == ", ")
            {
                Comparacion["Anterior"] = Comparacion["Anterior"].Remove(Comparacion["Anterior"].Length - 2, 2);
            }
            if (Comparacion["Actual"].Substring(Comparacion["Actual"].Length - 2, 2) == ", ")
            {
                Comparacion["Actual"] = Comparacion["Actual"].Remove(Comparacion["Actual"].Length - 2, 2);
            }
            return Comparacion;
        }
        public JsonResult guardarDepartamento(string Nombre,string Activo)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = DE.registrar_Departamento(Nombre, Convert.ToInt32(Activo));
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Departamento_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Departamento: " + Nombre + "","N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Departamento_guardado_error;
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
                noti.Mensaje = Mensajes.Departamento_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizarDepartamento(int ID, string Nombre,string Activo)
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
                    DataTable datosAnterior = DE.obtener_Departamento_ID(ID);

                    string v = datosAnterior.Rows[0]["ID"].ToString();
                    string datos = DE.actualizar_Departamento(ID, Nombre, Convert.ToInt32(Activo));
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Departamento_modificado;
                        noti.Tipo = "success";

                        DataTable datosActual = DE.obtener_Departamento_ID(ID);
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
                        noti.Mensaje = Mensajes.Departamento_modificado_error;
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
                noti.Mensaje = Mensajes.Departamento_modificado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Lista_Departamentos(string Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                DataTable datos = US.obtener_Departamentos(Activo);
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