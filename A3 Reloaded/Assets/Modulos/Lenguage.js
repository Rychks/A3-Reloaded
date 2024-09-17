$(document).ready(function () {
    fn_obtener_idiomas();
});
function fn_obtener_idiomas() {
    var url = "/Lenguaje/obtener_idiomas";
    $("#slc_Idioma").empty();
    $.get(url).done(function (data) {       
        //for (var i = 1; i < data.length; ++i) {
        //    $("#slc_Idioma").append('<option value="' + data[i].ID + '">' + data[i].Nombre + '</option>');
        //}
        $.each(data,function (i, item) {
            $("#slc_Idioma").append('<option value="' + item.ID + '">' + item.Nombre + '</option>');
        });
    }).fail(function (error) { fn_Notificaciones({ Mensaje: "Error al tratar de mostrar la información, intentelo más tarde", Tipo: "danger", Error: error }); });
}