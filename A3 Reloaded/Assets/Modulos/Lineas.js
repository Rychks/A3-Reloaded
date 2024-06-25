define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_iniLineas
        });
        $("#txtLineas_Nombre").on('keypress', function (e) {
            if (e.which == 13) {
                fn_Lineas();
            }
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnLineas_Limpiar').click();
            }
        });
        $("#cbxLineas_Activo").click(function () {
            fn_Lineas();
        });
        $("#btnLineas_Limpiar").click(function () {
            $.auxFormulario.limpiarCampos({
                Seccion: $("#frmLineas")
            });
            fn_Lineas();
        });
        $("#cbxLineasN_Activo").click(function () {
            if ($("#cbxLineasN_Activo").prop("checked")) {
                $("label[for='cbxLineasN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxLineasN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxLineasM_Activo").click(function () {
            if ($("#cbxLineasM_Activo").prop("checked")) {
                $("label[for='cbxLineasM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxLineasM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#btnLineasN_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmLineasN"),
                NoVacio: function () {
                    $.firmaElectronica.MostrarFirma({
                        Justificacion: false,
                        Funcion: fn_registrar_Linea
                    });
                }
            });
        });
        $("#btnLineas_Buscar").click(function () {
            fn_Lineas();
        });
        $("#btnLineasM_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmLineasM"),
                NoVacio: function () {
                    $.notiMsj.Confirmacion({
                        Tipo: "MD",
                        Titulo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_modificar_title'),
                        Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_modificar'),
                        BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                        BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                        FuncionV: function () {
                            $.firmaElectronica.MostrarFirma({
                                Justificacion: true,
                                Funcion: fn_actualizar_linea
                            });
                        }
                    });
                }
            });
        });
        $("#tblLineas table tbody").on('click', "a[data-registro=Editar]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $.post("/Lineas/obtener_Linea_ID", { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtLineasM_ID").val(item.ID);
                        $("#txtLineasM_Nombre").val(item.Nombre);
                        if (item.Activo == 1) {
                            $("#cbxLineasM_Activo").prop("checked", true);
                            $("label[for='cbxLineasM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
                        } else {
                            $("#cbxLineasM_Activo").prop("checked", false);
                            $("label[for='cbxLineasM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
                        }

                    });
                    $("#mdlLineas_Modificar").modal("show");
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        });
        $("#pgdLineas").paginado({
            Tabla: $("#tblLineas"),
            Version: 2,
            Funcion: fn_Lineas
        });
    });
    function fn_iniLineas() {
        fn_Lineas();
        $.matrizAccesos.verificaAcceso({ Elemento: $("#btnLineas_Agregar"), Url: "/Rol/verificarAcceso", FuncionId: 6 });
    }
    function fn_Lineas(Pagina) {
        var Nombre = $("#txtLineas_Nombre").val();
        var Activo = null;
        if ($("#cbxLineas_Activo").prop("checked")) {
            Activo = 1;
        }
        var Datos = { Nombre: Nombre, Activo: Activo == -1 ? null : Activo, Index: Pagina };
        var accesoEditar = "";
        $.matrizAccesos.validaAcceso({ FuncionId: 6 })
            .then(obj => {
                if (obj.result > 0) {
                    accesoEditar = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Editar"><i class="dropdown-icon fas fa-edit"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '</a>';
                }
               
                var Botones = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fas fa-bars" style="z-index:-99 !important;"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    accesoEditar +
                    '</div></div>';
                $.mostrarInfo({
                    URLindex: "/Lineas/obtenerTotalPagLinea",
                    URLdatos: "/Lineas/mostrarLineas",
                    Datos: Datos,
                    Version: 2,
                    Tabla: $("#tblLineas"),
                    Paginado: $("#pgdLineas"),
                    Mostrar: function (i, item) {

                        var Activo = '<div class="badge badge-success">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</div>';
                        if (item.Activo == 0) {
                            Activo = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</div>';
                        }

                        $("#tblLineas").find("tbody").append(
                            $('<tr>')
                                .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                                .append($('<td align="center">').append(item.RowNumber))
                                .append($('<td align="center">').append(item.Nombre))
                                .append($('<td align="center">').append(Activo))
                                .append($('<td align="center">').append(Botones))
                        );
                    }
                });
            }).catch(err => console.error(err));
    }
    function fn_registrar_Linea(Param) {
        var frmDatos = new FormData();
        frmDatos.append("Nombre", $("#txtLineasN_Nombre").val());
        if ($("#cbxLineasN_Activo").prop("checked")) {
            frmDatos.append("Activo", 1);
        } else {
            frmDatos.append("Activo", 0);
        }
        //Datos Firma
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Lineas/registro_Linea",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlLineas_Agregar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmLineasN") });
                }
                fn_Lineas();
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_linea(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtLineasM_ID").val());
        frmDatos.append("Nombre", $("#txtLineasM_Nombre").val());        
        if ($("#cbxLineasM_Activo").prop("checked")) {
            frmDatos.append("Activo", 1);
        } else {
            frmDatos.append("Activo", 0);
        }
        //Datos Firma
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        frmDatos.append("ZMYSEL", Param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Lineas/actualizar_Linea",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlLineas_Modificar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmLineasM") });
                    fn_Lineas();
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
});