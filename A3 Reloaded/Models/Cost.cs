using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace A3_Reloaded.Models
{
    public class Cost
    {
        public int ID { get; set; }
        public int Cuadrante { get; set; }
        public string Costs { get; set; }
        public string Avoid { get; set; }
        public string Saving { get; set; }
        public int Solution { get; set; }
    }
}