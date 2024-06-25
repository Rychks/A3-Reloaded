define(["jquery"], function ($) {
    $(document).ready(function () {
        $.CargarIdioma.Textos({
            Funcion: fn_AuditTrail
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnAuditTrail_Limpiar').click();
            }
        });
        $("#txtAuditTrail_Usuario").on('keypress', function (e) {
            if (e.which == 13) {
                fn_AuditTrail();
            }
        });
        $("#txtAuditTrail_Accion").change(function () {
            fn_AuditTrail();
        })
        $("#btnAuditTrail_Buscar").click(function () {
            fn_AuditTrail();
        });
        $("#btnAuditTrail_Limpiar").click(function () {
            $("#txtAuditTrail_Usuario").val("");
            $("#txtAuditTrail_Accion").prop("selectedIndex", 0);
            $("#txtAuditTrail_Fecha1").val("");
            $("#txtAuditTrail_Fecha2").val("");
            $("#txtAuditTrail_Fecha3").val("");
            fn_AuditTrail();
        });
        $("#txtAuditTrail_Fecha1").change(function () {
            $("#txtAuditTrail_Fecha2").val("");
            $("#txtAuditTrail_Fecha3").val("");
        });
        $("#txtAuditTrail_Fecha2,#txtAuditTrail_Fecha3").change(function () {
            $("#txtAuditTrail_Fecha1").val("");
        });
        $("#pgdAuditTrail").paginado({
            Tabla: $("#tblAuditTrail"),
            Version: 2,
            Funcion: fn_AuditTrail
        });
        $("#btnAuditTrail_Reporte").click(function () {
            fn_reporte();
        });
    });
    function fn_AuditTrail(Pagina) {
        var opc = 1;
        var usuario = $("#txtAuditTrail_Usuario").val();
        var accion = $("#txtAuditTrail_Accion option:selected").text();
        var fecha1 = $("#txtAuditTrail_Fecha1").val();
        var fecha2 = $("#txtAuditTrail_Fecha2").val();
        var fecha3 = $("#txtAuditTrail_Fecha3").val();
        if (fecha1 == "") { fecha1 = null; }
        if (fecha2 == "") { fecha2 = null; }
        if (fecha3 == "") { fecha3 = null; }
        if (usuario == "") { usuario = null; }
        if (accion == -1 || accion == "Select" || accion == "Seleccione") { accion = null; }
        if (accion == "Update" || accion == "Modificación") { accion = 'M'; }
        if (accion == "Insert" || accion == "Inserción") { accion = 'I'; }
        if (accion == "Delete" || accion == "Eliminación") { accion = 'E'; }
        if (fecha1 == null && fecha2 != null && fecha3 != null) {
            opc = 2;
        } else {
            opc = 1;
        }
        var Datos;
        if (opc == 1) {
            Datos = { Fecha1: fecha1, Fecha2: fecha2, Usuario: usuario, Accion: accion, index: Pagina }
        } else {
            Datos = { Fecha1: fecha2, Fecha2: fecha3, Usuario: usuario, Accion: accion, index: Pagina };
        }
        $.mostrarInfo({
            URLindex: "/AuditTrail/obtenerTotalPagAuditTrail",
            URLdatos: "/AuditTrail/mostrarAuditTrail",
            Datos: Datos,
            Version: 2,
            Tabla: $("#tblAuditTrail"),
            Paginado: $("#pgdAuditTrail"),
            Mostrar: function (i, item) {
                var Accion = "";
                var Idioma_Insert = $.CargarIdioma.Obtener_Texto('txt_Idioma_Insercion');
                var txt_Idioma_Modificacion = $.CargarIdioma.Obtener_Texto('txt_Idioma_Modificacion');
                var txt_Idioma_Eliminacion = $.CargarIdioma.Obtener_Texto('txt_Idioma_Eliminacion');
                if (item.Accion == "I") {
                    Accion = Idioma_Insert;
                } else if (item.Accion == "M") {
                    Accion = txt_Idioma_Modificacion;
                } else if (item.Accion == "E") {
                    Accion = txt_Idioma_Eliminacion;
                }
                $("#tblAuditTrail").find("tbody").append(
                    $('<tr>')
                        .append($('<td>').append(item.RowNumber))
                        .append($('<td>').append(item.Fecha))
                        .append($('<td>').append(item.Usuario))
                        .append($('<td>').append(Accion))
                        .append($('<td>').append(item.Anterior))
                        .append($('<td>').append(item.Actual))
                        .append($('<td>').append(item.Justificacion))
                );
            }
        });
    }
    function fn_reporte() {
        var opc = 1;
        var url;
        var usuario = $("#txtAuditTrail_Usuario").val();
        var accion = $("#txtAuditTrail_Accion option:selected").text();
        var fecha1 = $("#txtAuditTrail_Fecha1").val();
        var fecha2 = $("#txtAuditTrail_Fecha2").val();
        var fecha3 = $("#txtAuditTrail_Fecha3").val();
        if (accion == -1 || accion == "Select" || accion == "Seleccione") { accion = ""; }
        if (accion == "Update" || accion == "Modificación") { accion = 'M'; }
        if (accion == "Insert" || accion == "Inserción") { accion = 'I'; }
        if (accion == "Delete" || accion == "Eliminación") { accion = 'E'; }
        if (fecha1 == "" && fecha2 != "" && fecha3 != "") {
            opc = 2;
        } else {
            opc = 1;
        }
        if (opc == 1) {
            url = "/AuditTrail/reporteAT?Fecha1=" + fecha1 + "&Fecha2=" + fecha2 + "&Usuario=" + usuario + "&Accion=" + accion + "";
        } else {
            url = "/AuditTrail/reporteAT?Fecha1=" + fecha2 + "&Fecha2=" + fecha3 + "&Usuario=" + usuario + "&Accion=" + accion + "";
        }
        window.open(url, '_blank');
        return false;
    }
});