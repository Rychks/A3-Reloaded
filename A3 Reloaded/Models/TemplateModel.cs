using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class TemplateModel
    {
        public int RowNumber { get; set; }
        public int ID { get; set; }
        public string Folio { get; set; }
        public string Rol { get; set; }
        public string Imagen { get; set; }
        public string Descripcion { get; set; }
        public string TipoA3 { get; set; }
        public string Acceso { get; set; }
        public string PmCard { get; set; }
        public int Version { get; set; }
        public string template_version { get; set; }
        public int Activo { get; set; }
        public string Contact { get; set; }
        public string Problem { get; set; }
        public string Idioma { get; set; }
        public int Estatus { get; set; }
        public string Status_Text {get;set;}
        public string Lineas { get; set; }
    }
}