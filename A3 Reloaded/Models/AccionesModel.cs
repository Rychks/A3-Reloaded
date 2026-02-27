using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class AccionesModel
    {
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public int ID { get; set; }
        public int RowNumber { get; set; }
        public string Problema { get; set; }
        public string estatus_text { get; set; }
        public string Rol { get; set; }
        public string Estatus { get; set; }
        public int id_accion { get; set; }
        public int id_template { get; set; }
        public string Responsable { get; set; }
        public string asignado_por { get; set; }
        public string Fecha { get; set; }
        public string comentarios { get; set; }
        public string fecha_ini { get; set; }
        public string ItemId { get; set; }
        public int Responsable_ID { get; set; }
        public int AsignadoPor_ID { get; set; }
        public string Linea { get; set; }
    }
}