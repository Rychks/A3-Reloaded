using System.Web;
using System.Web.Optimization;

namespace A3_Reloaded
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/Assets/RSA").Include(
                        "~/Assets/RSA_JS/System.debug.js",
                        "~/Assets/RSA_JS/System.IO.debug.js",
                        "~/Assets/RSA_JS/System.Text.debug.js",
                        "~/Assets/RSA_JS/System.Convert.debug.js",
                        "~/Assets/RSA_JS/System.BigInt.debug.js",
                        "~/Assets/RSA_JS/System.BitConverter.debug.js",
                        "~/Assets/RSA_JS/System.Security.Cryptography.debug.js",
                        "~/Assets/RSA_JS/System.Security.Cryptography.SHA1.debug.js",
                        "~/Assets/RSA_JS/System.Security.Cryptography.HMACSHA1.debug.js",
                        "~/Assets/RSA_JS/System.Security.Cryptography.RSA.debug.js"));

            bundles.Add(new ScriptBundle("~/Assets/js").Include(
                        "~/Assets/modules/popper.js",
                        "~/Assets/modules/tooltip.js",
                        "~/Assets/modules/bootstrap/js/bootstrap.min.js",
                        "~/Assets/modules/nicescroll/jquery.nicescroll.min.js",
                        "~/Assets/modules/moment.min.js",
                        "~/Assets/js/stisla.js",
                        "~/Assets/js/scripts.js",
                        "~/Assets/modules/izitoast/js/iziToast.min.js",
                        "~/Assets/js/page/modules-toastr.js",
                        "~/Assets/modules/sweetalert/sweetalert.min.js"));

            bundles.Add(new ScriptBundle("~/Assets/Modulos").Include(
                        "~/Assets/Modulos/Sistema.js",
                        "~/Assets/Modulos/AuditTrail.js",
                        "~/Assets/Modulos/Usuario.js",
                        "~/Assets/Modulos/Departamento.js",
                        "~/Assets/Modulos/Template.js",
                        "~/Assets/Modulos/TemplateRunning.js",
                        "~/Assets/Modulos/InicioA3.js",
                        "~/Assets/Modulos/Seccion.js",
                        "~/Assets/Modulos/Items.js",
                        "~/Assets/Modulos/Pregunta.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css"));

            bundles.Add(new StyleBundle("~/Assets").Include(
                      "~/Assets/modules/fontawesome-free-5.12.1-web/css/all.css",
                      "~/Assets/css/style.css",
                      "~/Assets/css/components.css",
                      "~/Assets/modules/izitoast/css/iziToast.min.css"));
        }
    }
}
