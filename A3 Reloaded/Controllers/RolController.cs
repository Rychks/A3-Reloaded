using A3_Reloaded.Clases;
using A3_Reloaded.Models;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Data;
using System.EnterpriseServices;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    public class RolController : Controller
    {
        // GET: Rol
        Usuarios user = new Usuarios();
        Notificaciones notify = new Notificaciones();
        AuditTrail audit = new AuditTrail();
        Rol rol = new Rol();
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Rol_Index()
        {
            return View();
        }
        public JsonResult obtenerPaginado_Roles(string Nombre, string Activo, int NumRegistros = 50)
        {
            return Json(rol.obtenerPaginado_Roles(Nombre, Activo, NumRegistros));
        }
        public JsonResult obtenerRegistros_Roles(string Nombre, string Activo, int Index = 0, int NumRegistros = 50)
        {
            List<RolesModel> list = new List<RolesModel>();
            try
            {
                DataTable datos = rol.ObtenerRegistros_Roles(Nombre, Activo, Index, NumRegistros);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new RolesModel
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
        public JsonResult obtener_Rol_ID(int ID)
        {
            List<RolesModel> list = new List<RolesModel>();
            try
            {
                DataTable datos = rol.obtener_Rol_ID(ID);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new RolesModel
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
        public JsonResult obtenerLista_Funcion(string Activo)
        {
            List<AccesosModel> list = new List<AccesosModel>();
            try
            {
                DataTable datos = rol.obtenerLista_Funcion(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new AccesosModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Modulo = data["Modulo"].ToString(),
                        Funcion = data["Funcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Accesos(int Rol)
        {
            List<AccesosModel> list = new List<AccesosModel>();
            try
            {
                DataTable datos = rol.obtener_Accesos(Rol);
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new AccesosModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Nombre = dr["Funcion"].ToString()
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_Rol(string Nombre, int Activo)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = user.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = rol.registrar_Rol(Nombre, Activo);
                    if (datos == "guardado")
                    {
                        notify.Mensaje = "Role saved";
                        notify.Tipo = "success";
                        //AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Equipo: " + Nombre + " ", "N/A");
                    }
                    else
                    {
                        notify.Mensaje = "An error ocurred when you try save the Role";
                        notify.Tipo = "warning";
                    }
                }
                else
                {
                    audit.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
                    notify.Mensaje = Mensajes.contrasena_incorrecta;
                    notify.Tipo = "warning";
                }
                   
            }
            catch (Exception e)
            {
                notify.Mensaje = "An error ocurred when you try save the Role";
                notify.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(notify, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizarRol(int ID, string Nombre, int Activo)
        {
            try
            {
                string Usuario = Request["BYTOST"];
                string Pass = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = user.autenticacion(Usuario, Pass);
                if (firma)
                {
                    DataTable datosAnterior = rol.obtener_Rol_ID(ID);
                    string datos = rol.actualizar_Rol(ID, Nombre, Activo);
                    if (datos == "guardado")
                    {
                        notify.Mensaje = "Rol successfully updated";
                        notify.Tipo = "success";
                        DataTable datosActual = rol.obtener_Rol_ID(ID);
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

                        audit.registrarAuditTrail(Registro, Usuario, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        notify.Mensaje = "An error ocurred when you try update the Role";
                        notify.Tipo = "warning";
                    }
                }
                else
                {
                    audit.registrarAuditTrail(Registro, Usuario, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
                    notify.Mensaje = Mensajes.contrasena_incorrecta;
                    notify.Tipo = "warning";
                }


            }
            catch (Exception e)
            {
                notify.Mensaje = "An error ocurred when you try update the Role";
                notify.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(notify, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_permisos(List<AccesosModel> lista, int Rol)
        {
            try
            {
                string Usuario = Request["BYTOST"];
                string Pass = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = user.autenticacion(Usuario, Pass);
                if (firma)
                {
                    string datos_li = rol.Limpiar_Permisos(Rol);
                    if (datos_li == "guardado")
                    {
                        DataTable dtDetallePermisos = new DataTable();
                        dtDetallePermisos.Columns.Add(new DataColumn("Ac_rol", typeof(int)));
                        dtDetallePermisos.Columns.Add(new DataColumn("Ac_Function", typeof(int)));

                        foreach (AccesosModel item in lista)
                        {
                            dtDetallePermisos.Rows.Add(item.Rol, item.ID);
                        }
                        string confirmacion = rol.registrar_permisos(dtDetallePermisos);
                        if (confirmacion == "guardado")
                        {
                            notify.Tipo = "success";
                            notify.Mensaje = "Successfully saved settings";
                            audit.registrarAuditTrail(Registro,Usuario, "M", "Role Configuration", "N/A", "N/A");
                        }
                        else
                        {
                            notify.Tipo = "warning";
                            notify.Mensaje = "An error occurred while trying to save the Information";
                            notify.Error = confirmacion;
                        }
                    }
                    else
                    {
                        notify.Tipo = "warning";
                        notify.Mensaje = "An error occurred while trying to save the Information";
                        notify.Error = datos_li;
                    }
                }
                else
                {
                    audit.registrarAuditTrail(Registro, Usuario, "I", "N/A", "Firma electrónica fallida", "Contraseña Incorrecta");
                    notify.Mensaje = Mensajes.contrasena_incorrecta;
                    notify.Tipo = "warning";
                }

            }
            catch (Exception ex)
            {
                notify.Tipo = "warning";
                notify.Mensaje = "An error occurred while trying to save the Information";
                notify.Error = ex.Message;
            }
            return Json(notify, JsonRequestBehavior.AllowGet);
        }
        public JsonResult verificarAcceso(int funcionId)
        {
            string cwidUsuario = HttpContext.User.Identity.Name;
            int rolId = rol.obtenerRol_usuario(cwidUsuario);

            return Json(rol.verificarAcceso(rolId, funcionId), JsonRequestBehavior.AllowGet);
        }
    }
}