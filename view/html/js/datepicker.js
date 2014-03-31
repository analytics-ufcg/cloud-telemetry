/*Habilitando seletores de data/hora */
$('#datetimepicker1').datetimepicker({
	pick12HourFormat : true
});

$('#datetimepicker2').datetimepicker({
	pick12HourFormat : true
});


$("input[name='defaultTime']").click(function() {
	$('#data_hora1').val("");
	$('#data_hora2').val("");
});
$('.input-group-addon').click(function() {
	$('input[name=defaultTime]').prop('checked', false);
});