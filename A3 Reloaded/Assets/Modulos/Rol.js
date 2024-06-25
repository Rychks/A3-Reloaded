define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_RolIndex
        });
        $("#txtRoles_Nombre").on('keypress', function (e) {
            if (e.which == 13) {
                fn_Roles();
            }
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnRoles_Limpiar').click();
            }
        });
        $("#cbxRoles_Activo").click(function () {
            fn_Roles();
        })
        $("#tblRoles tbody").on('click', "a[data-registro=Editar]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $.post("/Rol/obtener_Rol_ID", { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtRolesM_ID").val(item.ID);
                        $("#txtRolesM_Nombre").val(item.Nombre);
                        if (item.Activo == 1) {
                            $("#cbxRolesM_Activo").prop("checked", true);
                            $("label[for='cbxRolesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
                        } else {
                            $("#cbxRolesM_Activo").prop("checked", false);
                            $("label[for='cbxRolesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
                        }
                    });
                    $("#mdlRoles_Modificar").modal("show");
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: "Error al tratar de mostrar la información, intentelo más tarde", Tipo: "danger", Error: error }); });
        });
        $("#tblRoles tbody").on('click', "a[data-registro=Configurar]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            var Nombre = $(this).parents("tr").find("[data-registro=Nombre]").html();
            fn_Operaciones(ID);
            $("#txtRolesC_nombre").val(Nombre);
            $("#txtRolesC_Id").val(ID);
            $("#mdlRoles_Configurar").modal("show");
        });
        $("#btnRoles_Limpiar").click(function () {
            $.auxFormulario.limpiarCampos({
                Seccion: $("#frmRoles")
            });
            fn_Roles();
        });
        $("#btnRolesN_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmRolesN"),
                NoVacio: function () {
                    $.firmaElectronica.MostrarFirma({
                        Justificacion: false,
                        Funcion: fn_registrar_Rol
                    });
                }
            });
        });
        $("#btnRolesM_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmRolesM"),
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
                                Funcion: fn_actualizar_roles
                            });
                        }
                    });
                }
            });
        });
        $("#btnRolesC_guardar").click(function () {
            $.notiMsj.Confirmacion({
                Tipo: "MD",
                Titulo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_modificar_title'),
                Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_modificar'),
                BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                FuncionV: function () {
                    $.firmaElectronica.MostrarFirma({
                        Justificacion: true,
                        Funcion: fn_actualizarAccesos
                    });
                }
            });
        });
        $("#cbxRolesN_Activo").click(function () {
            if ($("#cbxRolesN_Activo").prop("checked")) {
                $("label[for='cbxRolesN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxRolesN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxRolesM_Activo").click(function () {
            if ($("#cbxRolesM_Activo").prop("checked")) {
                $("label[for='cbxRolesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxRolesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
    });
    function fn_RolIndex() {
        fn_Roles()
        $.matrizAccesos.verificaAcceso({ Elemento: $("#btnRoles_Agregar"), Url: "/Rol/verificarAcceso", FuncionId: 1 });
    }
    function fn_actualizarAccesos(Param) {
        var rolId = $("#txtRolesC_Id").val()
        var numOperaciones = parseInt($('#tblRol_funciones tbody').find('input[type="checkbox"]:checked').length);
        if (numOperaciones > 0) {
            var frmDatos = new FormData();
            
            $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
            var Permisos = []
            $('#tblRol_funciones tbody').find('input[type="checkbox"]:checked').each(function () {
                var val = $(this).parent("td").parent("tr").find("input[name*='functionID']");
                var Accion = $(val).val();
                var PermisoModel = {
                    ID: Accion,
                    Rol: rolId
                }
                Permisos.push(PermisoModel);
            });
            var datos = { lista: Permisos, Rol: rolId, BYTOST: Param.BYTOST, ZNACKA: Param.ZNACKA, ZMYSEL: Param.ZMYSEL }
            var url = "/Rol/registrar_permisos";
            $.post(url, datos).done(function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlRoles_Configurar").modal("hide");
                    fn_Operaciones();
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            }).fail(function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            });
        } else {
            $.notiMsj.Notificacion({ Mensaje: "Seleccione una Operación", Tipo: "info", Error: null });
        }
    }
    function fn_Roles(Pagina) {
        var Nombre = $("#txtRoles_Nombre").val();
        var Activo = null;
        if ($("#cbxRoles_Activo").prop("checked")) {
            Activo = 1;
        }
        var Datos = { Nombre: Nombre, Activo: Activo == -1 ? null : Activo, Index: Pagina };
        var accesoEditar = "";
        var accesoConfigurar = "";
        $.matrizAccesos.validaAcceso({ FuncionId: 2 })
            .then(obj => {
                if (obj.result > 0) {
                    accesoEditar = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Editar"><i class="dropdown-icon fas fa-edit"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '</a>';
                }
                return $.matrizAccesos.validaAcceso({ FuncionId: 3 })
            })
            .then(obj => {
                if (obj.result > 0) {
                    accesoConfigurar = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Configurar"><i class="dropdown-icon fas fa-user-cog"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Configurar_Rol') + '</a>';
                }
                var Botones = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fas fa-bars" style="z-index:-99 !important;"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    accesoEditar +
                    accesoConfigurar +
                    '</div></div>';
                $.mostrarInfo({
                    URLindex: "/Rol/obtenerPaginado_Roles",
                    URLdatos: "/Rol/obtenerRegistros_Roles",
                    Datos: Datos,
                    Version: 2,
                    Tabla: $("#tblRoles"),
                    Paginado: $("#pgdRoles"),
                    Mostrar: function (i, item) {

                        var Activo = '<div class="badge badge-success">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</div>';
                        if (item.Activo == 0) {
                            Activo = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</div>';
                        }
                        
                        $("#tblRoles").find("tbody").append(
                            $('<tr>')
                                .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                                .append($('<td align="center">').append(item.RowNumber))
                                .append($('<td data-registro="Nombre">').append(item.Nombre))
                                .append($('<td align="center">').append(Activo))
                                .append($('<td align="center">').append(Botones))
                        );
                    }
                });
            }).catch(err => console.error(err));
    }
    function fn_Operaciones(Rol) {
        url = "/Rol/obtenerLista_Funcion";
        data = { Activo: 1 }
        $.post(url, data).done(function (datos) {
            url2 = "/Rol/obtener_Accesos";
            data2 = { Rol: Rol };

            $.post(url2, data2).done(function (datos2) {
                let input_Check = '<input type="checkbox">';
                if (datos != "") {
                    $("#tblRol_funciones tbody").empty();
                    $.each(datos, function (i, item) {
                        $("#tblRol_funciones tbody").append(
                            $('<tr>')
                                .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                                .append($('<td style="display:none">').append('<input type="text" name="functionID" value="' + item.ID + '" />'))
                                .append($('<td style="padding: 5px !important;">').append(item.Modulo))
                                .append($('<td>').append(item.Funcion))
                                .append($('<td>').append('<input type="checkbox" name="name" value="" />'))
                            //.append($('<td>').append(Botones))
                        );
                    });
                    $.each(datos, function (i, item1) {
                        $.each(datos2, function (i, item2) {
                            if (item1.ID == item2.Nombre) {
                                var val = $("#tblRol_funciones tbody").find("input[value='" + item2.Nombre + "']");
                                var ckeck = $(val).parent("td").parent("tr").find("input[type='checkbox']");
                                $(ckeck).prop("checked", true);
                            }
                        });
                    });
                }
            });
        });
    }
    function fn_registrar_Rol(Param) {
        var frmDatos = new FormData();
        frmDatos.append("Nombre", $("#txtRolesN_Nombre").val());
        if ($("#cbxRolesN_Activo").prop("checked")) {
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
            url: "/Rol/registrar_Rol",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlRoles_Agregar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmRolesN") });
                }
                fn_Roles();
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_roles(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtRolesM_ID").val());
        frmDatos.append("Nombre", $("#txtRolesM_Nombre").val());
        if ($("#cbxRolesM_Activo").prop("checked")) {
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
            url: "/Rol/actualizarRol",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlRoles_Modificar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmRolesM") });
                    fn_Roles();
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