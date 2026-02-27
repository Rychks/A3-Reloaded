using A3_Reloaded.Clases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Web;

namespace A3_Reloaded.Models
{
	public class HomeModel
	{
        public int RowNumber { get; set; }
        public int Folio { get; set; }
        public string  Tipo { get; set; }
        public int Version { get; set; }
        public string Descripcion { get; set; }
        public string Problema { get; set; }
        public string Concecuencia { get; set; }
        public string FechaInicio { get; set; }
        public string Owner { get; set; }
        public string Owner_CWID { get; set; }
        public int Owner_Id { get; set; }
        public string EstatusA3 { get; set; }
        public int Estatus_Id { get; set; }
        public string Lineas { get; set; }
        public string Rol { get; set; }
        public string Estatus { get; set; }
    }
}