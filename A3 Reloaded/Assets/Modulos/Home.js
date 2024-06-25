define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_home
        });
        $("#btnHome_Search").click(function () {
            fn_GetHistoryA3();
            $("#slcTestUsuarios").generarLista({ URL: "/Usuarios/Lista_Usuarios" });
            $('#slcTestUsuarios').select2();
        });
        $("#slcHome_TipoA3").change(function () {
            fn_GetHistoryA3()
        });
        $("#btnHome_clearFilter").click(function () {
            if ($("#cbxHome_Activities").prop("checked")) {
                $.auxFormulario.limpiarCampos({
                    Seccion: $("#frm_home_filter_div"),
                    Excepciones: ['txtHome_Contact','txtHome_Contact_aux'],
                });
            }
            else {
                $.auxFormulario.limpiarCampos({
                    Seccion: $("#frm_home_filter_div"),
                    Excepciones: ['txtHome_Contact_aux'],
                });
            }
           
            fn_GetHistoryA3();
        });
        $("#cbxHome_Activities").click(function () {
            if ($("#cbxHome_Activities").prop("checked")) {
                $("#txtHome_Contact").val($("#txtHome_Contact_aux").val());
                fn_GetHistoryA3()
                $("#cbxHome_Activities_text").text($.CargarIdioma.Obtener_Texto('txt_Idioma_mis_actividades'))           
            } else {
                $("#cbxHome_Activities_text").text($.CargarIdioma.Obtener_Texto('txt_Idioma_todas_actividades'))
                $("#txtHome_Contact").val(null);
                fn_GetHistoryA3()
            }
        });
        $("#tblHome_A3History table tbody").on('click', "a[data-registro=Edit]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();

            var yourElement = document.getElementById('btn_redirect_test');
            yourElement.setAttribute('href', '/Sistema/InicioA3?Id_a3=' + ID);


            document.getElementById('btn_redirect_test').click();
        });
        $("#pgdHome_A3History").paginado({
            Tabla: $("#tblHome_A3History"),
            Version: 2,
            Funcion: fn_GetHistoryA3
        });
    });
    function fn_home() {
        $("#slcHome_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3" });
        fn_GetHistoryA3();
    }

    function fn_GetHistoryA3(Pagina) {
        var Folio = $("#txtHome_Folio").val();
        var TipoA3 = $("#slcHome_TipoA3 option:selected").text();
        var Contact = $("#txtHome_Contact").val();
        var Problem = $("#txtHome_KeyWord").val();
        var Estatus = $("#slcHome_status option:selected").text();
        var Band = 1;
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_En_Proceso')) { Estatus = 0; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_idioma_Ingrese_En_Revision')) { Estatus = 3; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_idioma_Ingrese_En_Modificacion')) { Estatus = 2; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_Finalizado')) { Estatus = 1; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione')) { Estatus = null; }
        if (Folio == "") { Folio = null; }
        if (TipoA3 == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione') || TipoA3 == "Seleccione") { TipoA3 = null; }
        if (Contact == "") { Contact = null; }
        if (Problem == "") { Problem = null; }
        if ($("#cbxHome_Activities").prop("checked")) {
            Band = 0;
        }
        var Datos = { Folio: Folio, TipoA3: TipoA3, Problem: Problem, Contact: Contact, Estatus: Estatus, Band: Band, Index: Pagina };
        var rol = 3

        $.mostrarInfo({
            URLindex: "/Home/obtener_TotalPag_BandejaA3",
            URLdatos: "/Home/obtenerRegistros_BandejaA3",
            Datos: Datos,
            Version: 2,
            Tabla: $("#tblHome_A3History"),
            Paginado: $("#pgdHome_A3History"),
            Mostrar: function (i, item) {
                var btn_continue_a3  = "";
                var Estatus = '<div class="badge badge-primary">' + item.Status_Text + '</div>';
                if(item.Rol == "Executer"){
                    btn_continue_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Edit"><i class="dropdown-icon fas fa-edit"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Continuar_Investigacion') + '</a>';
                }
                var Rol = '<div class="badge badge-light">' + item.Rol + '</div>';            
                var Botones = '<button class="btn btn-icon btn-primary btnContinuar" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Continuar Investigación"><i class="far fa-edit"></i></button>';

                if (rol == "3") {
                    Botones = '<button disabled class="btn btn-icon btn-primary btnContinuar" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Continuar Investigación"><i class="far fa-edit"></i></button>';
                } else {
                    Botones = '<button  class="btn btn-icon btn-primary btnContinuar" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Continuar_Investigacion') + '"><i class="far fa-edit"></i></button>';
                }
                var Boton_Reporte = '<button class="btn btn-icon btn-success btnPdf" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_ReporteA3') + '"><i class="far fa-file-pdf"></i></button>';

               
                var btn_report_a3 = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Report"><i class="dropdown-icon far fa-file-pdf"></i> ' + $.CargarIdioma.Obtener_Texto('txt_Idioma_ReporteA3') + '</a>';
                var btn_group_options = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fas fa-bars"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    btn_continue_a3 +
                    btn_report_a3 +
                    '</div></div>';

                $("#tblHome_A3History").find("tbody").append(
                    $('<tr>')
                        .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                        .append($('<td style="display:none;" class="estatusTemplateRunning">').append(item.Estatus))
                        .append($('<td>').append(item.Folio))
                        .append($('<td>').append(item.Version))
                        .append($('<td>').append(item.TipoA3))                 
                        .append($('<td>').append(item.Problem))
                        .append($('<td>').append(item.Contact))
                        /*.append($('<td>').append(Rol))*/
                        .append($('<td>').append(Estatus))
                        .append($('<td>').append(btn_group_options))
                );
            }
        });
    }
});