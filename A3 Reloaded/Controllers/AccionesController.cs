using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace A3_Reloaded.Controllers
{
    [Authorize]
    public class AccionesController : Controller
    {
        // GET: Acciones
        public ActionResult Index()
        {
            return View();
        }

    }
}