using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class PreguntaModel
    {
        public int ID { get; set; }
        public string Texto { get; set; }
        public string Descripcion { get; set; }
        public string Comentarios { get; set; }
        public int Tipo { get; set; }
        public string Respuesta { get; set; }
        public int Estatus { get; set; }
        public int Seccion { get; set; }
        public int Firma { get; set; }
    }
}