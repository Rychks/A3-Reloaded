jQuery(window).on("load", function () {
    $(".loader").fadeOut("slow");
});
$(document).ready(function () {  
    fn_seguridad_rol();
    fn_obtener_Textos_idiomas();  
    var url = location.pathname;
    if (url == "/Departamento") {
        //fn_obtener_Textos_idiomas();
        fn_Departamentos();
        setTimeout(function () {            
            
            fn_asignar_textos_placeholder();
        }, 1000); 
        
    } else if (url == "/AuditTrail") {
        //fn_obtener_Textos_idiomas();
        fn_AuditTrail();
        setTimeout(function () {
            fn_asignar_textos_placeholder();
        }, 1000);         
    } else if (url == "/Usuarios") {
        //fn_obtener_Textos_idiomas();
        fn_Usuarios();
        setTimeout(function () {          
            var roles = $("#slcUsuarios_Rol");
            fn_Lista_RolesUsuario({ Objeto: roles, Activo: 1 });
            var departamento = $("#slcUsuarios_Departamento");
            fn_Lista_Departamentos({ Objeto: departamento, Activo: 1 });
            fn_asignar_textos_placeholder();
        }, 1000);         
    } else if (url == "/Templates") {
        //fn_obtener_Textos_idiomas();
        fn_Templates();
        setTimeout(function () {
            var tipoA3 = $("#slcTemplates_TipoA3");
            fn_Lista_TiposA3({ Objeto: tipoA3, Activo: 1 });   
            fn_asignar_textos_placeholder();
        }, 1000);       
    } else if (url == "/Sistema/InicioA3") {
        //fn_obtener_Textos_idiomas();
        //fn_TemplatesRunning();

        setTimeout(function () {
            fn_cargaTiposA3();           
            var tipoA3Running = $("#slcTemplatesRunning_TipoA3");
            fn_Lista_TiposA3({ Objeto: tipoA3Running, Activo: 1 });
            fn_asignar_textos_placeholder();
        }, 1000);             
        
    } else if (url == "/Sistema/HistorialA3") {
        fn_TemplatesRunning_History();
        var tipoA3Running_History = $("#slcTemplatesRunning_History_TipoA3");
        fn_Lista_TiposA3({ Objeto: tipoA3Running_History, Activo: 1 });
    } 

    //Terminar el Drag and Drop de los archivos
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        //$(this).parents(".file-area").find(".file-name").html(fileName);
    });
    $("#pnlItem_nota").hide();
    $("#pnlItem_Instrucciones").hide(); 
    //Firma Electronica
    $("#btnFirmaElectronica_Firmar").click(function () {
        var grifo = $("#txtSistema_Grifo").val();
        var bytost = $("#txtFirmaElectronica_BYTOST").val();
        var znacka = $("#txtFirmaElectronica_ZNACKA").val();
        var zmysel = $("#txtFirmaElectronica_ZMYSEL").val();
        var justi = $("#scnFirmaElectronica_Justificacion").prop("hidden");
        if ((znacka != "" && justi == true) || (znacka != "" && (justi == false && zmysel != ""))) {
            var sada = $("#txtFirmaElectronica_SADA").val();
            window[sada](data = { Grifo: grifo, BYTOST: bytost, ZNACKA: znacka, ZMYSEL: zmysel });
        } else {
            fn_Notificaciones({ Mensaje: idioma_ingrese_informacion_requerida, Tipo: "info" });
        }
    });
    $('#mdlSistema_FirmaElectronica').on('hidden.bs.modal', function (e) {
        $("#txtFirmaElectronica_ZNACKA").val("");
        $("#txtFirmaElectronica_ZMYSEL").val("");
        $("#txtFirmaElectronica_SADA").val("");
        $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
    });
});
//Paginado
var idioma_error_mostrar_info;
var idioma_error_reabirir_investigacion;
var idioma_comenzar_cuadrante_A;
var idioma_no_existen_registros;
var idioma_debe_crear_ishikawua;
var idioma_ingrese_informacion_requerida;
var idioma_Usuario_ya_agregado;
var idioma_debe_contestar_cuadrante;
var idioma_sistema;
var idioma_Confirmacion_modificar;
var idioma_Confirmacion_modificar_title;
var idioma_Elaborador_Evaluadores;
var idioma_Reabrir_investigacion;
var idioma_Reabrir_investigacion_mensaje_completo;
var idioma_Reabrir_investigacion_mensaje_mitad;
function fn_obtener_Textos_idiomas() {
    var url = "/Lenguaje/obtener_texto_idiomas";
    
    $.get(url).done(function (info) {
        $.each(info, function (i, item) {
            $("#" + item.Etiqueta + "").val(item.Texto);
            $("." + item.Etiqueta + "").val(item.Texto);
            $("." + item.Etiqueta + "").text(item.Texto);
            $("." + item.Etiqueta + "").html(item.Texto);
            asignar_textos_mesajes_sistema(item.Etiqueta, item.Texto);
        });
        
    })
    
}
function asignar_textos_mesajes_sistema(Etiqueta, texto) {
    if (Etiqueta == "txt_Idioma_comenzar_cuadrante_A") {
        idioma_comenzar_cuadrante_A = texto;
    } else if (Etiqueta == "txt_Idioma_Mostrar_informacion_error") {
        idioma_error_mostrar_info = texto;
    } else if (Etiqueta == "txt_Idioma_no_existen_registros") {
        idioma_no_existen_registros = texto;
    } else if (Etiqueta == "txt_Idioma_debe_crear_ishikawua") {
        idioma_debe_crear_ishikawua = texto;
    } else if (Etiqueta == "txt_Idioma_ingrese_informacion_requerida") {
        idioma_ingrese_informacion_requerida = texto;
    } else if (Etiqueta == "txt_Idioma_Usuario_ya_agregado") {
        idioma_Usuario_ya_agregado = texto;
    } else if (Etiqueta == "txt_Idioma_debe_contestar_cuadrante") {
        idioma_debe_contestar_cuadrante = texto;
    } else if (Etiqueta == "txt_Idioma_sistema") {
        idioma_sistema = texto;
    } else if (Etiqueta == "txt_Idioma_Confirmacion_modificar") {
        idioma_Confirmacion_modificar = texto;
    } else if (Etiqueta == "txt_Idioma_Confirmacion_modificar_title") {
        idioma_Confirmacion_modificar_title = texto;
    } else if (Etiqueta == "txt_Idioma_Elaborador_Evaluadores") {
        idioma_Elaborador_Evaluadores = texto;
    } else if (Etiqueta == "txt_Idioma_Reabrir_investigacion") {
        idioma_Reabrir_investigacion = texto;
    } else if (Etiqueta == "txt_Idioma_Reabrir_investigacion_mensaje_completo") {
        idioma_Reabrir_investigacion_mensaje_completo = texto;
    } else if (Etiqueta == "txt_Idioma_Reabrir_investigacion_mensaje_mitad") {
        idioma_Reabrir_investigacion_mensaje_mitad = texto;
    } else if (Etiqueta == "txt_Idioma_Error_Reabrir_Investigacion") {
        idioma_error_reabirir_investigacion = texto;
    }

}
function fn_asignar_textos_placeholder() {
    var idioma_plc_departamento = $("#txt_Idioma_Ingrese_el_nombre_del_departamento").val();
    $(".txt_Idioma_Ingrese_el_nombre_del_departamento").removeAttr("placeholder");
    $(".txt_Idioma_Ingrese_el_nombre_del_departamento").attr("placeholder", idioma_plc_departamento);
    $(".txt_Idioma_Ingrese_el_nombre_del_departamento").val(null);
    var idioma_plc_Nombre_Usuario = $("#txt_Idioma_Ingrese_un_nombre").val();
    $(".txt_Idioma_Ingrese_un_nombre").removeAttr("placeholder");
    $(".txt_Idioma_Ingrese_un_nombre").attr("placeholder", idioma_plc_Nombre_Usuario);
    $(".txt_Idioma_Ingrese_un_nombre").val(null);
    var idioma_plc_Apellido = $("#txt_Idioma_Apellido_paterno").val();
    $(".txt_Idioma_Apellido_paterno").removeAttr("placeholder");
    $(".txt_Idioma_Apellido_paterno").attr("placeholder", idioma_plc_Apellido);
    $(".txt_Idioma_Apellido_paterno").val(null);
    var idioma_plc_Correo = $("#txt_Idioma_Ingrese_correo").val();
    $(".txt_Idioma_Ingrese_correo").removeAttr("placeholder");
    $(".txt_Idioma_Ingrese_correo").attr("placeholder", idioma_plc_Correo);
    $(".txt_Idioma_Ingrese_correo").val(null);
    var idioma_plc_cwid= $("#txt_Idioma_Ingese_un_CWID").val();
    $(".txt_Idioma_Ingese_un_CWID").removeAttr("placeholder");
    $(".txt_Idioma_Ingese_un_CWID").attr("placeholder", idioma_plc_cwid);
    $(".txt_Idioma_Ingese_un_CWID").val(null);
    var idioma_plc_Folio = $("#txt_Idioma_Ingrese_Folio").val();
    $(".txt_Idioma_Ingrese_Folio").removeAttr("placeholder");
    $(".txt_Idioma_Ingrese_Folio").attr("placeholder", idioma_plc_Folio);
    $(".txt_Idioma_Ingrese_Folio").val(null);
    var idioma_plc_Descripcion = $("#txt_Idioma_Ingrese_Descripcion").val();
    $(".txt_Idioma_Ingrese_Descripcion").removeAttr("placeholder");
    $(".txt_Idioma_Ingrese_Descripcion").attr("placeholder", idioma_plc_Descripcion);
    $(".txt_Idioma_Ingrese_Descripcion").val(null);
    var idioma_plc_Cwid_Nombre = $("#txt_Idioma_Iinserte_CWID_nombre").val();
    $(".txt_Idioma_Iinserte_CWID_nombre").removeAttr("placeholder");
    $(".txt_Idioma_Iinserte_CWID_nombre").attr("placeholder", idioma_plc_Cwid_Nombre);
    $(".txt_Idioma_Iinserte_CWID_nombre").val(null);
    var idioma_plc_ingrese_contrasena = $("#txt_idioma_Ingrese_contraseña").val();
    $(".txt_idioma_Ingrese_contraseña").removeAttr("placeholder");
    $(".txt_idioma_Ingrese_contraseña").attr("placeholder", idioma_plc_ingrese_contrasena);
    $(".txt_idioma_Ingrese_contraseña").val(null);
    var idioma_plc_ingrese_justificacion = $("#txt_idioma_Ingrese_Justificacion").val();
    $(".txt_idioma_Ingrese_Justificacion").removeAttr("placeholder");
    $(".txt_idioma_Ingrese_Justificacion").attr("placeholder", idioma_plc_ingrese_justificacion);
    $(".txt_idioma_Ingrese_Justificacion").val(null);
    var idioma_plc_ingrese_Responsable = $("#txt_Idioma_Responsable").val();
    $(".txt_Idioma_Responsable").removeAttr("placeholder");
    $(".txt_Idioma_Responsable").attr("placeholder", idioma_plc_ingrese_Responsable);
    $(".txt_Idioma_Responsable").val(null);
    var idioma_plc_ingrese_nombre_seccion = $("#txt_Idioma_Ingrese_Nombre_seccion").val();
    $(".txt_Idioma_Ingrese_Nombre_seccion").removeAttr("placeholder");
    $(".txt_Idioma_Ingrese_Nombre_seccion").attr("placeholder", idioma_plc_ingrese_nombre_seccion);
    $(".txt_Idioma_Ingrese_Nombre_seccion").val(null);
    //var idioma_plc_departamento = $("#txt_Idioma_Ingrese_el_nombre_del_departamento").val();
    //$(".txt_Idioma_Ingrese_el_nombre_del_departamento").removeAttr("placeholder");
    //$(".txt_Idioma_Ingrese_el_nombre_del_departamento").attr("placeholder", idioma_plc_departamento);
}
function fn_cargaTiposA3() {
    var url = "/Templates/mostrarTemplatesActivo";
    var rol = $("#txt_Rol_Usuario").val();
    $.get(url).done(function (data) {
        $("#tblTemplatesActivos").empty();
        $.each(data, function (i, item) {
            var text_idioma = $("#txt_Idioma_Nueva_investigacion").val();
            var Botones = '<button class="btn btn-block btn-primary btnComenzar">' + text_idioma + '</button>';
            if (rol == "3") {
                Botones = '<button disabled class="btn btn-block btn-primary  btnComenzar">' + text_idioma + '</button>';
            } else { Botones = '<button class="btn btn-block btn-primary btnComenzar">' + text_idioma + '</button>';}            
            $("#tblTemplatesActivos").append(
                $('<tr>')
                    .append($('<td style="display:none;" class="idTemplate">').append(item.ID))
                    .append($('<td style="text-align:center;">').append('<img height="50" width="50" src="/Assets/img/Templates/' + item.Imagen + '"/>'))
                    .append($('<td>').append(item.TipoA3))
                    .append($('<td>').append(item.Descripcion))                    
                    .append($('<td>').append(item.Version))
                    .append($('<td>').append(Botones))
            );
        });
    });
}
function Pag_Atras(Boton, Pagina, Tabla) {
    var ant = $(Boton);
    var pag = parseInt($("option:selected", Pagina).val());
    if (ant.prop("disabled", false) && pag && pag != 1) {
        pag = pag - 1;
        $(Pagina).val(pag).change();
        $(Tabla).parents(".encabezados-fixed").scrollTop(0);
    }
}
function Pag_Siguiente(Boton, Pagina, Tabla) {
    var sig = $(Boton);
    var pag = parseInt($("option:selected", Pagina).val());
    var last = $("option:last-child", Pagina).val();
    if (sig.prop("disabled", false) && pag && pag < last) {
        pag = pag + 1;
        $(Pagina).val(pag).change();
        $(Tabla).parents(".encabezados-fixed").scrollTop(0);
    }
}
function Pag_Paginas(Seccion_Paginado, Paginas, Paginado) {
    var pag = parseInt($("option:selected", Paginas).val());
    var last = $("option:last-child", Paginas).val();
    var ant = $(Seccion_Paginado).find(".pgd-Ant");
    var sig = $(Seccion_Paginado).find(".pgd-Sig");
    if (pag == 1 && last != 1) {
        ant.prop("disabled", true);
        sig.prop("disabled", false);
    } else if (pag == 1 && last == 1) {
        ant.prop("disabled", true);
        sig.prop("disabled", true);
    } else if (pag < last) {
        ant.prop("disabled", false);
        sig.prop("disabled", false);
    } else if (pag == last) {
        ant.prop("disabled", false);
        sig.prop("disabled", true);
    }
    window[Paginado](pag);
}
//Notificaciones
function fn_Notificaciones(param) {
    var defaults = { Titulo: idioma_sistema, Mensaje: null, Tipo: null, Error: null };
    var param = $.extend({}, defaults, param);
    var parametros = { title: param.Titulo, message: param.Mensaje, position: "topRight", timeout: 3000, pauseOnHover: true, progressBar: false, closeOnClick: true, transition: "fadeInDown", layout: 2 };
    if (param.Tipo === "info") {
        iziToast.info(parametros);
    } else if (param.Tipo === "success") {
        iziToast.success(parametros);
    } else if (param.Tipo === "warning") {
        iziToast.warning(parametros);
    } else if (param.Tipo === "danger" || param.Tipo === "error") {
        iziToast.error(parametros);
    } else {
        iziToast.show(parametros);
    }
    if (param.Error > 0) {
        console.log(param.Error);
    }
}
//Mensajes y Alertas
function fn_Confirmación(param) {
    /*Tipo de Confirmación: 
     * CV - Campos Vacios
     * MD - Guardar
     * EL - Eliminar
    */
    var defaults = { Tipo: null, FuncionV: null, FuncionF: null, Parametros: null };
    var param = $.extend({}, defaults, param);
    if (param.Tipo == "CV") {
        swal({
            title: "Campos Vacios",
            text: "Se encontraron campos vacios, desea llenarlos con N/A?",
            buttons: {
                cancel: "No",
                defeat: "Si"
            },
            dangerMode: true,
        }).then((value) => {
            if (value == "defeat") {
                window[param.FuncionV](param.Parametros);
            } else {
                if (param.FuncionF != "" && param.FuncionF) {
                    window[param.FuncionV](param.Parametros);
                }
            }
        });
    } else if (param.Tipo == "EL") {
        swal({
            title: "Eliminar Registro?",
            text: "Esta seguro que desea eliminar este registro?",
            icon: 'warning',
            buttons: {
                cancel: "No",
                defeat: "Si"
            },
            dangerMode: true,
        }).then((value) => {
            if (value == "defeat") {
                $("#scnFirmaElectronica_Justificacion").prop("hidden", false);
                $("#txtFirmaElectronica_SADA").val(param.FuncionV);
                $("#mdlSistema_FirmaElectronica").modal("show");
            } else {
                if (param.FuncionF != "" && param.FuncionF) {
                    window[param.FuncionV](param.Parametros);
                }
            }
        });
    } else if (param.Tipo == "MD") {
        swal({
            title: idioma_Confirmacion_modificar_title,
            text: idioma_Confirmacion_modificar,
            icon: 'warning',
            buttons: {
                cancel: $("#txt_Idioma_No").val(),
                defeat: $("#txt_Idioma_Yes").val()
            },
            dangerMode: true,
        }).then((value) => {
            if (value == "defeat") {
                $("#scnFirmaElectronica_Justificacion").prop("hidden", false);
                $("#txtFirmaElectronica_SADA").val(param.FuncionV);
                $("#mdlSistema_FirmaElectronica").modal("show");
            } else {
                if (param.FuncionF != "" && param.FuncionF) {
                    window[param.FuncionV](param.Parametros);
                }
            }
        });
    }
}
//Firma Electronica
function fn_MostrarFirma(Parametros) {
    $("#scnFirmaElectronica_Justificacion").prop("hidden", !Parametros.Justificacion );
    $("#txtFirmaElectronica_SADA").val(Parametros.Funcion);
    $("#mdlSistema_FirmaElectronica").modal("show");
}
//
function fn_Lista_RolesUsuario(param) {
    var defaults = { Objeto: null, Activo: null, Seleccion: null };
    var param = $.extend({}, defaults, param);
    if (param.Objeto != "") {
        var url = "/Usuarios/obtenerRoles";
        var text_idioma = $("#txt_Idioma_Seleccione").val();
        $.post(url, data = { Activo: param.Activo }).done(function (res) {
            $(param.Objeto).empty();
            if (res != "") {
                if (param.Seleccion != "") {
                    $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
                } else {
                    $(param.Objeto).append('<option value="-1" disable>' + text_idioma + '</option>');
                }
                $.each(res, function (i, item) {
                    if (param.Seleccion != "" && (item.ID == param.Seleccion)) {
                        $(param.Objeto).append('<option selected value="' + item.ID + '">' + item.Rol + '</option>');
                    } else {
                        $(param.Objeto).append('<option value="' + item.ID + '">' + item.Rol + '</option>');
                    }
                });
            } else {
                $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
            }
        }).fail(function (error) { fn_Notificaciones({ Mensaje: idioma_no_existen_registros, Tipo: "danger", Error: error }); });
    } else {
        console.log("Ingrese el objeto donde se mostrara los roles.");
    }
}
function fn_Lista_Usuarios(param) {
    var defaults = { Objeto: null, Activo: null, Seleccion: null };
    var param = $.extend({}, defaults, param);
    if (param.Objeto != "") {
        var url = "/Usuarios/obtenerUsuarios";
        var text_idioma = $("#txt_Idioma_Seleccione").val();
        $.post(url, data = { Activo: param.Activo }).done(function (res) {
            $(param.Objeto).empty();
            if (res != "") {
                if (param.Seleccion != "") {
                    $(param.Objeto).append('<option value="-1" selected disable>Seleccione</option>');
                } else {
                    $(param.Objeto).append('<option value="-1" disable>Seleccione</option>');
                }
                $.each(res, function (i, item) {
                    if (param.Seleccion != "" && (item.ID == param.Seleccion)) {
                        $(param.Objeto).append('<option selected value="' + item.ID + '">' + item.Nombre + '</option>');
                    } else {
                        $(param.Objeto).append('<option value="' + item.ID + '">' + item.Nombre + '</option>');
                    }
                });
            } else {
                $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
            }
        }).fail(function (error) { fn_Notificaciones({ Mensaje: "Se produjo un error al tratar de mostrar los archivos", Tipo: "danger", Error: error }); });
    } else {
        console.log("Ingrese el objeto donde se mostrara los roles.");
    }
}
function fn_Lista_Departamentos(param) {
    var defaults = { Objeto: null, Activo: null, Seleccion: null };
    var param = $.extend({}, defaults, param);
    if (param.Objeto != "") {
        var url = "/Usuarios/obtenerDepartamentos";
        var text_idioma = $("#txt_Idioma_Seleccione").val();
        $.post(url, data = { Activo: param.Activo }).done(function (res) {
            $(param.Objeto).empty();
            if (res != "") {
                if (param.Seleccion != "") {
                    $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
                } else {
                    $(param.Objeto).append('<option value="-1" disable>' + text_idioma + '</option>');
                }
                $.each(res, function (i, item) {
                    if (param.Seleccion != "" && (item.ID == param.Seleccion)) {
                        $(param.Objeto).append('<option selected value="' + item.ID + '">' + item.Nombre + '</option>');
                    } else {
                        $(param.Objeto).append('<option value="' + item.ID + '">' + item.Nombre + '</option>');
                    }
                });
            } else {
                $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
            }
        }).fail(function (error) { fn_Notificaciones({ Mensaje: idioma_no_existen_registros, Tipo: "danger", Error: error }); });
    } else {
        console.log("Ingrese el objeto donde se mostrara los roles.");
    }
}

function fn_Lista_TiposA3(param) {
    var defaults = { Objeto: null, Activo: null, Seleccion: null };
    var param = $.extend({}, defaults, param);
    if (param.Objeto != "") {
        var url = "/Templates/obtenerTiposA3";
        var text_idioma = $("#txt_Idioma_Seleccione").val();
        $.post(url, data = { Activo: param.Activo }).done(function (res) {
            $(param.Objeto).empty();
            if (res != "") {
                if (param.Seleccion != "") {
                    $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
                } else {
                    $(param.Objeto).append('<option value="-1" disable>' + text_idioma +'</option>');
                }
                $.each(res, function (i, item) {
                    if (param.Seleccion != "" && (item.ID == param.Seleccion)) {
                        $(param.Objeto).append('<option selected value="' + item.ID + '">' + item.Nombre + '</option>');
                    } else {
                        $(param.Objeto).append('<option value="' + item.ID + '">' + item.Nombre + '</option>');
                    }
                });
            } else {
                $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
            }
        }).fail(function (error) { fn_Notificaciones({ Mensaje: idioma_no_existen_registros, Tipo: "danger", Error: error }); });
    } else {
        console.log("Ingrese el objeto donde se mostrara los roles.");
    }
}

function fn_Lista_Cuadrantes(param) {
    var defaults = { Objeto: null, Activo: null, Seleccion: null };
    var param = $.extend({}, defaults, param);
    if (param.Objeto != "") {
        var url = "/Templates/obtenerCuadrantes";
        var text_idioma = $("#txt_Idioma_Seleccione").val();
        $.post(url, data = { Activo: param.Activo }).done(function (res) {
            $(param.Objeto).empty();
            if (res != "") {
                if (param.Seleccion != "") {
                    $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
                } else {
                    $(param.Objeto).append('<option value="-1" disable>' + text_idioma + '</option>');
                }
                $.each(res, function (i, item) {
                    if (param.Seleccion != "" && (item.ID == param.Seleccion)) {
                        $(param.Objeto).append('<option selected value="' + item.ID + '">' + item.Nombre + '</option>');
                    } else {
                        $(param.Objeto).append('<option value="' + item.ID + '">' + item.Nombre + '</option>');
                    }
                });
            } else {
                $(param.Objeto).append('<option value="-1" selected disable>' + text_idioma + '</option>');
            }
        }).fail(function (error) { fn_Notificaciones({ Mensaje: idioma_no_existen_registros, Tipo: "danger", Error: error }); });
    } else {
        console.log("Ingrese el objeto donde se mostrara los roles.");
    }
}

function fn_seguridad_rol() {
    var url = "/Sistema/obtener_Rol_usuario";
    $.get(url).done(function (info) {
        $("#txt_Rol_Usuario").val(info.Id);
    });
}