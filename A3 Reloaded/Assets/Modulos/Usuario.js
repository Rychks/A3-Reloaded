define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_iniUsuarios,
        });
        $("#btnUsuarios_Limpiar").click(function () {
            $.auxFormulario.limpiarCampos({
                Seccion: $("#frmUsuarios")
            });
            fn_Usuarios();
        });
        $("#btnUsuarios_Agregar").click(function () {
            $("#slcUsuariosN_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos" });
            $("#slcUsuariosN_Rol").generarLista({ URL: "/Usuarios/obtener_Lista_Roles" });
        });
        $("#cbxUsuariosN_Activo").click(function () {
            if ($("#cbxUsuariosN_Activo").prop("checked")) {
                $("label[for='cbxUsuariosN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxUsuariosN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxUsuariosM_Activo").click(function () {
            if ($("#cbxUsuariosM_Activo").prop("checked")) {
                $("label[for='cbxUsuariosM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxUsuariosM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxUsuariosN_ApmNA").click(function () {
            if ($(this).prop("checked")) {
                $("#txtUsuariosN_Apm").val("N/A");
                $("#txtUsuariosN_Apm").prop("disabled", true);
            } else {
                $("#txtUsuariosN_Apm").prop("disabled", false);
                $("#txtUsuariosN_Apm").val("");
            }
        });
        $("#cbxUsuarios_Activo").click(function () {
            fn_Usuarios();
        });
        $("#btnUsuariosN_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmUsuariosN"),
                NoVacio: function () {
                    $.firmaElectronica.MostrarFirma({
                        Funcion: fn_registrar_usuario
                    });
                }
            });
        });
        $("#btnUsuariosM_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmUsuariosM"),
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
                                Funcion: fn_actualizar_usuario
                            });
                        }
                    });
                }
            });
        });
        $("#btnUsuarios_Buscar").click(function () {
            fn_Usuarios();
        });
        $("#tblUsuarios table tbody").on('click', "a[data-registro=Editar]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $.post("/Usuarios/obtenerUsuario", { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtUsuariosM_ID").val(item.ID);
                        $("#txtUsuariosM_CWID").val(item.CWID);
                        $("#txtUsuariosM_Nombre").val(item.Nombre);
                        $("#txtUsuariosM_App").val(item.App);
                        $("#txtUsuariosM_Correo").val(item.Correo);
                        $("#slcUsuariosM_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos", Seleccion: item.Departamento });
                        $("#slcUsuariosM_Rol").generarLista({ URL: "/Usuarios/obtener_Lista_Roles", Seleccion: item.Rol });
                        if (item.Activo == 1) {
                            $("#cbxUsuariosM_Activo").prop("checked", true);
                            $("label[for='cbxUsuariosM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
                        } else {
                            $("#cbxUsuariosM_Activo").prop("checked", false);
                            $("label[for='cbxUsuariosM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
                        }

                    });
                    $("#mdlUsuarios_Modificar").modal("show");
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        });
        $("#pgdUsuarios").paginado({
            Tabla: $("#tblUsuarios"),
            Version: 2,
            Funcion: fn_Usuarios
        });
        $("#slcUsuarios_Departamento").change(function () {
            fn_Usuarios();
        });
        $("#slcUsuarios_Rol").change(function () {
            fn_Usuarios();
        });
        $("#txtUsuarios_CWID,#txtUsuarios_Nombre,#txtUsuarios_Correo").on('keypress', function (e) {
            if (e.which == 13) {
                fn_Usuarios();
            }
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnUsuarios_Limpiar').click();
            }
        });
    });
    function fn_iniUsuarios() {
        fn_obtener_listas();
        fn_Usuarios();
        $.matrizAccesos.verificaAcceso({ Elemento: $("#btnUsuarios_Agregar"), Url: "/Rol/verificarAcceso", FuncionId: 11 });
    }
    function fn_Usuarios(Pagina) {
        var cwid = $("#txtUsuarios_CWID").val();
        var Nombre = $("#txtUsuarios_Nombre").val();
        var correo = $("#txtUsuarios_Correo").val();
        var Rol = $("#slcUsuarios_Rol option:selected").val();
        var Departamento = $("#slcUsuarios_Departamento option:selected").val();
        var app = "";
        var Activo = null;
        if (cwid == "") { cwid = null; }
        if (Nombre == "") { Nombre = null; }
        if (app == "") { app = null; }
        if (correo == "") { correo = null; }
        if ($("#cbxUsuarios_Activo").prop("checked")) {
            Activo = 1;
        }

        var Datos = { CWID: cwid, Nombre: Nombre, App: app, Correo: correo, Rol: Rol == -1 ? null : Rol, Departamento: Departamento == -1 ? null : Departamento, Activo: Activo == -1 ? null : Activo, Index: Pagina };
        var accesoEditar = "";
        $.matrizAccesos.validaAcceso({ FuncionId: 12 })
            .then(obj => {
                if (obj.result > 0) {
                    accesoEditar = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Editar"><i class="dropdown-icon fas fa-edit"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '</a>';
                }

                var Botones = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" title="Options"><i class="fas fa-bars" style="z-index:-99 !important;"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    accesoEditar +
                    '</div></div>';
                $.mostrarInfo({
                    URLindex: "/Usuarios/obtenerTotalPagUsuarios",
                    URLdatos: "/Usuarios/mostrarUsuarios",
                    Datos: Datos,
                    Version: 2,
                    Tabla: $("#tblUsuarios"),
                    Paginado: $("#pgdUsuarios"),
                    Mostrar: function (i, item) {

                        var Activo = '<div class="badge badge-success">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</div>';
                        if (item.Activo == 0) {
                            Activo = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</div>';
                        }

                        //var Botones = '<button class="btn btn-icon btn-primary btnEditar" data-toggle="tooltip"  data-registro="Editar" data-placement="bottom" title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '"><i class="far fa-edit"></i></button>';
                        $("#tblUsuarios").find("tbody").append(
                            $('<tr>')
                                .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                                .append($('<td>').append(item.RowNumber))
                                .append($('<td>').append(item.CWID))
                                .append($('<td>').append(item.Nombre))
                                .append($('<td>').append(item.Correo))
                                .append($('<td>').append(item.Rol))
                                .append($('<td>').append(item.Departamento))
                                .append($('<td>').append(Activo))
                                .append($('<td>').append(Botones))
                        );
                    }
                });
            }).catch(err => console.error(err));
    }
    function fn_obtener_listas() {
        $("#slcUsuarios_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos" });
        $("#slcUsuarios_Rol").generarLista({ URL: "/Usuarios/obtener_Lista_Roles" });
    }
    function fn_registrar_usuario(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtUsuariosN_ID").val());
        frmDatos.append("CWID", $("#txtUsuariosN_CWID").val());
        frmDatos.append("Nombre", $("#txtUsuariosN_Nombre").val());
        frmDatos.append("App", $("#txtUsuariosN_App").val());
        frmDatos.append("Correo", $("#txtUsuariosN_Correo").val());
        frmDatos.append("Rol", $("#slcUsuariosN_Rol option:selected").val());
        frmDatos.append("Departamento", $("#slcUsuariosN_Departamento option:selected").val());
        if ($("#cbxUsuariosN_Activo").prop("checked")) {
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
            url: "/Usuarios/guardarUsuario",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlUsuarios_Agregar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmUsuariosN") });
                }
                fn_Usuarios();
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_usuario(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtUsuariosM_ID").val());
        frmDatos.append("CWID", $("#txtUsuariosM_CWID").val());
        frmDatos.append("Nombre", $("#txtUsuariosM_Nombre").val());
        frmDatos.append("App", $("#txtUsuariosM_App").val());
        frmDatos.append("Correo", $("#txtUsuariosM_Correo").val());
        frmDatos.append("Rol", $("#slcUsuariosM_Rol option:selected").val());
        frmDatos.append("Departamento", $("#slcUsuariosM_Departamento option:selected").val());
        if ($("#cbxUsuariosM_Activo").prop("checked")) {
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
            url: "/Usuarios/actualizarUsuario",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmUsuariosM") });                                       
                }
                fn_Usuarios();
                $("#mdlUsuarios_Modificar").modal("hide");
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