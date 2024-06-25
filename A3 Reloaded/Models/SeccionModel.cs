using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class SeccionModel
    {
        public int RowNumber { get; set; }
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int Posicion { get; set; }
        public string Cuadrante { get; set; }
        public string Template { get; set; }
        public int Activo { get; set; }
    }
}