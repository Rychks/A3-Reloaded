define(["jquery"], function ($) {
    $(document).ready(function () {    
        
        $.CargarIdioma.Textos({
            Funcion: fn_iniSubareas
        });
        $("#slcSubareas_Departamento").change(function () {
            fn_Subareas();
        });
        $("#txtSubareas_Nombre").on('keypress', function (e) {
            if (e.which == 13) {
                fn_Subareas();
            }
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnSubareas_Limpiar').click();
            }
        });
        $("#cbxSubareas_Activo").click(function () {
            fn_Subareas();
        });
        $("#btnSubareas_Limpiar").click(function () {
            $.auxFormulario.limpiarCampos({
                Seccion: $("#frmSubareas")
            });
            fn_Subareas();
        });
        $("#btnSubareas_Agregar").click(function () {
            $("#slcSubareasN_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos" });
        });
        $("#cbxSubareasN_Activo").click(function () {
            var idioma_activado = $("#txt_Idioma_Activado").val();
            var idioma_desactivado = $("#txt_Idioma_Desactivado").val();
            if ($("#cbxSubareasN_Activo").prop("checked")) {
                $("label[for='cbxSubareasN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxSubareasN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxSubareasM_Activo").click(function () {
            if ($("#cbxSubareasM_Activo").prop("checked")) {
                $("label[for='cbxSubareasM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxSubareasM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#btnSubareasN_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmSubareasN"),
                NoVacio: function () {
                    $.firmaElectronica.MostrarFirma({
                        Funcion: fn_registrar_subarea
                    });
                }
            });
        });
        $("#btnSubareasM_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmSubareasM"),
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
                                Funcion: fn_actualizar_subarea
                            });
                        }
                    });
                }
            });
        });
        $("#btnSubareas_Buscar").click(function () {
            fn_Subareas();
        })
        $("#tblSubareas table tbody").on('click', "a[data-registro=Editar]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $.post("/Subareas/obtener_Subarea_ID", { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtSubareasM_ID").val(item.ID);
                        $("#txtSubareasM_Nombre").val(item.Nombre);
                        $("#slcSubareasM_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos", Seleccion: item.ID_Departamento });
                        if (item.Activo == 1) {
                            $("#cbxSubareasM_Activo").prop("checked", true);
                            $("label[for='cbxSubareasM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
                        } else {
                            $("#cbxSubareasM_Activo").prop("checked", false);
                            $("label[for='cbxSubareasM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
                        }
                        
                    });
                    $("#mdlSubareas_Modificar").modal("show");
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        });
        $("#pgdSubareas").paginado({
            Tabla: $("#tblSubareas"),
            Version: 2,
            Funcion: fn_Subareas
        });
        
    });
    function fn_iniSubareas() {
        fn_Subareas();
        fn_obtenerListas()
        $.matrizAccesos.verificaAcceso({ Elemento: $("#btnSubareas_Agregar"), Url: "/Rol/verificarAcceso", FuncionId: 17 });
    }
    function fn_obtenerListas() {
        $("#slcSubareas_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos" });
    }
    function fn_Subareas(Pagina) {
        var Nombre = $("#txtSubareas_Nombre").val();
        var Departamento = $("#slcSubareas_Departamento option:selected").val();
        var Activo = null;
        if ($("#cbxSubareas_Activo").prop("checked")) {
            Activo = 1;
        }
        var Datos = { Nombre: Nombre, Departamento: Departamento == -1 ? null : Departamento, Activo: Activo == -1 ? null : Activo, Index: Pagina };
        var accesoEditar = "";
        $.matrizAccesos.validaAcceso({ FuncionId: 18 })
            .then(obj => {
                if (obj.result > 0) {
                    accesoEditar = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Editar"><i class="dropdown-icon fas fa-edit"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '</a>';
                }

                var Botones = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fas fa-bars" style="z-index:-99 !important;"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    accesoEditar +
                    '</div></div>'; 7
                $.mostrarInfo({
                    URLindex: "/Subareas/obtenerTotalPagSubarea",
                    URLdatos: "/Subareas/mostrarSubareas",
                    Datos: Datos,
                    Version: 2,
                    Tabla: $("#tblSubareas"),
                    Paginado: $("#pgdSubareas"),
                    Mostrar: function (i, item) {

                        var Activo = '<div class="badge badge-success">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</div>';
                        if (item.Activo == 0) {
                            Activo = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</div>';
                        }                       
                        $("#tblSubareas").find("tbody").append(
                            $('<tr>')
                                .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                                .append($('<td>').append(item.RowNumber))
                                .append($('<td>').append(item.Nombre))
                                .append($('<td>').append(item.Departamento))
                                .append($('<td>').append(Activo))
                                .append($('<td>').append(Botones))
                        );
                    }
                });
            }).catch(err => console.error(err));
        
    }
    function fn_registrar_subarea(Param) {
        var frmDatos = new FormData();
        frmDatos.append("Nombre", $("#txtSubareasN_Nombre").val());
        frmDatos.append("Departamento", $("#slcSubareasN_Departamento option:selected").val());
        if ($("#cbxSubareasN_Activo").prop("checked")) {
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
            url: "/Subareas/registro_Subarea",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlSubareas_Agregar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmSubareasN") });                  
                }
                fn_Subareas();
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_subarea(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtSubareasM_ID").val());
        frmDatos.append("Nombre", $("#txtSubareasM_Nombre").val());
        frmDatos.append("Departamento", $("#slcSubareasM_Departamento option:selected").val());
        if ($("#cbxSubareasM_Activo").prop("checked")) {
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
            url: "/Subareas/actualizar_Subarea",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlSubareas_Modificar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmSubareasM") });                   
                    fn_Subareas();
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