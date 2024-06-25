using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class SubareaModel
    {
        public int RowNumber { get; set; }
        public int ID { get; set; }
        public string Nombre { get; set; }
        public int Activo { get; set; }
        public int ID_Departamento { get; set; }
        public string Departamento { get; set; }
    }
}