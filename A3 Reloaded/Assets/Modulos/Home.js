define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_home
        });
        $("#btnReporteRunning_Firmar").click(function () {

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
                $("#txtHome_Contact").val($("#txtHome_Contact_aux").val());
                fn_GetHistoryA3()
                $("#cbxHome_Activities_text").text($.CargarIdioma.Obtener_Texto('txt_Idioma_Mis_Reportes'))           
            } else {
                $("#cbxHome_Activities_text").text($.CargarIdioma.Obtener_Texto('txt_Idioma_Todos_Reportes'))
                $("#txtHome_Contact").val(null);
                fn_GetHistoryA3()
            }
        });
        $("#tblHome_A3History ").on('click', "a[data-registro=Edit]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();

            var yourElement = document.getElementById('btn_redirect_test');
            yourElement.setAttribute('href', '/Sistema/InicioA3?Id_a3=' + ID);


            document.getElementById('btn_redirect_test').click();
        });
        $("#tblHome_A3History table tbody").on("click", "a[data-registro=Report]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            var rol = $(this).parents("tr").find("[data-registro=Rol]").html();
            fn_validar_Evaluador(ID, rol);
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
            //var yourElement = document.getElementById('btnHome_new_investigation');
            //yourElement.setAttribute('href', '');

            //fn_cargaTiposA3()
            //$("#mdlHome_new_investigation").modal("show");
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

    });
    function registrar_firma_Aprobacion_A3(param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("Template", ID_Template);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_firma_aprobar_A3",
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
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("Template", ID_Template);
        frmDatos.append("Comentarios", $("#txtMdlComments_Comentarios").val());
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_firma_Rechazar_Aprobar_A3",
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
    function fn_validar_Evaluador(ID, rol) {
        var url = "/Reportes/valida_firma_Evaluador";
        var data = { ID: ID };
        var Tipo;
        $("#ReporteRunning_url").attr("src", "");
        $("#btnReporteRunning_Firmar").hide();
        $("#btnReporteRunning_Rechazar").hide();
        $("#txtTemplateRunning_Reporte_Tipo_Firma").val("N/A");
        $("#txtTemplateRunning_Reporte_ID").val(ID);

        if (rol === "None" || rol === "Executer") {
            $("#pnl_firma_reporte_template").hide();
            $("#btnReporteRunning_Firmar").hide();
        } else {
            $("#txtTemplateRunning_Reporte_Tipo_Firma").val(rol);
            $("#btnReporteRunning_Firmar").show();
            $("#btnReporteRunning_Rechazar").show();
            $("#txtTemplatesRunningN_ID").val(ID);
        }
        console.log(rol);
        $("#mdlReporteA3_Panel").modal("show");
        var url2 = "/Reportes/validar_template_WP_id";
        var data2 = { ID: ID };
        $.post(url2, data2).done(function (info) {
            if (info.Id == "1") {
                $("#ReporteRunning_url").attr("src", "/Reportes/reporteA3_WP?ID_Template=" + ID + "");
            } else {
                $("#ReporteRunning_url").attr("src", "/Reportes/reporteA3?ID_Template=" + ID + "");
            }
        });
        let valor = $('#slcTemplateRunning_Reporte_Versiones option:selected').val();
        if (valor == "value" || valor == "0") {
            var versionActURL = "/Reportes/obtener_version_actual_documento";
            var versionActData = { id_template: ID };
            $.post(versionActURL, versionActData).done(function (versionAct) {
                fn_obtener_flujo_reporte_A3(ID, versionAct);
                //$("#btnReporteRunning_Firmar").show();
                //$("#btnReporteRunning_Rechazar").show();
            });
        } else {
            var versionURL = "/Reportes/obtener_version_documento";
            var versionData = { id_template: ID, documento: valor };
            $.post(versionURL, versionData).done(function (version) {
                fn_obtener_flujo_reporte_A3(ID, version);
                $("#btnReporteRunning_Firmar").hide();
                $("#btnReporteRunning_Rechazar").hide();
            });
        }
        fn_obtener_Adjuntos_Template(ID);
        fn_obtener_versiones(ID);

        $.post(url, data).done(function (info) {
            if (info != "") {
                $.each(info, function (i, item) {
                    if (item.Rol == "1") {
                        Tipo = $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisor');
                    } else {
                        Tipo = $.CargarIdioma.Obtener_Texto('txt_Idioma_Aprovador');
                    }
                    
                });
            } else {
                
                
            }
            
        });
    }
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
                        .append($('<td>').append(item.Nombre))
                        .append($('<td>').append(item.Tipo))
                        .append($('<td>').append(item.Item))
                        .append($('<td>').append(item.Seccion))
                        .append($('<td>').append(item.Cuadrante))
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
                        .append($('<td>').append(item.Nombre))
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
        $("#slcHome_Line").generarLista({ URL: "/Lineas/Lista_Lineas" });
        $("#slcHome_status").select2();
        fn_GetHistoryA3();
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
        var Folio = $("#txtHome_Folio").val();
        var TipoA3 = $("#slcHome_TipoA3 option:selected").text();
        var Contact = $("#txtHome_Contact").val();
        var Problem = $("#txtHome_KeyWord").val();
        var Estatus = $("#slcHome_status option:selected").text();
        var Linea = $("#slcHome_Line option:selected").text();
        var Band = 0;
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione')) { Estatus = null; } else { Estatus = $("#slcHome_status option:selected").val(); }
        if (Folio == "") { Folio = null; }
        if (TipoA3 == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione') || TipoA3 == "Seleccione") { TipoA3 = null; }
        if (Linea == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione') || TipoA3 == "Seleccione") { Linea = null; }
        if (Contact == "") { Contact = null; }
        if (Problem == "") { Problem = null; }
        if ($("#cbxHome_Activities").prop("checked")) {
            Band = 1;
        }
        var Datos = { Folio: Folio, TipoA3: TipoA3, Problem: Problem, Contact: Contact, Estatus: Estatus, Band: Band, Linea: Linea, Index: Pagina };
        var rol = 3

        $.mostrarInfo({
            URLindex: "/Home/obtener_TotalPag_BandejaA3",
            URLdatos: "/Home/obtenerRegistros_BandejaA3",
            Datos: Datos,
            Version: 2,
            Tabla: $("#tblHome_A3History"),
            Paginado: $("#pgdHome_A3History"),
            Mostrar: function (i, item) {
                var btn_continue_a3 = "";
               
                var badge_Status = '<div class="badge badge-primary">' + item.Status_Text + '</div>';
                if (item.Rol == "Executer") {
                    if (item.Estatus !== 6) {
                        btn_continue_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit"><i class="dropdown-icon fas fa-edit"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Continuar_Investigacion') + '</a>';
                    } else {
                        btn_continue_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit"><i class="dropdown-icon fas fa-edit"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_reabrir_investigacion_opcion') + '</a>';
                    }
                  
                }
                var Rol = '<div class="badge badge-light">' + item.Rol + '</div>';            
               
                var btn_report_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Report"><i class="dropdown-icon far fa-file-pdf"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_ReporteA3') + '</a>';
                var btn_group_options = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fas fa-bars"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    btn_continue_a3 +
                    btn_report_a3 +
                    '</div></div>';

                $("#tblHome_A3History").find("tbody").append(
                    $('<tr>')
                        .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                        .append($('<td data-registro="Rol" style="display:none">').append(item.Rol))
                        .append($('<td style="display:none;" class="estatusTemplateRunning">').append(item.Estatus))
                        .append($('<td>').append(item.Folio))
                        .append($('<td class="text-center">').append(item.Version))
                        .append($('<td>').append(item.TipoA3))                 
                        .append($('<td>').append(item.Problem))
                        .append($('<td class="text-center">').append(item.Contact))
                        .append($('<td class="text-center">').append(item.Lineas))
                        //.append($('<td>').append(Rol))
                        .append($('<td class="text-center">').append(badge_Status))
                        .append($('<td class="text-center">').append(btn_group_options))
                );
            }
        });
    }
});