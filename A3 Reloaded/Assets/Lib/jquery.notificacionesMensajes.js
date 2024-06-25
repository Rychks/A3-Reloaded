define(['jquery', 'iziToast', 'sweetalert'], function (jQuery, iziToast, swal) {
    'use strict'
    jQuery.notiMsj = {
        Notificacion: function (Parametros) {
            var Param = $.extend({}, jQuery.notiMsj.default.Notificacion_default, Parametros);
            var Notificacion = { title: Param.Titulo, message: Param.Mensaje, position: "topRight", timeout: 3000, pauseOnHover: true, progressBar: false, closeOnClick: true, transition: "fadeInDown", layout: 2 };
            if (Param.Tipo === "info") {
                iziToast.info(Notificacion);
            } else if (Param.Tipo === "success") {
                iziToast.success(Notificacion);
            } else if (Param.Tipo === "warning") {
                iziToast.warning(Notificacion);
            } else if (Param.Tipo === "danger" || Param.Tipo === "error") {
                iziToast.error(Notificacion);
            } else {
                iziToast.show(Notificacion);
            }
            if (Param.Error > 0) {
                console.log(Param.Error);
            }
        },
        Confirmacion: function (Parametros) {
            //Tipo de Confirmación:
            //CV - Campos Vacios 
            //MD - Modificar
            //EL - Eliminar
            //QU - Quitar
            //DE - Desactivar
            //FuncionV - Función que se ejecuta cuando se presiona SI
            //FuncionF - Funcion que se ejecuta cuando se presiona NO/CANCELAR
            var Param = $.extend({}, jQuery.notiMsj.default.Confirmacion_default, Parametros);
            if (Param.Tipo == "CV") {
                swal({
                    title: Param.Titulo,
                    text: Param.Mensaje,
                    buttons: {
                        cancel: Param.BotonNo,
                        defeat: Param.BotonSi
                    },
                    dangerMode: true,
                }).then((value) => {
                    if (value == "defeat") {
                        Param.FuncionV(Param.Parametros);
                    } else {
                        if (Param.FuncionF != "" && Param.FuncionF) {
                            Param.FuncionF(Param.Parametros);
                        }
                    }
                });
            } else if (Param.Tipo == "EL") {
                swal({
                    title: Param.Titulo,
                    text: Param.Mensaje,
                    icon: 'warning',
                    buttons: {
                        cancel: Param.BotonNo,
                        defeat: Param.BotonSi
                    },
                    dangerMode: true,
                }).then((value) => {
                    if (value == "defeat") {
                        Param.FuncionV(Param.Parametros);
                    } else {
                        if (Param.FuncionF != "" && Param.FuncionF) {
                            Param.FuncionF(Param.Parametros);
                        }
                    }
                });
            } else if (Param.Tipo == "DE") {
                swal({
                    title: Param.Titulo,
                    text: Param.Mensaje,
                    icon: 'warning',
                    buttons: {
                        cancel: Param.BotonNo,
                        defeat: Param.BotonSi
                    },
                    dangerMode: true,
                }).then((value) => {
                    if (value == "defeat") {
                        Param.FuncionV(Param.Parametros);
                    } else {
                        if (Param.FuncionF != "" && Param.FuncionF) {
                            Param.FuncionF(Param.Parametros);
                        }
                    }
                });
            } else if (Param.Tipo == "QU") {
                swal({
                    title: Param.Titulo,
                    text: Param.Mensaje,
                    icon: 'warning',
                    buttons: {
                        cancel: Param.BotonNo,
                        defeat: Param.BotonSi
                    },
                    dangerMode: true,
                }).then((value) => {
                    if (value == "defeat") {
                        Param.FuncionV(Param.Parametros);
                    } else {
                        if (Param.FuncionF != "" && Param.FuncionF) {
                            Param.FuncionF(Param.Parametros);
                        }
                    }
                });
            } else if (Param.Tipo == "MD") {

                swal({
                    title: Param.Titulo,
                    text: Param.Mensaje,
                    icon: 'warning',
                    buttons: {
                        cancel: Param.BotonNo,
                        defeat: Param.BotonSi
                    },
                    dangerMode: true,
                }).then((value) => {
                    if (value == "defeat") {
                        Param.FuncionV(Param.Parametros);
                    } else {
                        if (Param.FuncionF != "" && Param.FuncionF) {
                            Param.FuncionF(Param.Parametros);
                        }
                    }
                });
            }
        }
    };
    jQuery.notiMsj.default = {
        Notificacion_default: {
            Titulo: "",
            Mensaje: null,
            Tipo: null,
            Error: null
        },
        Confirmacion_default: {
            Tipo: null,
            Titulo: null,
            Mensaje: null,
            BotonSi: null,
            BotonNo: null,
            FuncionV: function () { },
            FuncionF: function () { },
            Parametros: null
        }
    };
});