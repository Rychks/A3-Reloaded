define(["jquery", 'pdfjs-dist/build/pdf', 'pdfjs-dist/build/pdf.worker'], function ($, pdfjsLib, pdfworker) {
    $.fn.visorPDF = function (Parametros) {
        var Param = $.extend({}, $.fn.visorPDF.default, Parametros);
        var VisorPDF = $(this);
        // Layout
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfworker;
        var pdfDocLayout = null,
            pageNumLayout = 1,
            pageRenderingLayout = false,
            pageNumLayoutPending = null,
            scaleLayout = Param.Escala,
            canvasLayout = document.getElementById(VisorPDF.prop("id")),
            ctxLayout = null;
        if (canvasLayout != null) {
            ctxLayout = canvasLayout.getContext('2d');
        }
        render(Param.URL);
        $("div[data-visorpdf=" + VisorPDF.prop("id") + "]").find("[data-visorpdf=btnAnterior]").click(function () {
            onPrevPageLayout();
        });
        $("div[data-visorpdf=" + VisorPDF.prop("id") + "]").find("[data-visorpdf=btnSiguiente]").click(function () {
            onNextPageLayout();
        });
        $("div[data-visorpdf=" + VisorPDF.prop("id") + "]").find("[data-visorpdf=btnAcercar]").click(function () {
            zoomInLayout();
        });
        $("div[data-visorpdf=" + VisorPDF.prop("id") + "]").find("[data-visorpdf=btnAlejar]").click(function () {
            zoomOutLayout();
        });
        $("div[data-visorpdf=" + VisorPDF.prop("id") + "]").find("[data-visorpdf=btnRecargar]").click(function () {
            render(Param.URL);
        });
        function render(URL) {
            canvasLayout.width = canvasLayout.width;
            if (URL != "") {
                pdfjsLib.getDocument(URL).promise.then(function (pdfDocLayout_) {
                    pdfDocLayout = pdfDocLayout_;
                    $("div[data-visorpdf=" + VisorPDF.prop("id") + "]").find("[data-visorpdf=lblPaginasTotal]").html(pdfDocLayout.numPages);
                    // Initial/first page rendering
                    renderPageLayout(pageNumLayout);
                }, function (e) {
                        $.notiMsj.Notificacion({ Mensaje: "Error al tratar de mostrar la información, intentelo más tarde", Tipo: "danger", Error: e });
                });
                if (ctxLayout) {
                    ctxLayout.clearRect(0, 0, canvasLayout.width, canvasLayout.height);
                    ctxLayout.beginPath();
                }
            }
        }
        function renderPageLayout(num) {
            pageRenderingLayout = true;
            // Using promise to fetch the page
            pdfDocLayout.getPage(num).then(function (page) {
                var viewport = page.getViewport({ scale: scaleLayout });
                canvasLayout.height = viewport.height;
                canvasLayout.width = viewport.width;
                // Render PDF page into canvasLayout context
                var renderContext = {
                    canvasContext: ctxLayout,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                // Wait for rendering to finish
                renderTask.promise.then(function () {
                    pageRenderingLayout = false;
                    if (pageNumLayoutPending !== null) {
                        // New page rendering is pending
                        renderPageLayout(pageNumLayoutPending);
                        pageNumLayoutPending = null;
                    }
                });
            });
            // Update page counters
            $("div[data-visorpdf=" + VisorPDF.prop("id") + "]").find("[data-visorpdf=lblPaginaActual]").html(num);
        }
        function queuerenderPageLayout(num) {
            if (pageRenderingLayout) {
                pageNumLayoutPending = num;
            } else {
                renderPageLayout(num);
                if (ctxLayout) {
                    ctxLayout.clearRect(0, 0, canvasLayout.width, canvasLayout.height);
                    ctxLayout.beginPath();
                }
            }
        }
        function onPrevPageLayout() {
            if (pageNumLayout <= 1) {
                return;
            }
            pageNumLayout--;
            queuerenderPageLayout(pageNumLayout);
        }
        function onNextPageLayout() {
            if (pageNumLayout >= pdfDocLayout.numPages) {
                return;
            }
            pageNumLayout++;
            queuerenderPageLayout(pageNumLayout);
        }
        function zoomInLayout() {
            if (scaleLayout > 0.25) {
                scaleLayout = scaleLayout + 0.25;
                renderPageLayout(pageNumLayout);
                if (ctxLayout) {
                    ctxLayout.clearRect(0, 0, canvasLayout.width, canvasLayout.height);
                    ctxLayout.beginPath();
                }
            }
        }
        function zoomOutLayout() {
            if (scaleLayout <= 0.75) {
                return;
            } else {
                scaleLayout = scaleLayout - 0.25;
                renderPageLayout(pageNumLayout);
                if (ctxLayout) {
                    ctxLayout.clearRect(0, 0, canvasLayout.width, canvasLayout.height);
                    ctxLayout.beginPath();
                }
            }
        }
        return this;
    };
    $.fn.visorPDF.default = {
        Escala: 1,
        URL: "",
    };
});