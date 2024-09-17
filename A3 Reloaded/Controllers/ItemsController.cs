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
    public class ItemsController : Controller
    {
        
        Preguntas PR = new Preguntas();
        Instruccion IN = new Instruccion();
        Ishikawua IS = new Ishikawua();
        Nota NO = new Nota();
        Acciones accion = new Acciones();
        AnalisisPorque analisis = new AnalisisPorque();
        Hipotesis HI = new Hipotesis();
        Factor FA = new Factor();
        Items IT = new Items();
        AuditTrail AT = new AuditTrail();
        Usuarios US = new Usuarios();
        Notificaciones noti = new Notificaciones();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult registrar_Pregunta(string Texto,string Descripcion,string Tipo,string Seccion,string Firma)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = PR.registrar_Pregunta(Texto,Descripcion,Convert.ToInt32(Tipo));
                    string datos = IT.registrar_Item("Pregunta", Convert.ToInt32(id), 0, "TabPreguntas",Convert.ToInt32(Seccion),Texto,Convert.ToInt32(Firma));
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Item: " + Texto + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_Pregunta(string IDItem,string ID,string Texto, string Descripcion, string Tipo, string Seccion, string Firma)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = IT.obtener_pregunta_ID(Convert.ToInt32(ID));
                    PR.Modificar_Pregunta(Convert.ToInt32(ID),Texto, Descripcion, Convert.ToInt32(Tipo));
                    string datos = IT.modificar_Item(Convert.ToInt32(IDItem),"Pregunta", Convert.ToInt32(ID), 0, "TabPreguntas", Convert.ToInt32(Seccion), Texto, Convert.ToInt32(Firma));
                    if (datos == "guardado")
                    {
                        DataTable datosActual = IT.obtener_pregunta_ID(Convert.ToInt32(ID));
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_Nota(string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = NO.registrar_Nota(Titulo, Descripcion);
                    string datos = IT.registrar_Item("Nota", Convert.ToInt32(id), 0, "TabNotas", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult mostrarItems(string Seccion,int Index = 0, int NumRegistros = 50)
        {
            List<ItemModel> list = new List<ItemModel>();
            try
            {
                DataTable datos = IT.mostrar_Items(Seccion, Index, NumRegistros);
                list = organizarDatos(datos);
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtenerTotalPagItems(string Seccion, int NumRegistros = 50)
        {
            return Json(IT.obtener_TotalPagItems(Seccion, NumRegistros), JsonRequestBehavior.AllowGet);
        }
        private List<ItemModel> organizarDatos(DataTable Datos)
        {
            List<ItemModel> list = new List<ItemModel>();
            try
            {
                foreach (DataRow data in Datos.Rows)
                {
                    if (Datos.Columns.Contains("RowNumber"))
                    {
                        list.Add(new ItemModel
                        {
                            RowNumber = Convert.ToInt32(data["RowNumber"]),
                            ID = Convert.ToInt32(data["ID"]),
                            Elemento = data["Elemento"].ToString(),
                            Posicion = Convert.ToInt32(data["Posicion"]),
                            Texto = data["Texto"].ToString(),
                        });
                    }
                    else
                    {
                        list.Add(new ItemModel
                        {
                            ID = Convert.ToInt32(data["ID"]),
                            Elemento = data["Elemento"].ToString(),
                            Posicion = Convert.ToInt32(data["Posicion"]),
                            Texto = data["Texto"].ToString(),
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
        public JsonResult registrar_Accion(string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = accion.registrar_acciones(Titulo, Descripcion);
                    string datos = IT.registrar_Item("Acciones", Convert.ToInt32(id), 0, "TabAcciones", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_accion(string IDItem, string ID, string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = accion.obtener_accion_ID(Convert.ToInt32(ID));
                    accion.Modificar_acciones(Convert.ToInt32(ID), Titulo, Descripcion);
                    string datos = IT.modificar_Item(Convert.ToInt32(IDItem), "Acciones", Convert.ToInt32(ID), 0, "TabAcciones", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        DataTable datosActual = accion.obtener_accion_ID(Convert.ToInt32(ID));
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_analisis_porque(string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = analisis.registrar_analisis_porque(Titulo, Descripcion);
                    string datos = IT.registrar_Item("Analisis Porque", Convert.ToInt32(id), 0, "TabAnalisis_Porque", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_analisis_id(string ID)
        {
            List<AnalisisPorqueModel> list = new List<AnalisisPorqueModel>();
            try
            {
                DataTable datos = analisis.obtener_analisis_porque_ID(Convert.ToInt32(ID));
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new AnalisisPorqueModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Titulo = dr["Titulo"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_acciones_id(string ID)
        {
            List<AccionesModel> list = new List<AccionesModel>();
            try
            {
                DataTable datos = accion.obtener_accion_ID(Convert.ToInt32(ID));
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new AccionesModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Titulo = dr["Titulo"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_analisis_porque(string IDItem, string ID, string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = analisis.obtener_analisis_porque_ID(Convert.ToInt32(ID));
                    analisis.Modificar_analisis(Convert.ToInt32(ID), Titulo, Descripcion);
                    string datos = IT.modificar_Item(Convert.ToInt32(IDItem), "Analisis Porque", Convert.ToInt32(ID), 0, "TabAnalisis_Porque", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        DataTable datosActual = analisis.obtener_analisis_porque_ID(Convert.ToInt32(ID));
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_item_id(string ID)
        {
            List<ItemModel> list = new List<ItemModel>();
            try
            {
                DataTable datos = IT.obtener_item_ID(Convert.ToInt32(ID));
                foreach(DataRow dr in datos.Rows)
                {
                    list.Add(new ItemModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Elemento = dr["Elemento"].ToString(),
                        Posicion = Convert.ToInt32(dr["Posicion"]),
                        TabId = Convert.ToInt32(dr["ElementoID"]),
                        Texto = dr["Texto"].ToString(),
                        Tabla = dr["Tabla"].ToString(),
                        Firma = Convert.ToInt32(dr["Firma"]),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Pregnta_id(string ID)
        {
            List<PreguntaModel> list = new List<PreguntaModel>();
            try
            {
                DataTable datos = IT.obtener_pregunta_ID(Convert.ToInt32(ID));
                foreach(DataRow dr in datos.Rows)
                {
                    list.Add(new PreguntaModel
                    {
                        ID = Convert.ToInt32(dr["id"]),
                        Texto = dr["Texto"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                        Tipo = Convert.ToInt32(dr["Tipo"])
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Nota_id(string ID)
        {
            List<NotaModel> list = new List<NotaModel>();
            try
            {
                DataTable datos = NO.obtener_nota_ID(Convert.ToInt32(ID));
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new NotaModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Titulo = dr["Titulo"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_Nota(string IDItem, string ID, string Titulo, string Descripcion,string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = NO.obtener_nota_ID(Convert.ToInt32(ID));
                    NO.Modificar_Nota(Convert.ToInt32(ID), Titulo, Descripcion);
                    string datos = IT.modificar_Item(Convert.ToInt32(IDItem), "Nota", Convert.ToInt32(ID), 0, "TabNotas", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        DataTable datosActual = NO.obtener_nota_ID(Convert.ToInt32(ID));
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_Instruccion(string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = IN.registrar_Instruccion(Titulo, Descripcion);
                    string datos = IT.registrar_Item("Instruccion", Convert.ToInt32(id), 0, "TabInstrucciones", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_Instruccion(string IDItem, string ID, string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = IN.obtener_Instruccion_ID(Convert.ToInt32(ID));
                    IN.Modificar_Instruccion(Convert.ToInt32(ID), Titulo, Descripcion);
                    string datos = IT.modificar_Item(Convert.ToInt32(IDItem), "Instruccion", Convert.ToInt32(ID), 0, "TabInstrucciones", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        DataTable datosActual = IN.obtener_Instruccion_ID(Convert.ToInt32(ID));
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Instruccion_id(string ID)
        {
            List<NotaModel> list = new List<NotaModel>();
            try
            {
                DataTable datos = IN.obtener_Instruccion_ID(Convert.ToInt32(ID));
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new NotaModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Titulo = dr["Titulo"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_Ishikawua(string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = IS.registrar_Ishikawua(Titulo, Descripcion);
                    string datos = IT.registrar_Item("Ishikawua", Convert.ToInt32(id), 0, "TabIshikawua", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        noti.Id = id;
                        AT.registrarAuditTrail(Registro, BYTOST, "Ishikawua", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult registrar_Detalle_Ishikawua(string Rama, string Descripcion, int Ishikawua)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = IS.insert_rama(Rama, Descripcion, Ishikawua);
                    //string datos = IT.registrar_Item("Ishikawua", Convert.ToInt32(id), 0, "TabIshikawua", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        //AT.registrarAuditTrail(Registro, BYTOST, "Ishikawua", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_Ishikawua(string IDItem, string ID, string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = IS.obtener_Ishikawua_ID(Convert.ToInt32(ID));
                    IS.Modificar_Ishikawua(Convert.ToInt32(ID), Titulo, Descripcion);
                    string datos = IT.modificar_Item(Convert.ToInt32(IDItem), "Ishikawua", Convert.ToInt32(ID), 0, "TabIshikawua", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        noti.Id = ID;
                        DataTable datosActual = IS.obtener_Ishikawua_ID(Convert.ToInt32(ID));
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Ishikawua_id(string ID)
        {
            List<IshikawuaModel> list = new List<IshikawuaModel>();
            try
            {
                DataTable datos = IS.obtener_Ishikawua_ID(Convert.ToInt32(ID));
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new IshikawuaModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Titulo = dr["Titulo"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Detalle_Ishikawua_id(string ID)
        {
            List<IshikawuaModel> list = new List<IshikawuaModel>();
            try
            {
                DataTable datos = IS.obtener_Detalle_Ishikawua_ID(Convert.ToInt32(ID));
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new IshikawuaModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Rama = dr["Rama"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Detalle_Ishikawua_Rama(string ID,string Rama)
        {
            List<IshikawuaModel> list = new List<IshikawuaModel>();
            try
            {
                DataTable datos = IS.obtener_Detalle_Ishikawua_Rama(Convert.ToInt32(ID),Rama);
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new IshikawuaModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_Detalle_Ishikawua(int ID, string Rama, string Descripcion, int ID_Ishikawua)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = IS.obtener_Detalle_Ishikawua_ID(Convert.ToInt32(ID));
                    string datos = IS.Modificar_Detalle_Ishikawua(Convert.ToInt32(ID), Rama, Descripcion,ID_Ishikawua);
                    //string datos = IT.modificar_Item(Convert.ToInt32(IDItem), "Ishikawua", Convert.ToInt32(ID), 0, "TabIshikawua", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        DataTable datosActual = IS.obtener_Detalle_Ishikawua_ID(Convert.ToInt32(ID));
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }

        public JsonResult registrar_Hipotesis(string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = HI.registrar_hipotesis(Titulo, Descripcion);
                    string datos = IT.registrar_Item("Hipotesis", Convert.ToInt32(id), 0, "TabHipotesis", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_Hipotesis(string IDItem, string ID, string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = HI.obtener_hipotesis_ID(Convert.ToInt32(ID));
                    HI.Modificar_Hipotesis(Convert.ToInt32(ID), Titulo, Descripcion);
                    string datos = IT.modificar_Item(Convert.ToInt32(IDItem), "Hipotesis", Convert.ToInt32(ID), 0, "TabHipotesis", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        DataTable datosActual = HI.obtener_hipotesis_ID(Convert.ToInt32(ID));
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Hipotesis_id(string ID)
        {
            List<NotaModel> list = new List<NotaModel>();
            try
            {
                DataTable datos = HI.obtener_hipotesis_ID(Convert.ToInt32(ID));
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new NotaModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Titulo = dr["Titulo"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult registrar_Factor(string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string id = FA.registrar_Factor(Titulo, Descripcion);
                    string datos = IT.registrar_Item("Factor", Convert.ToInt32(id), 0, "TabFactor", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Nuevo Item: " + Titulo + "", "N/A");
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Modificar_Factor(string IDItem, string ID, string Titulo, string Descripcion, string Seccion)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    DataTable datosAnterior = FA.obtener_factor_ID(Convert.ToInt32(ID));
                    FA.Modificar_factor(Convert.ToInt32(ID), Titulo, Descripcion);
                    string datos = IT.modificar_Item(Convert.ToInt32(IDItem), "Factor", Convert.ToInt32(ID), 0, "TabFactor", Convert.ToInt32(Seccion), Titulo, 0);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_guardado;
                        noti.Tipo = "success";
                        DataTable datosActual = FA.obtener_factor_ID(Convert.ToInt32(ID));
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
                        AT.registrarAuditTrail(Registro, BYTOST, "M", Anterior, Actual, Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_guardado_error;
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
                noti.Mensaje = Mensajes.Item_guardado_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_Factor_id(string ID)
        {
            List<NotaModel> list = new List<NotaModel>();
            try
            {
                DataTable datos = FA.obtener_factor_ID(Convert.ToInt32(ID));
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new NotaModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Titulo = dr["Titulo"].ToString(),
                        Descripcion = dr["Descripcion"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult eliminar_pregunta(string ID,string ID_Item)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = PR.remover_pregunta(ID, ID_Item);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_omitido;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Item omitido", Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_omitido_error;
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
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_Nota(string ID, string ID_Item)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = NO.remover_nota(ID, ID_Item);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_omitido;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Item omitido", Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_omitido_error;
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
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_accion(string ID, string ID_Item)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = accion.remover_acciones(ID, ID_Item);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_omitido;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Item omitido", Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_omitido_error;
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
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_analisis(string ID, string ID_Item)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = analisis.remover_analisis(ID, ID_Item);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_omitido;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Item omitido", Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_omitido_error;
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
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_ishkawua(string ID, string ID_Item)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = IS.remover_ishikawua(ID, ID_Item);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_omitido;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Item omitido", Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_omitido_error;
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
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_hipotesis(string ID, string ID_Item)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = HI.remover_hipotesis(ID, ID_Item);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_omitido;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Item omitido", Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_omitido_error;
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
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_instruccion(string ID, string ID_Item)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = IN.remover_instruccion(ID, ID_Item);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_omitido;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Item omitido", Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_omitido_error;
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
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
        public JsonResult eliminar_factor(string ID, string ID_Item)
        {
            try
            {
                string BYTOST = Request["BYTOST"];
                string ZNACKA = Request["ZNACKA"];
                string Justificacion = Request["ZMYSEL"];
                DateTime Registro = DateTime.Now;
                bool firma = US.autenticacion(BYTOST, ZNACKA);
                if (firma)
                {
                    string datos = FA.remover_factor(ID, ID_Item);
                    if (datos == "guardado")
                    {
                        noti.Mensaje = Mensajes.Item_omitido;
                        noti.Tipo = "success";
                        AT.registrarAuditTrail(Registro, BYTOST, "E", "N/A", "Item omitido", Justificacion);
                    }
                    else
                    {
                        noti.Mensaje = Mensajes.Item_omitido_error;
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
                noti.Mensaje = Mensajes.Item_omitido_error;
                noti.Tipo = "warning";
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(noti, JsonRequestBehavior.AllowGet);
        }
    }
}