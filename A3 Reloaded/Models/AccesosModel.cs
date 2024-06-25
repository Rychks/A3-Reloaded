using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class AccesosModel
    {
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string Funcion { get; set; }
        public string Modulo { get; set; }
        public int Rol { get; set; }
        public int rolID { get; set; }
        public int funcionID { get; set; }
    }
}