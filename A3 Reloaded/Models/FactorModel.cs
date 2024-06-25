using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class FactorModel
    {
        public int ID { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public int Estatus { get; set; }
        public string Factor { get; set; }
        public string Formulate { get; set; }
        public int Tested { get; set; }
        public string Seccion { get; set; }
        public string Confirmacion { get; set; }
        public int Valido { get; set; }
    }
}