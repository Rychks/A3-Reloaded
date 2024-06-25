using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class RolesModel
    {
        public int RowNumber { get; set; }
        public int ID { get; set; }
        public string Rol { get; set; }
        public string Nombre { get; set; }
        public int Activo { get; set; }
    }
}