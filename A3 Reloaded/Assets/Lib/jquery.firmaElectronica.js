define(['jquery', 'NotificacionesMensajes', 'Idioma'], function ($) {
    $(document).ready(function () {
        //BYTOST - CWID
        //ZNACKA - Contraseña
        //ZMYSEL - Justificación
        //SADA - Función
        $("#btnFirmaElectronica_Firmar").click(function (e) {
            $.firmaElectronica.Firmar();
        });
        $('#mdlSistema_FirmaElectronica').on('hidden.bs.modal', function (e) {
            $("#txtFirmaElectronica_ZNACKA").val("");
            $("#txtFirmaElectronica_ZMYSEL").val("");
            $("#btnFirmaElectronica_Firmar").removeClass("btn-loading");
        });
        $('#mdlSistema_FirmaElectronica').on('shown.bs.modal', function (e) {
            $("#txtFirmaElectronica_ZNACKA").focus();
        });
    });
    jQuery.firmaElectronica = {
        MostrarFirma: function (Parametros) {
            var Param = $.extend(jQuery.firmaElectronica.default, Parametros);
            $("#scnFirmaElectronica_Justificacion").prop("hidden", !Param.Justificacion);
            $("#mdlSistema_FirmaElectronica").modal("show");
        },
        Firmar: function () {
            var Param = jQuery.firmaElectronica.default;
            var grifo = $("#txtSistema_Grifo").val();
            var bytost = $("#txtFirmaElectronica_BYTOST").val();
            var znacka = $("#txtFirmaElectronica_ZNACKA").val();
            var zmysel = $("#txtFirmaElectronica_ZMYSEL").val();
            var ID = Param.Parametro;
            if ((znacka != "" && Param.Justificacion == false) || (znacka != "" && (Param.Justificacion == true && zmysel != ""))) {
                var Datos = { Grifo: grifo, BYTOST: bytost, ZNACKA: znacka, ZMYSEL: zmysel, ID: ID };
                Param.Funcion(Datos);
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info" });
            }
        }
    };
    jQuery.firmaElectronica.default = {
        Justificacion: false,
        Funcion: function () { console.log("No existe la Funcion") },
        Parametro: null
    };
});