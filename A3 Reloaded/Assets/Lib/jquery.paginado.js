define(["jquery"], function ($) {
    $.fn.paginado = function (Parametros) {
        var Param = $.extend($.fn.paginado.default, Parametros);
        var Paginado = $(this);
        $("[data-paginado=Anterior]", Paginado).click(function () {
            var pag = parseInt($("[data-paginado=Paginas]", Paginado).find("option:selected").val());
            if ($(this).prop("disabled", false) && pag && pag != 1) {
                pag = pag - 1;
                $("[data-paginado=Paginas]", Paginado).val(pag).change();
                ScrollTop();
            }
        });
        $("[data-paginado=Siguiente]", Paginado).click(function () {
            var pag = parseInt($("[data-paginado=Paginas] option:selected", Paginado).val());
            var last = parseInt($("[data-paginado=Paginas] option:last-child", Paginado).val());
            if ($(this).prop("disabled", false) && pag && pag < last) {
                pag = pag + 1;
                $("[data-paginado=Paginas]", Paginado).val(pag).change();
                ScrollTop();
            }
        });
        function ScrollTop() {
            if (Param.AutoScroll) {
                if (Param.Version == 1) {
                    $(Parametros.Tabla).parents("." + Param.ClassHeader).scrollTop(0);
                } else if (Param.Version == 2) {
                    $(Parametros.Tabla).find("." + Param.ClassHeader).scrollTop(0);
                }
            }
        }
        $("[data-paginado=Paginas]", this).change(function () {
            var Pagina = parseInt($("option:selected", this).val());
            var UltimaPagina = parseInt($("option:last-child", this).val());
            var botonAnterior = $("[data-paginado=Anterior]", Paginado);
            var botonSiguiente = $("[data-paginado=Siguiente]", Paginado);
            if (Pagina == 1 && UltimaPagina != 1) {
                botonAnterior.prop("disabled", true);
                botonSiguiente.prop("disabled", false);
            } else if (Pagina == 1 && UltimaPagina == 1) {
                botonAnterior.prop("disabled", true);
                botonSiguiente.prop("disabled", true);
            } else if (Pagina < UltimaPagina) {
                botonAnterior.prop("disabled", false);
                botonSiguiente.prop("disabled", false);
            } else if (Pagina == UltimaPagina) {
                botonAnterior.prop("disabled", false);
                botonSiguiente.prop("disabled", true);
            }
            Param.Funcion(Pagina);
            ScrollTop();
        });
        return this;
    };
    $.fn.paginado.default = {
        Version: 1,
        AutoScroll: true,
        ClassHeader: "encabezados-fixed",
        Funcion: function () {}
    };
});