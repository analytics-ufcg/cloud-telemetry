var url_alarm_hist = ip_server + "/alarms_history";

function getAlarmHistoryTime() {
	var historico;
	var hist_sort = [];
	var num_notificacoes = 0;
	var acesso_inicial = lerCookie('cookie_acesso');
	$("#notificacoes").find('span').remove();
	// Executar requisicao de acordo com
	if (acesso_inicial != null) {
		checkCokie('cookie_acesso');
		var atual = formattedDate(new Date(), 0);
		var url_alarm_hist_time = url_alarm_hist + '?timestamp_begin=' + acesso_inicial + '&timestamp_end=' + atual;
		console.log(url_alarm_hist_time);
		$.ajax({
			url : url_alarm_hist_time,
			async : false,
			dataType : 'json',
			success : function(data) {
				historico = data;
				var num = 0;
				$.each(historico, function(k, v) {
					num += historico[k].history.length;
					var name = historico[k].alarm_name;
					var array = historico[k].history;
					$.each(array, function(k2, v2) {
						array[k2].alarm_name = name;
						hist_sort.push(array[k2]);
					});

				});
				hist_sort.sort(function(obj1, obj2) {
					return obj1.timestamp < obj2.timestamp ? -1 : (obj1.timestamp > obj2.timestamp ? 1 : 0);
				});
				hist_sort.reverse();
				$("#notificacoes").append('<span class="badge">' + num + '</span>');
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
					var name = historico[k].alarm_name;
					var array = historico[k].history;
					$.each(array, function(k2, v2) {
						array[k2].alarm_name = name;
						hist_sort.push(array[k2]);
					});

				});
				hist_sort.sort(function(obj1, obj2) {
					return obj1.timestamp < obj2.timestamp ? -1 : (obj1.timestamp > obj2.timestamp ? 1 : 0);
				});
				hist_sort.reverse();
				num_notificacoes = num;
				$("#notificacoes").append('<span class="badge">' + num + '</span>');

			},
			error : function(data) {

			}
		});
	}
	console.log(hist_sort);
	//executar script de criar tabela
	tabelaHist(hist_sort,num_notificacoes);

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

function tabelaHist(historico_ord,notificacoes) {

	console.log(historico_ord);
	var tabela_historico = '<table id="table_hist" class="table table-bordered"><thead><tr> <th>timestamp</th> <th>alarm_name</th> <th>type</th> <th>detail</th> </tr></thead> <tbody>';
	var array_h = historico_ord;
	$.each(array_h, function(k2, v2) {
		console.log();
		var nome = array_h[k2].alarm_name;
		var row_hist = '<tr> <th>' + array_h[k2].timestamp + '</th> <th>' + nome + '</th> <th>' + array_h[k2].type + '</th> <th>' + formatDetail(array_h[k2].detail, array_h[k2].type) + '</th></tr>';
		console.log(row_hist);
		tabela_historico += row_hist;
	});
	tabela_historico += '</tbody></table>';
	if (notificacoes > 0) {
		$(tabela_historico).appendTo("#hist_info");
	} else {
		$('<br><br><center><h4> Não houve disparo de alarmes até o momento </h4></center>').appendTo("#hist_info");
	}
	console.log("tabela");
}
