using System.IO;
using System.Web.Mvc;

namespace A3_Reloaded.Helpers // Cambia el namespace si es necesario
{
    public static class HtmlHelperExtensions
    {
        // Esta función lee la última fecha de modificación del archivo
        public static string UrlVersionada(this UrlHelper urlHelper, string contentPath)
        {
            string physicalPath = urlHelper.RequestContext.HttpContext.Server.MapPath(contentPath);
            string version = "1";

            if (File.Exists(physicalPath))
            {
                // Convierte la fecha de modificación en un número único (Ticks)
                version = File.GetLastWriteTime(physicalPath).Ticks.ToString();
            }
            return urlHelper.Content(contentPath) + "?v=" + version;
        }
    }
}