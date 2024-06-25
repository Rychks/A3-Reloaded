using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class IshikawuaModel
    {
        public int ID { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Rama { get; set; }
        public int ID_Rama { get; set; }
        public int Estatus { get; set; }
        public int Seccion { get; set; }
        public int Respuesta { get; set; }
        public int Ishikawua { get; set; }
        public string Contenido_Rama { get; set; }
    }
}