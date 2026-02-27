define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_home
        });
        $("#slcTemplateRunning_Reporte_Versiones").change(function () {
            var valor = $(this).val();
            var ID = $("#txtTemplateRunning_Reporte_ID").val();
            $("#ReporteRunning_url").attr("src", "");
            if (valor != "0") {
                $("#ReporteRunning_url").attr("src", "/Assets/Veriones_A3/" + valor);
            } else {
                var url2 = "/Sistema/verifica_tempate_wp";
                var data2 = { ID: ID };
                $.post(url2, data2).done(function (info) {
                    if (info.Id == "1") {
                        $("#ReporteRunning_url").attr("src", "/Reportes/reporteA3_WP?ID_Template=" + ID + "");
                    } else {
                        $("#ReporteRunning_url").attr("src", "/Reportes/reporteA3?ID_Template=" + ID + "");
                    }
                });
            }
            if (valor == 0) {
                var versionURL = "/Reportes/obtener_version_actual_documento";
                var versionData = { id_template: ID };
                $.post(versionURL, versionData).done(function (version) {
                    fn_obtener_flujo_reporte_A3(ID, version);
                    $("#btnReporteRunning_Firmar").show();
                    $("#btnReporteRunning_Rechazar").show();
                });
            } else {
                var versionURL = "/Reportes/obtener_version_documento";
                var versionData = { id_temnplate: ID, Documento: valor };
                $.post(versionURL, versionData).done(function (version) {
                    fn_obtener_flujo_reporte_A3(ID, version);
                    $("#btnReporteRunning_Firmar").hide();
                    $("#btnReporteRunning_Rechazar").hide();
                });
            }
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnHome_clearFilter').click();
                $('#btnHome_tareas_clearFilter').click();
            }
        });
        $("#txtHome_Folio,#txtHome_Contact,#txtHome_KeyWord").on('keypress', function (e) {
            if (e.which == 13) {
                fn_GetHistoryA3();
            }
        });
        $("#btnHome_Search").click(function () {
            fn_GetHistoryA3();
            $("#slcTestUsuarios").generarLista({ URL: "/Usuarios/Lista_Usuarios" });
            $('#slcTestUsuarios').select2();
        });
        $("#slcHome_status").change(function () {
            fn_GetHistoryA3()
        });
        $("#slcHome_TipoA3").change(function () {
            fn_GetHistoryA3()
        });
        $("#btnHome_clearFilter").click(function () {
            $("#slcHome_status").val("-1");
            $("#slcHome_Line").val("-1");
            $("#slcHome_TipoA3").val("-1");
            $("#slcHome_status").val("-1");
            $("#txtHome_Contact").val(null)
            $("#txtHome_KeyWord").val(null)
            $("#txtHome_fechaInicio").val(null)
            document.getElementById("txtHome_fechaInicio").valueAsDate = null;
            document.getElementById("txtHome_fechafin").valueAsDate = null;
            $("#txtHome_fechafin").val(null)
            $("#slcHome_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3" });
            $("#slcHome_status").generarLista({ URL: "/Home/get_list_status" });
            $("#slcHome_status_tareas").generarLista({ URL: "/Acciones/get_list_status_acciones" });
            $("#slcHome_Line").generarLista({ URL: "/Lineas/Lista_Lineas" });
            $("#slcHome_tareas_responsable").generarLista({ URL: "/Usuarios/Lista_Usuarios" });
            $('#slcHome_tareas_responsable').select2();
            $('#slcHome_status').select2({
                dropdownParent: $('#mdlHome_Filtros')
            });
            $('#slcHome_status_tareas').select2();
            $('#slcHome_TipoA3').select2({
                dropdownParent: $('#mdlHome_Filtros')
            });
            $('#slcHome_Line').select2({
                dropdownParent: $('#mdlHome_Filtros')
            });
            if ($("#cbxHome_Activities").prop("checked")) {
                $.auxFormulario.limpiarCampos({
                    Seccion: $("#frm_home_filter_div"),
                    Excepciones: ['txtHome_Contact','txtHome_Contact_aux'],
                });
            }
            else {
                $.auxFormulario.limpiarCampos({
                    Seccion: $("#frm_home_filter_div"),
                    Excepciones: ['txtHome_Contact', 'txtHome_Contact_aux'],
                });
            }
           
            fn_GetHistoryA3();
        });
        $("#cbxHome_Activities").click(function () {
            if ($("#cbxHome_Activities").prop("checked")) {
                // Lógica para "Mis Reportes"
                $(".txtColumnStatus").show();
                $("#txtHome_Contact").val($("#txtHome_Contact_aux").val());
                $("#cbxHome_Activities_text").text($.CargarIdioma.Obtener_Texto('txt_Idioma_Mis_Reportes'));

                // Actualizamos ambas tablas
                fn_GetHistoryA3();
                fn_get_acciones_preventivas(); // <--- AGREGAR ESTO AQUÍ TAMBIÉN
            } else {
                // Lógica para "Todos los Reportes"
                $(".txtColumnStatus").hide();
                $("#cbxHome_Activities_text").text($.CargarIdioma.Obtener_Texto('txt_Idioma_Todos_Reportes'));
                $("#txtHome_Contact").val(null);

                // Actualizamos ambas tablas
                fn_GetHistoryA3();
                fn_get_acciones_preventivas();
            }
        });
        $("#tblHome_A3History ").on('click', "a[data-registro=Edit]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();

            var yourElement = document.getElementById('btn_redirect_test');
            yourElement.setAttribute('href', '/Sistema/InicioA3?Id_a3=' + ID);


            document.getElementById('btn_redirect_test').click();
        });
        $("#tblHome_A3History table tbody").on("click", "a[data-registro=Report]", function () {
            var id_template = $(this).parents("tr").find("[data-registro=ID]").html();
            var rol = $(this).parents("tr").find("[data-registro=Rol]").html();
            var status_template = $(this).parents("tr").find("[data-registro=status_template]").html();
            //console.log(status_template);
            fn_validar_Evaluador(id_template, rol);
            //if (status_template > 5 && status_template < 9) {
                
            //} else {
            //    $.notiMsj.Notificacion({ Mensaje: "Investigación en curso", Tipo: "info" });              
            //}
        })
        $("#pgdHome_A3History").paginado({
            Tabla: $("#tblHome_A3History"),
            Version: 2,
            Funcion: fn_GetHistoryA3
        });
        $("#tblAdjuntosTemplate_Running").on("click", ".btnVerAdjunto", function () {
            var Archivo = $(this).parents("tr").find(".NomAdjunto").html();
            window.open("/Assets/Adjuntos/" + Archivo, '_blank');
            return false;
        });
        $("#btnHome_new_investigation").click(function () {
            window.location.href = "/Sistema/InicioA3?Id_a3=0"; 
        });
        $("#textReportes").click(function(){
            window.location.href = "/Reportes/PdfA4Example";
        })
        $("#tblTemplatesActivos").on("click", ".btnComenzar", function () {
            var id_template = $(this).parents("tr").find(".idTemplate").html();
            var url = "/Templates/obtenerTemplate";
            $.post(url, data = { ID: id_template }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtTemplatesRunningN_ID").val(item.ID);
                        $("#slcTemplatesRunningN_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3", Seleccion: item.TipoA3 });
                        $("#slcTemplatesRunningN_Usuarios").generarLista({ URL: "/Usuarios/Lista_Usuarios" });
                        $("#slcTemplatesRunningN_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos" });
                        $("#slcTemplatesRunningN_Subarea").generarLista({ URL: "/Subareas/Lista_Subareas" });
                        $("#slcTemplatesRunningN_Linea").generarLista({ URL: "/Lineas/Lista_Lineas" });
                        $("#slcTemplatesRunningN_Equipo").generarLista({ URL: "/Equipos/Lista_Equipos" });
                        fn_obtener_folio_nueva_investigacion();
                        $("#pnlTemplateRunning_Cuadrante_D").hide();
                        $("#tiposA3").hide();
                        $("#pnlInicio_Formulario_Nueva_Investigacion").show();
                        get_configuration_panels(id_template)
                        $("#tblTemplateRunningN_Evaluadores").empty();
                    });
                } else {
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: null });
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        });
        $("#tblHome_A3History table tbody").on("click", "a[data-registro=cancel]", function () {
            var id_template = $(this).parents("tr").find("[data-registro=ID]").html();
            $("#txtTemplateRunning_Reporte_ID").val(id_template);
            $.notiMsj.Confirmacion({
                Tipo: "MD",
                Titulo: "Cancelar Investigación",
                Mensaje: "¿Desea cancelar la investigación?",
                BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                FuncionV: function () {
                    $.firmaElectronica.MostrarFirma({
                        Justificacion: true,
                        Funcion: registrar_firma_Cancelacion_A3
                    });
                }
            });
            
        });
        $("#slcHome_status_tareas").change(function () {
            fn_get_acciones_preventivas();
        });
        $("#slcHome_tareas_responsable").change(function () {
            fn_get_acciones_preventivas();
        });
        $("#slcHome_tareas_linea").change(function () {
            fn_get_acciones_preventivas();
        });
        $("#btnHome_tareas_Search").click(function () {
            fn_get_acciones_preventivas();
        })
        $("#pgdHome_A3_tareas").paginado({
            Tabla: $("#tblHome_A3_acciones_preventivas"),
            Version: 2,
            Funcion: fn_get_acciones_preventivas
        });
        $("#btnHome_tareas_clearFilter").click(function () {
            $("#slcHome_status_tareas").generarLista({ URL: "/Acciones/get_list_status_acciones" });
            $("#slcHome_tareas_responsable").generarLista({ URL: "/Usuarios/Lista_Usuarios" });
            $("#slcHome_tareas_responsable").select2();
            $("#slcHome_tareas_linea").generarLista({ URL: "/Lineas/Lista_Lineas" });
            $("#slcHome_tareas_linea").select2();
            $("#slcHome_status_tareas").select2();
            $("#txtHome_Folio_tareas").val(null)
            $("#slcHome_tareas_responsable").val(-1)
            $("#slcHome_status_tareas").val(-1)

            fn_get_acciones_preventivas();
        })
        $("#tblHome_A3_acciones_preventivas").on('click', "a[data-registro=Edit_Review]", function () {
            var id_accion = $(this).parents("tr").find("[data-registro=id_accion]").html();
            var estatus = $(this).parents("tr").find("[data-registro=status]").html();
            fn_get_accion_preventiva(id_accion);
            fn_get_adjuntos_actividades_preventivas(id_accion);
            $("#txtAP_comentarios").attr("disabled", "disabled");
            $("#pnlAP_atachments").hide();
            $("#btnAP_finalizar").hide();
            if (estatus == "7") {
                $("#btnAp_aprobar").hide();
            } else {
                $("#btnAp_aprobar").show();
            }
           

        });
        $("#tblHome_A3_acciones_preventivas").on('click', "a[data-registro=Edit]", function () {
            var id_accion = $(this).parents("tr").find("[data-registro=id_accion]").html();
            var estatus = $(this).parents("tr").find("[data-registro=status]").html();
            if (estatus != "6" && estatus != "7" && estatus != "10") {
                fn_get_accion_preventiva(id_accion);
                fn_get_adjuntos_actividades_preventivas(id_accion);
                $("#txtAP_comentarios").removeAttr("disabled", "disabled");
                $("#pnlAP_atachments").show();
                $("#btnAP_finalizar").show();
                $("#btnAp_aprobar").hide();
            } else {
                $.notiMsj.Confirmacion({
                    Tipo: "MD",
                    Titulo: "Re-abrir Actividad",
                    Mensaje: "¿Desea re-abrir la actividad?. Esta acción reiniciara el flujo de aprobación",
                    BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                    BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                    FuncionV: function () {
                        fn_update_estatus_actividad_preventivas(id_accion, 9);
                        fn_get_accion_preventiva(id_accion);
                        fn_get_adjuntos_actividades_preventivas(id_accion);
                        $("#txtAP_comentarios").removeAttr("disabled", "disabled");
                        $("#pnlAP_atachments").show();
                        $("#btnAP_finalizar").show();
                        $("#btnAp_aprobar").hide()
                       
                    }
                });
            } 
        });
        $("#btnAdjuntos_Item_agregar").click(function () {
            var id_actividad = $("#txtAP_id").val();
            fn_insert_adjunto_actividades_preventivas(id_actividad);
        });
        $("#btnAP_finalizar").click(function () {
            var id_actividad = $("#txtAP_id").val();
            var comentarios = $("#txtAP_comentarios").val();
            if (comentarios != "") {
                $.notiMsj.Confirmacion({
                    Tipo: "MD",
                    Titulo: "Finalizar Actividad",
                    Mensaje: "¿Desea finalizar la actividad?",
                    BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                    BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                    FuncionV: function () {
                        fn_finalizar_actividades_preventivas(id_actividad, comentarios);
                    }
                });
            } else {
                $.notiMsj.Notificacion({ Mensaje: "Por favor, ingrese la información correspondiente", Tipo: "info" });
            }
        });
        $("#tblHome_A3_acciones_preventivas tbody").on("click", "a[data-registro=Report]", function () {
            var id_template = $(this).parents("tr").find("[data-registro=id_template]").html();
            var rol = $(this).parents("tr").find("[data-registro=Rol]").html();
            var status_template = $(this).parents("tr").find("[data-registro=status_template]").html();
            //console.log(status_template);
            fn_validar_Evaluador(id_template, rol);
            //if (status_template > 5 && status_template < 9) {
                
            //} else {
            //    $.notiMsj.Notificacion({ Mensaje: "Investigación en curso", Tipo: "info" });
            //}
        })
        $("#btnAp_aprobar").click(function () {
            $.firmaElectronica.MostrarFirma({
                Justificacion: false,
                Funcion: registrar_firma_aprobacion_actividad_preventiva
            });
        });
        $("#tblHome_A3_acciones_preventivas").on('click', "a[data-registro=Cancel]", function () {
            var id_accion = $(this).parents("tr").find("[data-registro=id_accion]").html();
            $("#txtAP_id").val(id_accion);
            $.firmaElectronica.MostrarFirma({
                Justificacion: false,
                Funcion: fn_cancelar_actividad_preventiva
            });
        });
        $("#btnHome_Filters").click(function () {
            $("#mdlHome_Filtros").modal("show");
        });
        $("#btnMdlHome_Filtros_Aplicar").click(function () {
            $("#mdlHome_Filtros").modal("hide");
            fn_GetHistoryA3();
            
        });

    });
    function fn_cancelar_actividad_preventiva(param) {
        var id_actividad = $("#txtAP_id").val();
        if (id_actividad != "") {
            var frmDatos = new FormData();
            frmDatos.append("id_actividad", id_actividad);
            frmDatos.append("BYTOST", param.BYTOST);
            frmDatos.append("ZNACKA", param.ZNACKA);
            $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
            $.ajax({
                type: "POST",
                url: "/Acciones/_cancelar_actividad_preventiva",
                contentType: false,
                processData: false,
                data: frmDatos,
                success: function (res) {
                    if (res.Tipo == "success") {
                        $("#mdlHome_acciones_preventivas").modal("hide");
                        $("#mdlSistema_FirmaElectronica").modal("hide");
                        $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                        fn_get_acciones_preventivas();
                    }
                    $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                    $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                },
                error: function (error) {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
                }
            });
        }
    }
    function registrar_firma_aprobacion_actividad_preventiva(param) {
        var id_actividad = $("#txtAP_id").val();
        if (id_actividad != "") {
            var frmDatos = new FormData();
            frmDatos.append("id_actividad", id_actividad);
            frmDatos.append("BYTOST", param.BYTOST);
            frmDatos.append("ZNACKA", param.ZNACKA);
            $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
            $.ajax({
                type: "POST",
                url: "/Acciones/aprobar_actividad_preventiva",
                contentType: false,
                processData: false,
                data: frmDatos,
                success: function (res) {
                    if (res.Tipo == "success") {
                        $("#mdlHome_acciones_preventivas").modal("hide");
                        $("#mdlSistema_FirmaElectronica").modal("hide");
                        $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                        fn_get_acciones_preventivas();
                    }
                    $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                    $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                },
                error: function (error) {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
                }
            });
        }
    }
    function fn_update_estatus_actividad_preventivas(id_actividad, estatus) {
        var frmDatos = new FormData();
        frmDatos.append("id_actividad", id_actividad);
        frmDatos.append("estatus", estatus);
        $.ajax({
            type: "POST",
            url: "/Acciones/update_estatus_actividad_preventiva",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {

                }
                fn_get_acciones_preventivas();
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#btnAP_finalizar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });

    }
    function fn_finalizar_actividades_preventivas(id_actividad, comentarios) {
        var id_actividad = $("#txtAP_id").val();
        if (id_actividad != "") {
            var frmDatos = new FormData();
            frmDatos.append("id_actividad", id_actividad);
            frmDatos.append("comentarios", comentarios);
            $("#btnAP_finalizar").addClass("btn-progress");
            $.ajax({
                type: "POST",
                url: "/Acciones/update_actividad_preventiva",
                contentType: false,
                processData: false,
                data: frmDatos,
                success: function (res) {
                    if (res.Tipo == "success") {
                        $("#mdlHome_acciones_preventivas").modal("hide");                        
                    }
                    fn_get_acciones_preventivas();
                    $("#btnAP_finalizar").removeClass("btn-progress");
                    $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                },
                error: function (error) {
                    $("#btnAP_finalizar").removeClass("btn-progress");
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
                }
            });
        }

    }
    function fn_insert_adjunto_actividades_preventivas(id_actividad) {
        var frmDatos = new FormData();
        frmDatos.append("id_actividad", id_actividad);
        frmDatos.append("file", ($("#txtAdjuntos_Item_Archivo"))[0].files[0]);
        $("#btnAdjuntos_Item_agregar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Acciones/insert_adjjunto_actividades_preventivas",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {

                }
                fn_get_adjuntos_actividades_preventivas(id_actividad);
                $("#btnAdjuntos_Item_agregar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_get_adjuntos_actividades_preventivas(id_actividad) {
        var url = "/Acciones/get_adjuntos_actividades_preventivas";
        var post_data = { id_actividad: id_actividad };
        var visualizar = ''
        $.post(url, post_data).done(function (resutl) {
            $("#tblHome_A3_acciones_preventivas_atachments tbody").empty();
            if (resutl != "") {
                $.each(resutl, function (i, item) {
                    $("#tblHome_A3_acciones_preventivas_atachments tbody").append(
                        $('<tr>')
                            .append($('<td style="display:none;" data-registro="id_adjunto" class="NomAdjunto">').append(item.id_adjunto))
                            .append($('<td style="display:none;" data-registro="id_actividad" class="NomAdjunto">').append(item.id_actividad))
                            .append($('<td>').append(item.nombre_archivo))
                            .append($('<td>').append(item.fecha_creacion))
                            .append($('<td class="text-center">').append('<a class="btn btn-icon btn-light" href="/Assets/Adjuntos/Actividades_Preventivas/' + item.stream_archivo + '" target="_blank" ><i class="fa fa-print"></i></a>'))
                    );
                });
            }
        }).fail(function (error) {
            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
        });
    }
    function registrar_firma_Cancelacion_A3(param) {
        var ID_Template = $("#txtTemplateRunning_Reporte_ID").val();
        if (ID_Template != "") {
            var frmDatos = new FormData();
            frmDatos.append("id_template", ID_Template);
            frmDatos.append("BYTOST", param.BYTOST);
            frmDatos.append("ZNACKA", param.ZNACKA);
            $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
            $.ajax({
                type: "POST",
                url: "/Reportes/registrar_firma_cancelar_A3",
                contentType: false,
                processData: false,
                data: frmDatos,
                success: function (res) {
                    if (res.Tipo == "success") {
                        $("#mdlSistema_FirmaElectronica").modal("hide");
                        $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                        $("#txtTemplateRunning_Reporte_ID").val(null);
                        fn_GetHistoryA3();
                    }
                    $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                    $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                },
                error: function (error) {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
                }
            });
        }
        
    }
    function registrar_firma_Aprobacion_A3(param) {
        var ID_Template = $("#txtTemplateRunning_Reporte_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("id_template", ID_Template);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Reportes/registrar_firma_aprobar_A3",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_obtener_flujo_reporte_A3(ID_Template, res.Id);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function registrar_firma_Rechazar_Aprobacion_A3(Param) {
        var ID_Template = $("#txtTemplateRunning_Reporte_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("id_template", ID_Template);
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        frmDatos.append("ZMYSEL", Param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Reportes/registrar_firma_rechazar_A3",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    $("#mdlReporte_RechazoPnl").modal("hide");
                    fn_obtener_flujo_reporte_A3(ID_Template, res.Id);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtener_flujo_reporte_A3(Template_ID, Template_Version) {
        var frmDatos = new FormData();
        frmDatos.append("id_template", Template_ID);
        frmDatos.append("version_template", Template_Version);
        $("#tblTemplateR_Estatus_Revisores").empty();
        $.ajax({
            type: "POST",
            url: "/Reportes/obtener_firmas_reporte_A3",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                $.each(res, function (i, item) {
                    let RazonFirma = item.Razon;
                    let SignificadoFirma;
                    let imgFirma = '<img height="25" width="25" src="/Assets/img/Estatus_Firmas/Pending_Sign.png" />'
                    if (RazonFirma == "1") { SignificadoFirma = $.CargarIdioma.Obtener_Texto('txt_Idioma_Reporte_Dueno'); }
                    else if (RazonFirma == "2") { SignificadoFirma = $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisor'); }
                    else if (RazonFirma == "3") { SignificadoFirma = $.CargarIdioma.Obtener_Texto('txt_Idioma_Aprovador'); }
                    if (item.Estatus == "0") {
                        imgFirma = '<img height="25" width="25" src="/Assets/img/Estatus_Firmas/icons8-data-pending-28.png"  />'
                    } else if (item.Estatus == "1") {
                        imgFirma = '<img height="25" width="25"  src="/Assets/img/Estatus_Firmas/icons8-eye-28.png" />'
                    } else if (item.Estatus == "2") {
                        imgFirma = '<img  height="25" width="25"  src="/Assets/img/Estatus_Firmas/icons8-cancel-28.png" />'
                    } else if (item.Estatus == "3") {
                        imgFirma = '<img height="25" width="25"  src="/Assets/img/Estatus_Firmas/icons8-checked-28.png" />'
                    }
                    $("#tblTemplateR_Estatus_Revisores").append(
                        $('<tr>')
                            .append($('<td>').append(item.Usuario))
                            .append($('<td class="text-center">').append(SignificadoFirma))
                            .append($('<td class="text-center">').append(imgFirma))
                            .append($('<td>').append(item.Comentarios))
                    );
                });
                // $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_validar_Evaluador(id_template, rol) {
        resetearInterfaz(id_template);

        $("#mdlReporteA3_Panel").modal("show");

        // Obtener y establecer la URL del reporte
        obtenerUrlReporte(id_template);

        // Obtener versión del documento y flujo
        let valorSeleccionado = $('#slcTemplateRunning_Reporte_Versiones option:selected').val();
        if (valorSeleccionado === "value" || valorSeleccionado === "0") {
            obtenerVersionActual(id_template);
        } else {
            obtenerVersionDocumento(id_template, valorSeleccionado);
        }

        // Obtener adjuntos y versiones del template
        fn_obtener_Adjuntos_Template(id_template);
        fn_obtener_versiones(id_template);

        // Validar firma del evaluador
        validarFirmaEvaluador(id_template);
    }
    function resetearInterfaz(id_template) {
        $("#ReporteRunning_url").attr("src", "");
        $("#btnReporteRunning_Firmar, #btnReporteRunning_Rechazar").hide();
        $("#txtTemplateRunning_Reporte_Tipo_Firma").val("N/A");
        $("#txtTemplateRunning_Reporte_ID").val(id_template);
        $("#pnl_firma_reporte_template").hide();
    }
    function obtenerUrlReporte(id_template) {
        const url = "/Reportes/validar_template_WP_id";
        const $reporteUrl = $("#ReporteRunning_url");
        const $spinner = $("#pdfLoader");

        // Mostrar el spinner y limpiar la URL actual
        $spinner.show();
        $reporteUrl.attr("src", "").off("load"); // Limpia eventos previos en el iframe

        $.post(url, { ID: id_template }).done(function (info) {
            const reporteUrl = info.Id === "1"
                ? `/Reportes/reporteA3_WP?ID_Template=${id_template}`
                : `/Reportes/reporteA3?ID_Template=${id_template}`;

            // Cuando el iframe termine de cargar, ocultar el spinner
            $reporteUrl.on("load", function () {
                $spinner.hide();
            });

            // Establecer la URL en el iframe
            $reporteUrl.attr("src", reporteUrl);
        });
    }
    function obtenerVersionActual(id_template) {
        const url = "/Reportes/obtener_version_actual_documento";
        $.post(url, { id_template }).done(function (versionAct) {
            fn_obtener_flujo_reporte_A3(id_template, versionAct);
        });
    }
    function obtenerVersionDocumento(id_template, documento) {
        const url = "/Reportes/obtener_version_documento";
        $.post(url, { id_template, documento }).done(function (version) {
            fn_obtener_flujo_reporte_A3(id_template, version);
            $("#btnReporteRunning_Firmar, #btnReporteRunning_Rechazar").hide();
        });
    }
    function validarFirmaEvaluador(id_template) {
        const url = "/Reportes/valida_firma_Evaluador";
        $.post(url, { ID: id_template }).done(function (info) {
            if (info && info.length > 0) {
                let tipoFirma = info[0].Rol === "1"
                    ? $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisor')
                    : $.CargarIdioma.Obtener_Texto('txt_Idioma_Aprovador');

                $("#txtTemplateRunning_Reporte_Tipo_Firma").val(tipoFirma);
            }
        });
    }
    //function fn_validar_Evaluador(id_template, rol) {
    //    var url = "/Reportes/valida_firma_Evaluador";
    //    var data = { ID: id_template };
    //    var Tipo;
    //    $("#ReporteRunning_url").attr("src", "");
    //    $("#btnReporteRunning_Firmar").hide();
    //    $("#btnReporteRunning_Rechazar").hide();
    //    $("#txtTemplateRunning_Reporte_Tipo_Firma").val("N/A");
    //    $("#txtTemplateRunning_Reporte_ID").val(id_template);
    //    $("#pnl_firma_reporte_template").hide();

    //    //if (rol == "None" || rol == "Executer") {
    //    //    $("#pnl_firma_reporte_template").hide();
    //    //    $("#btnReporteRunning_Firmar").hide();
    //    //} else {
    //    //    $("#txtTemplateRunning_Reporte_Tipo_Firma").val(rol);
    //    //    $("#btnReporteRunning_Firmar").show();
    //    //    $("#btnReporteRunning_Rechazar").show();
    //    //    $("#txtTemplatesRunningN_ID").val(id_template);
    //    //}
    //    //console.log(rol);
    //    $("#mdlReporteA3_Panel").modal("show");
    //    var url2 = "/Reportes/validar_template_WP_id";
    //    var data2 = { ID: id_template };
    //    $.post(url2, data2).done(function (info) {
    //        if (info.Id == "1") {
    //            $("#ReporteRunning_url").attr("src", "/Reportes/reporteA3_WP?ID_Template=" + id_template + "");
    //        } else {
    //            $("#ReporteRunning_url").attr("src", "/Reportes/reporteA3?ID_Template=" + id_template + "");
    //        }
    //    });
    //    let valor = $('#slcTemplateRunning_Reporte_Versiones option:selected').val();
    //    if (valor == "value" || valor == "0") {
    //        var versionActURL = "/Reportes/obtener_version_actual_documento";
    //        var versionActData = { id_template: id_template };
    //        $.post(versionActURL, versionActData).done(function (versionAct) {
    //            fn_obtener_flujo_reporte_A3(id_template, versionAct);
    //            //$("#btnReporteRunning_Firmar").show();
    //            //$("#btnReporteRunning_Rechazar").show();
    //        });
    //    } else {
    //        var versionURL = "/Reportes/obtener_version_documento";
    //        var versionData = { id_template: id_template, documento: valor };
    //        $.post(versionURL, versionData).done(function (version) {
    //            fn_obtener_flujo_reporte_A3(id_template, version);
    //            $("#btnReporteRunning_Firmar").hide();
    //            $("#btnReporteRunning_Rechazar").hide();
    //        });
    //    }
    //    fn_obtener_Adjuntos_Template(id_template);
    //    fn_obtener_versiones(id_template);

    //    $.post(url, data).done(function (info) {
    //        if (info != "") {
    //            $.each(info, function (i, item) {
    //                if (item.Rol == "1") {
    //                    Tipo = $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisor');
    //                } else {
    //                    Tipo = $.CargarIdioma.Obtener_Texto('txt_Idioma_Aprovador');
    //                }
                    
    //            });
    //        } else {
                
                
    //        }
            
    //    });
    //}
    function get_configuration_panels(id_template) {
        var url = "/Templates/get_configuration_panels";
        var frmDatos = new FormData();
        frmDatos.append("id_template", id_template);
        $.ajax({
            type: "POST",
            url: url,
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (result) {
                $("#pnlTemplateRunning_Cuadrante_D").hide();
                $("#tiposA3").hide();
                $("#pnlInicio_Formulario_Nueva_Investigacion").hide();
                $("#pnlTemplate_failure_mode").hide();
                $("#plnTemplate_PmCard").hide();
                console.log(result);
                $.each(result, function (i, item) {
                    $("#" + item.label_panel + "").show();
                })           
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtener_Adjuntos_TemplateRunning_Cuadrante_ID(ID) {
        var url = "/Sistema/obtener_Adjuntos_TemplateRunning_Cuadrante_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            var Imprimir = '<button class="btn btn-icon btn-success btnVerAdjunto" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-print"></i></button>';
            $.each(Data, function (i, item) {
                $("#tblAdjuntosTemplate_Running").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="NomAdjunto">').append(item.Nombre))
                        /*.append($('<td>').append(item.Nombre))*/
                        .append($('<td>').append(item.Tipo))
                        .append($('<td>').append(item.Item))
                        .append($('<td>').append(item.Seccion))
                        .append($('<td> ').append(item.Cuadrante))
                        .append($('<td>').append(Imprimir))
                );
            });
        });
    }
    function fn_obtener_Adjuntos_Template(ID) {
        var url = "/Sistema/obtener_Adjuntos_TemplateRunning_ID";
        var data = { ID: ID };
        $("#tblAdjuntosTemplate_Running").empty();
        $.post(url, data).done(function (Data) {
            var Imprimir = '<button class="btn btn-icon btn-success btnVerAdjunto" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-print"></i></button>';
            $.each(Data, function (i, item) {
                $("#tblAdjuntosTemplate_Running").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="NomAdjunto">').append(item.Nombre))
                        /*.append($('<td>').append(item.Nombre))*/
                        .append($('<td>').append(item.Tipo))
                        .append($('<td>').append(item.Item))
                        .append($('<td>').append(item.Seccion))
                        .append($('<td>').append(item.Cuadrante))
                        .append($('<td>').append(Imprimir))
                );
            });
            fn_obtener_Adjuntos_TemplateRunning_Cuadrante_ID(ID);
        });
    }
    function fn_obtener_versiones(ID) {
        var url = "/Sistema/obtener_versiones_template_id";
        var data = { ID: ID };
        $("#slcTemplateRunning_Reporte_Versiones").empty();
        $.post(url, data).done(function (info) {
            $("#slcTemplateRunning_Reporte_Versiones").append('<option selected value="0">Version Actual</option>')
            $.each(info, function (i, item) {
                $("#slcTemplateRunning_Reporte_Versiones").append('<option value="' + item.Descripcion + '">Version ' + item.Version + '</option>');
            });
        })
    }
    function fn_home() {
        $("#slcHome_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3" });
        $("#slcHome_status").generarLista({ URL: "/Home/get_list_status" });
        $("#slcHome_status_tareas").generarLista({ URL: "/Acciones/get_list_status_acciones" });
        $("#slcHome_Line").generarLista({ URL: "/Lineas/Lista_Lineas" });
        $("#slcHome_tareas_linea").generarLista({ URL: "/Lineas/Lista_Lineas" });
        $("#slcHome_tareas_responsable").generarLista({ URL: "/Usuarios/Lista_Usuarios" });
        $('#slcHome_tareas_responsable').select2();
        $('#slcHome_tareas_linea').select2();
        $('#slcHome_status').select2({
            dropdownParent: $('#mdlHome_Filtros')
        });
        $('#slcHome_status_tareas').select2();
        $('#slcHome_TipoA3').select2({
            dropdownParent: $('#mdlHome_Filtros')
        });
        $('#slcHome_Line').select2({
            dropdownParent: $('#mdlHome_Filtros')
        });

        fn_GetHistoryA3();
        fn_get_acciones_preventivas();
    }
    function fn_obtener_folio_nueva_investigacion() {
        var url = "/Templates/obtener_siguiente_folio";
        $.get(url).done(function (folio) {
            $("#txtTemplatesRunningN_Folio").val(folio);
        });
        $("#txtTemplatesRunningN_Problem").val(null);
        $("#txtTemplatesRunningN_Cost").val(null);
        //$("#mdlTemplatesRunning_Agregar").modal("show");
    }
    function fn_GetHistoryA3(Pagina) {
        var Fecha1 = $("#txtHome_fechaInicio").val();
        var Fecha2 = $("#txtHome_fechafin").val();
        var Folio = $("#txtHome_Folio").val();
        var TipoA3 = $("#slcHome_TipoA3 option:selected").text();
        var Contact = $("#txtHome_Contact").val();
        var PalabraClave = $("#txtHome_KeyWord").val();
        var Estatus = $("#slcHome_status option:selected").text();
        var Linea = $("#slcHome_Line option:selected").text();
        var gbl_rol_id = $("#txtGbl_rol_id").val();
        var CWID_Logged = null;
        var CWID = $("#txtHome_Contact").val(); 
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione')) { Estatus = null; } else { Estatus = $("#slcHome_status option:selected").val(); }
        if (Folio == "") { Folio = null; }
        if (TipoA3 == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione') || TipoA3 == "Seleccione") { TipoA3 = null; }
        if (Linea == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione') || TipoA3 == "Seleccione") { Linea = null; }
        if (Contact == "") { Contact = null; }
        if (PalabraClave == "") { PalabraClave = null; }
        if ($("#cbxHome_Activities").prop("checked")) {
            CWID_Logged = $("#txtHome_Contact_aux").val();
        }
        if (Fecha1 == null && Fecha2 != null ) {
            Fecha1 = Fecha2
        } else if (Fecha1 != null && Fecha2 == null) {
            Fecha2 = Fecha1
        }
        // , , CWID_Logged, , ID_Language,
        var Datos = { Fecha1: Fecha1, Fecha2: Fecha2, Linea: Linea, Folio: Folio, TipoA3: TipoA3, CWID: CWID, CWID_Logged: CWID_Logged, Estatus: Estatus, PalabraClave: PalabraClave, Index: Pagina };
        var rol = 3
        console.log("Rol -> " + gbl_rol_id);
        $.mostrarInfo({
            URLindex: "/Home/obtener_TotalPag_BandejaA3",
            URLdatos: "/Home/obtenerRegistros_BandejaA3",
            Datos: Datos,
            Version: 2,
            Tabla: $("#tblHome_A3History"),
            Paginado: $("#pgdHome_A3History"),
            Mostrar: function (i, item) {
                var btn_continue_a3 = "";
                var btn_cancel_a3 = "";
                var btn_report_a3 = "";
                var user_rol = item.Rol;
                var status_template = item.Estatus_Id;
                var badge_color = "";
                switch (status_template) {
                    case 6:
                        badge_color = "warning"
                        break;
                    case 9:
                        badge_color = "primary"
                        break;
                    case 8:
                        badge_color = "danger"
                        break;
                    case 10:
                        badge_color = "danger"
                        break;
                    case 7:
                        badge_color = "success"
                        break;
                    default:
                        badge_color = "secondary"
                }
                var badge_Status_a3 = '<span class="badge text-bg-' + badge_color + '">' + item.EstatusA3 + '</span>';
                var badge_Status = ''
                if (status_template != 10) {
                    btn_report_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Report"><i class="dropdown-icon far fa-file-pdf"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_ReporteA3') + '</a>';
                    if (item.Rol == "Executer" || gbl_rol_id == "1") {
                        btn_cancel_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="cancel"><i class="dropdown-icon far fa-circle-xmark"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar') + '</a>';
                        //'<a href="javascript:void(0)" class="dropdown-item" data-registro="cancel"><i class="dropdown-icon fa-solid fa-file-circle-xmark"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar') + '</a>';
                        switch (status_template) {
                            case 6:
                                btn_continue_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit"><i class="dropdown-icon far fa-folder-open"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_reabrir_investigacion_opcion') + '</a>';
                                break
                            case 7:
                                btn_continue_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit"><i class="dropdown-icon far fa-folder-open"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_reabrir_investigacion_opcion') + '</a>';
                                break;
                            default:
                                btn_continue_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit"><i class="dropdown-icon fas fa-edit"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Continuar_Investigacion') + '</a>';
                        }
                    }
                    if (user_rol == "Reviewer" || user_rol == "Aprover" || gbl_rol_id == "1") {
                        if (status_template == 6) {
                            btn_continue_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit"><i class="dropdown-icon far fa-circle-check"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisar_Investigacion') + '</a>'
                        }
                    }
                }
                if ($("#cbxHome_Activities").prop("checked")) {
                    badge_Status = $('<td class="text-center txtColumnStatus">').append('<span style="display:block" class="badge text-bg-primary">' + item.Estatus + '</span>')
                } else {
                    badge_Status = $('<td style="display:none" class="text-center txtColumnStatus">').append('<span  class="badge text-bg-primary">' + item.Estatus + '</span>')
                }
                var Rol = '<div class="badge badge-light">' + item.Rol + '</div>';            
                var btn_group_options = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fa-solid fa-list-ul"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    btn_continue_a3 +
                    btn_report_a3 +
                    btn_cancel_a3 +
                    '</div></div>';

                $("#tblHome_A3History").find("tbody").append(
                    $('<tr>')
                        .append($('<td data-registro="ID" style="display:none">').append(item.Folio))
                        .append($('<td data-registro="Rol" style="display:none">').append(item.Rol))
                        .append($('<td style="display:none;" data-registro="status_template" class="estatusTemplateRunning">').append(item.Estatus))
                        .append($('<td class="text-center">').append(item.Folio))
                        .append($('<td class="text-center">').append(item.FechaInicio))
                        .append($('<td class="text-center">').append(item.Version))
                        .append($('<td class="text-center">').append(item.Tipo))
                        .append($('<td class="text-justify">').append(item.Problema))
                        .append($('<td class="text-center">').append(item.Owner))
                        .append($('<td>').append(item.Lineas))
                        //.append($('<td>').append(Rol))
                        .append($('<td class="text-center">').append(badge_Status_a3))
                        .append(badge_Status)
                        .append($('<td class="text-center">').append(btn_group_options))
                );
            }
        });
    }
    function fn_get_accion_preventiva(id_accion) {
        const url = "/Acciones/get_accion_preventiva";
        var post_data = { id_accion: id_accion };
        $.post(url, post_data).done(function (result) {
            if (result != "") {
                $.each(result, function (i, item) {
                    $("#txtAP_id").val(item.ID)
                    $("#txtAP_text").val(item.Descripcion)
                    $("#txtAP_fecha_creacion").val(item.fecha_ini)
                    $("#txtAP_fecha_compromiso").val(item.Fecha)
                    $("#txtAP_responsable").val(item.Responsable)
                    $("#txtAP_comentarios").val(item.comentarios)
                })
            }
            $("#mdlHome_acciones_preventivas").modal("show");
        }).fail(function (error) {
            $.notiMsj.Notificacion({ Mensaje: "Error", Tipo: "warning", Error: error });
        });
    }
    function fn_get_acciones_preventivas(Pagina) {

        var Folio = $("#txtHome_Folio_tareas").val();
        var estatus = $("#slcHome_status_tareas option:selected").val();
        var responsable = $("#slcHome_tareas_responsable option:selected").val();
        var linea = $("#slcHome_tareas_linea option:selected").text();
        // Obtenemos el ID del usuario logueado
        var id_usuario_logueado = $("#txtHome_Contact_id_usuario").val();

        // Lógica de "Mis Reportes" vs "Todos"
        var id_usuario_filtro = null;
        if ($("#cbxHome_Activities").prop("checked")) {
            id_usuario_filtro = id_usuario_logueado;
        }

        // Limpieza
        if (Folio == "") { Folio = null; }
        if (estatus == "-1") { estatus = null; }
        if (responsable == "-1") { responsable = null; }
        if (linea == "-1" || linea == "" || linea =="Seleccione") { linea = null; }

        var Datos = {
            id_template: Folio,
            id_usuario: id_usuario_filtro,
            responsable: responsable,
            estatus: estatus,
            linea: linea,
            Index: Pagina
        };

        $.mostrarInfo({
            URLindex: "/Acciones/get_TotalPag_acciones_preventivas",
            URLdatos: "/Acciones/obtener_acciones_preventivas",
            Datos: Datos,
            Version: 2,
            Tabla: $("#tblHome_A3_acciones_preventivas"),
            Paginado: $("#pgdHome_A3_tareas"),
            Mostrar: function (i, item) {

                var btn_edit_Activity = "";
                var btn_cancel_Activity = "";
                var btn_review_Activity = ""; // Separamos el botón de revisión
                var btn_report_a3 = "";

                var status_accion = item.Estatus;

                // --- NUEVA LÓGICA DE ROLES (ADITIVA) ---
                // Comparamos IDs en lugar de usar el texto "Rol"
                // Usamos '==' para que no importe si uno es string y otro int
                var isEjecutor = (item.Responsable_ID == id_usuario_logueado);
                var isRevisor = (item.AsignadoPor_ID == id_usuario_logueado);

                // NOTA: Si quieres que un Super Admin (Rol 1) tenga permisos de todo, agrega:
                // var isSuperAdmin = $("#txtGbl_rol_id").val() == "1";
                // if(isSuperAdmin) { isEjecutor = true; isRevisor = true; }

                // 1. Botones para EJECUTOR
                if (isEjecutor) {
                    // Puede editar si no está cerrado (7), borrado (10) o en revisión (6)
                    if (status_accion != "7" && status_accion != "10" && status_accion != "6") {
                        btn_edit_Activity = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit"><i class="dropdown-icon fas fa-edit"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '</a>';
                    }
                }

                // 2. Botones para REVISOR
                if (isRevisor) {
                    // Solo aprueba si el estatus es 6 (En revisión)
                    if (status_accion == "6") {
                        btn_review_Activity = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit_Review"><i class="dropdown-icon far fa-circle-check"></i> ' + $.CargarIdioma.Obtener_Texto('txt_idioma_Revisar') + '</a>';
                    }

                    // Puede cancelar si no está finalizado o borrado
                    if (status_accion != "7" && status_accion != "10") {
                        btn_cancel_Activity = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Cancel"><i class="dropdown-icon far fa-circle-xmark"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar') + '</a>';
                    }
                }

                // Botón común (Reporte)
                btn_report_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Report"><i class="dropdown-icon far fa-file-pdf"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_ReporteA3') + '</a>';

                // Colores del Badge
                var badge_color = "secondary";
                switch (status_accion) {
                    case "1": badge_color = "secondary"; break;
                    case "6": badge_color = "warning"; break;
                    case "9": badge_color = "primary"; break;
                    case "8": badge_color = "danger"; break;
                    case "10": badge_color = "danger"; break;
                    case "7": badge_color = "success"; break;
                }
                var badge_Status = '<span class="badge text-bg-' + badge_color + '">' + item.estatus_text + '</span>';

                // Armamos el menú con TODAS las opciones disponibles
                var btn_group_options = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fa-solid fa-list-ul"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    btn_edit_Activity +   // Opción de Ejecutor
                    btn_review_Activity + // Opción de Revisor (Aprobar)
                    btn_cancel_Activity + // Opción de Revisor (Cancelar)
                    btn_report_a3 +       // Opción Común
                    '</div></div>';

                $("#tblHome_A3_acciones_preventivas").find("tbody").append(
                    $('<tr>')
                        .append($('<td data-registro="id_accion" style="display:none">').append(item.ID))
                        .append($('<td data-registro="Rol" style="display:none">').append(item.Rol)) // Mantenemos esto por si acaso, aunque ya no lo usamos para lógica
                        .append($('<td style="display:none;" data-registro="status">').append(item.Estatus))
                        .append($('<td class="text-center">').append(item.RowNumber))
                        .append($('<td data-registro="id_template" class="text-center">').append(item.id_template))
                        .append($('<td>').append(item.Descripcion))
                        .append($('<td class="text-center">').append(item.fecha_ini))
                        .append($('<td class="text-center">').append(item.Fecha))
                        .append($('<td class="text-center">').append(item.Responsable))
                        .append($('<td class="text-center">').append(item.asignado_por))
                        .append($('<td class="text-center">').append(item.Linea))
                        .append($('<td class="text-center">').append(badge_Status))
                        .append($('<td class="text-center">').append(btn_group_options))
                );
            }
        });
    }
});