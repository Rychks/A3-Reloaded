define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_iniDepartamentos
        });
        $("#txtDepartamentos_Nombre").on('keypress', function (e) {
            if (e.which == 13) {
                fn_Departamentos();
            }
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnDepartamentos_Limpiar').click();
            }
        });
        $("#cbxDepartamentos_Activo").click(function () {
            fn_Departamentos();
        });
        $("#btnDepartamentos_Limpiar").click(function () {
            $.auxFormulario.limpiarCampos({
                Seccion: $("#frmDepartamentos")
            });
            fn_Departamentos();
        });
        $("#cbxDepartamentosN_Activo").click(function () {
            if ($("#cbxDepartamentosN_Activo").prop("checked")) {
                $("label[for='cbxDepartamentosN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxDepartamentosN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxDepartamentosM_Activo").click(function () {
            if ($("#cbxDepartamentosM_Activo").prop("checked")) {
                $("label[for='cbxDepartamentosM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxDepartamentosM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#btnDepartamentosN_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmDepartamentosN"),
                NoVacio: function () {
                    $.firmaElectronica.MostrarFirma({
                        Funcion: fn_registrar_departamento
                    });
                }
            });
        });
        $("#btnDepartamentosM_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmDepartamentosM"),
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
                                Funcion: fn_actualizar_departamento
                            });
                        }
                    });
                }
            });
        });
        $("#btnDepartamentos_Buscar").click(function () {
            fn_Departamentos();
        })
        $("#tblDepartamentos table tbody").on('click', "a[data-registro=Editar]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $.post("/Departamento/obtenerDepartamento", { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtDepartamentosM_ID").val(item.ID);
                        $("#txtDepartamentosM_Nombre").val(item.Nombre);
                        if (item.Activo == 1) {
                            $("#cbxDepartamentosM_Activo").prop("checked", true);
                            $("label[for='cbxDepartamentosM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
                        } else {
                            $("#cbxDepartamentosM_Activo").prop("checked", false);
                            $("label[for='cbxDepartamentosM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
                        }                       
                    });
                    $("#mdlDepartamentos_Modificar").modal("show");
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        });
        $("#pgdDepartamentos").paginado({
            Tabla: $("#tblDepartamentos"),
            Version: 2,
            Funcion: fn_Departamentos
        });
    });
    function fn_iniDepartamentos() {
        fn_Departamentos();
        $.matrizAccesos.verificaAcceso({ Elemento: $("#btnLineas_Agregar"), Url: "/Rol/verificarAcceso", FuncionId: 8 });
    }
    function fn_Departamentos(Pagina) {
        var Nombre = $("#txtDepartamentos_Nombre").val();
        var Activo = null;
        if (Nombre == "") { Nombre = null; }
        if ($("#cbxDepartamentos_Activo").prop("checked")) {
            Activo = 1;
        }
        var Datos = { Nombre: Nombre, Activo: Activo == -1 ? null : Activo, Index: Pagina };
        var accesoEditar = "";
        $.matrizAccesos.validaAcceso({ FuncionId: 9 })
            .then(obj => {
                if (obj.result > 0) {
                    accesoEditar = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Editar"><i class="dropdown-icon fas fa-edit"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '</a>';
                }

                var Botones = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon"  title="Options" data-original-title="Options"><i class="fas fa-bars" style="z-index:-99 !important;"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    accesoEditar +
                    '</div></div>'; 7
                $.mostrarInfo({
                    URLindex: "/Departamento/obtenerTotalPagDepartamentos",
                    URLdatos: "/Departamento/mostrarDepartamentos",
                    Datos: Datos,
                    Version: 2,
                    Tabla: $("#tblDepartamentos"),
                    Paginado: $("#pgdDepartamentos"),
                    Mostrar: function (i, item) {

                        var Activo = '<div class="badge badge-success">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</div>';
                        if (item.Activo == 0) {
                            Activo = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</div>';
                        }                   
                        $("#tblDepartamentos").find("tbody").append(
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
    function fn_registrar_departamento(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtDepartamentosN_ID").val());
        frmDatos.append("Nombre", $("#txtDepartamentosN_Nombre").val());
        if ($("#cbxDepartamentosN_Activo").prop("checked")) {
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
            url: "/Departamento/guardarDepartamento",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmDepartamentosN") });
                }
                $("#mdlDepartamentos_Agregar").modal("hide");
                fn_Departamentos();
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_departamento(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtDepartamentosM_ID").val());
        frmDatos.append("Nombre", $("#txtDepartamentosM_Nombre").val());
        if ($("#cbxDepartamentosM_Activo").prop("checked")) {
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
            url: "/Departamento/actualizarDepartamento",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmDepartamentosM") });
                }
                $("#mdlDepartamentos_Modificar").modal("hide");
                fn_Departamentos();
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