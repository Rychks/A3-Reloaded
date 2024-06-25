define(["jquery", 'marcopolo', 'NotificacionesMensajes'], function (jQuery, marcopolo) {
    //--- Auxiliares para Formulario ---//
    jQuery.auxFormulario = {
        camposVacios: function (Parametros) {
            var Param = jQuery.extend({}, jQuery.auxFormulario.default.camposVacios_default, Parametros);
            var Vacios = true;
            var Campos = [];
            if (Param.Seccion.is("div")) {
                Param.Seccion.find("input[type=text],input[type=password],input[type=date],select,textarea").each(function (i, item) {
                    if (Param.Excepciones.length > 0) {
                        if (jQuery.inArray($(this).prop("id"), Param.Excepciones) == -1) {
                            if ($(this).is("input") || $(this).is("textarea")) {
                                if ($(this).val() == "" || $(this).val() == null) {
                                    Vacios = false;
                                    Campos.push($(this).prop("id"));
                                }
                            } else if ($(this).is("select")) {
                                if ($(this).find("option:selected").val() == -1 || $(this).find("option:selected").val() == null) {
                                    Vacios = false;
                                    Campos.push($(this).prop("id"));
                                }
                            }
                        }
                    } else {
                        if ($(this).is("input") || $(this).is("textarea")) {
                            if ($(this).val() == "" || $(this).val() == null) {
                                Vacios = false;
                                Campos.push($(this).prop("id"));
                            }
                        } else if ($(this).is("select")) {
                            if ($(this).find("option:selected").val() == -1 || $(this).find("option:selected").val() == null) {
                                Vacios = false;
                                Campos.push($(this).prop("id"));
                            }
                        }
                    }
                });
            } else {
                if (Param.Seccion.is("input") || Param.Seccion.is("textarea")) {
                    if (Param.Seccion.val() == "" || Param.Seccion.val() == null) {
                        Vacios = false;
                        Campos.push(Param.Seccion.prop("id"));
                    }
                } else if (Param.Seccion.is("select")) {
                    if (Param.Seccion.find("option:selected").val() == -1 || Param.Seccion.find("option:selected").val() == null) {
                        Vacios = false;
                        Campos.push(Param.Seccion.prop("id"));
                    }
                }
            }
            if (Vacios == false) {
                Param.EsVacio();
                Campos.forEach(function (item) {
                    console.log("Campo vacio: " + item);
                });
            } else {
                Param.NoVacio();
            }
        },
        llenarVacios: function (Parametros) {
            var Param = jQuery.extend({}, jQuery.auxFormulario.default.llenarVacios_default, Parametros);
            Param.Seccion.find("input[type=text],textarea").each(function (i, item) {
                if (Param.Excepciones.length > 0) {
                    if (jQuery.inArray($(this).prop("id"), Param.Excepciones) == -1) {
                        if ($(this).is("input") || $(this).is("textarea")) {
                            if ($(this).val() == "" || $(this).val() == null) {
                                $(this).val(Param.Texto);
                            }
                        }
                    }
                } else {
                    if ($(this).is("input") || $(this).is("textarea")) {
                        if ($(this).val() == "" || $(this).val() == null) {
                            $(this).val(Param.Texto);
                        }
                    }
                }
            });
            if (Param.Funcion != null) {
                Param.Funcion();
            }
        },
        limpiarCampos: function (Parametros) {
            var Param = jQuery.extend({}, jQuery.auxFormulario.default.limpiarCampos_default, Parametros);
            Param.Seccion.find(Param.Campos).each(function (i, item) {
                if (Param.Excepciones.length > 0) {
                    if ($(this).prop("id") != "") {
                        if (jQuery.inArray($(this).prop("id"), Param.Excepciones) == -1) {
                            if ($(this).is("input[type=checkbox],input[type=radio]")) {
                                $(this).prop("checked", false);
                            } else if ($(this).is("input[type=email],input[type=text],input[type=date],textarea")) {
                                $(this).val("");
                            } else if ($(this).is("input[type=date]")) {
                                if ($(this).prop("disabled")) {
                                    $(this).prop("disabled", false);
                                    $(this).val("");
                                    $(this).prop("disabled", true);
                                } else if ($(this).prop("readonly")) {
                                    $(this).prop("readonly", false);
                                    $(this).val("");
                                    $(this).prop("readonly", true);
                                } else {
                                    $(this).val("");
                                }
                            } else if ($(this).is("select")) {
                                $(this).prop("selectedIndex", 0);
                            }
                        }
                    } else {
                        if (jQuery.inArray($(this).prop("name"), Param.Excepciones) == -1) {
                            if ($(this).is("input[type=checkbox],input[type=radio]")) {
                                $(this).prop("checked", false);
                            } else if ($(this).is("input[type=email],input[type=text],input[type=date],textarea")) {
                                $(this).val("");
                            } else if ($(this).is("input[type=date]")) {
                                if ($(this).prop("disabled")) {
                                    $(this).prop("disabled", false);
                                    $(this).val("");
                                    $(this).prop("disabled", true);
                                } else if ($(this).prop("readonly")) {
                                    $(this).prop("readonly", false);
                                    $(this).val("");
                                    $(this).prop("readonly", true);
                                } else {
                                    $(this).val("");
                                }
                            } else if ($(this).is("select")) {
                                $(this).prop("selectedIndex", 0);
                            }
                        }
                    }
                } else {
                    if ($(this).is("input[type=checkbox],input[type=radio]")) {
                        $(this).prop("checked", false);
                    } else if ($(this).is("input[type=email],input[type=text],textarea")) {
                        $(this).val("");
                    } else if ($(this).is("input[type=date]")) {
                        if ($(this).prop("disabled")) {
                            $(this).prop("disabled", false);
                            $(this).val("");
                            $(this).prop("disabled", true);
                        } else if ($(this).prop("readonly")) {
                            $(this).prop("readonly", false);
                            $(this).val("");
                            $(this).prop("readonly", true);
                        } else {
                            $(this).val("");
                        }
                    } else if ($(this).is("select")) {
                        $(this).prop("selectedIndex", 0);
                    }
                }
            });
        }
    };
    jQuery.auxFormulario.default = {
        camposVacios_default: {
            Seccion: null,
            Excepciones: [],
            EsVacio: function () { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info" }); },
            NoVacio: function () { }
        },
        llenarVacios_default: {
            Seccion: null,
            Excepciones: [],
            Texto: "N/A",
            Funcion: function () {}
        },
        limpiarCampos_default: {
            Seccion: null,
            Campos: "input[type=checkbox],input[type=email],input[type=radio],input[type=text],input[type=date],select,textarea",
            Excepciones: [],
        }
    };
    $.fn.limpiarTabla = function (Parametros) {
        var Param = jQuery.extend({}, jQuery.auxFormulario.default.limpiarTabla_default, Parametros);
        if (Param.Version == 2) {
            if (Param.Reset == 1) {
                return this.each(function () {
                    if ($(this).find("tbody").find("p").length) {
                        $(this).find("tbody").empty();
                    }
                });
            } else {
                return this.each(function () {
                    $(this).find("tbody").empty();
                });
            }
        }
    };
    $.fn.limpiarTabla.deafult = {
        Reset: 0,
        Version: 1,
    }
    //--- Generador de Lista ---//
    $.fn.generarLista = function (Parametros) {
        var Param = $.extend({}, $.fn.generarLista.default, Parametros);
        var Criterios = $.extend({}, Param.Parametros, { Activo: Param.Activo });
        return this.each(function () {
            var Objeto = this;
            $.post(Param.URL, Criterios).done(function (res) {
                $(Objeto).empty();
                if (res != "") {
                    if (Param.Seleccion != "") {
                        $(Objeto).append('<option value="-1" selected disabled>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione')+'</option>');
                    } else {
                        $(Objeto).append('<option value="-1" disabled>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione') +'</option>');
                    }
                    $.each(res, function (i, item) {
                        if (Param.Seleccion != "" && (item.ID == Param.Seleccion) && Param.Version==1) {
                            $(Objeto).append('<option selected value="' + item.ID + '">' + item.Opcion + '</option>');
                        } else if (Param.Seleccion != "" && (item.Opcion == Param.Seleccion) && Param.Version==2) {
                            $(Objeto).append('<option selected value="' + item.ID + '">' + item.Opcion + '</option>');
                        } else {
                            $(Objeto).append('<option value="' + item.ID + '">' + item.Opcion + '</option>');
                        }
                    });
                } else {
                    $(Objeto).append('<option value="-1" selected disabled>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione') +'</option>');
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        });
    };
    $.fn.generarLista.default = {
        Seleccion: -1,
        Parametros: {},
        Activo: 1,
        Version: 1
    };
    //--- Contador de Caracteres en textarea ---//
    jQuery.contadorCaracteres = function(Parametros) {
        var Param = jQuery.extend({}, jQuery.contadorCaracteres.default, Parametros);
        $(".contadorCaracteres").each(function (e) {
            var Area = $(this);
            var Max =  0;
            if (Area.prop("maxlength") != -1) {
                Max = Area.prop("maxlength");
            } else {
                Max = Param.Max;
                Area.prop("maxlength", Max);
            }
            $("[data-contadorCaracteres='" + Area.prop("id") + "']").text("0/" + Max);
            Area.keyup(function () {
                var Caracteres = 0;
                Caracteres = Caracteres + $(this).val().length;
                $("[data-contadorCaracteres='" + $(this).prop("id") + "']").text(Caracteres + "/" + Max);
            });
        });
    }
    jQuery.contadorCaracteres.default = {
        Max:50,
    }
    //--- AutoCompletar ---//
    $.fn.autocompletar = function (Parametros) {
        var Param = $.extend({}, $.fn.generarLista.default, Parametros);
        var Criterios = $.extend({}, Param.Parametros, { Activo: Param.Activo });
        $(this).marcoPolo({
            url: Param.URL,
            param: Param.NombreCriterio,
            data: Criterios,
            formatNoResults: function (q) {
                return '<em>No se encontró coincidencias para <strong>' + q + '</strong>.</em>';
            },
            formatError: function (q) {
                return '<em>La busqueda no se pudo completar en este momento.</em>';
            },
            formatItem: function (data, $item) {
                return '<li class="mp_item text-left">' + data.label + '</li>';
                //return '<li class="mp_item text-left">' + data.label + '<ol><li>' + data.value + '</li></ol>' + '</li>';
            },
            onSelect: function (data, $item) {
                this.val(data.label);
                if (Param.Funcion != null) {
                    Param.Funcion(data,this);
                }
            }
        });
    }
    $.fn.autocompletar.default = {
        URL: null,
        NombreCriterio: null,
        Funcion: function () {}
    }
});