using A3_Reloaded.Clases;
using A3_Reloaded.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class TemplatesController : Controller
    {
        Clases.AuditTrail AT = new Clases.AuditTrail();
        Clases.Templates TE = new Clases.Templates();
        Clases.TemplatesRunning TER = new Clases.TemplatesRunning();
        Clases.Secciones SE = new Clases.Secciones();
        Clases.Usuarios US = new Clases.Usuarios();
        Notificaciones noti = new Notificaciones();
        Lenguaje LE = new Lenguaje();

        public ActionResult Index()
        {
            
            return View();
        }
        public ActionResult EditTemplate()
        {
            return View();
        }
        public JsonResult get_configuration_panels(string id_template)
        {
            List<PanelConfigurationModel> list = new List<PanelConfigurationModel>();
            try
            {
                DataTable datos = TE.get_configuration_panels(id_template);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new PanelConfigurationModel
                    {
                        label_panel = data["label_panel"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_templates_acceso_list(string Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                DataTable datos = TE.get_templates_acceso_list(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ListaModel
                    {
                        ID = Convert.ToInt32(data["Id"]),
                        Opcion = data["Name"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerTemplate(int ID)
        {
            List<TemplateModel> list = new List<TemplateModel>();
            try
            {
                DataTable datos = TE.obtener_TemplateID(ID);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerCuandrante(int ID)
        {
            List<CuadranteModel> list = new List<CuadranteModel>();
            try
            {
                DataTable datos = TE.obtener_cuadranteID(ID);
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new CuadranteModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Nombre = dr["Nombre"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                        Template = dr["Template"].ToString(),
                        Activo = Convert.ToInt32(dr["Activo"].ToString())
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerTotalPagTemplate(string Folio,string TipoA3,string Idioma, string Version, string Activo, int NumRegistros = 50)
        {
            string ID_Language = LE.obtener_Idioma_Usuario(HttpContext.User.Identity.Name.ToUpper());
            return Json(TE.obtener_TotalPagTemplates(Folio, TipoA3, Idioma, Version, Activo, NumRegistros), JsonRequestBehavior.AllowGet);
        }
        public JsonResult mostrarTemplates(string Folio,string TipoA3,string Idioma,string Version, string Activo, int Index = 0, int NumRegistros = 50)
        {
            string ID_Language = LE.obtener_Idioma_Usuario(HttpContext.User.Identity.Name.ToUpper());
            List<TemplateModel> list = new List<TemplateModel>();
            try
            {
                DataTable datos = TE.mostrar_Templates(Folio,TipoA3, Idioma, Version, Activo, Index, NumRegistros);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        private List<TemplateModel> organizarDatos(DataTable Datos)
        {
            List<TemplateModel> list = new List<TemplateModel>();
            try
            {
                foreach (DataRow data in Datos.Rows)
                {
                    if (Datos.Columns.Contains("RowNumber"))
                    {
                        list.Add(new TemplateModel
                        {
                            RowNumber = Convert.ToInt32(data["RowNumber"]),
                            ID = Convert.ToInt32(data["ID"]),
                            Folio = data["Folio"].ToString(),
                            Descripcion = data["Descripcion"].ToString(),
                            Idioma = data["Idioma"].ToString(),
                            Imagen = data["Imagen"].ToString(),
                            Acceso = data["Acceso"].ToString(),
                            PmCard = data["PmCard"].ToString(),
                            TipoA3 = data["TipoA3"].ToString(),
                            Version = Convert.ToInt32(data["Versionn"]),
                            Activo = Convert.ToInt32(data["Activo"])
                        });
                    }
                    else
                    {
                        list.Add(new TemplateModel
                        {
                            ID = Convert.ToInt32(data["ID"]),
                            Folio = data["Folio"].ToString(),
                            Descripcion = data["Descripcion"].ToString(),
                            Idioma = data["Idioma"].ToString(),
                            Imagen = data["Imagen"].ToString(),
                            TipoA3 = data["TipoA3"].ToString(),
                            Acceso = data["Acceso"].ToString(),
                            PmCard = data["PmCard"].ToString(),
                            Version = Convert.ToInt32(data["Versionn"]),
                            template_version = data["Versionn"].ToString(),
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
        public JsonResult guardarTemplates(string Folio,string TipoA3, string Idioma,string Acceso, string Activo,string Descripcion,HttpPostedFileBase Imagen = null)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string filename = "default.png";
                    if (Request.Files.Count > 0)
                    {
                        string path = Server.MapPath("~/Atach/");
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }
                        filename = Guid.NewGuid() + Path.GetExtension(Imagen.FileName);
                        string filepath = "/Assets/Img/Templates/" + filename;
                        Imagen.SaveAs(Path.Combine(Server.MapPath("/Assets/Img/Templates"), filename));
                    }     
                    string datos = TE.registrar_Template(Folio,Convert.ToInt32(TipoA3),1, Convert.ToInt32(Idioma), Convert.ToInt32(Acceso), Convert.ToInt32(Activo),Descripcion, filename);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.template_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Teplate: " + Folio + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.template_guardado_error;
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
                noti.Mensaje = Mensajes.template_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizarTemplate(int ID, string Folio, string Descripcion, HttpPostedFileBase Imagen,string TipoA3,string Idioma, string Acceso, string version, string Activo)
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
                    DataTable datosAnterior = TE.obtener_TemplateID(ID);
                    string filename = datosAnterior.Rows[0]["Imagen"].ToString();
                    if (Request.Files.Count > 0)
                    {
                        string path = Server.MapPath("~/Atach/");
                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }
                        filename = Guid.NewGuid() + Path.GetExtension(Imagen.FileName);
                        string filepath = "/Assets/Img/Templates/" + filename;
                        Imagen.SaveAs(Path.Combine(Server.MapPath("/Assets/Img/Templates"), filename));
                    }
                    string v = datosAnterior.Rows[0]["ID"].ToString();
                    string datos = TE.actualizar_Template(ID, Folio,Convert.ToInt32(TipoA3), Convert.ToInt32(Idioma), Convert.ToInt32(Acceso), Convert.ToInt32(version), Convert.ToInt32(Activo),Descripcion,filename);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.template_modificado;
                        noti.Tipo = "success";

                        DataTable datosActual = TE.obtener_TemplateID(ID);
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
        public JsonResult Lista_Formatos_A3(string Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                DataTable datos = TE.obtener_TiposA3(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new ListaModel
                    {
                        ID = Convert.ToInt32(data["ID"]),
                        Opcion = data["Nombre"].ToString(),
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
        public JsonResult obtenerTiposA3(string Activo)
        {
            List<TipoA3Model> list = new List<TipoA3Model>();
            try
            {
                DataTable datos = TE.obtener_TiposA3(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new TipoA3Model
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
        public JsonResult obtenerCuadrantes(string Activo)
        {
            List<CuadranteModel> list = new List<CuadranteModel>();
            try
            {
                DataTable datos = TE.obtener_Cuadrantes(Activo);
                foreach (DataRow data in datos.Rows)
                {
                    list.Add(new CuadranteModel
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
        public JsonResult mostrarTemplatesActivo()
        {
            string ID_Language = LE.obtener_Idioma_Usuario(HttpContext.User.Identity.Name.ToUpper());
            //string ID_Language = US.(HttpContext.User.Identity.Name.ToUpper());
            string Id_usuario = US.obtener_ID_Usuario(HttpContext.User.Identity.Name.ToUpper());
            List<TemplateModel> list = new List<TemplateModel>();
            try
            {
                DataTable datos = TE.mostrar_Templates_Activo(Id_usuario, ID_Language);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_siguiente_folio()
        {
            string folio = string.Empty;
            try
            {
                folio = TER.obtener_siguiente_folio();
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(folio, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_cuadrantes_template_id(int ID)
        {
            List<CuadranteModel> lst = new List<CuadranteModel>();
            try
            {
                DataTable dt = TE.obtener_cuadrantes_template_id(ID);              
                foreach(DataRow dr in dt.Rows)
                {
                    lst.Add(new CuadranteModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Nombre = dr["Nombre"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                        Template = dr["Template"].ToString(),
                        Activo = Convert.ToInt32(dr["Activo"].ToString())
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(lst, JsonRequestBehavior.AllowGet);
        }
        public JsonResult actualizarCuadrante(int ID,string Descripcion)
        {
            try
            {
                string usuario = HttpContext.User.Identity.Name.ToUpper();
                DateTime Registro = DateTime.Now;
                DataTable datosAnterior = TE.obtener_cuadranteID(ID);
                string v = datosAnterior.Rows[0]["ID"].ToString();
                string datos = TE.modificar_cuadrante(Descripcion, ID);
                if (datos == "guardado")
                {
                    noti.Mensaje = Mensajes.Cuadrante_modificar;
                    noti.Tipo = "success";

                    DataTable datosActual = TE.obtener_cuadranteID(ID);
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

                    AT.registrarAuditTrail(Registro, usuario, "M", Anterior, Actual, "Modificación");
                }
                else
                {
                    noti.Mensaje = Mensajes.Cuadrante_modifcar_error;
                    noti.Tipo = "warning";
                }
            }
            catch (Exception e)
            {
                noti.Mensaje = Mensajes.Cuadrante_modifcar_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_folio_template()
        {
            string folio = string.Empty;
            try
            {
                folio = TE.obtener_folio_template();
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(folio, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Verifica_Cuadrantes(string ID_Template,string Nombre)
        {
            string estatus = string.Empty;
            try
            {
                estatus = TER.Verifica_Cuadrante(ID_Template,Nombre);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(estatus, JsonRequestBehavior.AllowGet);
        }
        
    }
}