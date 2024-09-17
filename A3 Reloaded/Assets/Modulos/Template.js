define(["jquery"], function ($) {
    $(document).ready(function () {
        
        //ACTUALIZACIÓN FIN
        $("#btnTemplates_Settings_Regresar").click(function () {
            var id_template = $("#txtTemplate_edition_id").val();
            $("#pnlTemplate_edition_section").hide();
            fn_obtenerTemplate_ID(id_template);
            //$("#pnlTemplates_settings").hide();
        })
        $("#pnlTemplates_Ajustes").hide();
        $.CargarIdioma.Textos({
            Funcion: fn_iniTemplates
        });
        $(document).on('keyup', function (e) {
            if (e.key == "Escape") {
                $('#btnTemplates_Limpiar').click();
            }
        });
        $("#cbxTemplates_Activo").click(function () {
            fn_Templates();
        });
        $("#txtTemplates_Folio").on('keypress', function (e) {
            if (e.which == 13) {
                fn_Templates();
            }
        });
        $("#slcTemplates_Idioma").change(function () {
            fn_Templates();
        })
        $("#slcTemplates_TipoA3").click(function () {
            fn_Templates();
        })
        $("#btnTemplates_Limpiar").click(function () {
            $.auxFormulario.limpiarCampos({
                Seccion: $("#frmTemplates")
            });
            fn_Templates();
        });

        $("#btnTemplates_Agregar").click(function () {
            $("#slcTemplatesN_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3" });
            $("#slcTemplatesN_Idioma").generarLista({ URL: "/Lenguaje/obtener_lista_idiomas" });          
            $("#slcTemplatesN_Acceso").generarLista({ URL: "/Templates/get_templates_acceso_list" });          
            fn_obtener_folio_template();
        });
        $("#btnTemplatesM_Regresar").click(function () {
            $("#pnlTemplates_Ajustes").hide();
            $("#pnlTemplates_Admin").slideDown(1000);
        });
        $("#cbxTemplatesN_Activo").click(function () {
            if ($("#cbxTemplatesN_Activo").prop("checked")) {
                $("label[for='cbxTemplatesN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxTemplatesN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxTemplatesM_Activo").click(function () {
            if ($("#cbxTemplatesM_Activo").prop("checked")) {
                $("label[for='cbxTemplatesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxTemplatesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#btnTemplatesN_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmTemplatesN"),
                NoVacio: function () {
                    $.firmaElectronica.MostrarFirma({
                        Funcion: fn_registrar_Template
                    });
                }
            });
        });
        $("#btnTemplatesM_Guardar").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmTemplatesM"),
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
                                Funcion: fn_actualizar_templates
                            });
                        }
                    });
                }
            });
        });
        $("#btnTemplates_Buscar").click(function () {
            fn_Templates();
        });
        $("#tblTemplates table tbody").on("click", "a[data-registro=Editar]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $("#pnlTemplates_settings").show();
            $("#pnlTemplate_edition_section").hide();
            $("#txtTemplate_edition_id").val(ID);
            $("#btnTemplate_edition_add_cuadrant").hide();
            fn_obtenerTemplate_ID(ID);
            fn_get_cuadrantes_template(ID);
        });
        $("#tblTemplates table tbody").on("click", "a[data-registro=Traducir]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            var url = "/Templates/obtenerTemplate";
            $.post(url, data = { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtTemplatesN_Traducir_ID").val(item.ID);
                        $("#txtTemplatesN_Traducir_Descripcion").val(item.Descripcion);
                        $("#slcTemplatesN_Traducir_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3", Seleccion: item.TipoA3 });
                        $("#slcTemplatesN_Traducir_Idioma").generarLista({ URL: "/Lenguaje/obtener_lista_idiomas", Seleccion: item.Idioma });
                    });
                    var urlFolio = "/Templates/obtener_folio_template";
                    $.get(urlFolio).done(function (folio) {
                        $("#txtTemplatesN_Traducir_Folio").val(folio);
                    });
                    $("#mdlTemplates_Traducir").modal("show");
                } else {
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });               
        });
        $("#btnTemplatesN_Traducir_Guardar").click(function () {
            
            $.firmaElectronica.MostrarFirma({
                Funcion: fn_traducir_Template,
                Justificacion: false
            });
        });
        $("#cbxTemplatesN_Traducir_Activo").click(function () {
            if ($("#cbxTemplatesN_Traducir_Activo").prop("checked")) {
                $("label[for='cbxTemplatesN_Traducir_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxTemplatesN_Traducir_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#pgdTemplates").paginado({
            Tabla: $("#tblTemplates"),
            Version: 2,
            Funcion: fn_Templates
        });
        //Secciones
        $("#btnSecciones_Agregar").click(function () {
            var cuadrantes = $("#slcSeccionesN_Cuadrante");
            var template_id = $("#txtTemplatesM_ID").val();
            fn_lista_cuadrantes_template_id({ Objeto: cuadrantes, ID: template_id });
            $.auxFormulario.limpiarCampos({ Seccion: $("#frmSeccionesN") });
        });
        $("#cbxSeccionesN_Activo").click(function () {
            if ($("#cbxSeccionesN_Activo").prop("checked")) {
                $("label[for='cbxSeccionesN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxSeccionesN_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        $("#cbxSeccionesM_Activo").click(function () {
            if ($("#cbxSeccionesM_Activo").prop("checked")) {
                $("label[for='cbxSeccionesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
            } else {
                $("label[for='cbxSeccionesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
            }
        });
        
        $("#btnSeccionesM_Regresar").click(function () {
            $("#pnlTemplates_Ajustes").hide();
            $("#pnlTemplates_Admin").slideDown(1000);
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
                            $.firmaElectronica.MostrarFirma({
                                Justificacion: true,
                                Funcion: fn_actualizar_Seccion
                            });
                        }
                    });
                }
            });
        });

        $("#tblSecciones").on("click", ".btnEditar", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
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
        //Items
        $("#tblSecciones").on("click", ".btnPreguntas_Panel", function () {
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
        $(".btnCerrarPanelItems").click(function () {
            fn_SetItem_PnlDefault();
        });
        $("#slcItems_Elemento").change(function () {
            var item = $("#slcItems_Elemento option:selected").text();
            var idioma_pregunta = $.CargarIdioma.Obtener_Texto("txt_Idioma_Pregunta");
            var idioma_nota = $.CargarIdioma.Obtener_Texto("txt_Idioma_Notas");
            var idioma_ishikawua = $.CargarIdioma.Obtener_Texto("txt_Idioma_ishikawa");
            var idioma_instrucciones = $.CargarIdioma.Obtener_Texto("txt_Idioma_Instrucciones");
            var idioma_hipotesis = $.CargarIdioma.Obtener_Texto("txt_Idioma_Hipotesis");
            var idioma_factor = $.CargarIdioma.Obtener_Texto("txt_Idioma_Factor_causal");
            var idioma_seleccione = $.CargarIdioma.Obtener_Texto("txt_Idioma_Seleccione");
            var idioma_acciones = $.CargarIdioma.Obtener_Texto("txt_Idioma_Acciones_Preventivas");
            var idioma_analisis = $.CargarIdioma.Obtener_Texto("txt_Idioma_Analisis_porque");
            fn_SetItem_PnlDefault();
            if (item != idioma_seleccione) {
                $("#pnlItem_Default").hide();
                if (item == "0" || item == idioma_pregunta) {
                    $("#pnlItem_Pregunta").show();
                } else if (item == "2" || item == idioma_nota) {
                    $("#pnlItem_Nota").show();
                } else if (item == "3" || item == idioma_instrucciones) {
                    $("#pnlItem_Instrucciones").show();
                } else if (item == "1" || item == idioma_ishikawua) {
                    $("#pnlItem_Ishikawua").show();
                    $("#pnlItem_Ishikawua_Item").show();
                    $("#pnlItem_Ishikawua_Rama").hide();
                } else if (item == "4" || item == idioma_hipotesis) {
                    $("#pnlItem_Hipotesis").show();
                } else if (item == "5" || item == idioma_factor) {
                    $("#pnlItem_Factor").show();
                } else if (item == "6" || item == "Missing Base Condition") {
                    $("#pnlItem_Missing").show();
                } else if (item == "7" || item == idioma_acciones) {
                    $("#pnlItem_Acciones").show();
                }
                else if (item == "8" || item == idioma_analisis) {
                    $("#pnlItem_Analisis").show();
                }
            }
        });
        $("#btnItem_Guardar").click(function () {
            var item = $("#slcItems_Elemento").val();
            var idItem = $("#txtSeccionItem_ID").val();
            //$("#slcItems_Elemento").val(text_idioma);
            var idPR = $("#txtPregunta_ID").val();
            if (idPR != "" && idItem != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarPregunta
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarPregunta
                });
            }
        });
        $("#btnItemIshikawua_Ramas").click(function () {
            var id = $("#txtIshikawua_ID").val();
            if (id != "") {
                $("#pnlItem_Ishikawua_Item").slideUp();
                $("#pnlItem_Ishikawua_Rama").show();
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_debe_crear_ishikawua'), Tipo: 'warning' });
            }
        });
        $("#btnItemIshikawua_Regresar_Rama").click(function () {
            $("#pnlItem_Ishikawua_Item").show();
            $("#pnlItem_Ishikawua_Rama").slideUp();
        });
        $("#slcIshikawua_Rama").change(function () {
            var valor = $(this).val();
            var rama = $("#slcIshikawua_Rama option:selected").text();
            var id = $("#txtIshikawua_ID").val();
            var idioma_seleccione = $("#txt_Idioma_Seleccione").val();
            if (valor != idioma_seleccione) {
                fn_obtener_Rama_Info(id, rama);
            }
        });
        $("#btnItemIshikawua_Guardar").click(function () {
            var id = $("#txtIshikawua_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarIshikawua
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarIshikawua
                });
            }
        });
        $("#btnItemIshikawua_Guardar_Rama").click(function () {
            var id = $("#txtIshikawua_Rama_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarDetalleIshikawua
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarDetalleIshikawua
                });
            }
        });
        $("#btnItemFactor_Guardar").click(function () {
            var id = $("#txtFactor_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarFactor
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarfactor
                });
            }
        });
        $("#btnItemInstruccion_Guardar").click(function () {
            var id = $("#txtInstrucciones_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarInstruccion
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarInstruccion
                });
            }
        });
        $("#btnItemNota_Guardar").click(function () {
            var id = $("#txtNota_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarNota
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarNota
                });
            }
        });
        $("#btnItemHipotesis_Guardar").click(function () {
            var id = $("#txtHipotesis_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarHipotesis
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarHipotesis
                });
            }
        });
        $("#btnItemMissing_Guardar").click(function () {
            var id = $("#txtMissing_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarMissing
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarMissing
                });
            }
        });
        //CAMBIOS""
        $("#btnItemAcciones_Guardar").click(function () {
            var id = $("#txtAcciones_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarAccion
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarAcciones
                });
            }
        });
        $("#btnItemAnalisis_Guardar").click(function () {
            var id = $("#txtAnalisis_ID").val();
            if (id != "") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: true,
                    Funcion: fn_modificarAnalisis_porque
                });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_guardarAnalisis_porque
                });
            }
        });
        //eliminar Item
        $("#tblItems").on("click", ".btnOmitir", function () {
            var id = $(this).parents("tr").find("[data-registro=ID]").html();
            var urlItem = "/Items/obtener_item_id";
            var dataItem = { ID: id };
            $.post(urlItem, dataItem).done(function (resItem) {
                $.each(resItem, function (i, Tabitem) {
                    var Id_Item = Tabitem.TabId;
                    $("#txtItems_ItemOmitirID").val(Tabitem.ID)
                    if (Tabitem.Tabla == "TabPreguntas") {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_pregunta
                        });
                    } else if (Tabitem.Tabla == "TabNotas") {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_Nota
                        });
                    } else if (Tabitem.Tabla == "TabInstrucciones") {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_instruccion
                        });
                    } else if (Tabitem.Tabla == "TabHipotesis") {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_hipotesis
                        });
                    } else if (Tabitem.Tabla == "TabFactor") {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_factor
                        });
                    } else if (Tabitem.Tabla == "TabAcciones") {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_Accion
                        });
                    } else if (Tabitem.Tabla == "TabAnalisis_Porque") {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_Analisis
                        });
                    } else if (Tabitem.Tabla == "TabMissingBaseCondition") {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_Missing
                        });
                    } else {
                        $("#txtItems_OmitirID").val(Id_Item);
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: true,
                            Funcion: fn_eliminar_ishkawua
                        });
                    }
                });
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
        });
        //modificar Item
        $("#tblItems").on("click", ".btnEditar", function () {
            var id = $(this).parents("tr").find("[data-registro=ID]").html();
            var urlItem = "/Items/obtener_item_id";
            var dataItem = { ID: id };
            fn_SetItem_PnlDefault();
            var idioma_pregunta = $.CargarIdioma.Obtener_Texto("txt_Idioma_Pregunta");
            var idioma_nota = $.CargarIdioma.Obtener_Texto("txt_Idioma_Notas");
            var idioma_ishikawua = $.CargarIdioma.Obtener_Texto("txt_Idioma_ishikawa");
            var idioma_hipotesis = $.CargarIdioma.Obtener_Texto("txt_Idioma_Hipotesis");
            var idioma_factor = $.CargarIdioma.Obtener_Texto("txt_Idioma_Factor_causal");
            var idioma_instrucciones = $.CargarIdioma.Obtener_Texto("txt_Idioma_Instrucciones");
            var idioma_seleccione = $.CargarIdioma.Obtener_Texto("txt_Idioma_Seleccione");
            var idioma_acciones = $.CargarIdioma.Obtener_Texto("txt_Idioma_Acciones_Preventivas");
            var idioma_analisis = $.CargarIdioma.Obtener_Texto("txt_Idioma_Analisis_porque");
            $.post(urlItem, dataItem).done(function (resItem) {
                $.each(resItem, function (i, Tabitem) {
                    $("#pnlItem_Default").hide();
                    $("#slcItems_Elemento").val(idioma_seleccione);
                    if (Tabitem.Tabla == "TabPreguntas") {
                        $("#slcItems_Elemento").val(idioma_pregunta);
                        $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_pregunta_id(Tabitem.TabId, Tabitem.Firma);
                    } else if (Tabitem.Tabla == "TabNotas") {
                        $("#slcItems_Elemento").val(idioma_nota);
                        $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_nota_id(Tabitem.TabId);
                    } else if (Tabitem.Tabla == "TabInstrucciones") {
                        $("#slcItems_Elemento").val(idioma_instrucciones);
                        $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_instruccion_id(Tabitem.TabId);
                    } else if (Tabitem.Tabla == "TabHipotesis") {
                        $("#slcItems_Elemento").val(idioma_hipotesis);
                        $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_hipotesis_id(Tabitem.TabId);
                    } else if (Tabitem.Tabla == "TabFactor") {
                        $("#slcItems_Elemento").val(idioma_factor);
                        $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_factor_id(Tabitem.TabId);
                    } else if (Tabitem.Tabla == "TabMissingBaseCondition") {
                        $("#slcItems_Elemento").val("Missing Base Conditions");
                        $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_Missing_id(Tabitem.TabId);
                    } else if (Tabitem.Tabla == "TabAnalisis_Porque") {
                        $("#slcItems_Elemento").val(idioma_analisis);
                        $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_analisis_id(Tabitem.TabId);
                    } else if (Tabitem.Tabla == "TabAcciones") {
                            $("#slcItems_Elemento").val(idioma_acciones);
                            $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_accioness_id(Tabitem.TabId);
                    } else {
                        $("#slcItems_Elemento").val(idioma_ishikawua);
                        $("#txtSeccionItem_ID").val(Tabitem.ID);
                        fn_obtener_Ishikawua_Info(Tabitem.TabId);
                    }
                });
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
        });

        //FUNCIONES PARA ACCESO EN TEMPLATES
        $("#tblTemplates table tbody").on("click", "a[data-registro=Acceso]", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $("#slcTemplatesN_Acceso").generarLista({ URL: "/Templates/get_templates_acceso_list" });
            $("#txtTemplatesN_Acceso_ID").val(ID);
            $("#mdlTemplates_Access").modal("show");
            var url = "/Templates/obtenerTemplate";
            /* $.post(url, data = { ID: ID }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtTemplatesN_Traducir_ID").val(item.ID);
                        $("#txtTemplatesN_Traducir_Descripcion").val(item.Descripcion);
                        $("#slcTemplatesN_Traducir_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3", Seleccion: item.TipoA3 });
                        $("#slcTemplatesN_Traducir_Idioma").generarLista({ URL: "/Lenguaje/obtener_lista_idiomas", Seleccion: item.Idioma });
                    });
                    var urlFolio = "/Templates/obtener_folio_template";
                    $.get(urlFolio).done(function (folio) {
                        $("#txtTemplatesN_Traducir_Folio").val(folio);
                    });
                    $("#mdlTemplates_Traducir").modal("show");
                } else {
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); }); */              
        });
    });
    function fn_get_cuadrantes_template(id_template) {
        var url = "/Templates/obtener_cuadrantes_template_id";
        var post_data = { ID: id_template };
        $.post(url, post_data).done(function (data) {
            $("#pnlTemplate_edition_cuadrantes").empty();
            $.each(data, function (i, item) {
                $("#pnlTemplate_edition_cuadrantes").append('' +
                    '<div class="col-lg-3">' +
                    '<div >' +
                    '<textarea class= "form-control cuadrant-description" data-registro="text_cuadrant" style = "height:150px !important; resize:none; overflow:auto; outline:none;" > ' + item.Descripcion + '</textarea >' +
                    '<div  class="d-grid gap-2 d-md-flex  justify-content-md-end">' +
                    '<button data-registro="guardar" style="display:none" class="btn btn-success btn-sm btnSave-cuadrant-description mt-1"> Guardar cambios</button>' +
                    '</div>' +
                    '</div > ' +
                    '<div class="form-group d-grid gap-2 mt-2">' +
                    '<input type="text" disabled style="display:none" data-registro="id_cuadrant"  name="name" value="' + item.ID + '" />'+
                    '<button id="' + item.ID + '" name="' + item.Nombre + '" data-registro="cuadrant_info" style="font-size:30px; font-weight:bold; height:100px" class="btn btn-block btn-info btn-lg" > ' + item.Nombre + '</button>' +
                    '</div>' +
                    '</div > ');
            })
        }).fail(function (error) {

        })
    }
    function fn_iniTemplates() {
        $("#slcTemplates_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3" });
        $("#slcTemplates_Idioma").generarLista({ URL: "/Lenguaje/obtener_lista_idiomas" });
        $("#pnlTemplate_edition_section").hide();
        $.matrizAccesos.verificaAcceso({ Elemento: $("#btnTemplates_Agregar"), Url: "/Rol/verificarAcceso", FuncionId: 20 });
        fn_Templates()
    }
    function fn_Items(Pagina) {
        var seccion = $("#txtItems_SeccionID").val();
        var Datos = { Seccion: seccion, Index: Pagina };
        $.mostrarInfo({
            URLindex: "/Items/obtenerTotalPagItems",
            URLdatos: "/Items/mostrarItems",
            Datos: Datos,
            Version: 2,
            Tabla: $("#tblItems"),
            Paginado: $("#pgdItems"),
            Mostrar: function (i, item) {

                var Activo = '<span class="tag tag-green">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</span>';
                if (item.Activo == 0) {
                    Activo = '<span class="tag tag-red">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</span>';
                }

                var Botones = '<button class="btn btn-icon btn-primary btnEditar" data-toggle="tooltip"  data-registro="Editar" data-placement="bottom" title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '"><i class="far fa-edit"></i></button>';               
                var Omitir = '<button class="btn btn-icon btn-danger btnOmitir" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Omitir') + '"><i class="fa fa-times"></i></button>';
                $("#tblItems").find("tbody").append(
                    $('<tr>')
                        .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                        .append($('<td>').append(item.RowNumber))
                        .append($('<td>').append(item.Elemento))
                        .append($('<td>').append(item.Texto))
                        .append($('<td>').append(Botones))
                        .append($('<td>').append(Omitir))
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
    
    //***FUNCION PARA MOSTRAR TABLA TEMPLATES*****/
    function fn_Templates(Pagina) {
        var folio = $("#txtTemplates_Folio").val();
        var tipoA3 = $("#slcTemplates_TipoA3 option:selected").val();
        var idioma = $("#slcTemplates_Idioma option:selected").val();
        var version = null;
        var Activo = null;
        if (folio == "") { folio = null; }
        if (tipoA3 == -1) { tipoA3 = null; }
        if (idioma == -1) { idioma = null; }
        if ($("#cbxTemplates_Activo").prop("checked")) {
            Activo = 1;
        }
        var Datos = { Folio: folio, TipoA3: tipoA3 == -1 ? null : tipoA3, Idioma: idioma == -1 ? null : idioma, Version: version, Activo: Activo == -1 ? null : Activo, Index: Pagina };
        var accesoEditar = "";
        var accesoTraducir = "";
        var accesoPermisos = "";
        $.matrizAccesos.validaAcceso({ FuncionId: 21 })
            .then(obj => {
                if (obj.result > 0) {
                    accesoEditar = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Editar"><i class="dropdown-icon fas fa-edit"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '</a>';                  
                }
                return $.matrizAccesos.validaAcceso({ FuncionId: 24 });
            })
            .then(obj => {
                if (obj.result > 0) {
                    accesoPermisos = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Acceso"><i class="dropdown-icon fas fa-lock"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Acceso') + '</a>';
                }
                return $.matrizAccesos.validaAcceso({ FuncionId: 22 });
            })
            .then(obj => {
                if (obj.result > 0) {
                    accesoTraducir = '<a href="javascript:void(0)" class="dropdown-item" data-registro="Traducir"><i class="dropdown-icon fas fa-font"></i>' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Traducir') + '</a>';
                }
                var Botones = '<div class="item-action dropdown"><a href="javascript:void(0)" data-toggle="dropdown" class="icon" data-toggle-second="tooltip" title="" data-original-title="Options"><i class="fas fa-bars" style="z-index:-99 !important;"></i></a>' +
                    '<div class="dropdown-menu dropdown-menu-right">' +
                    accesoEditar +
                    accesoTraducir +
                    '</div></div>';
                $.mostrarInfo({
                    URLindex: "/Templates/obtenerTotalPagTemplate",
                    URLdatos: "/Templates/mostrarTemplates",
                    Datos: Datos,
                    Version: 2,
                    Tabla: $("#tblTemplates"),
                    Paginado: $("#pgdTemplates"),
                    Mostrar: function (i, item) {

                        var Activo = '<div class="badge badge-success">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</div>';
                        if (item.Activo == 0) {
                            Activo = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</div>';
                        }
                        //var Botones = '<button class="btn btn-icon btn-primary btnEditar" data-toggle="tooltip"  data-registro="Editar" data-placement="bottom" title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '"><i class="far fa-edit"></i></button>';
                        //var Boton_traducir = '<button class="btn btn-icon btn-info btnTraducir" data-toggle="tooltip"  data-registro="Traducir" data-placement="bottom" title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Traducir') + '" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Traducir') + '"><i class="fas fa-font"></i></button>';
                        $("#tblTemplates").find("tbody").append(
                            $('<tr>')
                                .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                                .append($('<td>').append(item.RowNumber))
                                .append($('<td>').append(item.Folio))
                                .append($('<td>').append(item.Descripcion))
                                .append($('<td>').append('<img height="30" width="30" src="/Assets/img/Templates/' + item.Imagen + '"/>'))
                                .append($('<td>').append(item.TipoA3))
                                .append($('<td>').append(item.Version))
                                .append($('<td>').append('<div class="badge badge-primary">' + item.Idioma + '</div>'))
                                .append($('<td>').append(Activo))
                                .append($('<td>').append(Botones))
                        );
                    }
                });
            }).catch(err => console.error(err));
    }
    //function fn_Secciones(Pagina) {
    //    var nombre = null;
    //    var descripcion = null;
    //    var posicion = null;
    //    var cuadrante = $("#slcSecciones_Cuadrante option:selected").val();
    //    var template = $("#txtTemplatesM_ID").val();
    //    var Activo = null;
    //    if (cuadrante == -1) { cuadrante = null; }
    //    if ($("#cbxSecciones_Activo").prop("checked")) {
    //        Activo = 1;
    //    }

    //    var Datos = { Nombre: nombre, Descripcion: descripcion, Posicion: posicion, Cuadrante: cuadrante == -1 ? null : cuadrante, Template: template, Activo: Activo == -1 ? null : Activo, Index: Pagina };
    //    $.mostrarInfo({
    //        URLindex: "/Secciones/obtenerTotalPagSeccion",
    //        URLdatos: "/Secciones/mostrarSecciones",
    //        Datos: Datos,
    //        Version: 2,
    //        Tabla: $("#tblSecciones"),
    //        Paginado: $("#pgdSecciones"),
    //        Mostrar: function (i, item) {

    //            var Activo = '<span class="tag tag-green">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</span>';
    //            if (item.Activo == 0) {
    //                Activo = '<span class="tag tag-red">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Inactivo') + '</span>';
    //            }

    //            var Botones = '<button class="btn btn-icon btn-primary btnEditar" data-toggle="tooltip"  data-registro="Editar" data-placement="bottom" title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Editar') + '"><i class="far fa-edit"></i></button>';
    //            var Preguntas = '<button class="btn btn-icon btn-success btnPreguntas_Panel" data-toggle="tooltip" data-placement="bottom" title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Agregar_Items') + '" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Agregar_Items') + '"><i class="fa fa-list"></i></button>';
    //            $("#tblSecciones").find("tbody").append(
    //                $('<tr>')
    //                    .append($('<td data-registro="ID" style="display:none">').append(item.ID))
    //                    .append($('<td>').append(item.RowNumber))
    //                    .append($('<td class="NombreSeccion">').append(item.Nombre))
    //                    .append($('<td>').append(item.Cuadrante))
    //                    .append($('<td>').append(Activo))
    //                    .append($('<td>').append(Botones))
    //                    .append($('<td>').append(Preguntas))
    //            );
    //        }
    //    });
    //}
    function fn_obtener_folio_template() {
        var url = "/Templates/obtener_folio_template";
        $.get(url).done(function (folio) {
            $("#txtTemplatesN_Folio").val(folio);
        });
        $("#txtTemplatesN_Descripcion").val(null);
        $("#txtTemplatesN_Imagen").val(null);
        $("#mdlTemplates_Agregar").modal("show");
    }
    function fn_obtenerTemplate_ID(id) {
        var url = "/Templates/obtenerTemplate";
        $.post(url, data = { ID: id }).done(function (res) {
            if (res != "") {
                $("#pnlTemplates_Admin").slideUp(1000);
                $("#pnlTemplates_Ajustes").show();
                $("#imgTemplatesM_Imagen").removeAttr("src");
                var cuadrantes = $("#slcSecciones_Cuadrante");
                var cuadrantes1 = $("#slcCuadrantes_Cuadrante");
                fn_lista_cuadrantes_template_id({ Objeto: cuadrantes, ID: id });
                fn_lista_cuadrantes_template_id({ Objeto: cuadrantes1, ID: id });
                $("#txtCuadrantesM_Descripcion").val(null);
                $.each(res, function (i, item) {
                    $("#txtTemplatesM_ID").val(item.ID);
                    $("#txtTemplatesM_Folio").val(item.Folio);                  
                    $("#txtTemplatesM_Descripcion").val(item.Descripcion);
                    $("#txtTemplatesM_TemplateVersion").val(item.template_version);
                    $("#imgTemplatesM_Imagen").attr("src", "/Assets/img/Templates/" + item.Imagen);
                    $("#slcTemplatesM_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3", Seleccion: item.TipoA3 });
                    $("#slcTemplatesM_Idioma").generarLista({ URL: "/Lenguaje/obtener_lista_idiomas", Seleccion: item.Idioma });
                    $("#slcTemplatesM_Acceso").generarLista({ URL: "/Templates/get_templates_acceso_list", Seleccion: item.Acceso });
                   
                    if (item.Activo == 1) {
                        $("#cbxTemplatesM_Activo").prop("checked", true);
                        $("label[for='cbxTemplatesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Activado'));
                    } else {
                        $("#cbxTemplatesM_Activo").prop("checked", false);
                        $("label[for='cbxTemplatesM_Activo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Desactivado'));
                    }
                    
                });
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    }
    function fn_registrar_Template(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtTemplatesN_ID").val());
        frmDatos.append("Folio", $("#txtTemplatesN_Folio").val());
        frmDatos.append("Descripcion", $("#txtTemplatesN_Descripcion").val());
        frmDatos.append("Imagen", ($("#txtTemplatesN_Imagen"))[0].files[0]);
        frmDatos.append("TipoA3", $("#slcTemplatesN_TipoA3 option:selected").val());
        frmDatos.append("Idioma", $("#slcTemplatesN_Idioma option:selected").val());
        frmDatos.append("Acceso", $("#slcTemplatesN_Acceso option:selected").val());
        if ($("#cbxTemplatesN_Activo").prop("checked")) {
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
            url: "/Templates/guardarTemplates",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlUsuarios_Agregar").modal("hide");
                    $.auxFormulario.limpiarCampos({ Seccion: $("#frmTemplatesN") });
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    $("#mdlTemplates_Agregar").modal("hide");                 
                }
                fn_Templates();
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_traducir_Template(Param) {
        var frmDatos = new FormData();
        frmDatos.append("ID_Template_Referencia", $("#txtTemplatesN_Traducir_ID").val());
        frmDatos.append("Idioma", $("#slcTemplatesN_Traducir_Idioma option:selected").val());
        frmDatos.append("Estatus", $("#txtTemplatesN_Descripcion").val());
        frmDatos.append("Tipo_A3", $("#slcTemplatesN_Traducir_TipoA3 option:selected").val());
        frmDatos.append("Folio", $("#txtTemplatesN_Traducir_Folio").val());
        frmDatos.append("Descripcion", $("#txtTemplatesN_Traducir_Descripcion").val());
        //Datos Firma
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Templates/Traducir_A3",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#mdlTemplates_Traducir").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                }
                fn_Templates();
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtenerCuadrante_ID(id) {
        var url = "/Templates/obtenerCuandrante";
        $.post(url, data = { ID: id }).done(function (res) {
            if (res != "") {
                $.each(res, function (i, item) {
                    $("#txtCuadrantesM_Descripcion").val(item.Descripcion);
                });
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    }
    function fn_actualizar_templates(Param) {
        var ID_Te = $("#txtTemplatesM_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtTemplatesM_ID").val());
        frmDatos.append("Folio", $("#txtTemplatesM_Folio").val());
        frmDatos.append("version", $("#txtTemplatesM_TemplateVersion").val());
        frmDatos.append("Descripcion", $("#txtTemplatesM_Descripcion").val());
        frmDatos.append("Imagen", ($("#txtTemplatesM_Imagen"))[0].files[0]);
        frmDatos.append("TipoA3", $("#slcTemplatesM_TipoA3 option:selected").val());
        frmDatos.append("Idioma", $("#slcTemplatesM_Idioma option:selected").val());
        frmDatos.append("Acceso", $("#slcTemplatesM_Acceso option:selected").val());
        if ($("#cbxTemplatesM_Activo").prop("checked")) {
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
            url: "/Templates/actualizarTemplate",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    fn_obtenerTemplate_ID(ID_Te);
                }
                fn_Templates();                ;
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    //function fn_actualizar_Cuadrante(param) {
    //    var frmDatos = new FormData();
    //    frmDatos.append("ID", $("#slcCuadrantes_Cuadrante option:selected").val());
    //    frmDatos.append("Descripcion", $("#txtCuadrantesM_Descripcion").val());
    //    frmDatos.append("BYTOST", param.BYTOST);
    //    frmDatos.append("ZNACKA", param.ZNACKA);
    //    frmDatos.append("ZMYSEL", param.ZMYSEL);
    //    $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
    //    $.ajax({
    //        type: "POST",
    //        url: "/Templates/actualizarCuadrante",
    //        contentType: false,
    //        processData: false,
    //        data: frmDatos,
    //        success: function (res) {
    //            if (res.Tipo == "success") {
    //                $("#mdlSistema_FirmaElectronica").modal("hide");
    //                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    
    //            }
    //            $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
    //            $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
    //        },
    //        error: function (error) {
    //            $("#mdlSistema_FirmaElectronica").modal("hide");
    //            $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
    //            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
    //        }
    //    });
    //}
    function fn_actualizar_Seccion(param) {
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
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
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
    //items funciones
    function fn_modificarPregunta(param) {
        var frmDatos = new FormData();
        var Tipo = $("#slcPregunta_Respuesta option:selected").text();
        var Tipo_val;
        if (Tipo == "Open" || Tipo == "Abierta") { Tipo_val = 1 }
        if (Tipo == "Yes/no" || Tipo == "Si/no") { Tipo_val = 0 }
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtPregunta_ID").val());
        frmDatos.append("Texto", $("#txtPregunta_Texto").val());
        frmDatos.append("Descripcion", $("#txtPregunta_Descripcion").val());
        frmDatos.append("Tipo", Tipo_val);
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        var firma = 0;
        if ($("#txtPregunta_firma").prop("checked")) {
            firma = 1;
        }
        frmDatos.append("Firma", firma);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_Pregunta",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    fn_Items();
                    $("#txtPregunta_Texto").val(null);
                    $("#txtPregunta_Descripcion").val(null);
                    $("#slcPregunta_Respuesta").val(idioma_seleccione);
                    $("#slcItems_Elemento").val(idioma_seleccione);
                    $("#txtPregunta_ID").val(null);
                    $("#txtSeccionItem_ID").val(null);
                    fn_SetItem_PnlDefault();
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
    function fn_guardarPregunta(param) {
        var frmDatos = new FormData();
        var Tipo = $("#slcPregunta_Respuesta option:selected").text();
        var Tipo_val;
        if (Tipo == "Open" || Tipo == "Abierta") { Tipo_val = 1 }
        if (Tipo == "Yes/no" || Tipo == "Si/no") { Tipo_val = 0 }
        frmDatos.append("Texto", $("#txtPregunta_Texto").val());
        frmDatos.append("Descripcion", $("#txtPregunta_Descripcion").val());
        frmDatos.append("Tipo", Tipo_val);
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        var firma = 0;
        if ($("#txtPregunta_firma").prop("checked")) {
            firma = 1;
        }
        frmDatos.append("Firma", firma);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Pregunta",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_SetItem_PnlDefault();
                    fn_Items();
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#txtPregunta_Texto").val(null);
                    $("#txtPregunta_Descripcion").val(null);
                    $("#slcPregunta_Respuesta").val(idioma_seleccione);
                    $("#slcItems_Elemento").val(idioma_seleccione);
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
    function fn_eliminar_pregunta(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_pregunta",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    $("#txtItems_ItemOmitirID").val(null);
                    fn_SetItem_PnlDefault();
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_eliminar_Nota(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_Nota",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    $("#txtItems_ItemOmitirID").val(null);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_eliminar_Accion(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_accion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    $("#txtItems_ItemOmitirID").val(null);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_eliminar_Analisis(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_analisis",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    $("#txtItems_ItemOmitirID").val(null);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_eliminar_instruccion(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_instruccion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    fn_SetItem_PnlDefault();
                    $("#txtItems_ItemOmitirID").val(null);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_eliminar_hipotesis(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_hipotesis",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    fn_SetItem_PnlDefault();
                    $("#txtItems_ItemOmitirID").val(null);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_eliminar_factor(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_factor",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    fn_SetItem_PnlDefault();
                    $("#txtItems_ItemOmitirID").val(null);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_eliminar_ishkawua(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_ishkawua",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    fn_SetItem_PnlDefault();
                    $("#txtItems_ItemOmitirID").val(null);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtener_pregunta_id(id, firma) {
        var urlPr = "/Items/obtener_Pregnta_id";
        var dataPr = { ID: id };
        var Tipo_val_open = $.CargarIdioma.Obtener_Texto("txt_Idioma_Tipo_de_Abiera");
        var Tipo_val_SI = $.CargarIdioma.Obtener_Texto("txt_Idioma_SiNo");
        var Tipo_val;
        
        $.post(urlPr, dataPr).done(function (resPr) {
            $("#pnlItem_Pregunta").show();
            $.each(resPr, function (i, TabPregunta) {
                if (TabPregunta.Tipo == "1") { Tipo_val = Tipo_val_open }
                if (TabPregunta.Tipo == "0") { Tipo_val = Tipo_val_SI }
                
                $("#txtPregunta_ID").val(TabPregunta.ID);
                $("#txtPregunta_Texto").val(TabPregunta.Texto);
                $("#txtPregunta_Descripcion").val(TabPregunta.Descripcion);
                $("#slcPregunta_Respuesta option:contains(" + Tipo_val + ")").attr('selected', true);
                $("#txtPregunta_firma").prop("checked", false);
                if (firma == "1") {
                    $("#txtPregunta_firma").prop("checked", true);
                }
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_obtener_nota_id(id) {
        var urlPr = "/Items/obtener_Nota_id";
        var dataPr = { ID: id };
        $.post(urlPr, dataPr).done(function (resPr) {
            $("#pnlItem_Nota").show();
            $.each(resPr, function (i, TabNota) {
                $("#txtNota_ID").val(TabNota.ID);
                $("#txtNota_titulo").val(TabNota.Titulo);
                $("#txtNota_Descripcion").val(TabNota.Descripcion);
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_guardarHipotesis(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtHipotesis_titulo").val());
        frmDatos.append("Descripcion", $("#txtHipotesis_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Hipotesis",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_SetItem_PnlDefault();
                    fn_Items();
                    $("#txtHipotesis_titulo").val(null);
                    $("#txtHipotesis_Descripcion").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#slcItems_Elemento").val(idioma_seleccione);
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
    function fn_modificarHipotesis(param) {
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtHipotesis_ID").val());
        frmDatos.append("Titulo", $("#txtHipotesis_titulo").val());
        frmDatos.append("Descripcion", $("#txtHipotesis_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_Hipotesis",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtHipotesis_titulo").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#txtHipotesis_Descripcion").val(null);
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
                    $("#txtHipotesis_ID").val(null);
                    $("#txtSeccionItem_ID").val(null);
                    fn_SetItem_PnlDefault();
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
    function fn_obtener_hipotesis_id(id) {
        var urlPr = "/Items/obtener_Hipotesis_id";
        var dataPr = { ID: id };
        $.post(urlPr, dataPr).done(function (resPr) {
            $("#pnlItem_Hipotesis").show();
            $.each(resPr, function (i, TabNota) {
                $("#txtHipotesis_ID").val(TabNota.ID);
                $("#txtHipotesis_titulo").val(TabNota.Titulo);
                $("#txtHipotesis_Descripcion").val(TabNota.Descripcion);
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_guardarfactor(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtFactor_titulo").val());
        frmDatos.append("Descripcion", $("#txtFactor_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Factor",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_SetItem_PnlDefault();
                    fn_Items();
                    $("#txtFactor_titulo").val(null);
                    $("#txtFactor_Descripcion").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto("txt_Idioma_Seleccione");
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
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
    function fn_modificarFactor(param) {
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtFactor_ID").val());
        frmDatos.append("Titulo", $("#txtFactor_titulo").val());
        frmDatos.append("Descripcion", $("#txtFactor_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_Factor",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtFactor_titulo").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#txtFactor_Descripcion").val(null);
                    $("#slcImtes_Elemento").val(idioma_seleccione);
                    $("#txtFactor_ID").val(null);
                    $("#txtSeccionItem_ID").val(null);
                    fn_SetItem_PnlDefault();
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
    function fn_obtener_factor_id(id) {
        var urlPr = "/Items/obtener_Factor_id";
        var dataPr = { ID: id };
        $.post(urlPr, dataPr).done(function (resPr) {
            $("#pnlItem_Hipotesis").show();
            $.each(resPr, function (i, TabNota) {
                $("#txtFactor_ID").val(TabNota.ID);
                $("#txtFactor_titulo").val(TabNota.Titulo);
                $("#txtFactor_Descripcion").val(TabNota.Descripcion);
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_guardarNota(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtNota_titulo").val());
        frmDatos.append("Descripcion", $("#txtNota_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Nota",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_SetItem_PnlDefault();
                    fn_Items();
                    $("#txtNota_titulo").val(null);
                    $("#txtNota_Descripcion").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
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
    function fn_modificarNota(param) {
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtNota_ID").val());
        frmDatos.append("Titulo", $("#txtNota_titulo").val());
        frmDatos.append("Descripcion", $("#txtNota_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_Nota",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtNota_titulo").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#txtNota_Descripcion").val(null);
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
                    $("#txtNota_ID").val(null);
                    $("#txtSeccionItem_ID").val(null);
                    fn_SetItem_PnlDefault();
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
    function fn_guardarInstruccion(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtInstrucciones_titulo").val());
        frmDatos.append("Descripcion", $("#txtInstrucciones_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Instruccion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtInstrucciones_titulo").val(null);
                    $("#txtInstrucciones_Descripcion").val(null);
                    fn_SetItem_PnlDefault();
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
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
    function fn_modificarInstruccion(param) {
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtInstrucciones_ID").val());
        frmDatos.append("Titulo", $("#txtInstrucciones_titulo").val());
        frmDatos.append("Descripcion", $("#txtInstrucciones_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_Instruccion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    fn_SetItem_PnlDefault();
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#txtInstrucciones_titulo").val(null);
                    $("#txtInstrucciones_Descripcion").val(null);
                    $("#slcImtes_Elemento").val(idioma_seleccione);
                    $("#txtInstrucciones_ID").val(null);
                    $("#txtSeccionItem_ID").val(null);
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
    function fn_obtener_instruccion_id(id) {
        var urlPr = "/Items/obtener_Instruccion_id";
        var dataPr = { ID: id };
        $.post(urlPr, dataPr).done(function (resPr) {
            $("#pnlItem_Instrucciones").show();
            $.each(resPr, function (i, TabNota) {
                $("#txtInstrucciones_ID").val(TabNota.ID);
                $("#txtInstrucciones_titulo").val(TabNota.Titulo);
                $("#txtInstrucciones_Descripcion").val(TabNota.Descripcion);
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_guardarIshikawua(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtIshikawua_titulo").val());
        frmDatos.append("Descripcion", $("#txtIshikawua_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Ishikawua",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtIshikawua_titulo").val(null);
                    $("#txtIshikawua_Descripcion").val(null);
                    $("#txtIshikawua_ID").val(res.Id);
                    $("#pnlItem_Ishikawua_Item").slideUp();
                    $("#pnlItem_Ishikawua_Rama").show();
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
    function fn_guardarDetalleIshikawua(param) {
        var frmDatos = new FormData();
        frmDatos.append("Rama", $("#slcIshikawua_Rama option:selected").text());
        frmDatos.append("Descripcion", $("#txtIshikawua_Descripcion_Rama").val());
        frmDatos.append("Ishikawua", $("#txtIshikawua_ID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Detalle_Ishikawua",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
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

    function fn_guardarAcciones(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtAcciones_titulo").val());
        frmDatos.append("Descripcion", $("#txtAcciones_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Accion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_SetItem_PnlDefault();
                    fn_Items();
                    $("#txtAcciones_titulo").val(null);
                    $("#txtAcciones_Descripcion").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
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
    function fn_modificarAccion(param) {
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtAcciones_ID").val());
        frmDatos.append("Titulo", $("#txtAcciones_titulo").val());
        frmDatos.append("Descripcion", $("#txtAcciones_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_accion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#txtAcciones_Descripcion").val(null);
                    $("#txtAcciones_titulo").val(null);
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
                    $("#txtAcciones_ID").val(null);
                    $("#txtSeccionItem_ID").val(null);
                    fn_SetItem_PnlDefault();
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
    function fn_guardarAnalisis_porque(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtAnalisis_titulo").val());
        frmDatos.append("Descripcion", $("#txtAnalisis_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Accion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_SetItem_PnlDefault();
                    fn_Items();
                    $("#txtAnalisis_titulo").val(null);
                    $("#txtAnalisis_Descripcion").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
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
    function fn_modificarAnalisis_porque(param) {
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtAnalisis_ID").val());
        frmDatos.append("Titulo", $("#txtAnalisis_titulo").val());
        frmDatos.append("Descripcion", $("#txtAnalisis_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_accion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#txtAnalisis_Descripcion").val(null);
                    $("#txtAnalisis_titulo").val(null);
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
                    $("#txtAnalisis_ID").val(null);
                    $("#txtSeccionItem_ID").val(null);
                    fn_SetItem_PnlDefault();
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
    function fn_obtener_Rama_Info(id, Rama) {
        var urlPr = "/Items/obtener_Detalle_Ishikawua_Rama";
        var dataPr = { ID: id, Rama: Rama };
        $("#txtIshikawua_Rama_ID").val(null);
        $("#txtIshikawua_Descripcion_Rama").val(null);
        $.post(urlPr, dataPr).done(function (resPr) {
            $.each(resPr, function (i, TabRama) {
                $("#txtIshikawua_Rama_ID").val(TabRama.ID);
                $("#txtIshikawua_Descripcion_Rama").val(TabRama.Descripcion);
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });

    }
    function fn_modificarDetalleIshikawua(param) {
        var frmDatos = new FormData();
        frmDatos.append("Rama", $("#slcIshikawua_Rama option:selected").text());
        frmDatos.append("Descripcion", $("#txtIshikawua_Descripcion_Rama").val());
        frmDatos.append("ID_Ishikawua", $("#txtIshikawua_ID").val());
        frmDatos.append("ID", $("#txtIshikawua_Rama_ID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_Detalle_Ishikawua",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
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
    function fn_obtener_Ishikawua_Info(id) {
        var urlPr = "/Items/obtener_Ishikawua_id";
        var dataPr = { ID: id };
        $.post(urlPr, dataPr).done(function (resPr) {
            $.each(resPr, function (i, TabRama) {
                $("#txtIshikawua_ID").val(TabRama.ID);
                $("#txtIshikawua_titulo").val(TabRama.Titulo);
                $("#txtIshikawua_Descripcion").val(TabRama.Descripcion);
            });
            $("#pnlItem_Ishikawua").show();
            $("#pnlItem_Ishikawua_Item").show();
            $("#pnlItem_Ishikawua_Rama").hide();
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_modificarIshikawua(param) {
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtIshikawua_ID").val());
        frmDatos.append("Titulo", $("#txtIshikawua_titulo").val());
        frmDatos.append("Descripcion", $("#txtIshikawua_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_Ishikawua",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
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
    function fn_guardarMissing(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtMissing_titulo").val());
        frmDatos.append("Descripcion", $("#txtMissing_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/registrar_Missing",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_SetItem_PnlDefault();
                    fn_Items();
                    $("#txtMissing_titulo").val("Missing Base Conditions");
                    $("#txtMissing_Descripcion").val(null);
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione+'"]').val();
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
    function fn_modificarMissing(param) {
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtSeccionItem_ID").val());
        frmDatos.append("ID", $("#txtMissing_ID").val());
        frmDatos.append("Titulo", $("#txtMissing_titulo").val());
        frmDatos.append("Descripcion", $("#txtMissing_Descripcion").val());
        frmDatos.append("Seccion", $("#txtItems_SeccionID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/Modificar_Missing",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtMissing_titulo").val("Missing Base Conditions");
                    var idioma_seleccione = $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione');
                    $("#txtMissing_Descripcion").val(null);
                    $('#slcItems_Elemento').find('option[text="' + idioma_seleccione + '"]').val();
                    $("#txtMissing_ID").val(null);
                    $("#txtSeccionItem_ID").val(null);
                    fn_SetItem_PnlDefault();
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
    function fn_obtener_Missing_id(id) {
        var urlPr = "/Items/obtener_Missing_id";
        var dataPr = { ID: id };
        $.post(urlPr, dataPr).done(function (resPr) {
            $("#pnlItem_Missing").show();
            $.each(resPr, function (i, TabMissing) {
                $("#txtMissing_ID").val(TabMissing.ID);
                $("#txtMissing_titulo").val(TabMissing.Titulo);
                $("#txtMissing_Descripcion").val(TabMissing.Descripcion);
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_obtener_analisis_id(id) {
        var urlPr = "/Items/obtener_analisis_id";
        var dataPr = { ID: id };
        $.post(urlPr, dataPr).done(function (resPr) {
            $("#pnlItem_Analisis").show();
            $.each(resPr, function (i, TabAnalisis) {
                $("#txtAnalisis_ID").val(TabAnalisis.ID);
                $("#txtAnalisis_titulo").val(TabAnalisis.Titulo);
                $("#txtAnalisis_Descripcion").val(TabAnalisis.Descripcion);
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_obtener_accioness_id(id) {
        var urlPr = "/Items/obtener_acciones_id";
        var dataPr = { ID: id };
        $.post(urlPr, dataPr).done(function (resPr) {
            $("#pnlItem_Acciones").show();
            $.each(resPr, function (i, TabAnalisis) {
                $("#txtAcciones_ID").val(TabAnalisis.ID);
                $("#txtAcciones_titulo").val(TabAnalisis.Titulo);
                $("#txtAcciones_Descripcion").val(TabAnalisis.Descripcion);
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_error_mostrar_info'), Tipo: "danger", Error: error }); });
    }
    function fn_eliminar_Missing(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtItems_OmitirID").val());
        frmDatos.append("ID_Item", $("#txtItems_ItemOmitirID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Items/eliminar_Missing",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_Items();
                    $("#txtItems_OmitirID").val(null);
                    $("#txtItems_ItemOmitirID").val(null);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Registro_omitir_error'), Tipo: "danger", Error: error });
            }
        });
    }
});





