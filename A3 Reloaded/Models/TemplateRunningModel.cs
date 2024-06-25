using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class TemplateRunningModel
    {
        public int RowNumber { get; set; }
        public int ID { get; set; }
        public string Folio { get; set; }
        public string Responsable { get; set; }
        public string Problema { get; set; }
        public string Costo { get; set; }
        public string TipoA3 { get; set; }
        public int Version { get; set; }
        public int Estatus { get; set; }
    }
}