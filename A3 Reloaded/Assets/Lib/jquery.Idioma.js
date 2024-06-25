define(["jquery", 'NotificacionesMensajes'], function (jQuery) {
    ///Obtener_Textos_Idioma();
    var Textos_Idioma = [];
    jQuery.CargarIdioma = {
        Textos: function (Parametros) {
            var Param = $.extend(jQuery.CargarIdioma.default, Parametros);
            $.ajax({
                type: "GET",
                url: "/Lenguaje/obtener_texto_idiomas",
                contentType: false,
                processData: false,
                data: null,
                success: function (res) {
                    $.each(res, function (i, item) {
                        $("#" + item.Etiqueta + "").val(item.Texto);
                        $("." + item.Etiqueta + "").text(item.Texto);
                        $("." + item.Etiqueta + "").html(item.Texto);
                        $("." + item.Etiqueta + "").removeAttr("placeholder");
                        $("." + item.Etiqueta + "").attr("placeholder", item.Texto);
                        $("." + item.Etiqueta + "").val(null);
                        let Texto_Idioma = {
                            Label: item.Etiqueta,
                            Texto: item.Texto
                        }
                        Textos_Idioma.push(Texto_Idioma);
                    });
                },
                error: function (error) {
                    //$("#mdlSistema_FirmaElectronica").modal("hide");
                    //$("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    //$.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
                }
            }).done(function (data) {
                setTimeout(function () {
                    Param.Funcion();
                }, 200);
               
                setTimeout(function () {
                    $(".loader").hide();
                }, 200);
                
            })
        },
        Obtener_Texto: function (Label) {
            var valor = Textos_Idioma.find(Texto_Idioma => Texto_Idioma.Label === Label);
            return valor.Texto;          
        },
        Demo: async function() {
            // Opciones por defecto estan marcadas con un *
            const response = await fetch('/Lenguaje/obtener_texto_idiomas', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(null) // body data type must match "Content-Type" header
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }        
    };
    jQuery.CargarIdioma.default = {
        Funcion: function () { console.log("No existe la Funcion") }
    };
});