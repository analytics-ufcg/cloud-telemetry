var url_alarm_hist = ip_server + "/alarms_history";
var num_alarmes_restantes;
var num_alarmes = 10;
var historico_alarmes = [];
var rows_requisicao = '';
var posicao_array = 0;
var ontem;

function getAlarmHistoryTime() {
	$("#bt_hist_alarm").show();
	$("#hist_info").empty();
	var hist_sort = [];
	var num_notificacoes = 0;

	if (alarm_data.length === 0) {
		$("#hist_info .no").remove();
		$('<span class="no"><br><center><h4> Não há histórico de alarmes. </h4></center></span>').appendTo("#hist_info");
	} else {
		$.each(alarm_data, function(k, v) {
			var name = alarm_data[k].alarm_name;
			var array = alarm_data[k].history;
			$.each(array, function(k2, v2) {
				array[k2].alarm_name = name;
				hist_sort.push(array[k2]);
			});
		});
		hist_sort.sort(function(obj1, obj2) {
			return obj1.timestamp < obj2.timestamp ? -1 : (obj1.timestamp > obj2.timestamp ? 1 : 0);
		});
		hist_sort.reverse();
		rows_requisicao = '';
		posicao_array = 0;
		historico_alarmes = hist_sort;

		num_alarmes_restantes = total_alarms;
		adicionarAlarmes();
	}

}

//Funcao chamada para adicionar mais alarmes ao historico
function adicionarAlarmes() {
	console.log(historico_alarmes.length);
	if (num_alarmes_restantes > num_alarmes) {
		tabelaHist(historico_alarmes, num_alarmes);
	} else if (num_alarmes_restantes == 0) {
		$("#hist_info .no").remove();
		$('<span class="no"><br><center><h4> Não há mais histórico de alarmes. </h4></center></span>').appendTo("#hist_info");
	} else {
		tabelaHist(historico_alarmes, num_alarmes_restantes);
	}
}

//Funcao para formatar json de detalhes
function formatDetail(detail, type) {
	var json = JSON.parse(detail);
	var rule = "";
	var state = "";
	if (type == "creation") {
		if (json.hasOwnProperty("rule")) {
			rule = "rule parameters<br>";
			$.each(json.rule, function(k, v) {
				if (k !== 'query') {
					rule += "   " + k + '=' + v;
				}
			});
		}
		return rule;
	} else {
		if (json.hasOwnProperty("state")) {
			state = "current state = " + json.state;
		}
		return state;
	}
}

function tabelaHist(historico_ord, qtd_alarmes) {
	$("#hist_info .table").remove();
	var tabela_historico = '<table id="table_hist" class="table table-bordered"><thead><tr> <th>timestamp</th> <th>alarm_name</th> <th>type</th> <th>detail</th> </tr></thead> <tbody>';
	var array_h = historico_ord;
	var num_notf = 0;
	tabela_historico += rows_requisicao;
	var rows = '';
	console.log("posicao array", posicao_array);
	console.log("qtd alarmes", qtd_alarmes);
	for (var i = posicao_array, l = total_alarms; i < qtd_alarmes + posicao_array; i++) {
		num_notf += 1;
		var nome = array_h[i].alarm_name;
		var row_hist = '<tr> <th>' + array_h[i].timestamp + '</th> <th>' + nome + '</th> <th>' + array_h[i].type + '</th> <th>' + formatDetail(array_h[i].detail, array_h[i].type) + '</th></tr>';
		rows += row_hist;
	}
	console.log("num notificacoes", num_notf);
	rows_requisicao += rows;
	tabela_historico += rows_requisicao + '</tbody></table>';
	if (num_notf > 0) {
		$(tabela_historico).appendTo("#hist_info");
	} else {
		$("#hist_info .no").remove();
		$('<span class="no"><br><center><h4> Não houve disparo de alarmes até o momento </h4></center></span>').appendTo("#hist_info");
	}
	posicao_array += qtd_alarmes;
	num_alarmes_restantes -= qtd_alarmes;
}
