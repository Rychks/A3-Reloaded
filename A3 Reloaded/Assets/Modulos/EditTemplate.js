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
        $("#ItemTemplate_edition_section").on("click", ".btnEditar", function () {
            var ID = $(this).parents("div").parents("div.col-md-6").find("input[data-registro=ID]").val();
            var url = "/Secciones/obtenerSeccion";
            var activado = $.CargarIdioma.Obtener_Texto('txt_Idioma_Activado');
            var desactivado = $.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado');
            $.post(url, data = { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtSeccionesM_ID").val(item.ID);
                        $("#txtSeccionesM_Nombre").val(item.Nombre);
                        $("#txtSeccionesM_Descripcion").val(item.Descripcion);
                        var template_id = $("#txtTemplatesM_ID").val();
                        var cuadrante = $("#slcSeccionesM_Cuadrante");
                        fn_lista_cuadrantes_template_id({ Objeto: cuadrante, ID: template_id, Seleccion: item.Cuadrante });
                        if (item.Activo == 1) {
                            $("#cbxSeccionesM_Activo").prop("checked", true);
                            $("label[for='cbxSeccionesM_Activo']").html(activado);
                        } else {
                            $("#cbxSeccionesM_Activo").prop("checked", false);
                            $("label[for='cbxSeccionesM_Activo']").html(desactivado);
                        }
                    });
                    $("#mdlSecciones_Modificar").modal("show");
                } else {
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
        });
        $("#btnSeccionesM_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmSeccionesM"),
                NoVacio: function () {
                    $.notiMsj.Confirmacion({
                        Tipo: "MD",
                        Titulo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_modificar_title'),
                        Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_modificar'),
                        BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                        BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                        FuncionV: function () {
                            fn_actualizar_Seccion()
                        }
                    });
                }
            });
        });
        $("#ItemTemplate_edition_section").on("click", ".btnOmitir", function () {
            var ID = $(this).parents("div").parents("div.col-md-6").find("input[data-registro=ID]").val();           
            $.notiMsj.Confirmacion({
                Tipo: "MD",
                Titulo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_Omitir_title'),
                Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Confirmacion_Omitir'),
                BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                FuncionV: function () {
                    fn_remove_seccion(ID)
                }
            });
        });
        $("#ItemTemplate_edition_section").on("click", ".btnAdd_Item", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            var nom = $(this).parents("tr").find(".NombreSeccion").html();
            var idioma_seleccione = $.CargarIdioma.Obtener_Texto("txt_Idioma_Seleccione");
            $("#txtItems_SeccionID").val(ID);
            $("#txtItems_SeccionNom").val(nom);
            fn_SetItem_PnlDefault();
            $("#mdlPreguntas_Panel").modal("show");
            fn_Items();
            $("#slcPregunta_Respuesta").val(idioma_seleccione);
        });
    });
    function fn_Items(Pagina, id_seccion) {
        //var seccion = $("#txtItems_SeccionID").val();
        var seccion = id_seccion;
        var Datos = { Seccion: id_seccion, Index: Pagina };
        $.mostrarInfo({
            URLindex: "/Items/obtenerTotalPagItems",
            URLdatos: "/Items/mostrarItems",
            Datos: Datos,
            Version: 2,
            Tabla: $("#tblSeccion" + id_seccion + ""),
            Paginado: $("#pgdItems"),
            Mostrar: function (i, item) {

                var Activo = '<span class="tag tag-green">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</span>';
                if (item.Activo == 0) {
                    Activo = '<span class="tag tag-red">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</span>';
                }

                var Botones = '<button class="btn btn-icon btn-primary btnEditar" data-toggle="tooltip"  data-registro="Editar" data-placement="bottom" title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '"><i class="far fa-edit"></i></button>';
                var Omitir = '<button class="btn btn-icon btn-danger btnOmitir" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Omitir') + '"><i class="fa fa-trash"></i></button>';
                $("#tblSeccion" + id_seccion + "").append(
                    $('<tr>')
                        .append($('<td data-registro="ID" style="display:none; text-align:center">').append(item.ID))
                        .append($('<td style="text-align:center">').append(item.RowNumber))
                        .append($('<td>').append(item.Elemento))
                        .append($('<td>').append(item.Texto))
                        .append($('<td style="text-align:center">').append(Botones))
                        .append($('<td style="text-align:center">').append(Omitir))
                );
            }
        });
    }
    function fn_SetItem_PnlDefault() {
        $("#pnlItem_Hipotesis").hide();
        $("#pnlItem_Default").show();
        $("#pnlItem_Pregunta").hide();
        $("#pnlItem_Nota").hide();
        $("#pnlItem_Instrucciones").hide();
        $("#pnlItem_Ishikawua").hide();
        $("#pnlItem_Factor").hide();
        $("#pnlItem_Missing").hide();
        $("#pnlItem_Acciones").hide();
        $("#pnlItem_Analisis").hide();
        $("#txtSeccionItem_ID").val(null);
    }
    function fn_remove_seccion(id_seccion) {
        id_cuadrante = $("#txtTemplate_edition_section_id_cuadrante").val();
        var frmDatos = new FormData();
        frmDatos.append("id_seccion", id_seccion);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Secciones/remove_section",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_get_secciones(id_cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_Seccion(param) {
        id_cuadrante = $("#txtTemplate_edition_section_id_cuadrante").val() 
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtSeccionesM_ID").val());
        frmDatos.append("Nombre", $("#txtSeccionesM_Nombre").val());
        frmDatos.append("Descripcion", $("#txtSeccionesM_Descripcion").val());
        frmDatos.append("Cuadrante", $("#slcSeccionesM_Cuadrante option:selected").val());
        frmDatos.append("Template", $("#txtTemplatesM_ID").val());
        if ($("#cbxSeccionesM_Activo").prop("checked")) {
            frmDatos.append("Activo", 1);
        } else {
            frmDatos.append("Activo", 0);
        }
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Secciones/actualizarSeccion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    $("#mdlSecciones_Modificar").modal("hide");
                    fn_get_secciones(id_cuadrante);
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
                        '<input style="display:none;" type="text" value="' + item.id_seccion + '"  data-registro="ID" />' +
                        '<button type="button" class="btn btn-sm btn-icon btn-light tooltip1 btnAdd_Item" data-text="Permite agregar elementos a la sección ejem. Preguntas, Notas Etc.." style="border-radius: 13px !important;"><i class="fa fa-plus"></i> Agregar Item</button>' +
                        '<button type="button" class="btn btn-sm btn-icon btn-primary tooltip1 btnEditar" data-text="Permite editar nombre y descripción de la sección" style="border-radius: 13px !important;"><i class="fa fa-edit"></i> Editar Sección</button>' +
                        '<button type="button" class="btn btn-sm btn-icon btn-danger tooltip1 btnOmitir" data-text="Permite omitir la sección" style="border-radius: 13px !important;"><i class="fa fa-trash"></i> Omitir Sección</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +   
                        '<table class="table table-bordered mt-2 tablaSeccion table-hover">' +
                        '<thead>' +
                        '<tr>' +
                        '<th scope="col" style="width:5%; text-align:center;">#</th>' +
                        '<th scope="col" style="width:10%">Elemento</th>' +
                        '<th scope="col">' + idioma_Texto + '</th>' +
                        '<th colspan="2" style="width:7%; text-align:center">' + Idioma_Opciones + '</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody id="tblSeccion' + item.id_seccion + '" style="font-size:15px"></tbody>' +
                        '</table>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );
                    fn_Items(1,item.id_seccion);
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