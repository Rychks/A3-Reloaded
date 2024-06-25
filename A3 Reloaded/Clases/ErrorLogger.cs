using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Clases
{
    public class ErrorLogger
    {
        public static void Registrar(object Obj, string ex, string errorBD = null)
        {
            try
            {
                string fecha = DateTime.Now.ToString("yyyy_MM_dd");
                string filepath = System.Web.HttpContext.Current.Server.MapPath("~/Logs/");
                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }
                filepath = filepath + "LogError_" + fecha + ".txt";
                if (!File.Exists(filepath))
                {
                    File.Create(filepath).Dispose();
                }
                //StreamWriter sw = new StreamWriter(path, true);
                using (StreamWriter sw = File.AppendText(filepath))
                {
                    string hora = DateTime.Now.ToString("HH:mm:ss tt");
                    StackTrace stacktrace = new StackTrace();
                    sw.WriteLine("[ " + DateTime.Now.ToString("dd/MM/yyy") + " " + hora + " ]");
                    sw.WriteLine("Controlador/Clase: '" + Obj.GetType().Name);
                    sw.WriteLine("Metodo: '" + stacktrace.GetFrame(1).GetMethod().Name);
                    sw.WriteLine("Error: ");
                    sw.WriteLine(ex);
                    if (errorBD != null && errorBD != "")
                    {
                        sw.WriteLine("Error Base de Datos: ");
                        sw.WriteLine(errorBD);
                    }
                    sw.WriteLine("--------------------------------------------------------------------------------------------------------------------------------------");
                    sw.Flush();
                    sw.Close();
                }
            }
            catch (Exception e)
            {
                e.ToString();
            }
        }
    }
}