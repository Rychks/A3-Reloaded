using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class StandardModel
    {
        public int ID { get; set; }
        public string Standard { get; set; }
        public int Cuadrante { get; set; }
        public int Q1_Initial { get; set; }
        public int Q1_Simplied { get; set; }
        public int Q2_Initial { get; set; }
        public int Q2_Simplied { get; set; }
        public int Q3_Initial { get; set; }
        public int Q3_Simplied { get; set; }
        public int Q4_Initial { get; set; }
        public int Q4_Simplied { get; set; }
        public int Q5_Initial { get; set; }
        public int Q5_Simplied { get; set; }
        public int Total_Initial { get; set; }
        public int Total_Simplied { get; set; }
    }
}