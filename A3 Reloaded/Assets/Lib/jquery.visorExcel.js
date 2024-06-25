define(["jquery",'jexcel'], function ($,jexcel) {
    $.fn.visorExcel = function (Parametros) {
        var Param = $.extend($.fn.visorExcel.default, Parametros);
        var Archivo = $(this);
        $(this).change(function () {
            //Comprobar extensión
            if (!(/\.(xlsx|xls|xlsm)$/i).test($(this).val())) {
                $.notiMsj.Notificacion({ Mensaje: "Por favor seleccione un archivo valido<br/>.xls o .xlsx", Tipo: "warning" });
                Param.Hojas.empty();
                Param.Hojas.append("<option value='-1' selected disabled>Seleccione la hoja</option>");
                Param.Seccion.empty();
                Param.Hojas.prop("disabled", true);
            }
            else {
                var NombreArchivo = $(this).val().split("\\").pop();
                $("label[for=" + $(this).prop("id") + "]").html(NombreArchivo);
                Param.Seccion.empty();
                var Archivo = $(this).prop('files')[0];
                var Reader = new FileReader();
                Reader.readAsArrayBuffer(Archivo);
                Reader.onloadstart = function (e) {
                    $.notiMsj.Notificacion({ Mensaje: "Cargando archivo...", Tipo: "info" });
                };
                Reader.error = function (error) {
                    $.notiMsj.Notificacion({ Mensaje: "Ocurrió un error al cargar el archivo seleccionado, inténtelo más tarde", Tipo: "danger", Error: error });
                }
                Reader.onload = function (e) {
                    var Datos = new Uint8Array(Reader.result);
                    try {
                        var Workbook = XLSX.read(Datos, { type: 'array', WTF: 1 });
                        Param.Hojas.empty();
                        Param.Hojas.append("<option value='-1' selected disabled>Seleccione la hoja</option>");
                        Workbook.SheetNames.forEach(function (sheetName) {
                            Param.Hojas.append("<option value='" + sheetName + "'>" + sheetName + "</option>");
                        });
                        Param.Hojas.prop("disabled", false);
                        $.notiMsj.Notificacion({ Mensaje: "Archivo Cargado", Tipo: "success" });
                    } catch (e) {
                        Param.Hojas.empty();
                        Param.Hojas.append("<option value='-1' selected disabled>Seleccione la hoja</option>");
                        Param.Seccion.empty();
                        Param.Hojas.prop("disabled", true);
                        $.notiMsj.Notificacion({ Mensaje: "El archivo que selecciono se encuentra dañado.</br>Favor de seleccionar otro", Tipo: "danger", Error: e });
                    }
                };
            }
        });
        Param.Hojas.change(function () {
            Param.Seccion.addClass("loader-registro");
            var Hoja = $(this).val();
            var Excel = $(Archivo).prop('files')[0];
            var Reader = new FileReader();
            Reader.readAsArrayBuffer(Excel);
            Reader.onload = function (e) {
                var Data = new Uint8Array(Reader.result);
                var Workbook = XLSX.read(Data, { type: 'array', bookDeps: true, cellStyles: true });
                var Worksheet = ajustarXYVacias(Workbook.Sheets[Hoja]);
                //console.log(Worksheet)
                if (Worksheet["!ref"] != undefined) {
                    if (Param.Tipo == "HTML") {
                        var htmlstr = XLSX.write(Workbook, { sheet: Hoja, type: 'string', editable: false, bookType: 'html' }).replace("<table", '<div class="table-responsive tabla-lg encabezados-fixed bg-white"><table class="sinEstilo"');
                        Param.Seccion.empty();
                        Param.Seccion[0].innerHTML += htmlstr;
                    } else if (Param.Tipo == "HOJA") {
                        var TamColumnas = Worksheet['!cols'];
                        //console.log(TamColumnas)
                        var CeldasCombinadas = obtenerCeldasCombinadas(Worksheet);
                        var result = XLSX.utils.sheet_to_json(Worksheet, { header: 1, blankrows: true, defval: '' });
                        Param.Seccion.empty();
                        jexcel(document.getElementById(Param.Seccion.prop("id")), {
                            data: result,
                            loadingSpin: true,
                            tableOverflow: true,
                            defaultColWidth: "100px",
                            tableWidth: "100%",
                            tableHeight: "480px",
                            minDimensions: [15, 15],
                            mergeCells: CeldasCombinadas,
                            text: {
                                noRecordsFound: 'No se encontró el registro',
                                showingPage: 'Mostrando página {0} de {1}',
                                show: 'Mostrar',
                                entries: 'Entradas',
                                insertANewColumnBefore: 'Insertar nueva columna antes',
                                insertANewColumnAfter: 'Insertar columna después',
                                deleteSelectedColumns: 'Eliminar las columnas selecionadas',
                                renameThisColumn: 'Renombrar esta columna',
                                orderAscending: 'Orden Ascendente',
                                orderDescending: 'Orden Descedente',
                                insertANewRowBefore: 'Insertar una nueva fila antes',
                                insertANewRowAfter: 'Insertar una nueva fila después',
                                deleteSelectedRows: 'Eliminar la fila seleccionada',
                                editComments: 'Editar comentarios',
                                addComments: 'Agregar comentarios',
                                comments: 'Comentarios',
                                clearComments: 'Borrar comentarios',
                                copy: 'Copiar ...',
                                paste: 'Pegar ...',
                                saveAs: 'Guardar como ...',
                                about: 'Acerca de',
                                areYouSureToDeleteTheSelectedRows: '¿Estás seguro de eliminar las filas seleccionadas?',
                                areYouSureToDeleteTheSelectedColumns: '¿Estás seguro de eliminar las columnas seleccionadas?',
                                thisActionWillDestroyAnyExistingMergedCellsAreYouSure: 'Esta acción destruirá todas las celdas combinadas existentes. ¿Estás seguro?',
                                thisActionWillClearYourSearchResultsAreYouSure: 'Esto borrará los resultados de búsqueda. ¿Estás seguro?',
                                thereIsAConflictWithAnotherMergedCell: 'Háy un conflicto con otra celda combinada',
                                invalidMergeProperties: 'No se puede combinar las celdas',
                                cellAlreadyMerged: 'Las celdas ya estan combinadas',
                                noCellsSelected: 'No hay celdas seleccionadas',
                            },
                            contextMenu: function (obj, x, y, e) {
                                var items = [];
                                if (y == null) {
                                    // Insert a new column
                                    if (obj.options.allowInsertColumn == true) {
                                        items.push({
                                            title: obj.options.text.insertANewColumnBefore,
                                            onclick: function () {
                                                obj.insertColumn(1, parseInt(x), 1);
                                            }
                                        });
                                    }
                                    if (obj.options.allowInsertColumn == true) {
                                        items.push({
                                            title: obj.options.text.insertANewColumnAfter,
                                            onclick: function () {
                                                obj.insertColumn(1, parseInt(x), 0);
                                            }
                                        });
                                    }
                                    // Delete a column
                                    if (obj.options.allowDeleteColumn == true) {
                                        items.push({
                                            title: obj.options.text.deleteSelectedColumns,
                                            onclick: function () {
                                                obj.deleteColumn(obj.getSelectedColumns().length ? undefined : parseInt(x));
                                            }
                                        });
                                    }
                                } else {
                                    // Insert new row
                                    if (obj.options.allowInsertRow == true) {
                                        items.push({
                                            title: obj.options.text.insertANewRowBefore,
                                            onclick: function () {
                                                obj.insertRow(1, parseInt(y), 1);
                                            }
                                        });
                                        items.push({
                                            title: obj.options.text.insertANewRowAfter,
                                            onclick: function () {
                                                obj.insertRow(1, parseInt(y));
                                            }
                                        });
                                    }
                                    if (obj.options.allowDeleteRow == true) {
                                        items.push({
                                            title: obj.options.text.deleteSelectedRows,
                                            onclick: function () {
                                                obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                                            }
                                        });
                                    }
                                }
                                // Line
                                items.push({ type: 'line' });
                                //Save
                                if (obj.options.allowExport) {
                                    items.push({
                                        title: obj.options.text.saveAs,
                                        shortcut: 'Ctrl + S',
                                        onclick: function () {
                                            obj.download();
                                        }
                                    });
                                }
                                return items;
                            }
                        });
                    }
                } else {
                    Param.Seccion.empty();
                }
            }
            Param.Seccion.removeClass("loader-registro");
        });
        function ajustarXYVacias(Worksheet) {
            //Comprobar si la primera columna y fila estan vacias
            var ColumnA = [], Fila1;
            for (let z in Worksheet) {
                if (z.toString()[0] === "A") {
                    ColumnA.push(Worksheet[z].v);
                }
            }
            var Rango = XLSX.utils.decode_range(Worksheet['!ref']);
            Rango.s.r = 0;
            Rango.e.r = 0;
            Fila1 = XLSX.utils.sheet_to_json(Worksheet, { header: 1, range: Rango });
            //si es el caso, agrega la fila y/o columna
            if (!Param.AjustarXY) {
                if (ColumnA.length == 0 || Fila1[0].length == 0) {
                    XLSX.utils.sheet_add_aoa(Worksheet, [[""]], { origin: "A1" });
                }
            } else {
                //Valorar si implementar
                if (ColumnA.length == 0) {

                }
                if (Fila1[0].length == 0) {
                    var Rango2 = XLSX.utils.decode_range(Worksheet['!ref']);
                    Rango2.s.r = 1;
                    Worksheet["!ref"] = XLSX.utils.encode_range(Rango2);
                }
            }
            return Worksheet;
        }
        function obtenerCeldasCombinadas(Worksheet) {
            //Obtiene cuales son las celdas que estan combinadas
            //Cuando AjustarXY es true se tienen que recorrer las filas y columnas
            var Combinadas = Worksheet['!merges'];
            var CeldasCombinadas = [];
            for (let i in Combinadas) {
                var Celda = XLSX.utils.encode_cell({ c: Combinadas[i].s.c, r: Combinadas[i].s.r });
                var tamCol = ((Combinadas[i].e.c) - (Combinadas[i].s.c)) + 1;
                var tamFila = ((Combinadas[i].e.r) - (Combinadas[i].s.r)) + 1;
                CeldasCombinadas[Celda] = [tamCol, tamFila];
            }
            return CeldasCombinadas
        }
    }
    $.fn.limpiarVisorExcel = function (Parametros) {
        var Param = $.extend($.fn.limpiarVisorExcel.default, Parametros);
        $(this).click(function () {
            Param.Hojas.empty();
            Param.Hojas.append("<option value='-1' selected disabled>Seleccione la hoja</option>");
            Param.Hojas.prop("disabled", true);
            Param.Seccion.empty();
            $("label[for=" + Param.Selector.prop("id") + "]").html("Seleccione un archivo de Excel");
            Param.Funcion();
        });
    }
    $.fn.visorExcel.default = {
        Hojas: null,
        Seccion: null,
        Tipo: "HTML",
        AjustarXY: false,
        Funcion: function () {}
    };
    $.fn.limpiarVisorExcel.default = {
        Selector: null,
        Hojas: null,
        Seccion: null,
        Funcion: function () {}
    };
});