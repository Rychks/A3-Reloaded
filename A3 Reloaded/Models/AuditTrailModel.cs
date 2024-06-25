using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class AuditTrailModel
    {
        public string RowNumber { get; set; }
        public string Fecha { get; set; }
        public string Usuario { get; set; }
        public string Accion { get; set; }
        public string Anterior { get; set; }
        public string Actual { get; set; }
        public string Justificacion { get; set; }
    }
}