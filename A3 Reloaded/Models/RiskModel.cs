using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class RiskModel
    {
        public int ID { get; set; }
        public string Cause { get; set; }
        public int P1 { get; set; }
        public int S1 { get; set; }
        public int Initial { get; set; }
        public int P2 { get; set; }
        public int S2 { get; set; }
        public int Final { get; set; }
    }
}