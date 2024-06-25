using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class AdjuntoModel
    {
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string Tipo { get; set; }
        public int Item_ID { get; set; }
        public string Item { get; set; }
        public string Seccion { get; set; }
        public string Cuadrante { get; set; }
    }
}