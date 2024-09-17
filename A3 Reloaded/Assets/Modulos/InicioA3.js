define(["jquery"], function ($) {
    $(document).ready(function () {
        $("#pnlHistorial").hide();
        $("#tiposA3").show();
        $("#divLoaderSecciones").hide();
        $("#divLoaderCuadranteD").hide()
        $("#pnlInicio_Formulario_Nueva_Investigacion").hide();
        $("#pnlTemplatesRunning_Investigacion").hide();
        $("#pnlTemplatesRunning_Investigacion").hide();
        $("#pnlTemplatesRunning_secciones").hide();
        $.CargarIdioma.Textos({
            Funcion: fn_cargaTiposA3
        });

        $("#btnMenuPrin").click(function () {
            $("#tiposA3").slideDown(1000);
            $("#pnlTemplatesRunning_Investigacion").hide();
            window.location.href = "/Home";
        });
        $("#btnHistorialA3_Regresar").click(function () {
            $("#tiposA3").slideDown();
            $("#pnlHistorial").hide();
        });
        $("#btnTipoA3_Historial_mostrar").click(function () {
            $("#slcTemplatesRunning_History_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3" });
            $("#tiposA3").slideUp();
            $("#pnlHistorial").show();
            $("#pnlInicio_Formulario_Nueva_Investigacion").hide();
            fn_TemplatesRunning_History();
        });
        $("#btnReporteRunning_Ver_Adjuntos").click(function () {
            $("#pnlReporte_tbl_AdjuntosRunning").show();
            $("#pnlReporte_tbl_ReporteRunning").hide();
        });
        $("#btnReporteRunning_Ver_Reporte").click(function () {
            $("#pnlReporte_tbl_AdjuntosRunning").hide();
            $("#pnlReporte_tbl_ReporteRunning").show();
        });
        //crear nueva investigacion
        $("#tblTemplatesActivos").on("click", ".btnComenzar", function () {
            var id = $(this).parents("tr").find(".idTemplate").html();
            var PmCard = $(this).parents("tr").find("[data-registro=PmCard]").html();
            var url = "/Templates/obtenerTemplate";
            $.post(url, data = { ID: id }).done(function (res) {
                if (res != "") {
                    $.each(res, function (i, item) {
                        $("#txtTemplatesRunningN_ID").val(item.ID);
                        $("#slcTemplatesRunningN_TipoA3").generarLista({ URL: "/Templates/Lista_Formatos_A3", Seleccion: item.TipoA3 });
                        $("#slcTemplatesRunningN_Usuarios").generarLista({ URL: "/Usuarios/Lista_Usuarios" });
                        $("#slcTemplatesRunningN_Usuarios").select2({
                            dropdownParent: $('#mdlTemplate_info_template .modal-content')
                        });
                        $("#slcTemplatesRunningN_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos" });
                        $("#slcTemplatesRunningN_Subarea").generarLista({ URL: "/Subareas/Lista_Subareas" });
                        $("#slcTemplatesRunningN_Linea").generarLista({ URL: "/Lineas/Lista_Lineas" });
                        $("#slcTemplatesRunningN_Equipo").generarLista({ URL: "/Equipos/Lista_Equipos" });
                        fn_obtener_folio_nueva_investigacion();
                        $("#pnlTemplateRunning_Cuadrante_D").hide();
                        $("#tiposA3").hide();
                        get_configuration_panels(id)
                       
                        if (PmCard != "0") {
                            $("#slc_PmCardRunning_linea").generarLista({ URL: "/Lineas/Lista_Lineas" });
                            get_list_failure_mode_category();
                            $("#plnTemplate_PmCard").show();

                        } else {
                            $("#plnTemplate_PmCard").hide();
                        }
                        $("#pnlInicio_Formulario_Nueva_Investigacion").show();
                        $("#tblTemplateRunningN_Evaluadores").empty();
                    });
                } else {
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: null });
                }
            }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
            
        });
        /* FUNCTION TO GET TOP 5 FAILURES*/
        $("#slc_PmCardRunning_linea").change(function () {
            let Linea_text = $("#slc_PmCardRunning_linea option:selected").text();
            fn_getTop5_faiulres(Linea_text);
        })

        /* **************************  */
        $("#btnTemplatesRunningN_Guardar").click(function () {
            var rows = $('#tblTemplateRunningN_Evaluadores tr').length;
            if (rows > 0) {
                $.auxFormulario.camposVacios({
                    Seccion: $("#frmTemplatesRN_Pnl"),
                    NoVacio: function () {
                        $.firmaElectronica.MostrarFirma({
                            Funcion: fn_comenzar_Investigacion
                        });
                    },
                    EsVacio: function () {
                        $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
                        $('html, body').animate({
                            scrollTop: $("#frmTemplatesRN").offset().top
                        }, 500);
                        $("#frmTemplatesRN").css({ "border": "solid", "border-color": "red" });
                        setInterval(function () {
                            $("#frmTemplatesRN").css("border", "none");
                        }, 2000);
                    }
                });
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
                $('html, body').animate({
                    scrollTop: $("#frmTemplateR_Evaluadores").offset().top
                }, 500);
                $("#frmTemplateR_Evaluadores_Body").css({ "border": "solid", "border-color": "red" });
                setInterval(function () {
                    $("#frmTemplateR_Evaluadores_Body").css("border", "none");
                }, 2000);
            }
        });
        //
        $("#btnTemplateRunningN_Evaluador_Agregar").click(function () {
            fn_agregar_evaluadores();
        });
        $("#btnTemplateRunningN_Departamento_Agregar").click(function () {
            fn_agregar_Departamento();
        });
        $("#btnTemplateRunningN_Subarea_Agregar").click(function () {
            fn_agregar_Subarea();
        });
        $("#btnTemplateRunningN_Linea_Agregar").click(function () {
            fn_agregar_Linea();
        });
        $("#btnTemplateRunningN_Equipo_Agregar").click(function () {
            fn_agregar_Equipo();
        });
        $("#tblTemplateRunningN_Evaluadores").on("click", ".btnOmitirFirma", function () {
            $(this).closest("tr").remove();
        });
        $("#tblTemplateRunningN_Departamentos").on("click", ".btnOmitir", function () {
            $(this).closest("tr").remove();
        });
        $("#tblTemplateRunningN_Subareas").on("click", ".btnOmitir", function () {
            $(this).closest("tr").remove();
        });
        $("#tblTemplateRunningN_Lineas").on("click", ".btnOmitir", function () {
            $(this).closest("tr").remove();
        });
        $("#tblTemplateRunningN_Equipos").on("click", ".btnOmitir", function () {
            $(this).closest("tr").remove();
        });
        //Funcion Evaluadores Running
        $("#tblEvaluadoresTemplate_Running").on("click", ".btnOmitirFirmaRinning", function () {
            var ID = $(this).parents("tr").find(".idRevisor").html();
            $("#txtEvaluadores_TemplatesR_ID").val(ID);
            $.firmaElectronica.MostrarFirma({
                Justificacion: true,
                Funcion: fn_omitir_evaluador_BD
            });

        });
        $("#btnTemplateRunning_Evaluador_Agregar").click(function () {
            var usuario = $("#slcTemplatesRunningN_Usuarios_Revisor option:selected").val();
            var usuario_text = $("#slcTemplatesRunningN_Usuarios_Revisor option:selected").text();
            var elaborador = $("#pnlTemplatesRunningM_Contact").val();
            var j = 0;
            if (usuario != "-1") {
                var rows = $('#tblEvaluadoresTemplate_Running tr').length;
                if (elaborador == usuario_text) {
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Elaborador_Evaluadores'), Tipo: "info", Error: null });
                } else {
                    if (rows > 0) {
                        $('#tblEvaluadoresTemplate_Running tr').each(function () {
                            var Usuario_ID = $(this).find(".idUsuario").html();
                            if (usuario == Usuario_ID) {
                                j = 1;
                                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Usuario_ya_agregado'), Tipo: "info", Error: null });
                            }
                        });
                        if (j == 0) {
                            $.firmaElectronica.MostrarFirma({
                                Justificacion: false,
                                Funcion: fn_agregar_evaluadores_running
                            });
                        }
                    } else {
                        $.firmaElectronica.MostrarFirma({
                            Justificacion: false,
                            Funcion: fn_agregar_evaluadores_running
                        });
                    }
                }
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }

        });
        //Funciones Departamentos Running
        $("#btnTemplatesRunningN_Departamentos").click(function () {
            $("#slcTemplatesRunningN_Departamentos_Departamento").generarLista({ URL: "/Departamento/Lista_Departamentos" });
            fn_obtener_departamentos_running();
            $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
            $("#mdlDepartamento_Panel").modal("show");
        });
        $("#btnTemplateRunningN_Departamentos_Agregar").click(function () {
            var departamento = $("#slcTemplatesRunningN_Departamentos_Departamento option:selected").val();
            if (departamento != "-1") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_agregar_departamento_running
                });
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }          
        });
        $("#tblTemplateRunningN_Departamentos_Datos").on("click", ".btnRemoverRegistro", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $("#txtTemplatesRunningN_Departamentos_ID").val(ID);
            $.firmaElectronica.MostrarFirma({
                Justificacion: true,
                Funcion: fn_remover_departamento_running
            });
        });
        //Funciones Lineas Running
        $("#btnTemplatesRunningN_Lineas").click(function () {
            $("#slcTemplatesRunningN_Lineas_Linea").generarLista({ URL: "/Lineas/Lista_Lineas" });
            fn_obtener_Lineas_running();
            $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
            $("#mdlLinea_Panel").modal("show");
        });
        $("#btnTemplateRunningN_Lineas_Agregar").click(function () {
            var linea = $("#slcTemplatesRunningN_Lineas_Linea option:selected").val();
            if (linea != "-1") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_agregar_linea_running
                });
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }
        });
        $("#tblTemplateRunningN_Lineas_Datos").on("click", ".btnRemoverRegistro", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $("#txtTemplatesRunningN_Lineas_ID").val(ID);
            $.firmaElectronica.MostrarFirma({
                Justificacion: true,
                Funcion: fn_remover_linea_running
            });
        });
        //Funciones Equipos Running
        $("#btnTemplatesRunningN_Equipos").click(function () {
            $("#slcTemplatesRunningN_Equipos_Equipo").generarLista({ URL: "/Equipos/Lista_Equipos" });
            fn_obtener_Equipos_running();
            $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
            $("#mdlEquipos_Panel").modal("show");
        });
        $("#btnTemplateRunningN_Equipos_Agregar").click(function () {
            var linea = $("#slcTemplatesRunningN_Equipos_Equipo option:selected").val();
            if (linea != "-1") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_agregar_Equipos_running
                });
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }
        });
        $("#tblTemplateRunningN_Equipos_Datos").on("click", ".btnRemoverRegistro", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $("#txtTemplatesRunningN_Equipos_ID").val(ID);
            $.firmaElectronica.MostrarFirma({
                Justificacion: true,
                Funcion: fn_remover_Equipos_running
            });
        });
        //Funciones Subareas
        $("#btnTemplatesRunningN_Subareas").click(function () {
            $("#slcTemplatesRunningN_Subareas_Subarea").generarLista({ URL: "/Subareas/Lista_Subareas" });
            fn_obtener_Subareas_running();
            $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
            $("#mdlSubareas_Panel").modal("show");
        });
        $("#btnTemplateRunningN_Subareas_Agregar").click(function () {
            var subarea = $("#slcTemplatesRunningN_Subareas_Subarea option:selected").val();
            if (subarea != "-1") {
                $.firmaElectronica.MostrarFirma({
                    Justificacion: false,
                    Funcion: fn_agregar_Subareas_running
                });
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }
        });
        $("#tblTemplateRunningN_Subareas_Datos").on("click", ".btnRemoverRegistro", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $("#txtTemplatesRunningN_Subareas_ID").val(ID);
            $.firmaElectronica.MostrarFirma({
                Justificacion: true,
                Funcion: fn_remover_Subareas_running
            });
        });
        //Funciones A3 Historial
        $("#btnTemplatesRunning_History_Buscar").click(function () {
            fn_TemplatesRunning_History();
        });
        $("#btnTemplatesRunning_History_Limpiar").click(function () {
            $.auxFormulario.limpiarCampos({
                Seccion: $("#frmTemplatesR_Historial")
            });;
            fn_TemplatesRunning_History();
        });
        $("#btnTemplatesRunning_Reporte_A3_Generados").click(function () {
            fn_Reporte_A3_Generados();
        });
        $("#btnTemplatesRunning_Reporte_Uso_App").click(function () {
            url = "/Sistema/reporte_A3_Uso_App";
            window.open(url, '_blank');
            return false;
        });
        $("#tblTemplatesRunning_History").on("click", ".btnContinuar", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            $("#txtTemplatesRunningN_ID").val(ID);
            var url = "/Sistema/obtener_estatus_template";
            var data = { ID: ID };
            $.post(url, data).done(function (info) {
                var res = "0";
                var url1 = "/Sistema/valida_responsable_usuario";
                var data1 = { ID: ID };
                $.post(url1, data1).done(function (info1) {
                    res = info1.Id;
                    if (info.Id == "3" || info.Id == "2" || info.Id == "0") {
                        var texto_alert;
                        if (info.Id == "3") {
                            texto_alert = $.CargarIdioma.Obtener_Texto('txt_Idioma_Reabrir_investigacion_mensaje_completo');
                        } else {
                            texto_alert = $.CargarIdioma.Obtener_Texto('txt_Idioma_Reabrir_investigacion_mensaje_mitad');
                        }
                        if (res == "1") {
                            alert();
                            $.notiMsj.Confirmacion({
                                Tipo: "MD",
                                Titulo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Reabrir_investigacion'),
                                Mensaje: texto_alert,
                                BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                                BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                                FuncionV: function () {
                                    $.firmaElectronica.MostrarFirma({
                                        Justificacion: true,
                                        Funcion: registrar_firma_reabrir_A3
                                    });
                                },
                                FuncionF: function () {
                                    alert();
                                    window.location.replace("/Home/Index");
                                }
                            });
                        } else {
                            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Error_Reabrir_Investigacion'), Tipo: "danger", Error: null });
                        }
                    } else {
                        if (res == "1") {
                            fn_mostrar_Investigacion(ID);
                            fn_mostrar_Cuadrantes_btn(ID);
                            $("#pnlTemplateRunning_Cuadrante_D").hide();
                        } else {
                            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Error_Reabrir_Investigacion'), Tipo: "danger", Error: null });
                        }
                    }
                });
            });
        });
        //Reportes
        $("#btnTemplatesRunning_Reporte_Est_Departamento").click(function () {
            url = "/Reportes/Reporte_Departamento";
            window.open(url, '_blank');
            return false;
        });
        $("#btnTemplatesRunning_Reporte_Est_Linea").click(function () {
            url = "/Reportes/Reporte_Linea";
            window.open(url, '_blank');
            return false;
        });
        $("#btnTemplatesRunning_Reporte_Est_Equipo").click(function () {
            url = "/Reportes/Reporte_Equipo";
            window.open(url, '_blank');
            return false;
        });
        $("#btnTemplatesRunning_Reporte_Est_Subarea").click(function () {
            url = "/Reportes/Reporte_Subarea";
            window.open(url, '_blank');
            return false;
        });
        //Funciones Reporte A3
        $("#tblTemplatesRunning_History").on("click", ".btnPdf", function () {
            var ID = $(this).parents("tr").find("[data-registro=ID]").html();
            fn_validar_Evaluador(ID);
        });
        $("#tblAdjuntosTemplate_Running").on("click", ".btnVerAdjunto", function () {
            var Archivo = $(this).parents("tr").find(".NomAdjunto").html();
            window.open("/Assets/Adjuntos/" + Archivo, '_blank');
            return false;
        });
        $("#slcTemplateRunning_Reporte_Versiones").change(function () {
            var valor = $(this).val();
            var ID = $("#txtTemplateRunning_Reporte_ID").val();
            $("#ReporteRunning_url").attr("src", "");
            if (valor != "0") {
                $("#ReporteRunning_url").attr("src", "/Assets/Veriones_A3/" + valor);
            } else {
                var url2 = "/Sistema/validar_template_WP_id";
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
                var versionURL = "/Sistema/obtener_version_actual_documento";
                var versionData = { Template: ID };
                $.post(versionURL, versionData).done(function (version) {
                    fn_obtener_flujo_reporte_A3(ID, version);
                    $("#btnReporteRunning_Firmar").show();
                    $("#btnReporteRunning_Rechazar").show();
                });
            } else {
                var versionURL = "/Reportes/obtener_version_documento";
                var versionData = { Template: ID, Documento: valor };
                $.post(versionURL, versionData).done(function (version) {
                    fn_obtener_flujo_reporte_A3(ID, version);
                    $("#btnReporteRunning_Firmar").hide();
                    $("#btnReporteRunning_Rechazar").hide();
                });
            }          
        });
       
        //Funciones Cuadrantes
        $("#pnlTemplatesRunning_Cuadrantes").on("click", "button", function (event) {
            let id = this.id;
            let name = this.name;
            fn_verifica_cuadrantes($("#txtTemplatesRunningN_ID").val(), name, id);
        });
        //ACCIONES DE BOTONES EN A3
        //Genera el formulario para contestar items 
        $("#ItemTemplateRunning_SeccionRunning").on("click", "button", function () {
            
            let id = this.id;
            let name = this.name;
            if (name == "ItemID") {
                obtenerElemento_Caracteristicas(id);
            } else if (name == "btnAdjuntos") {
                $("#txtAdjuntos_Item_Archivo").val(null);
                $("label[for='txtAdjuntos_Item_Archivo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione_Archivo'));
                $("#txtAdjuntos_Item_ID").val(id);
                fn_obtenerAdjuntos(id);
                $("#mdlAdjuntos_Panel").modal("show");
            } else if (name == "btnRedireccion") {
                var ID_Template = $("#txtTemplatesRunningN_ID").val();
                if (id == "btn_CuadranteA_D") {
                    fn_obtener_estatus_cuadrante(ID_Template, "A", "D");
                } else if (id == "btn_CuadranteA_B") {
                    fn_obtener_estatus_cuadrante(ID_Template, "A", "B");
                } else if (id == "btn_CuadranteB_C") {
                    fn_obtener_estatus_cuadrante(ID_Template, "B", "C");
                } else if (id == "btn_CuadranteC_D") {
                    fn_obtener_estatus_cuadrante(ID_Template, "C", "D");
                }
            }
        });
        $("#btnTemplateRunning_Regresar_Cuadrantes").click(function () {

            $("#pnlTemplatesRunning_Investigacion").slideDown();
            $("#pnlTemplatesRunning_secciones").hide();
            $("#pnlTemplateRunning_Cuadrante_D").hide();
            var ID = $("#txtTemplatesRunningN_ID").val();
            fn_mostrar_Investigacion(ID);
            fn_mostrar_Cuadrantes_btn(ID);
        });
        //Evaluadores Running
        $("#btnTemplatesRunningN_Evaluadores").click(function () {
            var ID = $("#txtTemplatesRunningN_ID").val();
            
            $("#slcTemplatesRunningN_Usuarios_Revisor").generarLista({ URL: "/Usuarios/Lista_Usuarios" });
            $("#slcTemplatesRunningN_Usuarios_Revisor").select2({
                dropdownParent: $('#mdlEvaluadores_Panel .modal-content')
            });
           
            fn_obtener_evaluadores(ID);
            $("#mdlEvaluadores_Panel").modal("show");
        });
        //Funciones Items Running
        $("#btnItemRunning_Guardar_Respuesta").click(function () {
            var Tabla = $("#txtItemRunning_Tabla").val();
            var Item_ID = $("#txtItemRunning_ID").val();
            var Pregunta_ID = $("#txtPreguntaRunning_ID").val();
            var tipo = $("#txtPreguntaRunning_TipoRespuesta").val();
            var firma = $("#txtItemRunning_Firma").val();
            if (Tabla == "TabPreguntas_Running") {
                if (firma != "0") {
                    if (tipo == "1") {
                        $.auxFormulario.camposVacios({
                            Seccion: $("#pnlItem_PreguntaRunning"),
                            Excepciones: ['txtPreguntaRunning_Comentarios', 'txtPreguntaRunning_ID'],
                            NoVacio: function () {
                                $.firmaElectronica.MostrarFirma({
                                    Funcion: guardarRespuesta_PreguntaRunning_Firma_Abierta
                                });
                            },
                        });
                    } else {
                        $.auxFormulario.camposVacios({
                            Seccion: $("#pnlItem_PreguntaRunning"),
                            Excepciones: ['txtPreguntaRunning_Comentarios', 'txtPreguntaRunning_ID', 'txtPreguntaRunning_Respuesta_Abierta'],
                            NoVacio: function () {
                                $.firmaElectronica.MostrarFirma({
                                    Funcion: guardarRespuesta_PreguntaRunning_Firma_Cerrada
                                });
                            },
                        });
                    }

                } else {
                    if (tipo == "1") {
                        $.auxFormulario.camposVacios({
                            Seccion: $("#pnlItem_PreguntaRunning"),
                            Excepciones: ['txtPreguntaRunning_Comentarios', 'txtPreguntaRunning_ID'],
                            NoVacio: function () {
                                guardarRespuesta_PreguntaRunning_Abierta();
                            }
                        });
                    } else {
                        $.auxFormulario.camposVacios({
                            Seccion: $("#pnlItem_PreguntaRunning"),
                            Excepciones: ['txtPreguntaRunning_Comentarios', 'txtPreguntaRunning_ID', 'txtPreguntaRunning_Respuesta_Abierta'],
                            NoVacio: function () {
                                guardarRespuesta_PreguntaRunning_Cerrada();
                            }
                        });
                    }

                }
            }
        });
        $("#btnNotaRunning_Guardar_Respuesta").click(function () {
            $.auxFormulario.camposVacios({
                Seccion: $("#frmNotaRunning"),
                NoVacio: function () {
                    guardarRespuesta_NotaRunning()
                },
            });
        });
        $("#btnHipotesisRunning_Guardar_Respuesta").click(function () {
            var Tabla = $("#txtItemHipotesisRunning_Tabla").val();
            var Item_ID = $("#txtItemHipotesisRunning_ID").val();
            var Nota_ID = $("#txtHipotesisRunning_ID").val();
            if (Tabla == "TabHipotesis_Running") {
                guardarRespuesta_HipotesisRunning();
            }
        });
        $("#btnFactorRunning_Guardar_Respuesta").click(function () {
            var Tabla = $("#txtItemFactorRunning_Tabla").val();
            var Item_ID = $("#txtItemFactorRunning_ID").val();
            var Nota_ID = $("#txtFactorRunning_ID").val();
            if (Tabla == "TabFactor_Running") {
                guardarRespuesta_FactorRunning();
            }
        });
        $("#btnInstruccionRunning_Guardar_Respuesta").click(function () {
            var Tabla = $("#txtItemInstruccionRunning_Tabla").val();
            var Item_ID = $("#txtItemInstruccionRunning_ID").val();
            var Nota_ID = $("#txtInstruccionRunning_ID").val();
            if (Tabla == "TabInstrucciones_Running") {
                guardarRespuesta_InstruccionRunning();
            }
        });
        $("#btnIshikawuaRunning_Guardar_Respuesta").click(function () {
            var j = 0;
            var i = 0;
            $('select[name=slcRespuesta_ishikawua]').each(function () {
                var opc = $(this).val();
                if (opc != null) {
                    i++;
                }
                j++;
            });
            if (j == i) {
                guardarRespuesta_IshikawuaRunning();
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }
        });
        $("#btnMissingRunning_Guardar_Respuesta").click(function () {
            guardarRespuesta_MissingRunning();
        });
        $("#btnMissingRunning_Nuevo_Registro").click(function () {
            fn_Agregar_Missing();
        });
        $("#btnHipotesisRunning_Agregar_Hipotesis").click(function () {
            var Titulo = $("#txtHipotesisRunning_Titulo").text();
            var Descripcion = $("#txtHipotesisRunning_Descripcion").text();
            fn_Agreagar_Hipotesis();
        });
        $("#btnFactorRunning_Agregar_Factor").click(function () {
            fn_Agreagar_Factor();
        });
        $("#btnMissingRunning_Remover_Registro").click(function () {
            fn_Eliminar_Missing();
        })
        $("#btnHipotesisRunning_Omitir_Hipotesis").click(function () {
            fn_eliminar_hipotesis_running();
        });
        $("#btnFactorRunning_Omitir_Factor").click(function () {
            eliminar_factor_running();
        });
        //Funciones Adjuntos
        $("#txtAdjuntos_Item_Archivo").change(function () {
            var Archivo = ($("#txtAdjuntos_Item_Archivo"))[0].files[0];
            var Archivo_Name = ($("#txtAdjuntos_Item_Archivo"))[0].files[0].name;
            if (!Archivo) {
                $("label[for='txtAdjuntos_Item_Archivo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione_Archivo'));
            } else {
                $("label[for='txtAdjuntos_Item_Archivo']").html(Archivo_Name);
            }
        });
        $("#btnAdjuntos_Item_agregar").click(function () {
            $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
            var Archivo = ($("#txtAdjuntos_Item_Archivo"))[0].files[0]
            if (!Archivo) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            } else {
                $.firmaElectronica.MostrarFirma({
                    Funcion: fn_guardarAdjunto
                });
            }
        });
        $("#tblAdjuntos_Running").on("click", ".btnOmitirAdjunto", function () {
            var id = $(this).parents("tr").find(".idAdjunto").html();
            $("#txtAdjuntos_ID").val(id);
            $.firmaElectronica.MostrarFirma({
                Funcion: fn_omitirAdjunto
            });
        });
        //
        $("#btnInvestigation5why_Agregar").click(function () {
            $("#txt5wCuadranteD_What").val(null);
            $("#txt5wCuadranteD_Why1").val(null);
            $("#txt5wCuadranteD_Why2").val(null);
            $("#txt5wCuadranteD_Why3").val(null);
            $("#txt5wCuadranteD_Why4").val(null);
            $("#txt5wCuadranteD_Why5").val(null);
            $("#txt5wCuadranteD_Cause").val(null);
            $("#txt5wCuadranteD_Step").val(null);
            $("#txt5wCuadranteD_Name").val(null);
            $("#txt5wCuadranteD_Date").val(null);
            $("#txt5wCuadranteD_Status").val(null);
            $("#txt5wCuadranteD_ID").val(null);
            $("#mdlInvestigtion5why_CuadranteD").modal("show");
        });
        $("#btnStandarsCuadranteD_Agregar").click(function () {
            $("#txtStardardCuadranteC_NewStandard").val(null);
            $("#txtStardardCuadranteC_ID").val(null);
            $("#slcStandarCuadranteD_Q1_Initial").val("1");
            $("#slcStandarCuadranteD_Q1_Simplied").val("1");
            $("#slcStandarCuadranteD_Q2_Initial").val("1");
            $("#slcStandarCuadranteD_Q2_Simplied").val("1");
            $("#slcStandarCuadranteD_Q3_Initial").val("1");
            $("#slcStandarCuadranteD_Q3_Simplied").val("1");
            $("#slcStandarCuadranteD_Q4_Initial").val("1");
            $("#slcStandarCuadranteD_Q4_Simplied").val("1");
            $("#slcStandarCuadranteD_Q5_Initial").val("1");
            $("#slcStandarCuadranteD_Q5_Simplied").val("1");
            $("#txtSatardadCuadranteD_Total_Initial").val("0");
            $("#txtSatardadCuadranteD_Total_Simplied").val("0");
            $("#mdlStandards_CuadranteD").modal("show");
        });
        $("#btnStandarsCuadranteD_WP_Agregar").click(function () {
            $("#txtRiskInitial_Initial").val("0")
            $("#txtRiskIFinal_Final").val("0")
            $("#txtRiskCause_Cause").val(null)
            $("#txtRiskCause_ID").val(null)
            $("#mdlRiskRunning_Panel").modal("show");
        });
       
        //Cuadrante D funciones
        $(".SlcRiskInitial").change(function () {
            var p = $("#SlcRiskInitial_p").val();
            var s = $("#SlcRiskInitial_s").val();
            var res = parseInt(p) * parseInt(s);
            $("#txtRiskInitial_Initial").val(res);
        });
        $(".SlcRiskFinal").change(function () {
            var p = $("#SlcRiskFinal_p").val();
            var s = $("#SlcRiskFinal_s").val();
            var res = parseInt(p) * parseInt(s);
            $("#txtRiskIFinal_Final").val(res);
        });
        $(".StardardInitial").change(function () {
            var aux = 0;
            var Total = 0;
            $('select[name=StandardInitialValue]').each(function () {
                var valor = $(this).val();
                aux = parseInt(aux) + parseInt(valor);
                Total = aux;
            });
            $("#txtSatardadCuadranteD_Total_Initial").val(Total);
        });
        $(".StardardSimplied").change(function () {
            var aux = 0;
            var Total = 0;
            $('select[name=StandardSimpliedValue]').each(function () {
                var valor = $(this).val();
                aux = parseInt(aux) + parseInt(valor);
                Total = aux;
            });
            $("#txtSatardadCuadranteD_Total_Simplied").val(Total);
        });
        $("#btnAdjuntos_Item_agregar_D").click(function () {
            guardarAdjunto_CuadranteD();
        });
        $(".adjuntar_Cuadrante_D").click(function () {
            let name = this.name;
            $("#txtAdjuntos_Seccion_Archivo_D").val(name);
            var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
            obtenerAdjuntos_CuadtanteD(Cuadrante, name)
            $("#mdlAdjuntos_Panel_Cuadrante_D").modal("show");
        });
        $("#tblAdjuntos_Running_D").on("click", ".btnOmitirAdjunto_D", function () {
            var ID = $(this).parents("tr").find(".idAdjunto").html();
            omitir_adjuntos_cuadrante_D(ID);
        });
        $("#btnInvestigation5Why_CuadranteD_Guardar").click(function () {         
            var ID = $("#txt5wCuadranteD_ID").val();
            if (ID != "") {
                $.auxFormulario.camposVacios({
                    Seccion: $("#frm5w_CuadranteD"),
                    NoVacio: function () {
                        fn_actualizar_5w();
                    }
                });
            } else {
                $.auxFormulario.camposVacios({
                    Seccion: $("#frm5w_CuadranteD"),
                    Excepciones: ["txt5wCuadranteD_ID"],
                    NoVacio: function () {
                        fn_guardar_5w();
                    }
                });
            }
        });
        $("#tbl5WCuadranteD_tabla").on("click", ".btnDetail5W", function () {
            var ID = $(this).parents("tr").find(".id5w").html();
            fn_obtener_5w_ID_Info(ID);
        });
        $("#tbl5WCuadranteD_tabla").on("click", ".btnOmitir5W", function () {
            var ID = $(this).parents("tr").find(".id5w").html();
            eliminar_5Why(ID);
        });
        $("#btnStandardCuadranteD_guardar").click(function () {
            var ID = $("#txtStardardCuadranteC_ID").val();
            var texto = $("#txtStardardCuadranteC_NewStandard").val();
            if (texto != "") {
                if (ID != "") {
                    fn_actualizar_Standard();
                } else {
                    fn_guardar_Standard();
                }
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }          
        });
        $("#tblStandardCuadranteD_Tabla").on("click", ".btnDetailStandard", function () {
            var ID = $(this).parents("tr").find(".idStandard").html();
            fn_obtener_Standard_ID_Info(ID);
        });
        $("#tblStandardCuadranteD_Tabla").on("click", ".btnOmitirStandard", function () {
            var ID = $(this).parents("tr").find(".idStandard").html();
            eliminar_standard(ID);
        });   
        $("#btnCuadranteD_Guardar_results").click(function () {
            var id = $("#txtNota_ID_CuadranteD_Results").val()
            var nota1 = $("#txtNota_CuadranteD_Results").val();
            var nota2 = $("#txtNota2_CuadranteD_Results").val();
            if (nota1 != "" && nota2 != "") {
                if (id != "") {
                    fn_actualizar_results();
                } else {
                    fn_guardar_results();
                }
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }           
        });
        $("#btnCuadranteD_Guardar_Cost").click(function () {
            var cost = $("#txtCost_cost_CuadranteD").val();
            var Avoid = $("#txtCost_Avoid_CuadranteD").val();
            var Saving = $("#txtCost_Saving_CuadranteD").val();
            var id = $("#txtCost_ID_CuadranteD").val()
            if (cost != "" && Avoid != "" && Saving != "") {
                if (id != "") {
                    fn_actualizar_cost();
                } else {
                    fn_guardar_cost();
                }
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }           
        });
        $("#btnCuadranteD_Archivo_Pnl_results").on("click", "button", function () {
            let id = this.id;
            let name = this.name;
            if (name != "OmitirA1") {
                window.open("/Assets/Adjuntos/" + name, '_blank');
                return false;
            } else {
                fn_omitir_adjunto_results("1");
            }
        });
        $("#btnCuadranteD_Archivo2_Pnl_results").on("click", "button", function () {
            let id = this.id;
            let name = this.name;
            if (name != "OmitirA1") {
                window.open("/Assets/Adjuntos/" + name, '_blank');
                return false;
            } else {
                fn_omitir_adjunto_results("2");
            }
        });
        $("#btnRisk_Guardar_Respuesta").click(function () {
            var Id = $("#txtRiskCause_ID").val();
            var causa = $("#txtRiskCause_Cause").val();
            if (causa != "") {
                if (Id != "") {
                    modificar_risk();
                } else {
                    fn_registrar_risk();
                }
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }
        });
        $("#tblRiskCuadranteD_WP_Tabla").on("click", ".btnDetailRisk", function () {
            var ID = $(this).parents("tr").find(".idRisk").html();
            obtener_risk_id(ID);
        });
        $("#tblRiskCuadranteD_WP_Tabla").on("click", ".btnOmitRisk", function () {
            var ID = $(this).parents("tr").find(".idRisk").html();
            eliminar_risk(ID);
        });
        $("#btnCuadranteD_WP_Guardar_results").click(function () {
            var id = $("#txtNota_ID_CuadranteD_Results_wp").val()
            var nota = $("#txtNota2_WP_CuadranteD_Results").val();
            if (nota != "") {
                if (id != "") {
                    fn_actualizar_results_wp();
                } else {
                    fn_guardar_results_wp();
                }
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
            }   
        });
        //Finalizar Investigacion
        $("#btnTemplateRunning_Finalizar_investigacion").click(function () {
            $("#btnFirmaElectronica_Firmar").removeClass("btn-progress")
            $.firmaElectronica.MostrarFirma({
                Justificacion: false,
                Funcion: registrar_firma_templateRunning_finalizado
            });
        });
        $("#btnTemplateRunning_Finalizar_investigacion_Modificacion").click(function () {
            $.firmaElectronica.MostrarFirma({
                Justificacion: false,
                Funcion: registrar_firma_templateRunning_Modificado
            });
        });
        
        $("#btnMdlComments_Guardar").click(function () {
            let comentarios = $("#txtMdlComments_Comentarios").val();
            if (comentarios != "") {
                $("#mdlReporte_RechazoPnl").modal("hide");
                let tipo_firma = $("#txtTemplateRunning_Reporte_Tipo_Firma").val();
                if (tipo_firma == $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisor')) {
                    $.firmaElectronica.MostrarFirma({
                        Justificacion: false,
                        Funcion: registrar_firma_Rechazar_Revision_A3
                    });
                } else if (tipo_firma == $.CargarIdioma.Obtener_Texto('txt_Idioma_Aprovador')) {
                    $.firmaElectronica.MostrarFirma({
                        Justificacion: false,
                        Funcion: registrar_firma_Rechazar_Aprobacion_A3
                    });
                }
            } else { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null }); }
           
        });
        $("#tbl_PmCardRunning").on("click", ".checkbox_topFailures", function () {
            if ($(this).prop("checked")) {
                $(".checkbox_topFailures").attr("disabled", "disabled")
                $(this).prop("checked", true);
                $(this).removeAttr("disabled");

                var minutos = $(this).parents("tr").find("[data-registro=minutos]").html();
                var motivo = $(this).parents("tr").find("[data-registro=motivo]").html();
                var maquina = $(this).parents("tr").find("[data-registro=maquina]").html();
                var linea = $(this).parents("tr").find("[data-registro=linea]").html();

                $("#txtTemplatesRunningN_Problem").val(motivo);
                $("#txtTemplatesRunningN_Cost").val(minutos + ' Minutos de paro');
                $("#slcTemplatesRunningN_Departamento option").filter(function () {
                    //may want to use $.trim in here
                    return $(this).text() == "Producción";
                }).prop('selected', true);
                $("#slcTemplatesRunningN_Linea option").filter(function () {
                    //may want to use $.trim in here
                    return $(this).text() == linea; simon
                }).prop('selected', true);

                $("#slcTemplatesRunningN_Equipo option").filter(function () {
                    //may want to use $.trim in here
                    return $(this).text() == maquina;
                }).prop('selected', true);
                $("#btnTemplateRunningN_Equipo_Agregar").click();
                $("#btnTemplateRunningN_Linea_Agregar").click();
                $("#btnTemplateRunningN_Departamento_Agregar").click();
            } else {
                $(".checkbox_topFailures").removeAttr("disabled", "disabled")
                $("#txtTemplatesRunningN_Problem").val(null);
                $("#txtTemplatesRunningN_Cost").val(null);
                $("#tblTemplateRunningN_Equipos").empty();
                $("#tblTemplateRunningN_Lineas").empty();
                $("#tblTemplateRunningN_Departamentos").empty();
            }
       
        })
        $("#tbl_PmCardRunning").on("click","tr",function () {

            $(this).addClass("selected").siblings().removeClass("selected");
        });
        $("#tblTemplateRunningN_failure_mode").on("click", ".checkbox_failureMode", function () {
            if ($(this).prop("checked")) {
                $(".checkbox_failureMode").attr("disabled", "disabled")
                $(this).prop("checked", true);
                $(this).removeAttr("disabled");

                var text = $(this).parents("tr").find("[data-registro=failure_mode_text]").html();
                var id = $(this).parents("tr").find("[data-registro=failure_mode_id]").html();
                var category = $("#slcTemplatesRunningN_failure_mode_category option:selected").text();
                $("#txtTemplatesRunningN_failure_mode_text").val(text);
                $("#txtTemplatesRunningN_failure_mode_id").val(id);
                $("#txtTemplatesRunningN_failure_mode_code").val('/' + category + '/' + text);
            } else {
                $(".checkbox_failureMode").removeAttr("disabled", "disabled")
                $("#txtTemplatesRunningN_failure_mode_text").val(null);
                $("#txtTemplatesRunningN_failure_mode_id").val(null);
                $("#txtTemplatesRunningN_failure_mode_code").val(null);
            }

        });
        $("#tbl_PmCardRunning").on("click", ".btnEvents", function () {
            var fecha = $(this).parents("tr").find("[data-registro=fecha]").html();
            var linea = $(this).parents("tr").find("[data-registro=linea]").html();
            var maquina = $(this).parents("tr").find("[data-registro=maquina]").html();
            var motivo = $(this).parents("tr").find("[data-registro=motivo]").html();
            var clasificacion = $(this).parents("tr").find("[data-registro=clasificacion]").html();
            fn_get_faiulres_events(fecha, linea, maquina, motivo, clasificacion)
        });
        $("#slcTemplatesRunningN_failure_mode_category").change(function () {
            var id_category = $(this).val();
            if (id_category != "-1") {
                get_list_failure_mode_by_id_category(id_category);
            }
        })
    });
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

    /*FUNCTION TO GET FAILRE MODE LIST */
    function get_list_failure_mode_by_id_category(id_category) {
        var url = "/Sistema/get_list_failure_mode_by_id_category";
        var frmDatos = new FormData();
        frmDatos.append("id_category", id_category);
        frmDatos.append("is_enable", 1);        
        $.ajax({
            type: "POST",
            url: url,
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (result) {
                $("#tblTemplateRunningN_failure_mode tbody").empty();
                $.each(result, function (i, item) {
                    $("#tblTemplateRunningN_failure_mode tbody").append(
                        $('<tr>')
                            .append($('<td data-registro="failure_mode_id" style="display:none">').append(item.id_failure))
                            .append($('<td data-registro="failure_mode_text" style="display:none">').append(item.name_failure))
                            .append($('<td>').append(item.name_failure))
                            .append($('<td>').append('  <input type="checkbox" class="checkbox_failureMode" name="name" value="" />'))
                    );
                })
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function get_list_failure_mode_category() {
        var url = "/Sistema/get_list_failure_mode_category";
        var post_data = { is_enable: 1 };
        $("#slcTemplatesRunningN_failure_mode_category").empty();
        $("#slcTemplatesRunningN_failure_mode_category").append('<option selected disabled value="-1">Seleccione</option>')
        $.ajax({
            type: "POST",
            url: url,
            contentType: false,
            processData: false,
            data: post_data,
            success: function (result) {
                $.each(result, function (i, item) {
                    $("#slcTemplatesRunningN_failure_mode_category").append('<option value="'+item.id_category+'">'+item.name_category+'</option>')
                });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    /* FUNCTION TO GET TOP 5 FAILURES FROM CONTROLLER */

    function fn_getTop5_faiulres(Linea) {
        try {
            var url = "/OEE/get_top5Failures";
            var post_data = { Linea: Linea };
            $.post(url, post_data).done(function (result) {
                $("#tbl_PmCardRunning tbody").empty();
                $.each(result, function (i, item) {
                    $("#tbl_PmCardRunning tbody").append(
                        $('<tr>')
                            .append($('<td data-registro="fecha">').append(item.Fecha))
                            .append($('<td data-registro="linea">').append(item.Linea))
                            .append($('<td data-registro="maquina">').append(item.Maquina))
                            .append($('<td data-registro="motivo">').append(item.Motivo))
                            .append($('<td data-registro="minutos">').append(item.Minutos))
                            .append($('<td data-registro="clasificacion">').append(item.Clasificacion))
                            .append($('<td class="text-center">').append('<button type="button" class="btn btn-sm btn-light btnEvents"><i class="fa-solid fa-eye"></i></button>'))
                            .append($('<td class="text-center">').append('<input type="checkbox" class="checkbox_topFailures" name="name" value="" />'))
                    );
                })
                
            }).fail(function (error) {
                $.notiMsj.Notificacion({ Mensaje: error, Tipo: "danger", Error: null });
            });
        } catch (e) {

        }
    }
    function fn_get_faiulres_events(fecha,linea,maquina,motivo,clasificacion) {
        try {
            var url = "/OEE/obtener_eventos_falla";
            var post_data = {
                fecha: fecha, linea, linea, maquina: maquina, motivo: motivo, clasificacion: clasificacion
            };
            $.post(url, post_data).done(function (result) {
                $("#tbl_events_pmcard tbody").empty();
                $.each(result, function (i, item) {
                    $("#tbl_events_pmcard tbody").append(
                        $('<tr>')
                            .append($('<td data-registro="fecha">').append(item.Fecha))
                            .append($('<td data-registro="linea">').append(item.Linea))
                            .append($('<td data-registro="maquina">').append(item.Maquina))
                            .append($('<td data-registro="motivo">').append(item.Motivo))
                            .append($('<td data-registro="minutos">').append(item.Minutos))
                            .append($('<td data-registro="clasificacion">').append(item.Clasificacion))
                            .append($('<td data-registro="comentario">').append(item.Comentario))
                    );
                })
                $("#mdlTemplate_pmcard_events").modal("show");
            }).fail(function (error) {
                $.notiMsj.Notificacion({ Mensaje: error, Tipo: "danger", Error: null });
            });
        } catch (e) {

        }
    }
    /* *********************************************** */
    function fn_continue_a3() {
        let ID = $("#txt_id_a3_running").val()
        $("#txtTemplatesRunningN_ID").val(ID);
        var url = "/Sistema/obtener_estatus_template";
        var data = { ID: ID };
        $.post(url, data).done(function (info) {
            var res = "0";
            var url1 = "/Sistema/valida_responsable_usuario";
            var data1 = { ID: ID };
            $.post(url1, data1).done(function (info1) {
                res = info1.Id;
                if (info.Id == "6" || info.Id == "7" || info.Id == "8") {
                    var texto_alert;
                    if (info.Id == "7") {
                        texto_alert = $.CargarIdioma.Obtener_Texto('txt_Idioma_Reabrir_investigacion_mensaje_completo');
                    } else {
                        texto_alert = $.CargarIdioma.Obtener_Texto('txt_Idioma_Reabrir_investigacion_mensaje_mitad');
                    }
                    if (res == "1") {
                        $.notiMsj.Confirmacion({
                            Tipo: "MD",
                            Titulo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Reabrir_investigacion'),
                            Mensaje: texto_alert,
                            BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                            BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                            FuncionV: function () {
                                $.firmaElectronica.MostrarFirma({
                                    Justificacion: true,
                                    Funcion: registrar_firma_reabrir_A3
                                });
                            },
                            FuncionF: function () {
                                window.location.replace("/Home")
                            }
                        });
                    } else {
                        $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Error_Reabrir_Investigacion'), Tipo: "danger", Error: null });
                    }
                } else {
                    if (res == "1") {
                        fn_mostrar_Investigacion(ID);
                        fn_mostrar_Cuadrantes_btn(ID);
                        $("#pnlTemplateRunning_Cuadrante_D").hide();
                    } else {
                        $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Error_Reabrir_Investigacion'), Tipo: "danger", Error: null });
                    }
                }
            });
        });
    }
    function fn_obtener_departamentos_running() {
        var id = $("#txtTemplatesRunningN_ID").val();
        var url = "/Sistema/obtener_registros_Departamentos_running";
        var data = { ID: id };
        $.post(url, data).done(function (info) {
            $("#tblTemplateRunningN_Departamentos_Datos").empty();
            var Omitir = '<button class="btn btn-icon btn-danger btnRemoverRegistro" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            if (info != "") {
                $.each(info, function (i, item) {
                    $("#tblTemplateRunningN_Departamentos_Datos").append(
                        $('<tr>')
                            .append($('<td data-registro="ID" style="display:none;">').append(item.ID))
                            .append($('<td>').append(item.Nombre))
                            .append($('<td>').append(Omitir))
                    );
                });
            } else {
                $("#tblTemplateRunningN_Departamentos_Datos").append("<tr><th colspan='7'><p class='text-center'>" + $.CargarIdioma.Obtener_Texto("txt_Idioma_no_existen_registros") + "</p></th></tr>");
            }
            
        });
    }
    function fn_agregar_departamento_running(param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var Departamento = $("#slcTemplatesRunningN_Departamentos_Departamento option:selected").val();
        var frmDatos = new FormData();
        frmDatos.append("Template", ID_Template);
        frmDatos.append("Departamento", Departamento);        
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registro_Departamento_Running_Firma",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    fn_obtener_departamentos_running(ID_Template);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_remover_departamento_running(Param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtTemplatesRunningN_Departamentos_ID").val());
        frmDatos.append("ID_Investigacion", $("#txtTemplatesRunningN_ID").val());
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        frmDatos.append("ZMYSEL", Param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/omitir_departamento",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_departamentos_running(ID_Template);
                }
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#txtEvaluadores_TemplatesR_ID").val(null);
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#txtTemplatesRunningN_Departamentos_ID").val(null);
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtener_Lineas_running() {
        var id = $("#txtTemplatesRunningN_ID").val();
        var url = "/Sistema/obtener_registros_Lineas_running";
        var data = { ID: id };
        $.post(url, data).done(function (info) {
            $("#tblTemplateRunningN_Lineas_Datos").empty();
            var Omitir = '<button class="btn btn-icon btn-danger btnRemoverRegistro" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            if (info != "") {
                $.each(info, function (i, item) {
                    $("#tblTemplateRunningN_Lineas_Datos").append(
                        $('<tr>')
                            .append($('<td data-registro="ID" style="display:none;">').append(item.ID))
                            .append($('<td>').append(item.Nombre))
                            .append($('<td>').append(Omitir))
                    );
                });
            } else {
                $("#tblTemplateRunningN_Lineas_Datos").append("<tr><th colspan='7'><p class='text-center'>" + $.CargarIdioma.Obtener_Texto("txt_Idioma_no_existen_registros") + "</p></th></tr>");
            }

        });
    }
    function fn_agregar_linea_running(param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var Linea = $("#slcTemplatesRunningN_Lineas_Linea option:selected").val();
        var frmDatos = new FormData();
        frmDatos.append("Template", ID_Template);
        frmDatos.append("Linea", Linea);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registro_Linea_Running_Firma",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    fn_obtener_Lineas_running(ID_Template);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_remover_linea_running(Param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtTemplatesRunningN_Lineas_ID").val());
        frmDatos.append("ID_Investigacion", $("#txtTemplatesRunningN_ID").val());
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        frmDatos.append("ZMYSEL", Param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/omitir_lineas",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_Lineas_running(ID_Template);
                }
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#txtEvaluadores_TemplatesR_ID").val(null);
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#txtTemplatesRunningN_Departamentos_ID").val(null);
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtener_Equipos_running() {
        var id = $("#txtTemplatesRunningN_ID").val();
        var url = "/Sistema/obtener_registros_Equipos_running";
        var data = { ID: id };
        $.post(url, data).done(function (info) {
            $("#tblTemplateRunningN_Equipos_Datos").empty();
            var Omitir = '<button class="btn btn-icon btn-danger btnRemoverRegistro" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            if (info != "") {
                $.each(info, function (i, item) {
                    $("#tblTemplateRunningN_Equipos_Datos").append(
                        $('<tr>')
                            .append($('<td data-registro="ID" style="display:none;">').append(item.ID))
                            .append($('<td>').append(item.Nombre))
                            .append($('<td>').append(Omitir))
                    );
                });
            } else {
                $("#tblTemplateRunningN_Equipos_Datos").append("<tr><th colspan='7'><p class='text-center'>" + $.CargarIdioma.Obtener_Texto("txt_Idioma_no_existen_registros") + "</p></th></tr>");
            }

        });
    }
    function fn_agregar_Equipos_running(param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var Equipo = $("#slcTemplatesRunningN_Equipos_Equipo option:selected").val();
        var frmDatos = new FormData();
        frmDatos.append("Template", ID_Template);
        frmDatos.append("Equipo", Equipo);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registro_Equipo_Running_Firma",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    fn_obtener_Equipos_running(ID_Template);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_remover_Equipos_running(Param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtTemplatesRunningN_Equipos_ID").val());
        frmDatos.append("ID_Investigacion", $("#txtTemplatesRunningN_ID").val());
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        frmDatos.append("ZMYSEL", Param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/omitir_equipo",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_Equipos_running(ID_Template);
                }
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#txtEvaluadores_TemplatesR_ID").val(null);
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#txtTemplatesRunningN_Departamentos_ID").val(null);
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtener_Subareas_running() {
        var id = $("#txtTemplatesRunningN_ID").val();
        var url = "/Sistema/obtener_registros_Subareas_running";
        var data = { ID: id };
        $.post(url, data).done(function (info) {
            $("#tblTemplateRunningN_Subareas_Datos").empty();
            var Omitir = '<button class="btn btn-icon btn-danger btnRemoverRegistro" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            if (info != "") {
                $.each(info, function (i, item) {
                    $("#tblTemplateRunningN_Subareas_Datos").append(
                        $('<tr>')
                            .append($('<td data-registro="ID" style="display:none;">').append(item.ID))
                            .append($('<td>').append(item.Nombre))
                            .append($('<td>').append(Omitir))
                    );
                });
            } else {
                $("#tblTemplateRunningN_Subareas_Datos").append("<tr><th colspan='7'><p class='text-center'>" + $.CargarIdioma.Obtener_Texto("txt_Idioma_no_existen_registros") + "</p></th></tr>");
            }

        });
    }
    function fn_agregar_Subareas_running(param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var Subarea = $("#slcTemplatesRunningN_Subareas_Subarea option:selected").val();
        var frmDatos = new FormData();
        frmDatos.append("Template", ID_Template);
        frmDatos.append("Subarea", Subarea);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registro_Subarea_Running_Firma",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    fn_obtener_Subareas_running(ID_Template);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_remover_Subareas_running(Param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtTemplatesRunningN_Subareas_ID").val());
        frmDatos.append("ID_Investigacion", $("#txtTemplatesRunningN_ID").val());
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        frmDatos.append("ZMYSEL", Param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/omitir_subarea",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_Subareas_running(ID_Template);
                }
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#txtEvaluadores_TemplatesR_ID").val(null);
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#txtTemplatesRunningN_Departamentos_ID").val(null);
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    $("#btnInicioA3_Regresar").click(function () {
        window.location.href = "/Home";
    })
    function fn_obtener_folio_nueva_investigacion() {
        var url = "/Templates/obtener_siguiente_folio";
        $.get(url).done(function (folio) {
            $("#txtTemplatesRunningN_Folio").val(folio);
        });
        $("#txtTemplatesRunningN_Problem").val(null);
        $("#txtTemplatesRunningN_Cost").val(null);
        //$("#mdlTemplatesRunning_Agregar").modal("show");
    }
    function fn_cargaTiposA3() {
        let id_a3 = $("#txt_id_a3_running").val();
        if (id_a3 == "0") {
            let url = "/Templates/mostrarTemplatesActivo";
            let idioma_ID = $("#txtGbl_Idioma_ID").val();
            let Data = { Idioma_ID: idioma_ID }
            $.post(url, Data).done(function (data) {
                $("#tblTemplatesActivos").empty();
                var rol = $("#txt_Rol_Usuario").val();
                var text_idioma = $.CargarIdioma.Obtener_Texto('txt_Idioma_Nueva_investigacion');
                $.each(data, function (i, item) {
                    var Botones = '<button class="btn btn-block btn-primary btnComenzar">' + text_idioma + '</button>';
                    if (rol == "3") {
                        Botones = '<button disabled class="btn btn-block btn-primary  btnComenzar">' + text_idioma + '</button>';
                    } else { Botones = '<button class="btn btn-block btn-primary btnComenzar">' + text_idioma + '</button>'; }
                    $("#tblTemplatesActivos").append(
                        $('<tr>')
                            .append($('<td style="display:none;" class="idTemplate">').append(item.ID))
                            .append($('<td data-registro="PmCard" style="display:none">').append(item.PmCard))
                            .append($('<td style="text-align:center;">').append('<img height="50" width="50" src="/Assets/img/Templates/' + item.Imagen + '"/>'))
                            .append($('<td>').append(item.TipoA3))
                            .append($('<td>').append(item.Descripcion))
                            .append($('<td>').append(item.Version))
                            .append($('<td>').append(Botones))
                    );
                });

            }).fail(function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            });
        } else {
            fn_continue_a3()
        }
        
    }
    function fn_agregar_evaluadores() {
        var ID_Usuario = $("#slcTemplatesRunningN_Usuarios option:selected").val();
        var Nom_Usuario = $("#slcTemplatesRunningN_Usuarios option:selected").text();
        var ID_Tipo_Usuario = $("#slcTemplatesRunningN_TiposFirma option:selected").val();
        var Nom_Tipo_Usuario_val = $("#slcTemplatesRunningN_TiposFirma option:selected").text();
        var Nom_Tipo_Usuario = 2;
        if (Nom_Tipo_Usuario_val == "Reviewer" || Nom_Tipo_Usuario_val == "Revisor") {
            Nom_Tipo_Usuario = 1;
        } else {
            Nom_Tipo_Usuario = 2;
        }
        if (ID_Usuario != "-1") {
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitirFirma" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            var i = 0;
            var rows = $('#tblTemplateRunningN_Evaluadores tr').length;
            if (Nom_Usuario == $("#txtTemplatesRunningN_Contact").val()) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Elaborador_Evaluadores'), Tipo: "info", Error: null });
            } else {
                if (rows > 0) {
                    $('#tblTemplateRunningN_Evaluadores tr').each(function () {
                        var Usuario = $(this).find(".IDUsuario").html();
                        if (Usuario == ID_Usuario) {
                            i = 1;
                            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Usuario_ya_agregado'), Tipo: "info", Error: null });
                            
                        }
                    });
                    if (i == 0) {
                        $("#tblTemplateRunningN_Evaluadores").append(
                            $('<tr>')
                                .append($('<td style="display:none;" class="IDUsuario">').append(ID_Usuario))
                                .append($('<td style="display:none;" class="IDTipo">').append(Nom_Tipo_Usuario))
                                .append($('<td>').append(Nom_Usuario))
                                .append($('<td>').append(Nom_Tipo_Usuario_val))
                                .append($('<td>').append(Omitir))
                        );
                    }
                } else {
                    $("#tblTemplateRunningN_Evaluadores").append(
                        $('<tr>')
                            .append($('<td style="display:none;" class="IDUsuario">').append(ID_Usuario))
                            .append($('<td style="display:none;" class="IDTipo">').append(Nom_Tipo_Usuario))
                            .append($('<td>').append(Nom_Usuario))
                            .append($('<td>').append(Nom_Tipo_Usuario_val))
                            .append($('<td>').append(Omitir))
                    );
                }
            }
        } else {
            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
        }
    }
    function fn_agregar_Departamento() {
        var Departamento_ID = $("#slcTemplatesRunningN_Departamento option:selected").val();
        var Departamento_Nombre = $("#slcTemplatesRunningN_Departamento option:selected").text();
        if (Departamento_ID != "-1") {
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitir" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            var i = 0;
            var rows = $('#tblTemplateRunningN_Departamentos tr').length;
            if (rows > 0) {
                $('#tblTemplateRunningN_Departamentos tr').each(function () {
                    var Departamento = $(this).find(".Departamento_ID").html();
                    if (Departamento == Departamento_ID) {
                        i = 1;
                        $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Dato_Registrado'), Tipo: "info", Error: null });
                    }
                });
                if (i == 0) {
                    $("#tblTemplateRunningN_Departamentos").append(
                        $('<tr>')
                            .append($('<td style="display:none;" class="Departamento_ID">').append(Departamento_ID))
                            .append($('<td>').append(Departamento_Nombre))
                            .append($('<td>').append(Omitir))
                    );
                }
            } else {
                $("#tblTemplateRunningN_Departamentos").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="Departamento_ID">').append(Departamento_ID))
                        .append($('<td>').append(Departamento_Nombre))
                        .append($('<td>').append(Omitir))
                );
            }
        } else {
            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
        }
    }
    function fn_agregar_Subarea() {
        var Subarea_ID = $("#slcTemplatesRunningN_Subarea option:selected").val();
        var Subarea_Nombre = $("#slcTemplatesRunningN_Subarea option:selected").text();
        if (Subarea_ID != "-1") {
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitir" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            var i = 0;
            var rows = $('#tblTemplateRunningN_Subareas tr').length;
            if (rows > 0) {
                $('#tblTemplateRunningN_Subareas tr').each(function () {
                    var Subarea = $(this).find(".Subarea_ID").html();
                    if (Subarea == Subarea_ID) {
                        i = 1;
                        $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Dato_Registrado'), Tipo: "info", Error: null });
                    }
                });
                if (i == 0) {
                    $("#tblTemplateRunningN_Subareas").append(
                        $('<tr>')
                            .append($('<td style="display:none;" class="Subarea_ID">').append(Subarea_ID))
                            .append($('<td>').append(Subarea_Nombre))
                            .append($('<td>').append(Omitir))
                    );
                }
            } else {
                $("#tblTemplateRunningN_Subareas").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="Subarea_ID">').append(Subarea_ID))
                        .append($('<td>').append(Subarea_Nombre))
                        .append($('<td>').append(Omitir))
                );
            }
        } else {
            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
        }
    }
    function fn_agregar_Linea() {
        var Linea_ID = $("#slcTemplatesRunningN_Linea option:selected").val();
        var Lnea_Nombre = $("#slcTemplatesRunningN_Linea option:selected").text();
        if (Linea_ID != "-1") {
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitir" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            var i = 0;
            var rows = $('#tblTemplateRunningN_Lineas tr').length;
            if (rows > 0) {
                $('#tblTemplateRunningN_Lineas tr').each(function () {
                    var Linea = $(this).find(".Linea_ID").html();
                    if (Linea == Linea_ID) {
                        i = 1;
                        $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Dato_Registrado'), Tipo: "info", Error: null });
                    }
                });
                if (i == 0) {
                    $("#tblTemplateRunningN_Lineas").append(
                        $('<tr>')
                            .append($('<td style="display:none;" class="Linea_ID">').append(Linea_ID))
                            .append($('<td>').append(Lnea_Nombre))
                            .append($('<td>').append(Omitir))
                    );
                }
            } else {
                $("#tblTemplateRunningN_Lineas").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="Linea_ID">').append(Linea_ID))
                        .append($('<td>').append(Lnea_Nombre))
                        .append($('<td>').append(Omitir))
                );
            }
        } else {
            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
        }
    }
    function fn_agregar_Equipo() {
        var Equipo_ID = $("#slcTemplatesRunningN_Equipo option:selected").val();
        var  Equipo_Nombre  = $("#slcTemplatesRunningN_Equipo option:selected").text();
        if (Equipo_ID != "-1") {
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitir" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            var i = 0;
            var rows = $('#tblTemplateRunningN_Equipos tr').length;
            if (rows > 0) {
                $('#tblTemplateRunningN_Equipos tr').each(function () {
                    var Equipo = $(this).find(".Equipo_ID").html();
                    if (Equipo == Equipo_ID) {
                        i = 1;
                        $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Dato_Registrado'), Tipo: "info", Error: null });
                    }
                });
                if (i == 0) {
                    $("#tblTemplateRunningN_Equipos").append(
                        $('<tr>')
                            .append($('<td style="display:none;" class="Equipo_ID">').append(Equipo_ID))
                            .append($('<td>').append(Equipo_Nombre))
                            .append($('<td>').append(Omitir))
                    );
                }
            } else {
                $("#tblTemplateRunningN_Equipos").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="Equipo_ID">').append(Equipo_ID))
                        .append($('<td>').append(Equipo_Nombre))
                        .append($('<td>').append(Omitir))
                );
            }
        } else {
            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_ingrese_informacion_requerida'), Tipo: "info", Error: null });
        }
    }
    function fn_omitir_evaluador_BD(Param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtEvaluadores_TemplatesR_ID").val());
        frmDatos.append("ID_Investigacion", $("#txtTemplatesRunningN_ID").val());
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        frmDatos.append("ZMYSEL", Param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/omitir_evluador",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_evaluadores(ID_Template);
                }
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#txtEvaluadores_TemplatesR_ID").val(null);
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#txtEvaluadores_TemplatesR_ID").val(null);
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_comenzar_Investigacion(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtTemplatesRunningN_ID").val());
        frmDatos.append("Folio", $("#txtTemplatesRunningN_Folio").val());
        frmDatos.append("TipoA3", $("#slcTemplatesRunningN_TipoA3 option:selected").text());
        frmDatos.append("Contact", $("#txtTemplatesRunningN_Contact").val());
        frmDatos.append("Problem", $("#txtTemplatesRunningN_Problem").val());
        frmDatos.append("Cost", $("#txtTemplatesRunningN_Cost").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/comenzar_investigacion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_registrar_evaluadores(res.Id);
                    fn_registrar_departamento_running(res.Id);
                    fn_registrar_Subarea_running(res.Id);
                    fn_registrar_Linea_running(res.Id);
                    fn_registrar_Equipo_running(res.Id);
                    fn_insert_falla_running(res.Id)
                    fn_insert_modofalla_running(res.Id)
                    fn_mostrar_Investigacion(res.Id);
                    fn_mostrar_Cuadrantes_btn(res.Id);
                    
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });                
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_insert_modofalla_running(id_template) {
        $('#tblTemplateRunningN_failure_mode tbody').find('input[type="checkbox"]:checked').each(function () {

            var id_codigo = $(this).parent("td").parent("tr").find("[data-registro=failure_mode_id]").html();
            var text_failure_mode = $(this).parent("td").parent("tr").find("[data-registro=failure_mode_text]").html();
            var id_categoria = $("#slcTemplatesRunningN_failure_mode_category option:selected").val();
            var text_categoria = $("#slcTemplatesRunningN_failure_mode_category option:selected").text();
            var codigo = '/' + text_categoria + '/' + text_failure_mode
            var frmDatos = new FormData();
            frmDatos.append("id_template", id_template);
            frmDatos.append("id_codigo", id_codigo);
            frmDatos.append("id_categoria", id_categoria);
            frmDatos.append("codigo", codigo);

            $.ajax({
                type: "POST",
                url: "/Sistema/insert_modofalla_running",
                contentType: false,
                processData: false,
                data: frmDatos,
                success: function (res) {
                    if (res.Tipo == "success") {

                    }
                    $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                },
                error: function (error) {
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
                }
            });
        });
    }
    function fn_insert_falla_running(id_template) {
        $('#tbl_PmCardRunning tbody').find('input[type="checkbox"]:checked').each(function () {
            var linea = $(this).parent("td").parent("tr").find("[data-registro=linea]").html();
            var maquina = $(this).parent("td").parent("tr").find("[data-registro=maquina]").html();
            var motivo = $(this).parent("td").parent("tr").find("[data-registro=motivo]").html();
            var minutos = $(this).parent("td").parent("tr").find("[data-registro=minutos]").html();
            var clasificacion = $(this).parent("td").parent("tr").find("[data-registro=clasificacion]").html();
            var fecha = $(this).parent("td").parent("tr").find("[data-registro=fecha]").html();

            var frmDatos = new FormData();
            frmDatos.append("id_template", id_template);
            frmDatos.append("linea", linea);
            frmDatos.append("maquina", maquina);
            frmDatos.append("motivo", motivo);
            frmDatos.append("minutos", minutos);
            frmDatos.append("clasificacion", clasificacion);
            frmDatos.append("fecha", fecha);

            $.ajax({
                type: "POST",
                url: "/Sistema/insert_falla_running",
                contentType: false,
                processData: false,
                data: frmDatos,
                success: function (res) {
                    if (res.Tipo == "success") {

                    }
                    $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                },
                error: function (error) {
                    $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
                }
            });
        });
    }
    function fn_registrar_evaluadores(ID_Template) {
        $('#tblTemplateRunningN_Evaluadores tr').each(function () {
            var Usuario = $(this).find(".IDUsuario").html();
            var Tipo = $(this).find(".IDTipo").html();
            var url = "/Sistema/registrar_evluadores";
            var data = { Usuario: Usuario, Tipo: Tipo, Template: ID_Template };
            $.post(url, data).done(function () {

            });
        });
    }
    function fn_registrar_departamento_running(ID_Template) {
        $('#tblTemplateRunningN_Departamentos tr').each(function () {
            var Departamento = $(this).find(".Departamento_ID").html();
            var url = "/Sistema/registro_Departamento_Running";
            var data = { Template: ID_Template, Departamento: Departamento };
            $.post(url, data).done(function () {

            });
        });
    }
    function fn_registrar_Subarea_running(ID_Template) {
        $('#tblTemplateRunningN_Subareas tr').each(function () {
            var Subarea = $(this).find(".Subarea_ID").html();
            var url = "/Sistema/registro_Subarea_Running";
            var data = { Template: ID_Template, Subarea: Subarea };
            $.post(url, data).done(function () {

            });
        });
    }
    function fn_registrar_Linea_running(ID_Template) {
        $('#tblTemplateRunningN_Lineas tr').each(function () {
            var Linea = $(this).find(".Linea_ID").html();
            var url = "/Sistema/registro_Linea_Running";
            var data = { Template: ID_Template, Linea: Linea };
            $.post(url, data).done(function () {

            });
        });
    }
    function fn_registrar_Equipo_running(ID_Template) {
        $('#tblTemplateRunningN_Equipos tr').each(function () {
            var Equipo = $(this).find(".Equipo_ID").html();
            var url = "/Sistema/registro_Equipo_Running";
            var data = { Template: ID_Template, Equipo: Equipo };
            $.post(url, data).done(function () {

            });
        });
    }
    function fn_get_clasificacion_Falla_by_id_template(id) {
        var url = "/Sistema/get_clasificacion_Falla_by_id_template";
        var data = { id_template: id };
        $.post(url, data).done(function (result) {
            $("#txtTemplateR_clasificacion_falla").val(result);
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    }
    function fn_get_modo_falla_by_id_template(id) {
        var url = "/Sistema/get_modo_falla_by_id_template";
        var data = { id_template: id };
        $.post(url, data).done(function (result) {            
            $("#txtTemplateR_modo_falla").val(result);
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    }
    function fn_mostrar_Investigacion(id) {
        var url = "/Sistema/obtenerTemplateRunningID";
        var data = { ID: id };
        $.post(url, data).done(function (datos) {
            $.each(datos, function (i, item) {
                $("#txtTemplateRunngin_Titulo").text("A3 Reloaded - " + item.TipoA3);
                $("#pnlTemplatesRunningM_Folio").val(item.Folio);
                $("#pnlTemplatesRunningM_Contact").val(item.Responsable);
                $("#pnlTemplatesRunningM_Problema").val(item.Problema);
                $("#pnlTemplatesRunningM_Costo").val(item.Costo);
                $("#txtTemplatesRunningN_ID").val(id);
            });
            fn_get_clasificacion_Falla_by_id_template(id)
            fn_get_modo_falla_by_id_template(id)
            $("#pnlTemplatesRunning_Investigacion").show();
            $("#tiposA3").hide();
            $("#pnlHistorial").hide();
            $("#pnlInicio_Formulario_Nueva_Investigacion").hide();
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    }
    function fn_mostrar_Cuadrantes_btn(Template_ID) {
        var url = "/Sistema/obtenerCuadrantes_TemplateRunning";
        var data = { ID: Template_ID };
        $("#pnlTemplatesRunning_Cuadrantes").empty();       
        $.post(url, data).done(function (res) {
            var btnClass = "btn-success";
            var EstatusMsg = $.CargarIdioma.Obtener_Texto('txt_Idioma_Pendiente');
            $.each(res, function (i, item) {             
                if (item.Estatus == "1") {
                    btnClass = "btn-secondary";
                    EstatusMsg = $.CargarIdioma.Obtener_Texto('txt_Idioma_En_Proceso');
                } else if (item.Estatus == "2") {
                    btnClass = "btn-success";
                    EstatusMsg = $.CargarIdioma.Obtener_Texto('txt_Idioma_Finalizado');
                } else {
                    btnClass = "btn-info";
                    EstatusMsg = $.CargarIdioma.Obtener_Texto('txt_Idioma_Pendiente');
                }
                $("#pnlTemplatesRunning_Cuadrantes").append('<div class="col-lg-3">' +
                    '<div class="form-group">' +                    
                    '<textarea class= "form-control mt-1" disabled style = "height:120px !important; resize:none; overflow:auto; border:0px; outline:none;" > ' + item.Descripcion + '</textarea >' +
                    '</div > ' +
                    '<div class="form-group d-grid gap-2">' +
                    '<button id="' + item.ID + '" name="' + item.Nombre + '" style="font-size:30px; font-weight:bold; height:100px" class="btn btn-block ' + btnClass + ' btn-lg" > ' + item.Nombre + '</button>' +
                    '<p>' + EstatusMsg+'</p>'+
                    '</div></div > ');
            });           
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    }    
    //Historial A3
    function fn_TemplatesRunning_History(Pagina) {
        var Folio = $("#txtTemplatesRunning_History_Folio").val();
        var TipoA3 = $("#slcTemplatesRunning_History_TipoA3 option:selected").text();
        var Contact = $("#txtTemplatesRunning_History_Contact").val();
        var Problem = $("#txtTemplatesRunning_Problem").val();
        var Estatus = $("#slcTemplatesRunning_History_Estatus option:selected").text();
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_En_Proceso')) {Estatus = 0;}
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_idioma_Ingrese_En_Revision')) {Estatus = 3;}
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_idioma_Ingrese_En_Modificacion')) {Estatus = 2;}
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_Finalizado')) { Estatus = 1; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione')) { Estatus = null; }
        if (Folio == "") { Folio = null; }
        if (TipoA3 == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione')) { TipoA3 = null; }
        if (Contact == "") { Contact = null; }
        if (Problem == "") { Problem = null; }
        var Datos = { Folio: Folio, TipoA3: TipoA3, Problem: Problem, Contact: Contact, Estatus: Estatus, Index: Pagina };
        var rol = $("#txt_Rol_Usuario").val();
        
        $.mostrarInfo({
            URLindex: "/Sistema/obtenerTotalPagTemplatesRunning",
            URLdatos: "/Sistema/mostrarTemplatesRunning",
            Datos: Datos,
            Version: 2,
            Tabla: $("#tblTemplatesRunning_History"),
            Paginado: $("#pagTemplatesRunning_History"),
            Mostrar: function (i, item) {
                var Estatus = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Activo') + '</div>';
                if (item.Estatus == "1") {
                    Estatus = '<div class="badge badge-light">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_En_Proceso') + '</div>';
                } else if (item.Estatus == "2") {
                    Estatus = '<div class="badge badge-info">' + $.CargarIdioma.Obtener_Texto('txt_idioma_Ingrese_En_Revision') + '</div>';
                }
                else if (item.Estatus == "4") {
                    Estatus = '<div class="badge badge-info">' + $.CargarIdioma.Obtener_Texto('txt_idioma_Ingrese_En_Modificacion') + '</div>';
                } else if (item.Estatus == "3") {
                    Estatus = '<div class="badge badge-success">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Finalizado') + '</div>';
                } else if (item.Estatus == "0") {
                    Estatus = '<div class="badge badge-danger">' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Reporte_Rechazado') + '</div>';
                }
                var Botones = '<button class="btn btn-icon btn-primary btnContinuar" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Continuar Investigación"><i class="far fa-edit"></i></button>';

                if (rol == "3") {
                    Botones = '<button disabled class="btn btn-icon btn-primary btnContinuar" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Continuar Investigación"><i class="far fa-edit"></i></button>';
                } else {
                    Botones = '<button  class="btn btn-icon btn-primary btnContinuar" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_Continuar_Investigacion') +'"><i class="far fa-edit"></i></button>';
                }
                var Boton_Reporte = '<button class="btn btn-icon btn-success btnPdf" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + $.CargarIdioma.Obtener_Texto('txt_Idioma_ReporteA3')+'"><i class="far fa-file-pdf"></i></button>';
                 
                $("#tblTemplatesRunning_History").find("tbody").append(
                    $('<tr>')
                        .append($('<td data-registro="ID" style="display:none">').append(item.ID))
                        .append($('<td>').append(item.RowNumber))
                        .append($('<td style="display:none;" class="estatusTemplateRunning">').append(item.Estatus))
                        .append($('<td>').append(item.Folio))
                        .append($('<td>').append(item.TipoA3))
                        .append($('<td>').append(item.Version))
                        .append($('<td>').append(item.Contact))
                        .append($('<td>').append(item.Problem))
                        .append($('<td>').append(Estatus))
                        .append($('<td>').append(Botones))
                        .append($('<td>').append(Boton_Reporte))
                );
            }
        });
    }
    function fn_Reporte_A3_Generados() {
        var Folio = $("#txtTemplatesRunning_History_Folio").val();
        var TipoA3 = $("#slcTemplatesRunning_History_TipoA3 option:selected").text();
        var Contact = $("#txtTemplatesRunning_History_Contact").val();
        var Estatus = $("#slcTemplatesRunning_History_Estatus option:selected").text();
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_En_Proceso')) { Estatus = 0; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_idioma_Ingrese_En_Revision')) { Estatus = 3; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_idioma_Ingrese_En_Modificacion')) { Estatus = 2; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_Finalizado')) { Estatus = 1; }
        if (Estatus == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione')) { Estatus = ""; }
        if (Folio == "") { Folio = ""; }
        if (TipoA3 == $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione')) { TipoA3 = ""; }
        if (Contact == "") { Contact = ""; }
        url = "/Sistema/reporte_A3_Generado?Folio=" + Folio + "&TipoA3=" + TipoA3 + "&Contact=" + Contact + "&Estatus=" + Estatus + "";

        window.open(url, '_blank');
        return false;
    }
    function fn_validar_Evaluador(ID) {
        var url = "/Sistema/valida_firma_Evaluador";
        var data = { ID: ID };
        var Tipo;
        $("#ReporteRunning_url").attr("src", "");
        $("#btnReporteRunning_Firmard").hide();
        $("#btnReporteRunning_Rechazar").hide();
        $("#txtTemplateRunning_Reporte_Tipo_Firma").val("N/A");
        $("#txtTemplateRunning_Reporte_ID").val(ID);
        $.post(url, data).done(function (info) {
            if (info != "") {
                $.each(info, function (i, item) {
                    if (item.Rol == "1") {
                        Tipo = $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisor');
                    } else {
                        Tipo = $.CargarIdioma.Obtener_Texto('txt_Idioma_Aprovador');
                    }
                    $("#txtTemplateRunning_Reporte_Tipo_Firma").val(Tipo);
                    $("#btnReporteRunning_Firmar").show();
                    $("#btnReporteRunning_Rechazar").show();
                    $("#txtTemplatesRunningN_ID").val(ID);
                });
            } else {
                $("#pnl_firma_reporte_template").hide();
                $("#btnReporteRunning_Firmar").hide();
            }
            $("#mdlReporteA3_Panel").modal("show");
            var url2 = "/Sistema/validar_template_WP_id";
            var data2 = { ID: ID };
            $.post(url2, data2).done(function (info) {
                if (info.Id == "1") {
                    $("#ReporteRunning_url").attr("src", "/Sistema/reporteA3_WP?ID_Template=" + ID + "");
                } else {
                    $("#ReporteRunning_url").attr("src", "/Sistema/reporteA3?ID_Template=" + ID + "");
                }
            });
            let valor = $('#slcTemplateRunning_Reporte_Versiones option:selected').val();
            if (valor == "value" || valor == "0") {
                var versionActURL = "/Sistema/obtener_version_actual_documento";
                var versionActData = { Template: ID };
                $.post(versionActURL, versionActData).done(function (versionAct) {
                    fn_obtener_flujo_reporte_A3(ID, versionAct);
                    $("#btnReporteRunning_Firmar").show();
                    $("#btnReporteRunning_Rechazar").show();
                });
            } else {
                var versionURL = "/Sistema/obtener_version_documento";
                var versionData = { Template: ID, Documento: valor };
                $.post(versionURL, versionData).done(function (version) {
                    fn_obtener_flujo_reporte_A3(ID, version);
                    $("#btnReporteRunning_Firmar").hide();
                    $("#btnReporteRunning_Rechazar").hide();
                });
            }
            fn_obtener_Adjuntos_Template(ID);
            fn_obtener_versiones(ID);
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
    function fn_obtener_flujo_reporte_A3(Template_ID,Template_Version) {
        var frmDatos = new FormData();
        frmDatos.append("Template_ID", Template_ID);
        frmDatos.append("Template_Version", Template_Version);
        $("#tblTemplateR_Estatus_Revisores").empty();
        $.ajax({
            type: "POST",
            url: "/Sistema/obtener_firmas_reporte_A3",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {              
                $.each(res, function (i, item) {
                    let RazonFirma = item.RazonFirma;
                    let SignificadoFirma;
                    let imgFirma = '<img src="/Assets/img/Estatus_Firmas/Pending_Sign.png" />'
                    if (RazonFirma == "1") { SignificadoFirma = $.CargarIdioma.Obtener_Texto('txt_Idioma_Reporte_Dueno'); }
                    else if (RazonFirma == "2") { SignificadoFirma = $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisor'); }
                    else if (RazonFirma == "3") { SignificadoFirma = $.CargarIdioma.Obtener_Texto('txt_Idioma_Aprovador'); }
                    if (item.EstatusFirma == "0") {
                        imgFirma = '<img src="/Assets/img/Estatus_Firmas/icons8-data-pending-28.png"  />'
                    } else if (item.EstatusFirma == "1") {
                        imgFirma = '<img src="/Assets/img/Estatus_Firmas/icons8-eye-28.png" />'
                    } else if (item.EstatusFirma == "2") {
                        imgFirma = '<img src="/Assets/img/Estatus_Firmas/icons8-cancel-28.png" />'
                    } else if (item.EstatusFirma == "3") {
                        imgFirma = '<img src="/Assets/img/Estatus_Firmas/icons8-checked-28.png" />'
                    }
                    $("#tblTemplateR_Estatus_Revisores").append(
                        $('<tr>')
                            .append($('<td>').append(item.Usuario))
                            .append($('<td>').append(SignificadoFirma))
                            .append($('<td>').append(imgFirma))
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

    //Pendientes Aplicar Idioma

    //*****MUESTRA SECCIONES -> APLICA VALIDACIÓN POR ROL */
    async function fn_mostrarSeccionesRunning(ID, Nombre) {       
        $("#pnlTemplatesRunning_Investigacion").slideUp();
        setTimeout(function () {
            $("#pnlTemplatesRunning_secciones").show();        
        }, 500);
        $("#ItemTemplateRunning_SeccionRunning").empty();
        $("#divLoaderSecciones").show();
        var data = { ID: ID };     
        const response = await fetch('/Sistema/obtenerSecciones_CuadranteRunning', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });

        var Secciones_Data = response.json();

        Secciones_Data.then(data => {       
            
            setTimeout(function () {                 
                var idioma_Texto = $.CargarIdioma.Obtener_Texto("txt_Idioma_Texto");
                var idioma_Respuesta = $.CargarIdioma.Obtener_Texto("txt_Idioma_Respuesta");
                var Idioma_Estatus = $.CargarIdioma.Obtener_Texto("txt_Idioma_Estatus");
                var Idioma_Opciones = $.CargarIdioma.Obtener_Texto("txt_Idioma_Opciones");
                var Idioma_Cuadrante = $.CargarIdioma.Obtener_Texto("txt_Idioma_Cuadrante");                             
                $("#txtTemplateRunning_Cuadrante_Titulo").text(Idioma_Cuadrante + " - " + Nombre);
                $.each(data, function (i, item) {
                    //if (item.Control == "0") {
                    if (1 == 1) {
                        $("#ItemTemplateRunning_SeccionRunning").append('<div class="form-group divSeccion><div class="table-responsive tabla-md encabezados-fixed"><div class="section-title mt-0">' + item.Nombre + '</div><small>' + item.Descripcion + '</small><table class="table table-bordered tablaSeccion table-hover"><thead ><tr><th scope="col">' + idioma_Texto + '</th><th scope="col">' + idioma_Respuesta + '</th><th colspan="2" style="width:30%">' + Idioma_Opciones + '</th><th  style="width:10%" >' + Idioma_Estatus + '</th></tr></thead><tbody id="tblSeccionRunning' + item.ID + '" style="font-size:15px"><tr><th colspan="7"><p class="text-center">' + $.CargarIdioma.Obtener_Texto("txt_Idioma_no_existen_registros") + '</p></th></tr></tbody></table></div></div>');
                    } else {
                        $("#ItemTemplateRunning_SeccionRunning").append('<div disabled="disabled" style="pointer-events: none; background: #dddddd;" class="form-group disabled divSeccion><div class="table-responsive tabla-md encabezados-fixed"><div class="section-title mt-0">' + item.Nombre + '</div><small>' + item.Descripcion + '</small><table class="table table-bordered tablaSeccion table-hover" disabled><thead ><tr><th scope="col">' + idioma_Texto + '</th><th scope="col">' + idioma_Respuesta + '</th><th colspan="2" style="width:30%">' + Idioma_Opciones + '</th><th  style="width:10%" >' + Idioma_Estatus + '</th></tr></thead><tbody id="tblSeccionRunning' + item.ID + '" style="font-size:15px"><tr><th colspan="7"><p class="text-center">' + $.CargarIdioma.Obtener_Texto("txt_Idioma_no_existen_registros") + '</p></th></tr></tbody></table></div></div>');
                    }
                    fn_agregarItemsSeccion(item.ID);
                });
                
                fn_obtener_cuadrante_runninID(ID, Nombre);   
                $("#divLoaderSecciones").css("display", "none");
                $("#divLoaderSecciones").hide();
            }, 1000);
           
           
        });
    }

    function fn_validar_respuestas_seccion_31(ID_Template) {
        var frmDatos = new FormData();
        frmDatos.append("ID", ID_Template);
        $.ajax({
            type: "POST",
            url: "/Sistema/Validar_Respuesta_Seccion_31",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    if (res.Id == "1") {
                        var urlidSeccion = "/Sistema/obtener_ID_seccion_32";
                        var dataisSeccion = { Template: ID_Template };
                        $.post(urlidSeccion, dataisSeccion).done(function (ID_Seccion) {
                            var urlEstatusSeccionControl = "/Sistema/verifica_estatus_control_Seccion";
                            var dataEstatusSeccionControl = { Seccion: ID_Seccion };
                            $.post(urlEstatusSeccionControl, dataEstatusSeccionControl).done(function (Estatus) {
                                if (Estatus == 0) {
                                    $.notiMsj.Confirmacion({
                                        Tipo: "MD",
                                        Titulo: "",
                                        Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Reporte_CondicionesBasicas_pregunta'),
                                        BotonSi: $.CargarIdioma.Obtener_Texto('txt_Idioma_Notificacion_SI'),
                                        BotonNo: $.CargarIdioma.Obtener_Texto('txt_Idioma_Cancelar'),
                                        FuncionV: function () {
                                            var urlActSeccionControl = "/Sistema/actualzar_control_secciones";
                                            var dataActSeccionControl = { Seccion: ID_Seccion, Opcion: 1 };
                                            $.post(urlActSeccionControl, dataActSeccionControl).done(function (res) {
                                                fn_actualizar_Seccion();
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        var urlidSeccion = "/Sistema/obtener_ID_seccion_32";
                        var dataisSeccion = { Template: ID_Template };
                        $.post(urlidSeccion, dataisSeccion).done(function (ID_Seccion) {
                            var urlEstatusSeccionControl = "/Sistema/verifica_estatus_control_Seccion";
                            var dataEstatusSeccionControl = { Seccion: ID_Seccion };
                            $.post(urlEstatusSeccionControl, dataEstatusSeccionControl).done(function (Estatus) {
                                if (Estatus == 1) {
                                    var urlActSeccionControl = "/Sistema/actualzar_control_secciones";
                                    var dataActSeccionControl = { Seccion: ID_Seccion, Opcion: 0 };
                                    $.post(urlActSeccionControl, dataActSeccionControl).done(function (res) {
                                        fn_actualizar_Seccion();
                                    });
                                }
                            });
                        });
                    }
                }               
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
   
    function fn_agregarItemsSeccion(id_seccion) {
        var url = "/Sistema/obtener_items_seccionID";
        var data = { ID: id_seccion };
        $("#tblSeccionRunning" + id_seccion).empty();
        $.post(url, data).done(function (res) {
            var Texto_Background = ["N/A","NA","n/a","na","N/a","Na","n/A","nA"]
            var idioma_Pendiente = $.CargarIdioma.Obtener_Texto("txt_Idioma_Pendiente");
            var Idioma_Finalizado = $.CargarIdioma.Obtener_Texto("txt_Idioma_Finalizado");
            var Idioma_Adjuntos = $.CargarIdioma.Obtener_Texto("txt_Idioma_Adjuntos");
            var Idioma_Cambiar = $.CargarIdioma.Obtener_Texto("txt_Idioma_CambiarRespuesta");
            var Idioma_Responder = $.CargarIdioma.Obtener_Texto("txt_Idioma_Responder");
            var Botones = '<button class="btn btn-primary btnResp" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + Idioma_Cambiar + '"><i class="far fa-edit"></i> ' + Idioma_Cambiar + '</button>';
            $.each(res, function (i, item) {
                var Estatus = '<div class="badge badge-success">' + Idioma_Finalizado + '</div>';
                var Adjuntos = '<button id="' + item.ID + '" name="btnAdjuntos" class="btn btn-info btnResp" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Cambiar"><i class="fa fa-paperclip"></i> ' + Idioma_Adjuntos + '</button>';

                if (item.Estatus == 0) {
                    Estatus = '<div class="badge badge-danger">' + idioma_Pendiente + '</div>';
                    Botones = '<button id="' + item.ID + '" name="ItemID" class="btn btn-success btnResp" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + Idioma_Responder + '"><i class="far fa-edit"></i> ' + Idioma_Responder + '</button>';
                } else {
                    Estatus = '<div class="badge badge-success">' + Idioma_Finalizado + '</div>';
                    Botones = '<button id="' + item.ID + '" name="ItemID" class="btn btn-primary btnResp" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + Idioma_Cambiar + '"><i class="far fa-edit"></i> ' + Idioma_Cambiar + '</button>';
                }
                if (Texto_Background.includes(item.Respuesta.trim())) {
                    $("#tblSeccionRunning" + id_seccion).append(
                        $('<tr style="background-color: #e9ecef !important;">')
                            .append($('<td style="display:none;" class="idItem">').append(item.ID))
                            .append($('<td style="display:none;" data-registro="Id_Seccion">').append(id_seccion))
                            .append($('<td data-registro="texto">').append(item.Texto))
                            .append($('<td data-registro="respuesta">').append(item.Respuesta))
                            .append($('<td data-registro="botones">').append(Botones))
                            .append($('<td>').append(Adjuntos))
                            .append($('<td data-registro="estatus">').append(Estatus))
                    );
                } else {
                    $("#tblSeccionRunning" + id_seccion).append(
                        $('<tr>')
                            .append($('<td style="display:none;" class="idItem">').append(item.ID))
                            .append($('<td style="display:none;" data-registro="Id_Seccion">').append(id_seccion))
                            .append($('<td data-registro="texto">').append(item.Texto))
                            .append($('<td data-registro="respuesta">').append(item.Respuesta))
                            .append($('<td data-registro="botones">').append(Botones))
                            .append($('<td>').append(Adjuntos))
                            .append($('<td data-registro="estatus">').append(Estatus))
                    );
                }               
            });
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    }
    function fn_obtener_result_wp(ID) {
        var url = "/Sistema/obtener_result_wp";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            //var Details = '<button class="btn btn-icon btn-primary btnDetailStandard" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-edit"></i></button>';
            $("#btnCuadranteD_Archivo_Pnl_results").empty();
            $("#btnCuadranteD_Archivo2_Pnl_results").empty();
            $.each(Data, function (i, item) {
                $("#txtNota_ID_CuadranteD_Results_wp").val(item.ID)
                $("#txtNota2_WP_CuadranteD_Results").val(item.Nota1)
            });
        });
    }
    function fn_obtener_risk_cuadrante_id(ID) {
        var url = "/Sistema/obtener_risk_cuadrante_id";
        var data = { ID: ID };
        $("#tblRiskCuadranteD_WP_Tabla").empty();
        $.post(url, data).done(function (Data) {
            var Details = '<button class="btn btn-icon btn-primary btnDetailRisk" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-edit"></i></button>';
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitRisk" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-times"></i></button>';
            $.each(Data, function (i, item) {
                $("#tblRiskCuadranteD_WP_Tabla").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="idRisk">').append(item.ID))
                        .append($('<td>').append(item.Cause))
                        .append($('<td>').append(item.P1))
                        .append($('<td>').append(item.S1))
                        .append($('<td>').append(item.Initial))
                        .append($('<td>').append(item.P2))
                        .append($('<td>').append(item.S2))
                        .append($('<td>').append(item.Final))
                        .append($('<td>').append(Details))
                        .append($('<td>').append(Omitir))
                );
            });
        });
    }
    function fn_obtener_result(ID) {
        var url = "/Sistema/obtener_result";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            //var Details = '<button class="btn btn-icon btn-primary btnDetailStandard" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-edit"></i></button>';
            $("#btnCuadranteD_Archivo_Pnl_results").empty();
            $("#btnCuadranteD_Archivo2_Pnl_results").empty();
            $.each(Data, function (i, item) {
                $("#txtNota_ID_CuadranteD_Results").val(item.ID);
                $("#txtNota_CuadranteD_Results").val(item.Nota1);
                $("#txtNota2_CuadranteD_Results").val(item.Nota2);
            });
        });
    }
    
    function fn_obtener_Standard_ID_Cuadrante(ID) {
        var url = "/Sistema/obtener_Standard_ID_Cuadrante";
        var data = { ID: ID };
        $("#tblStandardCuadranteD_Tabla").empty();
        $.post(url, data).done(function (Data) {
            var Details = '<button class="btn btn-icon btn-primary btnDetailStandard" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-edit"></i></button>';
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitirStandard" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-times"></i></button>';
            $.each(Data, function (i, item) {
                $("#tblStandardCuadranteD_Tabla").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="idStandard">').append(item.ID))
                        .append($('<td>').append(item.Standard))
                        .append($('<td>').append(item.Total_Initial))
                        .append($('<td>').append(item.Total_Simplied))
                        .append($('<td>').append(Details))
                        .append($('<td>').append(Omitir))
                );
            });
        });
    }
    function fn_obtener_Cost(ID) {
        var url = "/Sistema/obtener_Cost";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            //var Details = '<button class="btn btn-icon btn-primary btnDetailStandard" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-edit"></i></button>';
            $.each(Data, function (i, item) {
                $("#txtCost_ID_CuadranteD").val(item.ID)
                $("#txtCost_cost_CuadranteD").val(item.Costs)
                $("#txtCost_Avoid_CuadranteD").val(item.Avoid)
                $("#txtCost_Saving_CuadranteD").val(item.Saving)
                if (item.Solution == "1") {
                    $("#rdbCost_Solution_YES").prop("checked", true);
                    $("#rdbCost_Solution_NO").prop("checked", false);
                } else {
                    $("#rdbCost_Solution_NO").prop("checked", true);
                    $("#rdbCost_Solution_YES").prop("checked", false);
                }
            });
        });
    }
    function obtener_estatus_template() {
        $("#btnTemplateRunning_Finalizar_investigacion").show()
        //$("#btnTemplateRunning_Finalizar_investigacion").hide()
        //$("#btnTemplateRunning_Finalizar_investigacion_Modificacion").hide();
        //var url = "/Sistema/obtener_estatus_template";
        //var ID_Template = $("#txtTemplatesRunningN_ID").val();
        //var data = { ID: ID_Template };
        //$.post(url, data).done(function (info) {
        //    if (info.Id !== "9") {
                
        //    } else if (info.Id == "9") {
        //        $("#btnTemplateRunning_Finalizar_investigacion_Modificacion").show();
        //    }
        //})
    }
    function fn_obtener_evaluadores(id) {
        var url = "/Sistema/obtener_evaluadores_template_id";
        var data = { ID: id };
        $.post(url, data).done(function (info) {
            $("#tblEvaluadoresTemplate_Running").empty();
            var Tipo = "Revisor";
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitirFirmaRinning" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';

            $.each(info, function (i, item) {
                if (item.Rol == "1") {
                    Tipo = $.CargarIdioma.Obtener_Texto("txt_Idioma_Revisor");
                } else {
                    Tipo = $.CargarIdioma.Obtener_Texto("txt_Idioma_Aprovador");
                }
                $("#tblEvaluadoresTemplate_Running").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="idRevisor">').append(item.ID))
                        .append($('<td style="display:none;" class="idUsuario">').append(item.ID_Usuario))
                        .append($('<td>').append(item.Nombre))
                        .append($('<td>').append(Tipo))
                        .append($('<td>').append(Omitir))
                );
            });
        });
    }
    function fn_obtener_itemRunning_ID(id_item) {
        setTimeout(function () {
            $("#" + id_item + "").removeClass("btn-progress")
        }, 1000);
        
        var url = "/Sistema/get_detail_item_running";
        var data = { id_item: id_item };
        $.post(url, data).done(function (data) {
            var idioma_Pendiente = $.CargarIdioma.Obtener_Texto("txt_Idioma_Pendiente");
            var Idioma_Finalizado = $.CargarIdioma.Obtener_Texto("txt_Idioma_Finalizado");
            var Idioma_Cambiar = $.CargarIdioma.Obtener_Texto("txt_Idioma_CambiarRespuesta");
            var Idioma_Responder = $.CargarIdioma.Obtener_Texto("txt_Idioma_Responder");
            let respuesta = $("#" + id_item + "").parents("tr").find("[data-registro=respuesta]")
            let estatus = $("#" + id_item + "").parents("tr").find("[data-registro=estatus]")
            let botones = $("#" + id_item + "").parents("tr").find("[data-registro=botones]")
            let Estatus_item = "";
            let Botones_item = "";
            $(respuesta).empty()
            $(estatus).empty()
            $(botones).empty()
            $.each(data, function (i, item) {
                console.log(item.Estatus);
                $(respuesta).append(item.Respuesta);
                if (item.Estatus == 0) {
                    Estatus_item = '<div class="badge badge-danger">' + idioma_Pendiente + '</div>';
                    Botones_item = '<button id="' + item.ID + '" name="ItemID" class="btn btn-success btnResp" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + Idioma_Responder + '"><i class="far fa-edit"></i> ' + Idioma_Responder + '</button>';
                } else {
                    Estatus_item = '<div class="badge badge-success">' + Idioma_Finalizado + '</div>';
                    Botones_item = '<button id="' + item.ID + '" name="ItemID" class="btn btn-primary btnResp" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="' + Idioma_Cambiar + '"><i class="far fa-edit"></i> ' + Idioma_Cambiar + '</button>';
                }
                $(estatus).append(Estatus_item)
                $(botones).append(Botones_item)
            });
        }).fail(function (error) {
            console.log(error)
        });
    }
    function obtenerElemento_Caracteristicas(ID) {
        var url = "/Sistema/obtener_itemRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                var tabla = item.Tabla;
                var elementoID = item.TabId;
                fn_limpiarModalItemRunning();
                if (tabla == "TabPreguntas_Running") {
                    obtenerPreguntaRunning_ID(elementoID, tabla, ID);
                    $("#mdlItemRunning_Panel").modal("show");
                } else if (tabla == "TabNotas_Running") {
                    obtenerNotaRunning_ID(elementoID, tabla, ID);
                    $("#mdlNotaRunning_Panel").modal("show");
                } else if (tabla == "TabInstrucciones_Running") {
                    obtenerInstruccionRunning_ID(elementoID, tabla, ID);
                    $("#mdlInstruccionRunning_Panel").modal("show");
                } else if (tabla == "TabIshikawua_Running") {
                    obtenerIshikawuaRunning_ID(elementoID, tabla, ID);
                    $("#mdlIshikawuaRunning_Panel").modal("show");
                } else if (tabla == "TabHipotesis_Running") {
                    obtenerHipotesisRunning_ID(elementoID, tabla, ID);
                    $("#mdlHipotesisRunning_Panel").modal("show");
                } else if (tabla == "TabFactor_Running") {
                    obtenerFactorRunning_ID(elementoID, tabla, ID);
                    $("#mdlFactorRunning_Panel").modal("show");
                } else if (tabla == "TabMissing_Running") {
                    obtenerMissingRunning_ID(elementoID, tabla, ID);
                    $("#mdlMissingRunning_Panel").modal("show");
                }
            });
        });
    }
    function fn_limpiarModalItemRunning() {
        $("#pnlItem_PreguntaRunning").hide();
        $("#pnlItem_NotaRunning").hide();
    }
    //Estructura Elementos
    function obtenerPreguntaRunning_ID(ID, Tabla, ItemID) {
        $("#txtItemRunning_ID").val(ItemID);
        $("#txtItemRunning_Tabla").val(Tabla);
        var url = "/Sistema/obtener_PreguntaRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtPreguntaRunning_ID").val(item.ID);
                $("#txtPreguntaRunning_TipoRespuesta").val(item.Tipo);
                $("#txtPreguntaRunning_Texto").text(item.Texto);
                $("#txtPreguntaRunning_Descripcion").text(item.Descripcion);
                if (item.Tipo == "1") {
                    $("#pnlPreguntaRunning_Respuesta_Abierta").show();
                    $("#pnlPreguntaRunning_Respuesta_Cerrada").hide();
                    $("#txtPreguntaRunning_Respuesta_Abierta").val(item.Respuesta);
                } else {
                    if (item.Respuesta == "") {
                        $("#txtPreguntaRunning_Respuesta_Cerrada").find("option:contains('" + $.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione') + "')").attr('selected', 'selected');
                    } else {
                        $("#txtPreguntaRunning_Respuesta_Cerrada").find("option:contains('" + item.Respuesta + "')").attr('selected', 'selected');
                    }
                    $("#txtPreguntaRunning_Comentarios").val(item.Comentarios);
                    $("#pnlPreguntaRunning_Respuesta_Cerrada").show();
                    $("#pnlPreguntaRunning_Respuesta_Abierta").hide();
                    
                }
                $("#txtItemRunning_Firma").val(item.Firma);
            });
            $("#pnlItem_PreguntaRunning").show();
        });
    }
    function obtenerNotaRunning_ID(ID, Tabla, ItemID) {
        $("#txtNotaRunning_Respuesta").val(null);
        $("#txtItemNotaRunning_ID").val(ItemID);
        $("#txtItemNotaRunning_Tabla").val(Tabla);
        var url = "/Sistema/obtener_NotaRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtNotaRunning_ID").val(item.ID);
                $("#txtNotaRunning_Titulo").text(item.Titulo);
                $("#txtNotaRunning_Respuesta").val(item.Respuesta);
                $("#txtNotaRunning_Descripcion").text(item.Descripcion);
            });
        });
    }
    function obtenerMissingRunning_ID(ID, Tabla, ItemID) {
        $("#txtItemMissingRunning_ID").val(ItemID);
        $("#txtItemMissingRunning_Tabla").val(Tabla);
        var url = "/Sistema/obtener_MissingRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtMissingRunning_ID").val(item.ID);
                $("#txtMissingRunning_Titulo").text(item.Titulo);              
                $("#txtMissingRunning_Descripcion").text(item.Descripcion);
                $("#txtMissingRunning_Defect").val(item.Defect);
                $("#txtMissingRunning_Condition").val(item.Condition);
                $("#txtMissingRunning_Measures").val(item.Measures);
                $("#txtMissingRunning_Requested").val(item.Requested);
                $("#txtMissingRunning_Type").val(item.Tipo);
                $("#txtMissingRunning_Responsable").val(item.Responsable);
                $("#txtMissingRunning_Fecha").val(item.Fecha);
                $("#slcMissingRunning_Estatus").val(item.Estatus);
                $("#txtItemMissingRunning_Seccion").val(item.Seccion);
            });
        });
    }
    function obtenerInstruccionRunning_ID(ID, Tabla, ItemID) {
        $("#txtItemInstruccionRunning_ID").val(ItemID);
        $("#txtItemInstruccionRunning_Tabla").val(Tabla);
        var url = "/Sistema/obtener_InstruccionRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtInstruccionRunning_ID").val(item.ID);
                $("#txtInstruccionRunning_Titulo").text(item.Titulo);
                $("#txtInstruccionRunning_Descripcion").text(item.Descripcion);
            });
        });

    }
    function obtenerIshikawuaRunning_ID(ID, Tabla, ItemID) {
        $("#txtItemIshikawuaRunning_ID").val(ItemID);
        $("#txtItemIshikawuaRunning_Tabla").val(Tabla);
        var url = "/Sistema/obtener_IshikawuaRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtIshikawuaRunning_ID").val(item.ID);
                $("#txtIshikawuaRunning_Titulo").text(item.Titulo);
                $("#txtIshikawuaRunning_Descripcion").text(item.Descripcion);
                obtener_Detalle_IshikawuaRunning_ID(item.ID);
            });
        });
    }
    function obtenerHipotesisRunning_ID(ID, Tabla, ItemID) {
        $("#txtItemHipotesisRunning_ID").val(ItemID);
        $("#txtItemHipotesisRunning_Tabla").val(Tabla);
        var url = "/Sistema/obtener_HipotesisRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtHipotesisRunning_ID").val(item.ID);
                $("#txtHipotesisRunning_Titulo").text(item.Titulo);
                $("#txtHipotesisRunning_Descripcion").text(item.Descripcion);
                $("#slcHipotesisRunning_Rama").val(item.Rama);
                $("#txtHipotesisRunning_Hipotesis").val(item.Hipotesis);
                $("#txtHipotesisRunning_Resultados").val(item.Resultados);
                $("#txtHipotesisRunning_Seccion").val(item.Seccion);
                if (item.Test == "0") {
                    $("#rdbHipotesisRunning_Test_No").prop("checked", true);
                    $("#rdbHipotesisRunning_Test_Yes").prop("checked", false);
                } else {
                    $("#rdbHipotesisRunning_Test_No").prop("checked", false);
                    $("#rdbHipotesisRunning_Test_Yes").prop("checked", true);
                }
                if (item.True == "0") {
                    $("#rdbHipotesisRunning_Valid_False").prop("checked", true);
                    $("#rdbHipotesisRunning_Valid_True").prop("checked", false);
                } else {
                    $("#rdbHipotesisRunning_Valid_False").prop("checked", false);
                    $("#rdbHipotesisRunning_Valid_True").prop("checked", true);
                }
            });
        });
    }
    function obtenerFactorRunning_ID(ID, Tabla, ItemID) {
        $("#txtItemFactorRunning_ID").val(ItemID);
        $("#txtItemFactorRunning_Tabla").val(Tabla);
        var url = "/Sistema/obtener_FactorRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtFactorRunning_ID").val(item.ID);
                $("#txtFactorRunning_Titulo").text(item.Titulo);
                $("#txtFactorRunning_Descripcion").text(item.Descripcion);
                $("#txtFactorRunning_Seccion").val(item.Seccion);
                $("#txtFactorRunning_Factor").val(item.Factor);
                $("#txtFactorRunning_Conformacion").val(item.Confirmacion);
                $("#txtFactorRunning_Formulate").val(item.Formulate);
                if (item.Tested == "0") {
                    $("#rdbFactorRunning_Tested_No").prop("checked", true);
                    $("#rdbFactorRunning_Tested_Yes").prop("checked", false);
                } else {
                    $("#rdbFactorRunning_Tested_No").prop("checked", false);
                    $("#rdbFactorRunning_Tested_Yes").prop("checked", true);
                }
                if (item.Valido == "0") {
                    $("#rdbFactorRunning_Valido_No").prop("checked", true);
                    $("#rdbFactorRunning_Valido_Yes").prop("checked", false);
                } else {
                    $("#rdbFactorRunning_Valido_No").prop("checked", false);
                    $("#rdbFactorRunning_Valido_Yes").prop("checked", true);
                }
            });
        });
    }
    function obtener_Detalle_IshikawuaRunning_ID(ID) {
        var url = "/Sistema/obtener_DetalleIshikawuaRunning_ID";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            var idioma_Seleccione = $.CargarIdioma.Obtener_Texto("txt_Idioma_Seleccione");
            $("#tblDetalle_Ishikawua_Running").empty();
            $.each(Data, function (i, item) {
                var slcRespueta = '<select id="' + item.ID + '" name="slcRespuesta_ishikawua" class="form-control"><option value="-1" selected disabled>' + idioma_Seleccione + '</option><option value="2">All Yes</option><option value="3">No >= 1?</option></select>';
                if (item.Respuesta != "0") {
                    if (item.Respuesta != "2") {
                        slcRespueta = '<select id="' + item.ID + '" name="slcRespuesta_ishikawua" class="form-control"><option value="-1" disabled>' + idioma_Seleccione + '</option><option  value="2">All Yes</option><option selected value="3">No >= 1?</option></select>';
                    } else {
                        slcRespueta = '<select id="' + item.ID + '" name="slcRespuesta_ishikawua" class="form-control"><option value="-1" disabled>' + idioma_Seleccione + '</option><option selected value="2">All Yes</option><option  value="3">No >= 1?</option></select>';
                    }
                } else {
                    slcRespueta = '<select id="' + item.ID + '" name="slcRespuesta_ishikawua" class="form-control"><option value="-1" selected disabled>' + idioma_Seleccione + '</option><option value="2">All Yes</option><option value="3">No >= 1?</option></select>';
                }
                var test = item.Descripcion;
                var result = test.replace(/\?/g, '?<br/>');
                $("#tblDetalle_Ishikawua_Running").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="idRama">').append(item.ID))
                        .append($('<td>').append(item.Rama))
                        .append($('<td>').append(result))
                        .append($('<td>').append(slcRespueta))
                );
            });
        });
    }
    //Funciones Elementos
    function guardarRespuesta_PreguntaRunning_Cerrada() {
        let id_item = $("#txtItemRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlItemRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemRunning_ID").val());
        frmDatos.append("ID", $("#txtPreguntaRunning_ID").val());
        frmDatos.append("Comentarios", $("#txtPreguntaRunning_Comentarios").val());
        var tipo = $("#txtPreguntaRunning_TipoRespuesta").val();
        var respuesta = "";
        if (tipo == "1") {
            respuesta = $("#txtPreguntaRunning_Respuesta_Abierta").val();
        } else {
            respuesta = $("#txtPreguntaRunning_Respuesta_Cerrada option:selected").text();
        }
        frmDatos.append("Respuesta", respuesta);
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlItemRunning_Panel").modal("hide");
                    $("#txtPreguntaRunning_Comentarios").val(null);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_obtener_itemRunning_ID(id_item);
            },
            error: function (error) {
                $("#" + id_item + "").addClass("btn-progress");
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_PreguntaRunning_Abierta() {
        let id_item = $("#txtItemRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlItemRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemRunning_ID").val());
        frmDatos.append("ID", $("#txtPreguntaRunning_ID").val());
        frmDatos.append("Comentarios", $("#txtPreguntaRunning_Comentarios").val());
        var tipo = $("#txtPreguntaRunning_TipoRespuesta").val();
        var respuesta = "";
        if (tipo == "1") {
            respuesta = $("#txtPreguntaRunning_Respuesta_Abierta").val();
        } else {
            respuesta = $("#txtPreguntaRunning_Respuesta_Cerrada option:selected").text();
        }
        frmDatos.append("Respuesta", respuesta);
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#txtPreguntaRunning_Comentarios").val(null);                   
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_obtener_itemRunning_ID(id_item);
            },
            error: function (error) {
                $("#" + id_item + "").removeClass("btn-progress")
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_PreguntaRunning_Firma_Abierta(param) {
        let id_item = $("#txtItemRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlItemRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemRunning_ID").val());
        frmDatos.append("ID", $("#txtPreguntaRunning_ID").val());
        frmDatos.append("Comentarios", $("#txtPreguntaRunning_Comentarios").val());
        var tipo = $("#txtPreguntaRunning_TipoRespuesta").val();
        var respuesta = "";
        if (tipo == "0") {
            respuesta = $("#txtPreguntaRunning_Respuesta_Abierta").val();
        } else {
            respuesta = $("#txtPreguntaRunning_Respuesta_Cerrada option:selected").text();
        }
        frmDatos.append("Respuesta", respuesta);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta_firma",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#txtPreguntaRunning_Comentarios").val(null);
                    $("#mdlItemRunning_Panel").modal("hide");
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    
                }
                fn_obtener_itemRunning_ID(id_item);
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#" + id_item + "").addClass("btn-progress");
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_PreguntaRunning_Firma_Cerrada(param) {
        let id_item = $("#txtItemRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlItemRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemRunning_ID").val());
        frmDatos.append("ID", $("#txtPreguntaRunning_ID").val());
        frmDatos.append("Comentarios", $("#txtPreguntaRunning_Comentarios").val());
        var tipo = $("#txtPreguntaRunning_TipoRespuesta").val();
        var respuesta = "";
        if (tipo == "0") {
            respuesta = $("#txtPreguntaRunning_Respuesta_Abierta").val();
        } else {
            respuesta = $("#txtPreguntaRunning_Respuesta_Cerrada option:selected").text();
        }
        frmDatos.append("Respuesta", respuesta);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        frmDatos.append("ZMYSEL", param.ZMYSEL);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta_firma",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#txtPreguntaRunning_Comentarios").val(null);
                    $("#mdlItemRunning_Panel").modal("hide");
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_obtener_itemRunning_ID(id_item);
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_NotaRunning() {
        let id_item = $("#txtItemNotaRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlNotaRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemNotaRunning_ID").val());
        frmDatos.append("ID", $("#txtNotaRunning_ID").val());
        frmDatos.append("Respuesta", $("#txtNotaRunning_Respuesta").val());
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta_Nota",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlNotaRunning_Panel").modal("hide");
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_obtener_itemRunning_ID(id_item)
                //fn_actualizar_Seccion();
            },
            error: function (error) {
                $("#" + id_item + "").addClass("btn-progress");
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_MissingRunning() {
        let id_item = $("#txtItemMissingRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlMissingRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemMissingRunning_ID").val());
        frmDatos.append("ID", $("#txtMissingRunning_ID").val());
        frmDatos.append("Defect", $("#txtMissingRunning_Defect").val());
        frmDatos.append("Condition", $("#txtMissingRunning_Condition").val());
        frmDatos.append("Measures", $("#txtMissingRunning_Measures").val());
        frmDatos.append("Requested", $("#txtMissingRunning_Requested").val());
        frmDatos.append("type", $("#txtMissingRunning_Type").val());
        frmDatos.append("Responsible", $("#txtMissingRunning_Responsable").val());
        frmDatos.append("Fecha", $("#txtMissingRunning_Fecha").val());
        frmDatos.append("estatus", $("#slcMissingRunning_Estatus").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta_Missing",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlMissingRunning_Panel").modal("hide");
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_obtener_itemRunning_ID(id_item)
               // fn_actualizar_Seccion();
            },
            error: function (error) {
                $("#" + id_item + "").addClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_InstruccionRunning() {
        let id_item = $("#txtItemInstruccionRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlMissingRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemInstruccionRunning_ID").val());
        frmDatos.append("ID", $("#txtInstruccionRunning_ID").val());
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta_Instruccion",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlInstruccionRunning_Panel").modal("hide");
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                //fn_actualizar_Seccion();
                fn_obtener_itemRunning_ID(id_item)
            },
            error: function (error) {
                $("#" + id_item + "").addClass("btn-progress");
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_IshikawuaRunning() {
        let id_item = $("#txtItemIshikawuaRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlIshikawuaRunning_Panel").modal("hide");
        var Respuesta = "All Yes";
        $('select[name=slcRespuesta_ishikawua]').each(function () {
            var opc = $(this).val();
            if (opc == "3") {
                Respuesta = "NO >= 1";
            }
        });
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemIshikawuaRunning_ID").val());
        frmDatos.append("ID", $("#txtIshikawuaRunning_ID").val());
        frmDatos.append("Respuesta", Respuesta);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta_Ishikawua",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    $("#mdlIshikawuaRunning_Panel").modal("hide");
                    $('select[name=slcRespuesta_ishikawua]').each(function () {
                        let id = this.id;
                        var opc = $(this).val();
                        guardarRespuesta_DetalleIshikawuaRunning(id, opc);
                    });
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_obtener_itemRunning_ID(id_item)
                //fn_actualizar_Seccion();
            },
            error: function (error) {
                $("#" + id_item + "").addClass("btn-progress");
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_DetalleIshikawuaRunning(ID, Respuesta) {
        var url = "/Sistema/guardar_respuesta_DetalleIshikawua";
        var data = { ID: ID, Respuesta: Respuesta };
        $.post(url, data).done(function () {

        });
    }
    function guardarRespuesta_HipotesisRunning() {
        let id_item = $("#txtItemHipotesisRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlHipotesisRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemHipotesisRunning_ID").val());
        frmDatos.append("ID", $("#txtHipotesisRunning_ID").val());
        frmDatos.append("Rama", $("#slcHipotesisRunning_Rama option:selected").val());
        frmDatos.append("Hipotesis", $("#txtHipotesisRunning_Hipotesis").val());
        frmDatos.append("Resultados", $("#txtHipotesisRunning_Resultados").val());
        if ($("#rdbHipotesisRunning_Test_Yes").prop("checked")) {
            frmDatos.append("Test", "1");
        } else {
            frmDatos.append("Test", "0");
        }
        if ($("#rdbHipotesisRunning_Valid_True").prop("checked")) {
            frmDatos.append("True", "1");
        } else {
            frmDatos.append("True", "0");
        }
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta_Hipotesis",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlHipotesisRunning_Panel").modal("hide");
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_obtener_itemRunning_ID(id_item)
                //fn_actualizar_Seccion();
            },
            error: function (error) {
                $("#" + id_item + "").addClass("btn-progress");
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function guardarRespuesta_FactorRunning() {
        let id_item = $("#txtItemFactorRunning_ID").val();
        $("#" + id_item + "").addClass("btn-progress");
        $("#mdlHipotesisRunning_Panel").modal("hide");
        var frmDatos = new FormData();
        frmDatos.append("IDItem", $("#txtItemFactorRunning_ID").val());
        frmDatos.append("ID", $("#txtFactorRunning_ID").val());
        frmDatos.append("Factor", $("#txtFactorRunning_Factor").val());
        frmDatos.append("Formulate", $("#txtFactorRunning_Formulate").val());
        frmDatos.append("Confirmacion", $("#txtFactorRunning_Conformacion").val());
        if ($("#rdbFactorRunning_Tested_Yes").prop("checked")) {
            frmDatos.append("Tested", "1");
        } else {
            frmDatos.append("Tested", "0");
        }
        if ($("#rdbFactorRunning_Valido_Yes").prop("checked")) {
            frmDatos.append("Valido", "1");
        } else {
            frmDatos.append("Valido", "0");
        }
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_respuesta_Factor",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlFactorRunning_Panel").modal("hide");
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_obtener_itemRunning_ID(id_item)
                //fn_actualizar_Seccion();
            },
            error: function (error) {
                $("#" + id_item + "").addClass("btn-progress");
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_Agreagar_Hipotesis(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtHipotesisRunning_Titulo").text());
        frmDatos.append("Descripcion", $("#txtHipotesisRunning_Descripcion").text());
        frmDatos.append("ID_Seccion", $("#txtHipotesisRunning_Seccion").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/agregar_hipotesis",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_actualizar_Seccion();
                }
                $("#mdlHipotesisRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlHipotesisRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_Agreagar_Factor(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtFactorRunning_Titulo").text());
        frmDatos.append("Descripcion", $("#txtFactorRunning_Descripcion").text());
        frmDatos.append("ID_Seccion", $("#txtFactorRunning_Seccion").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/agregar_Factor",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_actualizar_Seccion();
                }
                $("#mdlFactorRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlFactorRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_Agregar_Missing(param) {
        var frmDatos = new FormData();
        frmDatos.append("Titulo", $("#txtHipotesisRunning_Titulo").text());
        frmDatos.append("Descripcion", $("#txtHipotesisRunning_Descripcion").text());
        frmDatos.append("ID_seccion", $("#txtItemMissingRunning_Seccion").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/nuevo_registro_missing",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_actualizar_Seccion();
                }
                $("#mdlMissingRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlMissingRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_Eliminar_Missing(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtMissingRunning_ID").val());
        frmDatos.append("Item_ID", $("#txtItemMissingRunning_ID").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/eliminar_missing_running",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_actualizar_Seccion();
                }
                $("#mdlMissingRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlMissingRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_eliminar_hipotesis_running() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtHipotesisRunning_ID").val());
        frmDatos.append("Item_ID", $("#txtItemHipotesisRunning_ID").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/eliminar_hipotesis_running",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlHipotesisRunning_Panel").modal("hide");
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_actualizar_Seccion();
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function eliminar_factor_running() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtFactorRunning_ID").val());
        frmDatos.append("Item_ID", $("#txtItemFactorRunning_ID").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/eliminar_factor_running",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlFactorRunning_Panel").modal("hide");
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                fn_actualizar_Seccion();
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    // FIN
    function fn_actualizar_Seccion() {
        var Cuadrante_ID = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var Cuadrante_Nombre = $("#pnlTemplateRunning_Cuadrante_Nombre_Ejecucion").val();
        let Template_ID = $("#txtTemplatesRunningN_ID").val();
        if (Cuadrante_Nombre == "A") {
            fn_validar_respuestas_seccion_31(Template_ID);
        }       
        fn_mostrarSeccionesRunning(Cuadrante_ID, Cuadrante_Nombre);                
    } 
    function fn_agregar_evaluadores_running(param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var Evaluador_Tipo = $("#txtTemplateRunning_Evaluador_Tipo option:selected").text();
        var Nom_Tipo_Usuario = 2;
        if (Evaluador_Tipo == $.CargarIdioma.Obtener_Texto('txt_Idioma_Revisor')) {
            Nom_Tipo_Usuario = 1;
        } else { Nom_Tipo_Usuario = 2; }
        var frmDatos = new FormData();
        frmDatos.append("Usuario", $("#slcTemplatesRunningN_Usuarios_Revisor option:selected").val());
        frmDatos.append("Tipo", Nom_Tipo_Usuario);
        frmDatos.append("Template", ID_Template);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_evluadores",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    fn_obtener_evaluadores(ID_Template);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
            }
        });
    }
    //Funciones adjuntos
    function fn_obtenerAdjuntos(ID) {
        var url = "/Sistema/obtener_Adjuntos_Item_ID";
        var data = { ID: ID };
        $("#tblAdjuntos_Running").empty();
        $.post(url, data).done(function (Data) {
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitirAdjunto" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            $.each(Data, function (i, item) {
                $("#tblAdjuntos_Running").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="idAdjunto">').append(item.ID))
                        .append($('<td>').append(item.Nombre))
                        .append($('<td>').append(item.Tipo))
                        .append($('<td>').append(Omitir))
                );
            });
        });
    }
    function fn_guardarAdjunto(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtAdjuntos_Item_ID").val());
        frmDatos.append("Archivo", ($("#txtAdjuntos_Item_Archivo"))[0].files[0]);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/guardar_adjunto",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    var id = $("#txtAdjuntos_Item_ID").val();
                    fn_obtenerAdjuntos(id);
                    $("#txtAdjuntos_Item_Archivo").val(null);
                    $("label[for='txtAdjuntos_Item_Archivo']").html($.CargarIdioma.Obtener_Texto('txt_Idioma_Seleccione_Archivo'));
                }
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });          
            }
        });
    }
    function fn_omitirAdjunto(param) {
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtAdjuntos_ID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/omitir_adjunto",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    var id = $("#txtAdjuntos_Item_ID").val();
                    fn_obtenerAdjuntos(id);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });              
            }
        });
    }
    //Funciones Cuadrantes
    function fn_verifica_cuadrantes(ID_Template, Nombre, ID) {
        var url = "/Templates/Verifica_Cuadrantes";
        var data = { ID_Template: ID_Template, Nombre: Nombre };
        $.post(url, data).done(function (info) {
            if (info != "0") {
                $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val(ID);
                $("#pnlTemplateRunning_Cuadrante_Nombre_Ejecucion").val(Nombre);
                fn_obtener_cuadrante_runninID(ID);
                fn_mostrarSeccionesRunning(ID, Nombre);
                if (Nombre == "D") {
                    //$("#divLoaderCuadranteD").show()
                    setTimeout(function () {
                        $("#divLoaderCuadranteD").hide()
                        $("#pnlTemplateRunning_Cuadrante_D").show();
                        var url2 = "/Sistema/verifica_tempate_wp";
                        var data2 = { ID: ID };
                        $.post(url2, data2).done(function (res) {
                            if (res.Id == "1") {
                                fn_obtener_result_wp(ID);
                                fn_obtener_risk_cuadrante_id(ID);
                                $("#pnlResults_TemplateWG").show();
                                $("#pnlResults_CuadranteD").hide();
                            } else {
                                fn_obtener_result(ID);
                                $("#pnlResults_TemplateWG").hide();
                                $("#pnlResults_CuadranteD").show();
                            }
                        });
                        fn_obtener_5w_ID_Cuadrante(ID);
                        fn_obtener_Standard_ID_Cuadrante(ID);
                        fn_obtener_Cost(ID);
                        obtener_estatus_template();
                    }, 1000);
                } else {
                    
                }
            } else {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_comenzar_cuadrante_A'), Tipo: "info", Error: null });
            }
        }).fail(function (error) {
            $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
        });
    }
    function fn_obtener_cuadrante_runninID(Cuadrante_ID,Cuadrante_Nombre) {
        var btn_CuadranteB_C = $.CargarIdioma.Obtener_Texto("txt_Idioma_Continuar_Cuadrante_C");
        var btn_CuadranteC_D = $.CargarIdioma.Obtener_Texto("txt_Idioma_Continuar_Cuadrante_D");
        if (Cuadrante_Nombre == "A") {
            fn_verifica_cuadrante_A(Cuadrante_ID);
        } else if (Cuadrante_Nombre == "B") {
            $("#ItemTemplateRunning_SeccionRunning").append('<div id="" class="text-right"><button name="btnRedireccion" type="button" class="btn btn-success btnRedireccion" id="btn_CuadranteB_C">' + btn_CuadranteB_C + '</button></div>');
        } else if (Cuadrante_Nombre == "C") {
            $("#ItemTemplateRunning_SeccionRunning").append('<div id="" class="text-right"><button name="btnRedireccion" type="button" class="btn btn-success btnRedireccion" id="btn_CuadranteC_D">' + btn_CuadranteC_D + '</button></div>');
        }
    }
    function fn_verifica_cuadrante_A(id) {
        var url = "/Sistema/Verificar_Cuadrante_A";
        var data = { ID: id };
        var btn_CuadranteA_D = $.CargarIdioma.Obtener_Texto("txt_Idioma_Continuar_Cuadrante_D");
        var btn_CuadranteA_B = $.CargarIdioma.Obtener_Texto("txt_Idioma_Continuar_Cuadrante_B");
        $.post(url, data).done(function (info) {
            if (info != "0") {
                $("#ItemTemplateRunning_SeccionRunning").append('<div id="" class="text-right"><button name="btnRedireccion" type="button" class="btn btn-success btnRedireccion" id="btn_CuadranteA_D">' + btn_CuadranteA_D + '</button></div>');
            } else {
                $("#ItemTemplateRunning_SeccionRunning").append('<div id="" class="text-right"><button name="btnRedireccion" type="button" class="btn btn-success btnRedireccion" id="btn_CuadranteA_B">' + btn_CuadranteA_B + '</button></div>');
            }
        }).fail(function (error) { $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error }); });
    }
    function fn_obtener_estatus_cuadrante(ID_Template, Nombre_Validar, Nombre_Siguiente) {
        var url = "/Sistema/valida_estatus_cuadrante";
        var data = { ID_Template: ID_Template, Nombre: Nombre_Validar };
        $.post(url, data).done(function (info) {
            if (info != "0") {
                var frmDatos = new FormData();
                frmDatos.append("ID", ID_Template);
                $.ajax({
                    type: "POST",
                    url: "/Sistema/Validar_Respuesta_Seccion_31",
                    contentType: false,
                    processData: false,
                    data: frmDatos,
                    success: function (res) {
                        if (res.Tipo == "success") {
                            if (res.Id == "1") {
                                fn_set_estatus_cuadrante(ID_Template, Nombre_Validar, Nombre_Siguiente);
                            } else {
                                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_debe_contestar_cuadrante'), Tipo: "info", Error: null });              
                            }
                        }
                    },
                    error: function (error) {
                        $("#mdlSistema_FirmaElectronica").modal("hide");
                        $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                        $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Mostrar_informacion_error'), Tipo: "danger", Error: error });
                    }
                });              
            } else {
                fn_set_estatus_cuadrante(ID_Template, Nombre_Validar, Nombre_Siguiente);
                // fn_obtener_cuadrante_template(ID_Template, Nombre_Siguiente);
            }
        });
    }
    function fn_set_estatus_cuadrante(ID_Template, Nombre_validar, Nombre_Siguiente) {
        var url = "/Sistema/set_estatus_cuadrante";
        var data = { Estatus: "2", ID_Template: ID_Template, Nombre: Nombre_validar };
        $.post(url, data).done(function (info) {
            if (info == "1") {
                fn_obtener_cuadrante_template(ID_Template, Nombre_Siguiente);
            }
        });
    }
    function fn_obtener_cuadrante_template(ID_Template, Nombre) {
        var url = "/Sistema/obtener_info_cuadrante";
        var data = { ID_Template: ID_Template, Nombre: Nombre };
        $.post(url, data).done(function (info) {
            $.each(info, function (i, item) {
                fn_verifica_cuadrantes($("#txtTemplatesRunningN_ID").val(), item.Nombre, item.ID);
            });
        });
    }
    //Finalizar Investigacion
    function registrar_firma_templateRunning_finalizado(param) {
        var frmDatos = new FormData();
        frmDatos.append("id_template", $("#txtTemplatesRunningN_ID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Reportes/Finish_investigation_process",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    window.location.replace("/Home/Index");
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
    function registrar_firma_reabrir_A3(param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("id_template", ID_Template);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Reportes/registrar_firma_reabrir_A3",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlItemRunning_Panel").modal("hide");
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                    fn_mostrar_Investigacion(ID_Template);
                    fn_mostrar_Cuadrantes_btn(ID_Template);
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
    function registrar_firma_templateRunning_Modificado(param) {
        var frmDatos = new FormData();
        frmDatos.append("Template", $("#txtTemplatesRunningN_ID").val());
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);

        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_firma_modificar_A3",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlItemRunning_Panel").modal("hide");
                    $("#mdlSistema_FirmaElectronica").modal("hide");
                    $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                }
                $("#btnFirmaElectronica_Firmar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
                window.location.replace("/Sistema/InicioA3");
            },
            error: function (error) {
                $("#mdlSistema_FirmaElectronica").modal("hide");
                $("#scnFirmaElectronica_Justificacion").prop("hidden", true);
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function registrar_firma_Revision_A3(param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("Template", ID_Template);
        frmDatos.append("BYTOST", param.BYTOST);
        frmDatos.append("ZNACKA", param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_firma_revisar_A3",
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
    function registrar_firma_Rechazar_Revision_A3(Param) {
        var ID_Template = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("Template", ID_Template);
        frmDatos.append("Comentarios", $("#txtMdlComments_Comentarios").val());
        frmDatos.append("BYTOST", Param.BYTOST);
        frmDatos.append("ZNACKA", Param.ZNACKA);
        $("#btnFirmaElectronica_Firmar").addClass("btn-progress");
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_firma_Rechazar_revisar_A3",
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
    //Funciones Cuadrante D
    function guardarAdjunto_CuadranteD() {
        var frmDatos = new FormData();
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var seccion = $("#txtAdjuntos_Seccion_Archivo_D").val();
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Seccion", seccion);
        frmDatos.append("Archivo", ($("#txtAdjuntos_Item_Archivo_D"))[0].files[0]);
        $.ajax({
            type: "POST",
            url: "/Sistema/insert_adjuntos_cuadrante_D",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    obtenerAdjuntos_CuadtanteD(Cuadrante, seccion);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function obtenerAdjuntos_CuadtanteD(ID, Seccion) {
        var url = "/Sistema/obtener_adjuntos_cuadrante_D";
        var data = { Cuadrante: ID, Seccion: Seccion };
        $("#tblAdjuntos_Running_D").empty();
        $.post(url, data).done(function (Data) {
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitirAdjunto_D" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Omitir Registro"><i class="fa fa-times"></i></button>';
            $.each(Data, function (i, item) {
                $("#tblAdjuntos_Running_D").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="idAdjunto">').append(item.ID))
                        .append($('<td>').append(item.Nombre))
                        .append($('<td>').append(Omitir))
                );
            });
        });
    }
    function omitir_adjuntos_cuadrante_D(ID) {
        var frmDatos = new FormData();
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var seccion = $("#txtAdjuntos_Seccion_Archivo_D").val();
        frmDatos.append("ID", ID);
        $.ajax({
            type: "POST",
            url: "/Sistema/omitir_adjuntos_cuadrante_D",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    obtenerAdjuntos_CuadtanteD(Cuadrante, seccion);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_5w() {
        $("#btnInvestigation5Why_CuadranteD_Guardar").addClass("btn-progress");
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var Template_ID = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txt5wCuadranteD_ID").val());
        frmDatos.append("What", $("#txt5wCuadranteD_What").val());
        frmDatos.append("Why1", $("#txt5wCuadranteD_Why1").val());
        frmDatos.append("Why2", $("#txt5wCuadranteD_Why2").val());
        frmDatos.append("Why3", $("#txt5wCuadranteD_Why3").val());
        frmDatos.append("Why4", $("#txt5wCuadranteD_Why4").val());
        frmDatos.append("Why5", $("#txt5wCuadranteD_Why5").val());
        frmDatos.append("Cause", $("#txt5wCuadranteD_Cause").val());
        frmDatos.append("Step", $("#txt5wCuadranteD_Step").val());
        frmDatos.append("Name", $("#txt5wCuadranteD_Name").val());
        frmDatos.append("Date", $("#txt5wCuadranteD_Date").val());
        frmDatos.append("Status", $("#txt5wCuadranteD_Status").val());
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("ID_Template", Template_ID);
        $.ajax({
            type: "POST",
            url: "/Sistema/actualizar_5w",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlInvestigtion5why_CuadranteD").modal("hide");
                    fn_obtener_5w_ID_Cuadrante(Cuadrante);
                }
                $("#btnInvestigation5Why_CuadranteD_Guardar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#btnInvestigation5Why_CuadranteD_Guardar").removeClass("btn-progress");
                $("#mdlInvestigtion5why_CuadranteD").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_guardar_5w() {
        $("#btnInvestigation5Why_CuadranteD_Guardar").addClass("btn-progress");
        var Cuadrante_ID = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var Template_ID = $("#txtTemplatesRunningN_ID").val();
        var frmDatos = new FormData();
        frmDatos.append("What", $("#txt5wCuadranteD_What").val());
        frmDatos.append("Why1", $("#txt5wCuadranteD_Why1").val());
        frmDatos.append("Why2", $("#txt5wCuadranteD_Why2").val());
        frmDatos.append("Why3", $("#txt5wCuadranteD_Why3").val());
        frmDatos.append("Why4", $("#txt5wCuadranteD_Why4").val());
        frmDatos.append("Why5", $("#txt5wCuadranteD_Why5").val());
        frmDatos.append("Cause", $("#txt5wCuadranteD_Cause").val());
        frmDatos.append("Step", $("#txt5wCuadranteD_Step").val());
        frmDatos.append("Name", $("#txt5wCuadranteD_Name").val());
        frmDatos.append("Date", $("#txt5wCuadranteD_Date").val());
        frmDatos.append("Status", $("#txt5wCuadranteD_Status").val());
        frmDatos.append("Cuadrante", Cuadrante_ID);
        frmDatos.append("ID_Template", Template_ID);
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_5w",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlInvestigtion5why_CuadranteD").modal("hide");
                    fn_obtener_5w_ID_Cuadrante(Cuadrante_ID);
                }
                $("#btnInvestigation5Why_CuadranteD_Guardar").removeClass("btn-progress");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#btnInvestigation5Why_CuadranteD_Guardar").removeClass("btn-progress");
                $("#mdlInvestigtion5why_CuadranteD").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function eliminar_5Why(ID) {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", ID);
        $.ajax({
            type: "POST",
            url: "/Sistema/eliminar_5Why",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_5w_ID_Cuadrante(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtener_5w_ID_Cuadrante(ID) {
        var url = "/Sistema/obtener_5w_ID_Cuadrante";
        var data = { ID: ID };
        var constestado = $.CargarIdioma.Obtener_Texto('txt_Idioma_Contestado');
        $("#tbl5WCuadranteD_tabla").empty();
        $.post(url, data).done(function (Data) {
            var Estatus = '<div style="font-size:10px;" class="badge badge-success">' + constestado + '</div>';
            var Details = '<button class="btn btn-icon btn-primary btnDetail5W" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-edit"></i></button>';
            var Omitir = '<button class="btn btn-icon btn-danger btnOmitir5W" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Details"><i class="fa fa-times"></i></button>';
            $.each(Data, function (i, item) {
                if (item.Status == "1") {
                    Estatus = '<div style="font-size:10px;" class="badge badge-primary">Started</div>';
                } else if (item.Status == "2") {
                    Estatus = '<div style="font-size:10px;" class="badge badge-info">In Progress</div>';
                }
                else if (item.Status == "3") {
                    Estatus = '<div style="font-size:10px;" class="badge badge-info">Largly Completed</div>';
                }
                else if (item.Status == "4") {
                    Estatus = '<div style="font-size:10px;" class="badge badge-success">Completed</div>';
                }
                $("#tbl5WCuadranteD_tabla").append(
                    $('<tr>')
                        .append($('<td style="display:none;" class="id5w">').append(item.ID))
                        .append($('<td>').append(item.What))
                        .append($('<td>').append(item.Why1))
                        .append($('<td>').append(item.Why2))
                        .append($('<td>').append(item.Why3))
                        .append($('<td>').append(item.Why4))
                        .append($('<td>').append(item.Why5))
                        .append($('<td>').append(item.Cause))
                        .append($('<td>').append(item.Step))
                        .append($('<td>').append(item.Name))
                        .append($('<td>').append(item.Date))
                        .append($('<td>').append(Estatus))
                        .append($('<td>').append(Details))
                        .append($('<td>').append(Omitir))
                );
            });
        });
    }
    function fn_obtener_5w_ID_Info(ID) {
        var url = "/Sistema/obtener_5w_ID_info";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {

            $.each(Data, function (i, item) {

                $("#txt5wCuadranteD_What").val(item.What);
                $("#txt5wCuadranteD_Why1").val(item.Why1);
                $("#txt5wCuadranteD_Why2").val(item.Why2);
                $("#txt5wCuadranteD_Why3").val(item.Why3);
                $("#txt5wCuadranteD_Why4").val(item.Why4);
                $("#txt5wCuadranteD_Why5").val(item.Why5);
                $("#txt5wCuadranteD_Cause").val(item.Cause);
                $("#txt5wCuadranteD_Step").val(item.Step);
                $("#txt5wCuadranteD_Name").val(item.Name);
                $("#txt5wCuadranteD_Date").val(item.Date);
                $("#txt5wCuadranteD_Status").val(item.Status);
                $("#txt5wCuadranteD_ID").val(item.ID);
            });
            $("#mdlInvestigtion5why_CuadranteD").modal("show");
        });
    }
    function fn_guardar_Standard() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("Standard", $("#txtStardardCuadranteC_NewStandard").val());
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Q1_Initial", $("#slcStandarCuadranteD_Q1_Initial").val());
        frmDatos.append("Q1_Simplied", $("#slcStandarCuadranteD_Q1_Simplied").val());
        frmDatos.append("Q2_Initial", $("#slcStandarCuadranteD_Q2_Initial").val());
        frmDatos.append("Q2_Simplied", $("#slcStandarCuadranteD_Q2_Simplied").val());
        frmDatos.append("Q3_Initial", $("#slcStandarCuadranteD_Q3_Initial").val());
        frmDatos.append("Q3_Simplied", $("#slcStandarCuadranteD_Q3_Simplied").val());
        frmDatos.append("Q4_Initial", $("#slcStandarCuadranteD_Q4_Initial").val());
        frmDatos.append("Q4_Simplied", $("#slcStandarCuadranteD_Q4_Simplied").val());
        frmDatos.append("Q5_Initial", $("#slcStandarCuadranteD_Q5_Initial").val());
        frmDatos.append("Q5_Simplied", $("#slcStandarCuadranteD_Q5_Simplied").val());
        frmDatos.append("Total_Initial", $("#txtSatardadCuadranteD_Total_Initial").val());
        frmDatos.append("Total_Simplied", $("#txtSatardadCuadranteD_Total_Simplied").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_Standard",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlStandards_CuadranteD").modal("hide");
                    fn_obtener_Standard_ID_Cuadrante(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlStandards_CuadranteD").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_Standard() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtStardardCuadranteC_ID").val());
        frmDatos.append("Standard", $("#txtStardardCuadranteC_NewStandard").val());
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Q1_Initial", $("#slcStandarCuadranteD_Q1_Initial").val());
        frmDatos.append("Q1_Simplied", $("#slcStandarCuadranteD_Q1_Simplied").val());
        frmDatos.append("Q2_Initial", $("#slcStandarCuadranteD_Q2_Initial").val());
        frmDatos.append("Q2_Simplied", $("#slcStandarCuadranteD_Q2_Simplied").val());
        frmDatos.append("Q3_Initial", $("#slcStandarCuadranteD_Q3_Initial").val());
        frmDatos.append("Q3_Simplied", $("#slcStandarCuadranteD_Q3_Simplied").val());
        frmDatos.append("Q4_Initial", $("#slcStandarCuadranteD_Q4_Initial").val());
        frmDatos.append("Q4_Simplied", $("#slcStandarCuadranteD_Q4_Simplied").val());
        frmDatos.append("Q5_Initial", $("#slcStandarCuadranteD_Q5_Initial").val());
        frmDatos.append("Q5_Simplied", $("#slcStandarCuadranteD_Q5_Simplied").val());
        frmDatos.append("Total_Initial", $("#txtSatardadCuadranteD_Total_Initial").val());
        frmDatos.append("Total_Simplied", $("#txtSatardadCuadranteD_Total_Simplied").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/actualizar_Standard",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    $("#mdlStandards_CuadranteD").modal("hide");
                    fn_obtener_Standard_ID_Cuadrante(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $("#mdlStandards_CuadranteD").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_obtener_Standard_ID_Info(ID) {
        var url = "/Sistema/obtener_Standard_ID_info";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtStardardCuadranteC_NewStandard").val(item.Standard);
                $("#txtStardardCuadranteC_ID").val(item.ID);
                $("#slcStandarCuadranteD_Q1_Initial").val(item.Q1_Initial);
                $("#slcStandarCuadranteD_Q1_Simplied").val(item.Q1_Simplied);
                $("#slcStandarCuadranteD_Q2_Initial").val(item.Q2_Initial);
                $("#slcStandarCuadranteD_Q2_Simplied").val(item.Q2_Simplied);
                $("#slcStandarCuadranteD_Q3_Initial").val(item.Q3_Initial);
                $("#slcStandarCuadranteD_Q3_Simplied").val(item.Q3_Simplied);
                $("#slcStandarCuadranteD_Q4_Initial").val(item.Q4_Initial);
                $("#slcStandarCuadranteD_Q4_Simplied").val(item.Q4_Simplied);
                $("#slcStandarCuadranteD_Q5_Initial").val(item.Q5_Initial);
                $("#slcStandarCuadranteD_Q5_Simplied").val(item.Q5_Simplied);
                $("#txtSatardadCuadranteD_Total_Initial").val(item.Total_Initial);
                $("#txtSatardadCuadranteD_Total_Simplied").val(item.Total_Simplied);
            });
            $("#mdlStandards_CuadranteD").modal("show");
        });
    }
    function eliminar_standard(ID) {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", ID);
        $.ajax({
            type: "POST",
            url: "/Sistema/eliminar_standard",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_Standard_ID_Cuadrante(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_guardar_results() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Nota1", $("#txtNota_CuadranteD_Results").val());
        frmDatos.append("Nota2", $("#txtNota2_CuadranteD_Results").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_result",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_result(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_results() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtNota_ID_CuadranteD_Results").val());
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Nota1", $("#txtNota_CuadranteD_Results").val());
        frmDatos.append("Nota2", $("#txtNota2_CuadranteD_Results").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/update_result",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_result(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_guardar_cost() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Cost", $("#txtCost_cost_CuadranteD").val());
        frmDatos.append("Avoid", $("#txtCost_Avoid_CuadranteD").val());
        frmDatos.append("Saving", $("#txtCost_Saving_CuadranteD").val());
        var solutions = 0;
        if ($("#rdbCost_Solution_YES").is(":checked")) {
            solutions = 1;
        } else {
            solutions = 0;
        }
        frmDatos.append("Solution", solutions);
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_cost",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_Cost(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_cost() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtCost_ID_CuadranteD").val());
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Cost", $("#txtCost_cost_CuadranteD").val());
        frmDatos.append("Avoid", $("#txtCost_Avoid_CuadranteD").val());
        frmDatos.append("Saving", $("#txtCost_Saving_CuadranteD").val());
        var solutions = 0;
        if ($('#rdbCost_Solution_YES').is(':checked')) {
            solutions = 1;
        } else {
            solutions = 0;
        }
        frmDatos.append("Solution", solutions);
        $.ajax({
            type: "POST",
            url: "/Sistema/actualizar_cost",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_Cost(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_omitir_adjunto_results(Archivo) {
        var frmDatos = new FormData();
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        frmDatos.append("ID", $("#txtNota_ID_CuadranteD_Results").val());
        frmDatos.append("Archivo", Archivo);
        $.ajax({
            type: "POST",
            url: "/Sistema/omitir_adjunto_results",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_result(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_registrar_risk() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("Cause", $("#txtRiskCause_Cause").val());
        frmDatos.append("P1", $("#SlcRiskInitial_p option:selected").val());
        frmDatos.append("S1", $("#SlcRiskInitial_s option:selected").val());
        frmDatos.append("Initial", $("#txtRiskInitial_Initial").val());
        frmDatos.append("P2", $("#SlcRiskFinal_p option:selected").val());
        frmDatos.append("S2", $("#SlcRiskFinal_s option:selected").val());
        frmDatos.append("Final", $("#txtRiskIFinal_Final").val());
        frmDatos.append("Cuadrante", Cuadrante);
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_risk",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_risk_cuadrante_id(Cuadrante);
                }
                $("#mdlRiskRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function modificar_risk() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtRiskCause_ID").val());
        frmDatos.append("Cause", $("#txtRiskCause_Cause").val());
        frmDatos.append("P1", $("#SlcRiskInitial_p option:selected").val());
        frmDatos.append("S1", $("#SlcRiskInitial_s option:selected").val());
        frmDatos.append("Initial", $("#txtRiskInitial_Initial").val());
        frmDatos.append("P2", $("#SlcRiskFinal_p option:selected").val());
        frmDatos.append("S2", $("#SlcRiskFinal_s option:selected").val());
        frmDatos.append("Final", $("#txtRiskIFinal_Final").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/modificar_risk",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_risk_cuadrante_id(Cuadrante);
                }
                $("#mdlRiskRunning_Panel").modal("hide");
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function obtener_risk_id(ID) {
        var url = "/Sistema/obtener_risk_id";
        var data = { ID: ID };
        $.post(url, data).done(function (Data) {
            $.each(Data, function (i, item) {
                $("#txtRiskCause_ID").val(item.ID)
                $("#txtRiskCause_Cause").val(item.Cause)
                $("#SlcRiskInitial_p").val(item.P1)
                $("#SlcRiskInitial_s").val(item.S1)
                $("#txtRiskInitial_Initial").val(item.Initial)
                $("#SlcRiskFinal_p").val(item.P2)
                $("#SlcRiskFinal_s").val(item.S2)
                $("#txtRiskIFinal_Final").val(item.Final)
            });
            $("#mdlRiskRunning_Panel").modal("show");
        });
    }
    function eliminar_risk(ID) {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", ID);
        $.ajax({
            type: "POST",
            url: "/Sistema/eliminar_risk",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_risk_cuadrante_id(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_guardar_results_wp() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Nota1", $("#txtNota2_WP_CuadranteD_Results").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/registrar_result_wp",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_result_wp(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    function fn_actualizar_results_wp() {
        var Cuadrante = $("#pnlTemplateRunning_Cuadrante_ID_Ejecucion").val();
        var frmDatos = new FormData();
        frmDatos.append("ID", $("#txtNota_ID_CuadranteD_Results_wp").val());
        frmDatos.append("Cuadrante", Cuadrante);
        frmDatos.append("Nota1", $("#txtNota2_WP_CuadranteD_Results").val());
        $.ajax({
            type: "POST",
            url: "/Sistema/update_result_wp",
            contentType: false,
            processData: false,
            data: frmDatos,
            success: function (res) {
                if (res.Tipo == "success") {
                    fn_obtener_result(Cuadrante);
                }
                $.notiMsj.Notificacion({ Mensaje: res.Mensaje, Tipo: res.Tipo, Error: res.Error });
            },
            error: function (error) {
                $.notiMsj.Notificacion({ Mensaje: $.CargarIdioma.Obtener_Texto('txt_Idioma_Informacion_guardar_error'), Tipo: "danger", Error: error });
            }
        });
    }
    //async function fn_valida_cuadrante_estatus(Cuadrante_ID) {
    //    var Data = { Cuadrante_ID: Cuadrante_ID };
    //    const response = await fetch('/Sistema/valida_cuadrante_estatus', {
    //        method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //        mode: 'cors', // no-cors, *cors, same-origin
    //        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //        credentials: 'same-origin', // include, *same-origin, omit
    //        headers: {
    //            'Content-Type': 'application/json'
    //            // 'Content-Type': 'application/x-www-form-urlencoded',
    //        },
    //        redirect: 'follow', // manual, *follow, error
    //        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //        body: JSON.stringify(Data) // body data type must match "Content-Type" header
    //    });
    //    return response.json();
    //}
    //function GetSortOrder(prop) {
    //    return function (a, b) {
    //        if (a[prop] > b[prop]) {
    //            return 1;
    //        } else if (a[prop] < b[prop]) {
    //            return -1;
    //        }
    //        return 0;
    //    }
    //}
});

