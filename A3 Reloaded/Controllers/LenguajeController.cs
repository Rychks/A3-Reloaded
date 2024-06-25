using A3_Reloaded.Clases;
using A3_Reloaded.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    public class LenguajeController : Controller
    {
        Lenguaje LE = new Lenguaje();
        // GET: Lenguaje
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult obtener_idiomas()
        {
            List<LenguageModel> list = new List<LenguageModel>();
            try
            {
                DataTable datos = LE.obtener_idioma();
                foreach (DataRow dr in datos.Rows)
                {
                    list.Add(new LenguageModel
                    {
                        ID = Convert.ToInt32(dr["ID"]),
                        Nombre = dr["Nombre"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult obtener_lista_idiomas(string Activo)
        {
            List<ListaModel> list = new List<ListaModel>();
            try
            {
                DataTable datos = LE.obtener_idioma();
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
        public JsonResult obtener_texto_idiomas()
        {
            //string ID_Language = ConfigurationManager.AppSettings["ClientId"];
            string CWID = HttpContext.User.Identity.Name.ToUpper();
            string ID_Language = LE.obtener_Idioma_Usuario(CWID);
            List<LenguageModel> list = new List<LenguageModel>();
            try
            {
                DataTable datos = LE.obtener_Textos_Idioma(ID_Language);
                foreach (DataRow dr in datos.Rows)
                {
                    traducir_mensajes_sistema(dr["Label"].ToString(), dr["Texto"].ToString());
                    list.Add(new LenguageModel
                    {
                        Texto = dr["Texto"].ToString(),
                        Etiqueta = dr["Label"].ToString(),
                    });
                }
            }
            catch (Exception e)
            {
                Clases.ErrorLogger.Registrar(this, e.ToString());
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        private void traducir_mensajes_sistema(string Etiqueta,string Mensaje)
        {
            if (Etiqueta == "txt_Idioma_Documento_firmado")
            {
                Mensajes.Documento_firmado = Mensaje;
            }
            if (Etiqueta == "txt_Idioma_Documento_firmado_error")
            {
                Mensajes.Documento_firmado_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Contrasena_incorrecta")
            {
                Mensajes.contrasena_incorrecta = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Respuesta_guardada")
            {
                Mensajes.respuesta_guardada = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Respuesta_guardada_error")
            {
                Mensajes.respuesta_guardada_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_archivo_guardado")
            {
                Mensajes.archivo_guardado = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_archivo_guardado_error")
            {
                Mensajes.archivo_guardado_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_archivo_omitido")
            {
                Mensajes.archivo_omitido = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_archivo_omitido_error")
            {
                Mensajes.archivo_omitido_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Contestado")
            {
                Mensajes.Contestado = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Departamento_guardado")
            {
                Mensajes.Departamento_guardado = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Departamento_guardado_error")
            {
                Mensajes.Departamento_guardado_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Departamento_modificar")
            {
                Mensajes.Departamento_modificado = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Departamento_modificar_error")
            {
                Mensajes.Departamento_modificado_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Item_guardado")
            {
                Mensajes.Item_guardado = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Item_guardado_error")
            {
                Mensajes.Item_guardado_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Template_modificado")
            {
                Mensajes.template_modificado = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Template_modificado_error")
            {
                Mensajes.Template_modificado_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Seccion_guardar_error")
            {
                Mensajes.Seccion_guardar_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Seccion_guardar")
            {
                Mensajes.Seccion_guardar = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Investigacion_guardar_error")
            {
                Mensajes.Investigacion_guardar_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Investigacion_guardar")
            {
                Mensajes.Investigacion_guardar = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Informacion_guardar_error")
            {
                Mensajes.Informacion_guardar_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Informacion_guardar")
            {
                Mensajes.Informacion_guardar = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Evaluador_agregar_error")
            {
                Mensajes.Evaluador_agregar_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Evaluador_agregar")
            {
                Mensajes.Evaluador_agregar = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Evaluador_Omitir_error")
            {
                Mensajes.Evaluador_omitir_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Evaluador_Omitir")
            {
                Mensajes.Evaluador_Omitir = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Documento_firmado_listo")
            {
                Mensajes.Documento_firmado_listo = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Template_guardado_error")
            {
                Mensajes.template_guardado_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Template_guardado")
            {
                Mensajes.template_guardado = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_cuadrante_modificar_error")
            {
                Mensajes.Cuadrante_modifcar_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_cuadrante_modificar")
            {
                Mensajes.Cuadrante_modificar = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Usuario_modificar")
            {
                Mensajes.Usuario_modificar = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Usuario_modificar_error")
            {
                Mensajes.Usuario_modificar_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Usuario_guardar")
            {
                Mensajes.Usuario_guardar = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Usuario_guardar_error")
            {
                Mensajes.Usuario_guardar_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Usuario_guardar_existente")
            {
                Mensajes.Usuario_guardar_existente = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Responsable")
            {
                Mensajes.Responsable = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Folio")
            {
                Mensajes.Folio = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Version")
            {
                Mensajes.Version = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Cual_es_el_problema")
            {
                Mensajes.Cual_es_problema = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_CostoPerdida")
            {
                Mensajes.Costo = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_fecha")
            {
                Mensajes.Fecha = Mensaje;
            }else if(Etiqueta == "txt_Idioma_Cuadrante")
            {
                Mensajes.Cuadrante = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Nombre")
            {
                Mensajes.Nombre = Mensaje;
            }
            else if (Etiqueta == "txt_idioma_Ingrese_Tipo_Firma")
            {
                Mensajes.Tipo_Firma = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Revisor")
            {
                Mensajes.Revisor = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Aprovador")
            {
                Mensajes.Aprobador = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Aprovador")
            {
                Mensajes.Aprobador = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Usuario")
            {
                Mensajes.Usuario = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Accion")
            {
                Mensajes.Accion = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Valor_actual")
            {
                Mensajes.Actual = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Valor_anterior")
            {
                Mensajes.Anterior = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Justificacion")
            {
                Mensajes.Justificacion = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Modificacion")
            {
                Mensajes.Modificacion = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Insercion")
            {
                Mensajes.Insercion = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Eliminacion")
            {
                Mensajes.Eliminacion = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Tipo_de_A3")
            {
                Mensajes.TipoA3 = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Estatus")
            {
                Mensajes.Estatus = Mensaje;
            }
            else if (Etiqueta == "txt_idioma_Ingrese_En_Modificacion")
            {
                Mensajes.EnModificacion = Mensaje;
            }
            else if (Etiqueta == "txt_idioma_Ingrese_En_Revision")
            {
                Mensajes.EnRevision = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Finalizado")
            {
                Mensajes.Finalizado = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_En_Proceso")
            {
                Mensajes.EnProceso = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Item_omitir_error")
            {
                Mensajes.Item_omitido_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Item_omitir")
            {
                Mensajes.Item_omitido = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Registro_omitir")
            {
                Mensajes.Registro_omitir = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Registro_omitir_error")
            {
                Mensajes.Registro_omitir_error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Fecha_Inicio")
            {
                Mensajes.Fecha_Inicio = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Fecha_Ultima_Modificacion")
            {
                Mensajes.Fecha_Modificacion = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Fecha_Fin")
            {
                Mensajes.Fecha_Fin = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Subarea_guardar")
            {
                Mensajes.Registro_Subarea = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Subarea_guardar_error")
            {
                Mensajes.Registro_Subarea_Error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Subarea_modificar")
            {
                Mensajes.Actualizar_Subarea = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Subarea_modificar_error")
            {
                Mensajes.Actualizar_Subarea_Error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Confirmacion_modificar")
            {
                Mensajes.Confirmacion_Modificar = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Confirmacion_modificar_title")
            {
                Mensajes.Confirmacion_Modificar_Titulo = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_sistema")
            {
                Mensajes.Sistema = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Confirmacion_Omitir")
            {
                Mensajes.Confirmacion_Omitir = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Confirmacion_Omitir_title")
            {
                Mensajes.Confirmacion_Omitir_Titulo = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Linea_guardar")
            {
                Mensajes.Registro_Linea = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Linea_guardar_error")
            {
                Mensajes.Registro_Linea_Error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Linea_modificar")
            {
                Mensajes.Actualizar_Linea = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Linea_modificar_error")
            {
                Mensajes.Actualizar_Linea_Error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Equipo_guardar")
            {
                Mensajes.Registro_Equipo = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Equipo_guardar_error")
            {
                Mensajes.Registro_Equipo_Error = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Equipo_modificar")
            {
                Mensajes.Actualizar_Equipo = Mensaje;
            }
            else if (Etiqueta == "txt_Idioma_Equipo_modificar_error")
            {
                Mensajes.Actualizar_Equipo_Error = Mensaje;
            }
        }
    }
}