define(["jquery", 'marcopolo', 'NotificacionesMensajes'], function (jQuery, marcopolo) {
    jQuery.matrizAccesos = {
        verificaAcceso: function (Parametros) {
            var Param = jQuery.extend({}, jQuery.matrizAccesos.default.verificaAcceso_default, Parametros);
            var Acceso = false;
            var Datos = { funcionId: Param.FuncionId };

            Param.Elemento.css("display", "none");
            $.post(Param.Url, Datos).done(function (data) {
                var tieneAcceso = parseInt(data)

                if (tieneAcceso == 1) {
                    Param.Elemento.show();
                    Acceso = true
                } else {
                    Param.Elemento.hide();
                    Acceso = false
                }
            }).fail(function (error) {
                fn_Notificaciones({
                    Mensaje: "An error occurred while trying to display the information", Tipo: "danger", Error: error
                });
            });
            return Acceso;
        },
        validaAcceso: function (Parametros) {
            var Param = jQuery.extend({}, jQuery.matrizAccesos.default.validaAcceso_default, Parametros);
            return new Promise((resolve, reject) => {
                var frmDatos = new FormData();
                frmDatos.append("funcionId", Param.FuncionId);
                $.ajax({
                    type: "POST",
                    url: "/Rol/verificarAcceso",
                    contentType: false,
                    processData: false,
                    data: frmDatos,
                    success: function (res) {
                        resolve({
                            funcionId: Param.FuncionId,
                            result: res
                        });
                    },
                    error: function (error) {
                        return Promise.reject(error);
                        console.log(error);
                        fn_Notificaciones({
                            Mensaje: "An error occurred while trying to display the information", Tipo: "danger", Error: error
                        });
                    }
                });
            });
        },
    };
    jQuery.matrizAccesos.default = {
        verificaAcceso_default: {
            Elemento: null,
            Url: null,
            FuncionId: null,
            sinAcceso: function () { $.notiMsj.Notificacion({ Mensaje: "No tienes Acceso", Tipo: "info" }); },
        },
        validaAcceso_default: {
            FuncionId: null,
            sinAcceso: function () { $.notiMsj.Notificacion({ Mensaje: "No tienes Acceso", Tipo: "info" }); },
        }
    };
});