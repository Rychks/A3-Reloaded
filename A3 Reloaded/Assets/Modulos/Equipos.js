define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_iniEquipos
        });
        $("#btnEquipos_Limpiar").click(function () {
            $.auxFormulario.limpiarCampos({
                Seccion: $("#frmEquipos")
            });
            fn_Equipos();
        });
        $("#cbxEquiposN_Activo").click(function () {
            if ($("#cbxEquiposN_Activo").prop("checked")) {
                $("label[for='cbxEquiposN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxEquiposN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxEquiposM_Activo").click(function () {
            if ($("#cbxEquiposM_Activo").prop("checked")) {
                $("label[for='cbxEquiposM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxEquiposM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#btnEquiposN_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmEquiposN"),
                NoVacio: function () {
                    $.firmaElectronica.MostrarFirma({
                        Funcion: fn_registrar_Equipo
                    });
                }
            });
        });
        $("#txtEquipos_Nombre").on('keypress', function (e) {
            if (e.which == 13) {
                fn_Equipos();
            }
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnEquipos_Limpiar').click();
            }
        });
        $("#btnEquipos_Buscar").click(function () {
            fn_Equipos();
        });
        $("#cbxEquipos_Activo").click(function () {
            fn_Equipos();
        });
        $("#btnEquiposM_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmEquiposM"),
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
                                Funcion: fn_actualizar_Equipo
                            });
                        }
                    });
                }
            });
        });
        $("#tblEquipos table tbody").on('click', "a[data-registro=Editar]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $.post("/Equipos/obtener_Equipo_ID", { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtEquiposM_ID").val(item.ID);
                        $("#txtEquiposM_Nombre").val(item.Nombre);
                        if (item.Activo == 1) {
                            $("#cbxEquiposM_Activo").prop("checked", true);
                            $("label[for='cbxEquiposM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
                        } else {
                            $("#cbxEquiposM_Activo").prop("checked", false);
                            $("label[for='cbxEquiposM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
                        }

                    });
                    $("#mdlEquipos_Modificar").modal("show");
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        });
        $("#pgdEquipos").paginado({
            Tabla: $("#tblEquipos"),
            Version: 2,
            Funcion: fn_Equipos
        });
    });
    function fn_iniEquipos() {
        fn_Equipos();
        $.matrizAccesos.verificaAcceso({ Elemento: $("#btnEquipos_Agregar"), Url: "/Rol/verificarAcceso", FuncionId: 14 });
    }
    function fn_Equipos(Pagina) {
        var Nombre = $("#txtEquipos_Nombre").val();
        var Activo = null;
        if ($("#cbxEquipos_Activo").prop("checked")) {
            Activo = 1;
        }
        var Datos = { Nombre: Nombre, Activo: Activo == -1 ? null : Activo, Index: Pagina };
        var accesoEditar = "";
        $.matrizAccesos.validaAcceso({ FuncionId: 15 })
            .then(obj => {
                if (obj.result > 0) {
                    accesoEditar = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Editar"><i class="dropdown-icon fas fa-edit"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '</a>';
                }

                var Botones = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fas fa-bars" style="z-index:-99 !important;"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    accesoEditar +
                    '</div></div>';
                $.mostrarInfo({
                    URLindex: "/Equipos/obtenerTotalPagEquipo",
                    URLdatos: "/Equipos/mostrarEquipos",
                    Datos: Datos,
                    Version: 2,
                    Tabla: $("#tblEquipos"),
                    Paginado: $("#pgdEquipos"),
                    Mostrar: function (i, item) {

                        var Activo = '<div class="badge badge-success">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</div>';
                        if (item.Activo == 0) {
                            Activo = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</div>';
                        }
                        
                        $("#tblEquipos").find("tbody").append(
                            $('<tr>')
                                .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                                .append($('<td>').append(item.RowNumber))
                                .append($('<td>').append(item.Nombre))
                                .append($('<td>').append(Activo))
                                .append($('<td>').append(Botones))
                        );
                    }
                });
            }).catch(err => console.error(err));
    }
    function fn_registrar_Equipo(Param) {
        var frmDatos = new FormData();
        frmDatos.append("Nombre", $("#txtEquiposN_Nombre").val());
        if ($("#cbxEquiposN_Activo").prop("checked")) {
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
            url: "/Equipos/registro_Equipo",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlEquipos_Agregar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmEquiposN") });
                }
                fn_Equipos();
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_Equipo(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtEquiposM_ID").val());
        frmDatos.append("Nombre", $("#txtEquiposM_Nombre").val());
        if ($("#cbxEquiposM_Activo").prop("checked")) {
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
            url: "/Equipos/actualizar_Equipo",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlEquipos_Modificar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmLineasM") });
                    fn_Equipos();
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