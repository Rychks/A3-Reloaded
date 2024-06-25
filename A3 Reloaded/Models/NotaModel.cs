using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class NotaModel
    {
        public int ID { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Respuesta { get; set; }
        public int Estatus { get; set; }
        public int Seccion { get; set; }
    }
}