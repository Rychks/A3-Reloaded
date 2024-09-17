define(["jquery"], function ($) {
    $(document).ready(function () {
        //$.CargarIdioma.Textos({

        //});
        $("#btnTemplate_edition_add_section").click(function () {
            var cuadrantes = $("#slcSeccionesN_Cuadrante");
            var template_id = $("#txtTemplate_edition_id").val();
            var id_cuadrante = $("#txtTemplate_edition_section_id_cuadrante").val();
            fn_lista_cuadrantes_template_id({ Objeto: cuadrantes, ID: template_id, Seleccion: id_cuadrante });
            $.auxFormulario.limpiarCampos({ Seccion: $("#frmSeccionesN") });
            $("#mdlSecciones_Agregar").modal("show");
        });
        $("#btnTemplates_edition_section_Regresar").click(function () {
            $("#pnlTemplates_Ajustes").show();
            $("#pnlTemplate_edition_section").hide();
        })
        $("#pnlTemplate_edition_cuadrantes").on("click", "button[data-registro=cuadrant_info]", function (event) {
            var btn = $(this);
            var id_cuadrant = $(this).parents("div").parents("div.col-lg-3").find("input[data-registro=id_cuadrant]").val()
            $("#pnlTemplates_Ajustes").hide();
            $("#pnlTemplate_edition_section").show();
            $("#txtTemplate_edition_section_id_cuadrante").val(id_cuadrant);
            fn_get_secciones(id_cuadrant);
        })
        $("#btnTemplate_edition_add_cuadrant").click(function () {
            $("#mdlTemplate_edition_add_cuadrant").modal("show");
        });
        $("#pnlTemplate_edition_cuadrantes").on("click", "button[data-registro=guardar]", function (event) {
            var btn = $(this);
            var id_cuadrant = $(this).parents("div").parents("div.col-lg-3").find("input[data-registro=id_cuadrant]").val()
            var text_cuadrant = $(this).parents("div").parents("div.col-lg-3").find("textarea[data-registro=text_cuadrant]").val();

            $.notiMsj.Confirmacion({
                Tipo: "MD",
                Titulo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_modificar_title'),
                Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_modificar'),
                BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                FuncionV: function () {
                    fn_actualizar_Cuadrante(id_cuadrant, text_cuadrant, btn);
                }
            });
        })
        $("#pnlTemplate_edition_cuadrantes").on("keyup",".cuadrant-description", function () {            
            var btn = $(this).parents("div").parents("div.col-lg-3").find("button[data-registro=guardar]");
            btn.show();
        });
        $("#btnTemplatesM_Editar").click(function () {
            //$("#pnlTemplates_settings").show();
            //$("#pnlTemplates_Ajustes").hide();
            var id_template = $("#txtTemplatesM_ID").val();
            fn_get_cuadrantes_template(id_template);
        });
        $("#pnlTemplates_settings").hide();
        $("#btnSeccionesN_Guardar").click(function () {
            id_cuadrante = $("#txtTemplate_edition_section_id_cuadrante").val()          
            $.auxFormulario.camposVacios({
                Seccion: $("#frmSeccionesN"),
                NoVacio: function () {
                    fn_registrar_Seccion(id_cuadrante)
                    //$.firmaElectronica.MostrarFirma({
                    //    Justificacion: false,
                    //    Funcion: fn_registrar_Seccion
                    //});
                }
            });
        });
    });
    function fn_registrar_Seccion(id_cuadrante) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtSeccionesN_ID").val());
        frmDatos.append("Nombre", $("#txtSeccionesN_Nombre").val());
        frmDatos.append("Descripcion", $("#txtSeccionesN_Descripcion").val());
        frmDatos.append("Cuadrante", id_cuadrante);
        frmDatos.append("Template", $("#txtTemplatesM_ID").val());
        frmDatos.append("Activo", 1);
        //Datos Firma
        //frmDatos.append("BYTOST", Param.BYTOST);
        //frmDatos.append("ZNACKA", Param.ZNACKA);
        //$("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Secciones/guardarSecciones",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    /*$("#mdlSistema_FirmaElectronica").modal("hide");*/
                    $("#mdlSecciones_Agregar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmSeccionesN") });
                }
                /*$("#btnFirmaElectronica_Firmar").removeClass("btn-progress");*/
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
                fn_get_secciones(id_cuadrante);
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_lista_cuadrantes_template_id(param) {
        var defaults = { Objeto: null, ID: null, Seleccion: null };
        var param = $.extend({}, defaults, param);
        if (param.Objeto != "") {
            var url = "/Templates/obtener_cuadrantes_template_id";
            var text_idioma = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
            $.post(url, data = { ID: param.ID }).done(function (res) {
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
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        } else {
            console.log("Ingrese el objeto donde se mostrara los roles.");
        }
    }
    function fn_get_secciones(id_cuadrante) {
        var frmDatos = new FormData();
        frmDatos.append("id_cuadrante", id_cuadrante);
        $("#divTemplate_edition_section_loader").show();
        $.ajax({
            type: "POST",
            url: "/Secciones/get_template_sections_by_id_cuadrant",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (result) {
                $("#ItemTemplate_edition_section").empty();
                var idioma_Texto = $.CargarIdioma.Obtener_Texto("txt_Idioma_Texto");
                var Idioma_Opciones = $.CargarIdioma.Obtener_Texto("txt_Idioma_Opciones");
                var Idioma_Cuadrante = $.CargarIdioma.Obtener_Texto("txt_Idioma_Cuadrante");
                $.each(result, function (i, item) {
                    $("#ItemTemplate_edition_section").append('<div class="form-group divSeccion>' +
                        '<div class="table-responsive tabla-md encabezados-fixed">' +
                        '<div class="row">' +
                        '<div class="col-md-6">' +
                        '<div class="section-title mt-0">' + item.Nombre + '</div>' +
                        '<small>' + item.Descripcion + '</small>' +
                        '</div>' +
                        '<div class="col-md-6">' +
                        '<div class="d-grid gap-2 d-md-flex justify-content-md-end">' +
                        '<button type="button" class="btn btn-sm btn-icon btn-light tooltip1" data-text="Permite agregar elementos a la sección ejem. Preguntas, Notas Etc.." style="border-radius: 13px !important;"><i class="fa fa-plus"></i> Agregar Item</button>' +
                        '<button type="button" class="btn btn-sm btn-icon btn-primary tooltip1" data-text="Permite editar nombre y descripción de la sección" style="border-radius: 13px !important;"><i class="fa fa-edit"></i> Editar Sección</button>' +
                        '<button type="button" class="btn btn-sm btn-icon btn-danger tooltip1" data-text="Permite omitir la sección" style="border-radius: 13px !important;"><i class="fa fa-trash"></i> Omitir Sección</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +   
                        '<table class="table table-bordered mt-2 tablaSeccion table-hover">' +
                        '<thead>' +
                        '<tr>' +
                        '<th scope="col">' + idioma_Texto + '</th>' +
                        '<th colspan="2" style="width:30%">' + Idioma_Opciones + '</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody id="tblSeccionRunning' + item.ID + '" style="font-size:15px"></tbody>' +
                        '</table>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );
                })
                $("#divTemplate_edition_section_loader").hide();              
            },
            error: function (error) {
                $("#divTemplate_edition_section_loader").hide();
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_Cuadrante(id_cuadrante,text_cuadrante, btn) {
        var frmDatos = new FormData();
        frmDatos.append("ID", id_cuadrante);
        frmDatos.append("Descripcion", text_cuadrante);
        btn.addClass("btn-progress")
        $.ajax({
            type: "POST",
            url: "/Templates/actualizarCuadrante",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    btn.removeClass("btn-progress")
                    btn.hide();
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    //FUNCIÓN PARA OBTENER CUADRANTES DE TEMPLATE
    function fn_get_cuadrantes_template(id_template) {
        var url = "/Templates/obtener_cuadrantes_template_id";
        var post_data = { ID: id_template };
        $.post(url, post_data).done(function (data) {
            $("#pnlTemplate_edition_cuadrantes").empty();
            $.each(data, function (i, item) {
                $("#pnlTemplate_edition_cuadrantes").append('' +
                    '<div class="col-lg-3">' +
                        '<div >' +
                            '<textarea class= "form-control cuadrant-description" style = "height:150px !important; resize:none; overflow:auto; outline:none;" > ' + item.Descripcion + '</textarea >' +
                            '<div  class="d-grid gap-2 d-md-flex  justify-content-md-end">' +
                                '<button data-registro="guardar" style="display:none" class="btn btn-success btn-sm btnSave-cuadrant-description mt-1"> Guardar cambios</button>' +
                            '</div>'+
                        '</div > ' +
                        '<div class="form-group d-grid gap-2 mt-2">' +
                    '<button id="' + item.ID + '" name="' + item.Nombre + '" style="font-size:30px; font-weight:bold; height:100px" class="btn btn-block btn-info btn-lg" > ' + item.Nombre + '</button>' +
                    '<button data-registro="omitir" style="" class="btn btn-danger btn-sm btnSave-cuadrant-description mt-1"> Omitir Cuadrante</button>' +
                        '</div>' +
                    '</div > ');
            })
        }).fail(function (error) {

        })
    }
    //FIN FUNCIÓN
});