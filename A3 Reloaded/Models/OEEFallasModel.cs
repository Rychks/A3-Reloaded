﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class OEEFallasModel
    {
        public string Fecha { get; set; }
        public string Linea { get; set; }
        public string Maquina { get; set; }
        public string Motivo { get; set; }
        public string Turno { get; set; }
        public string Lote { get; set; }
        public string SKU { get; set; }
        public string Producto { get; set; }
        public int Minutos { get; set; }
        public string Clasificacion { get; set; }
        public string Comentario { get; set; }

    }
}