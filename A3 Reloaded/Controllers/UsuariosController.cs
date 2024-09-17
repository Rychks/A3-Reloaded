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
    public class UsuariosController : Controller
    {
        Clases.AuditTrail AT = new Clases.AuditTrail();
        Clases.Usuarios US = new Clases.Usuarios();
        Notificaciones noti = new Notificaciones();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult obtenerTotalPagUsuarios(string CWID, string Nombre, string App, string Correo, string Rol,string Departamento, string Activo, int NumRegistros = 50)
        {
            return Json(US.obtener_TotalPagUsuarios(CWID, Nombre, App, Correo, Rol, Departamento, Activo, NumRegistros));
        }
        public JsonResult mostrarUsuarios(string CWID, string Nombre, string App,string Correo, string Rol, string Departamento, string Activo, int Index = 0, int NumRegistros = 50)
        {
            List<UsuarioModel> list = new List<UsuarioModel>();
            try
            {
                DataTable datos = US.mostrar_Usuarios(CWID, Nombre, App, Correo, Rol, Departamento, Activo, Index, NumRegistros);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult guardarUsuario(string CWID, string Nombre, string App, string Correo, string Rol,string Departamento, string Activo)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                int estatus = US.revisar_Usuario(CWID);
                if (estatus == 404)
                {
                    bool firma = US.autenticacion(BYTOST, ZNACKA);
                    if (firma)
                    {
                        string datos = US.registrar_Usuario(CWID.ToUpper(), Nombre, App, Correo, Convert.ToInt32(Rol), Convert.ToInt32(Departamento), Convert.ToInt32(Activo));
                        if (datos == "guardado")
                        {
                            noti.Mensaje = Mensajes.Usuario_guardar;
                            noti.Tipo = "success";
                            AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Usuario: " + Nombre + " " + App + " (" + CWID.ToUpper() + ")", "N/A");
                        }
                        else
                        {
                            noti.Mensaje = Mensajes.Usuario_guardar_error;
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
                else
                {
                    noti.Mensaje = Mensajes.Usuario_guardar_existente;
                    noti.Tipo = "info";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Usuario_guardar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerUsuario(int ID)
        {
            List<UsuarioModel> list = new List<UsuarioModel>();
            try
            {
                DataTable datos = US.obtener_UsuarioID(ID);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerRoles(string Activo)
        {
            List<RolesModel> list = new List<RolesModel>();
            try
            {
                DataTable datos = US.obtener_Roles(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new RolesModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Rol = data["Rol"].ToString(),
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
        public JsonResult obtener_Lista_Roles(string Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                DataTable datos = US.obtener_Roles(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ListaModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Opcion = data["Rol"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Lista_Usuarios(string Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                DataTable datos = US.obtener_Usuarios(Activo);
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
        public JsonResult obtenerUsuarios(string Activo)
        {
            List<UsuarioModel> list = new List<UsuarioModel>();
            try
            {
                DataTable datos = US.obtener_Usuarios(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new UsuarioModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Nombre = data["Nombre"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerDepartamentos(string Activo)
        {
            List<DepartamentoModel> list = new List<DepartamentoModel>();
            try
            {
                DataTable datos = US.obtener_Departamentos(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new DepartamentoModel
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
        private List<UsuarioModel> organizarDatos(DataTable Datos)
        {
            List<UsuarioModel> list = new List<UsuarioModel>();
            try
            {
                foreach (DataRow data in Datos.Rows)
                {
                    if (Datos.Columns.Contains("RowNumber"))
                    {
                        list.Add(new UsuarioModel
                        {
                            RowNumber = Convert.ToInt32(data["RowNumber"]),
                            ID = Convert.ToInt32(data["ID"]),
                            CWID = data["CWID"].ToString(),
                            Nombre = data["Nombre"].ToString(),
                            App = data["App"].ToString(),
                            Correo = data["Correo"].ToString(),
                            Rol = data["Rol"].ToString(),
                            Departamento = data["Departamento"].ToString(),
                            Activo = Convert.ToInt32(data["Activo"])
                        });
                    }
                    else
                    {
                        list.Add(new UsuarioModel
                        {
                            ID = Convert.ToInt32(data["ID"]),
                            CWID = data["CWID"].ToString(),
                            Nombre = data["Nombre"].ToString(), 
                            App = data["App"].ToString(),
                            Correo = data["Correo"].ToString(),
                            Rol = data["Rol"].ToString(),
                            Departamento = data["Departamento"].ToString(),
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
                        else if (col.ColumnName.ToString() == "Rol")
                        {
                            Comparacion["Anterior"] += US.obtener_Nombre_Rol(Anterior.Rows[i][col.ColumnName.ToString()].ToString()) + ", ";
                            Comparacion["Actual"] += US.obtener_Nombre_Rol(Actual.Rows[i][col.ColumnName.ToString()].ToString()) + ", ";
                        }
                        else
                        {
                            Comparacion["Anterior"] += Anterior.Rows[i][col.ColumnName.ToString()].ToString() + ", ";
                            Comparacion["Actual"] += Actual.Rows[i][col.ColumnName.ToString()].ToString() + ", ";
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
        public JsonResult actualizarUsuario(int ID, string CWID, string Nombre, string App,  string Correo, string Rol, string Departamento, string Activo)
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
                    DataTable datosAnterior = US.obtener_UsuarioID(ID);

                    string datos = US.actualizar_Usuario(ID, CWID.ToUpper(), Nombre, App, Correo, Convert.ToInt32(Rol), Convert.ToInt32(Departamento), Convert.ToInt32(Activo));
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Usuario_modificar;
                        noti.Tipo = "success";
                        string Anterior = string.Empty;
                        string Actual = string.Empty;
                        DataTable datosActual = US.obtener_UsuarioID(ID);
                        for(int i = 0; i < datosAnterior.Rows.Count; i++)
                        {
                            foreach (DataColumn dc_acterior in datosAnterior.Columns)
                            {
                                string dato_anterior = datosAnterior.Rows[i][dc_acterior.ColumnName.ToString()].ToString();
                                string dato_actual = datosActual.Rows[i][dc_acterior.ColumnName.ToString()].ToString();
                                string Columna = dc_acterior.ColumnName.ToString();
                                if (dato_anterior != dato_actual)
                                {
                                    if (Columna == "Rol")
                                    {
                                        string Rol_Anterior = US.obtener_Nombre_Rol(dato_anterior);
                                        string Rol_Actual = US.obtener_Nombre_Rol(dato_actual);
                                        if (string.IsNullOrEmpty(Anterior))
                                        {
                                            Anterior = Rol_Anterior;
                                            Actual = Rol_Actual;
                                        }
                                        else
                                        {
                                            Anterior = Anterior + ", " + Rol_Anterior;
                                            Actual = Actual + ", " + Rol_Actual;
                                        }
                                        
                                    }else if(Columna == "Activo")
                                    {
                                        string Activo_Anterior = string.Empty;
                                        string Activo_Actual = string.Empty;
                                        if(dato_anterior == "1") { Activo_Anterior = "Activo"; } else { Activo_Anterior = "Inactivo"; }
                                        if(dato_actual == "1") { Activo_Actual = "Activo"; } else { Activo_Actual = "Inactivo"; }
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
                                        
                                    }else if(Columna == "Departamento")
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
                        noti.Mensaje = Mensajes.Usuario_modificar_error;
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
                noti.Mensaje = Mensajes.Usuario_modificar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }

        public JsonResult get_profile_users(string cwid)
        {
            List<UsuarioModel> list = new List<UsuarioModel>();
            try
            {
                ProfileUser profileUser = new ProfileUser(cwid);
              
                list.Add(new UsuarioModel
                    {
                        Nombre = profileUser.name,
                        App = profileUser.lastname,
                        Correo = profileUser.mail,
                        Departamento = profileUser.department
                    });
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}