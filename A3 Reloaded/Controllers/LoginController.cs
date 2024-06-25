using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Security;

namespace A3_Reloaded.Controllers
{
    public class LoginController : Controller
    {
        Clases.Lenguaje LE = new Clases.Lenguaje();
        Clases.AuditTrail AT = new Clases.AuditTrail();
        Clases.Usuarios US = new Clases.Usuarios();
        // GET: Login
        [AllowAnonymous]
        public ActionResult Index(string Mensaje, string Tipo)
        {
            if (!string.IsNullOrEmpty(Mensaje))
            {
                ViewBag.Mensaje = Mensaje;
                ViewBag.Tipo = Tipo;
            }
            return View();
        }
        /*Inicio de sesion con comprobación de usuario en la BD y en LDAP*/
        [AllowAnonymous]
        public ActionResult IniciarSesion(string BYTOST, string ZNACKA,string ID_Language)
        {
            DateTime Registro = DateTime.Now;
            int estatus = US.revisar_Usuario(BYTOST);
            if (estatus == 200)
            {
                bool comprobar = US.autenticacion(BYTOST, ZNACKA);
                if (comprobar)
                {
                    LE.asignar_idioma_usuario(BYTOST.ToUpper(), Convert.ToInt32(ID_Language));
                    FormsAuthentication.SetAuthCookie(BYTOST.ToUpper(), false);
                    AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Inicio de Sesión", "N/A");
                    return Redirect("~/Home/Index");
                }
                else
                {
                    ViewBag.Mensaje = "Contraseña incorrecta";
                    ViewBag.Tipo = "warning";
                    AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Intento Fallido de Inicio de Sesión", "Contraseña Incorrecta");
                    return RedirectToAction("Index", new { Mensaje = ViewBag.Mensaje, Tipo = ViewBag.Tipo });
                }
            }
            else if (estatus == 204)
            {
                ViewBag.Mensaje = "El usuario se encuentra desactivado";
                ViewBag.Tipo = "warning";
                AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Intento Fallido de Inicio de Sesión", "El usuario se encuentra desactivado dentro del sistema");
                return RedirectToAction("Index", new { Mensaje = ViewBag.Mensaje, Tipo = ViewBag.Tipo });
            }
            else if (estatus == 404)
            {
                ViewBag.Mensaje = "Tenemos problemas en encontrar el usuario. Por favor verifique el usuario";
                ViewBag.Tipo = "danger";
                AT.registrarAuditTrail(Registro, BYTOST, "I", "N/A", "Intento Fallido de Inicio de Sesión", "No se pudo comprobar la existencia del Usuario");
                return RedirectToAction("Index", new { Mensaje = ViewBag.Mensaje, Tipo = ViewBag.Tipo });
            }
            return RedirectToAction("Error", new { Mensaje = ViewBag.Mensaje, Tipo = ViewBag.Tipo });
        }

        public ActionResult Error(string Mensaje, string Tipo)
        {
            if (!string.IsNullOrEmpty(Mensaje))
            {
                ViewBag.Mensaje = Mensaje;
                ViewBag.Tipo = Tipo;
            }
            return View();
        }
        [Authorize]
        public void CerrarSesion()
        {
            DateTime Registro = DateTime.Now;
            string CWID = HttpContext.User.Identity.Name.ToUpper();
            AT.registrarAuditTrail(Registro, CWID, "M", "Inicio de Sesión", "Cierre de Sesión", "N/A");
            System.Web.Security.FormsAuthentication.SignOut();
            System.Web.Security.FormsAuthentication.RedirectToLoginPage();
        }
        [Authorize]
        public void CerrarSesionInactividad()
        {
            DateTime Registro = DateTime.Now;
            string CWID = HttpContext.User.Identity.Name.ToUpper();
            AT.registrarAuditTrail(Registro, CWID, "M", "Inicio de Sesión", "Cierre de Sesión", "Cierre de Sesión por inactividad");
            System.Web.Security.FormsAuthentication.SignOut();
            System.Web.Security.FormsAuthentication.RedirectToLoginPage();
        }
    }
}