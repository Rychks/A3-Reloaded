define(["jquery"], function (jQuery) {
    jQuery.alerta_sesion = function (Opciones) {
        var Ops = $.extend(jQuery.alerta_sesion.default, Opciones);
        var seconds = (parseInt(Ops.Tiempo) * 60) - 2;
        var miliseconds = seconds * 1000;
        setInterval(function () {
            var min = Math.floor(seconds / 60);
            var sec = Math.floor(seconds - (min * 60));
            var mins = "", secs = "", time = "";
            if (min < 10) { mins = "0" + min } else { mins = min; }
            if (sec < 10) { secs = "0" + sec } else { secs = sec; }
            if (min > 0) { time = mins + ":" + secs + " min"; } else { time = mins + ":" + secs + " seg"; }
            $("#" + Ops.Leyenda).text(time);
            seconds--;
        }, 1000);
        setTimeout(function () {
            //Show Popup before 120 seconds = 2 minutes of timeout.
            //-1 for fix
            $("#" + Ops.Modal).modal("show");
        }, miliseconds - ((Ops.Tiempo_Mensaje - 1) * 1000));
        setTimeout(function () {
            //Leave sesssion
            window.location = Ops.Ruta_Cierre;
        }, miliseconds);
        $("#btnSistema_RenovarSesion").click(function () {
            window.location = window.location.href;
        });
    };
    jQuery.alerta_sesion.default = {
        Modal: "mdlSistema_Sesion",
        Leyenda: "txtSistema_MinRestantes",
        Tiempo: 30,//Minutos
        Tiempo_Mensaje: 120,//Segundos
        Ruta_Cierre: "/Login/CerrarSesionInactividad",
        Ruta_Continuar: window.location.href
    };
});