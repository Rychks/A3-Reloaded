using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class UsuarioModel
    {
        public int RowNumber { get; set; }
        public int ID { get; set; }
        public string CWID { get; set; }
        public string Nombre { get; set; }
        public string App { get; set; }
        public string Correo { get; set; }
        public string Rol { get; set; }
        public string Departamento { get; set; }
        public int ID_Usuario { get; set; }
        public int Activo { get; set; }
    }
}