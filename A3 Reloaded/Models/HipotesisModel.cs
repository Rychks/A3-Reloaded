using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Web;

namespace A3_Reloaded.Models
{
    public class HipotesisModel
    {
        public int ID { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Rama { get; set; }
        public int Estatus { get; set; }
        public int Seccion { get; set; }
        public string Hipotesis { get; set; }
        public string Resultados { get; set; }
        public int Test { get; set; }
        public int True { get; set; }
    }
}