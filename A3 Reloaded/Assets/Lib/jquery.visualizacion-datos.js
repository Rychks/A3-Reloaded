define(["jquery", 'NotificacionesMensajes'], function (jQuery) {
    jQuery.mostrarInfo = function (Parametros) {
        var Param = jQuery.extend({}, jQuery.mostrarInfo.default, Parametros);
        var PaginaActual = (isNaN(Param.Datos.Index) || (Param.Datos.Index == null)) ? 1 : Param.Datos.Index;
        jQuery.extend(Param.Datos, { Index: (PaginaActual - 1) });

        $.post(Param.URLdatos, Param.Datos).done(function (data) {
            if (Param.Version == 1) {
                $(Param.Tabla).empty();
            } else if (Param.Version == 2) {
                $(Param.Tabla.find("tbody")).empty();
            }
            if (Param.Version == 2) { $(Param.Tabla).addClass("active"); }
            if (data != null && data != "") {
               
                $.each(data, Param.Mostrar);
                $.post(Param.URLindex, Param.Datos).done(function (data) {
                    $("[data-paginado=Paginas]", Param.Paginado).empty();
                    for (x = 1; x <= data; x++) {
                        if (x == PaginaActual) {
                            $("[data-paginado=Paginas]", Param.Paginado).append("<option selected value=" + x + ">" + x + "</option>");
                        } else {
                            $("[data-paginado=Paginas]", Param.Paginado).append("<option value=" + x + ">" + x + "</option>");
                        }
                    }
                    var botonAnterior = $("[data-paginado=Anterior]", Param.Paginado);
                    var botonSiguiente = $("[data-paginado=Siguiente]", Param.Paginado);
                    if (PaginaActual == 1 && data != 1) {
                        botonAnterior.prop("disabled", true);
                        botonSiguiente.prop("disabled", false);
                    } else if (PaginaActual == 1 && data == 1) {
                        botonAnterior.prop("disabled", true);
                        botonSiguiente.prop("disabled", true);
                    } else if (PaginaActual < data) {
                        botonAnterior.prop("disabled", false);
                        botonSiguiente.prop("disabled", false);
                    } else if (PaginaActual == data) {
                        botonAnterior.prop("disabled", false);
                        botonSiguiente.prop("disabled", true);
                    }
                }).fail(function (error) { fn_Notificaciones({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
                
            } else {
                if (Param.Version == 1) {
                    $(Param.Tabla).append("<tr><td class='text-center' colspan='100%'>" + $.CargarIdioma.Obtener_Texto('txt_Idioma_No_Encontraron_Registros') + "</td></tr>");
                } else if (Param.Version == 2) {
                    $(Param.Tabla.find("tbody")).append("<tr><td class='text-center' colspan='100%'>" + $.CargarIdioma.Obtener_Texto('txt_Idioma_No_Encontraron_Registros') + "</td></tr>");
                }
                $("[data-paginado=Paginas]", Param.Paginado).empty();
                $("[data-paginado=Paginas]", Param.Paginado).append("<option selected value='1'>1</option>");
                $("[data-paginado=Anterior]", Param.Paginado).prop("disabled", true);
                $("[data-paginado=Siguiente]", Param.Paginado).prop("disabled", true);
            }


            if (Param.Version == 2) { $(Param.Tabla).removeClass("active"); }
            $('[data-toggle="tooltip"],[data-toggle-second="tooltip"]').tooltip({ trigger: 'hover' });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    };
    jQuery.mostrarInfo.default = {
        URLindex: null,
        URLdatos: null,
        Datos: {},
        Version: 1,
        Tabla: null,
        Paginado: null,
        Mostrar: function () { }
    };
});