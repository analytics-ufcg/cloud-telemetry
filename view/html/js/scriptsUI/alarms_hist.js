var url_alarm_hist = ip_server + "/alarms_history";
var historico;
var acesso_inicial = lerCookie('cookie_acesso');
if (acesso_inicial != null) {
	checkCokie('cookie_acesso');
	var atual = formattedDate(new Date(), 0);
	console.log(acesso_inicial);
	console.log(atual);
	url_alarm_hist += '?timestamp_begin=' + acesso_inicial + '&timestamp_end=' + atual;
	$.ajax({
		url : url_alarm_hist,
		async : false,
		dataType : 'json',
		success : function(data) {
			historico = data;
			var num = 0;
			$.each(historico, function(k, v) {
				num += historico[k].history.length;
			});
			$("#notificacoes").append('<span class="badge">' + num + '</span>');
			//hist_div
		},
		error : function(data) {

		}
	});

} else {
	checkCokie('cookie_acesso');
	console.log("não existe cookie");
	$.ajax({
		url : url_alarm_hist,
		async : false,
		dataType : 'json',
		success : function(data) {
			historico = data;
			var num = 0;
			$.each(historico, function(k, v) {
				num += historico[k].history.length;
			});
			$("#notificacoes").append('<span class="badge">' + num + '</span>');
			//hist_div

		},
		error : function(data) {

		}
	});
}

var tabela_historico = '<table class="table table-bordered"><thead><tr> <th>timestamp</th> <th>alarm_name</th> <th>type</th> <th>detail</th> </tr></thead> <tbody>';
$.each(historico, function(k, v) {
	var array_h = historico[k].history.reverse();
	var nome = historico[k].alarm_name;
	$.each(array_h, function(k2, v2) {
		var row_hist = '<tr> <th>' + array_h[k2].timestamp + '</th> <th>' + nome + '</th> <th>' + array_h[k2].type + '</th> <th>' + array_h[k2].detail + '</th></tr>';
		tabela_historico += row_hist;
	});
});
tabela_historico += '</tbody></table>';
$(tabela_historico).appendTo("#hist_div"); 

$.each(historico, function(k, v) {
	var array_h = historico[k].history.reverse();
	$.each(array_h, function(k2, v2) {
		console.log(array_h[k2].timestamp);
	});
});