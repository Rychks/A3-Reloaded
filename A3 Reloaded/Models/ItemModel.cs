using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class ItemModel
    {
        public int RowNumber { get; set; }
        public int ID { get; set; }
        public string Elemento { get; set; }
        public int TabId { get; set; }
        public int Estatus { get; set; }
        public int Posicion { get; set; }
        public string Tabla { get; set; }
        public string Texto { get; set; }
        public int Seccion { get; set; }
        public int Firma { get; set; }
        public string Respuesta { get; set; }
    }
}