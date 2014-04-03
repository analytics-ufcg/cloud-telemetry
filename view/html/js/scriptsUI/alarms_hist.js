var url_alarm_hist = ip_server + "/alarms_history";

function getAlarmHistoryTime() {
	var historico;
	var num_notificacoes = 0;
	var acesso_inicial = lerCookie('cookie_acesso');

	$('<div id="load_rec" style="display:none">	<br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4> Realizando requisição... Isto pode levar alguns minutos. Por favor aguarde.</h4></center></div>').appendTo("#hist_info");
	$("#load_rec").show();

	$("#notificacoes").find('span').remove();
	// Executar requisicao de acordo com
	if (acesso_inicial != null) {
		checkCokie('cookie_acesso');
		var data = new Date();
		/* Modificacao devido à diferença de 3h para o BD do Ceilometer*/
		data.setHours(data.getHours() + 4);
		var atual = formattedDate(data, 0);
		var url_alarm_hist_time = url_alarm_hist + '?timestamp_begin=' + acesso_inicial + '&timestamp_end=' + atual;
		console.log(url_alarm_hist_time);
		$.ajax({
			url : url_alarm_hist_time,
			dataType : 'json'
		}).fail(function(data) {
			cookie_error(data);
		}).done(function(data) {
			cookie_request(data);
		});

	} else {
		console.log("teste");
		checkCokie('cookie_acesso');
		console.log(url_alarm_hist);
		$.ajax({
			url : url_alarm_hist,
			dataType : 'json'
		}).fail(function(data) {
			no_cookie_error(data);
		}).done(function(data) {
			console.log("done");
			no_cookie_request(data);
		});
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

function cookie_request(data) {
	if (data === undefined) {
		$("#hist_info").empty().queue(function(exec) {
			$('<br><br><center><h4> Não houve disparo de alarmes até o momento </h4></center>').appendTo("#hist_info");
			$("#notificacoes").append('<span class="badge">' + 0 + '</span>');
			exec();
		});
	} else {
		var hist_sort = [];
		var historico = data;
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

		tabelaHist(hist_sort, num);
	}
}

function cookie_error(data) {
	$("#hist_info").empty().queue(function(exec) {
		$('<br><br><center><h4> Ocorreu um erro durante a requisição, tente novamente. </h4></center>').appendTo("#hist_info");
		exec();
	});

}

function no_cookie_request(data) {
	if (data === undefined) {
		$("#hist_info").empty().queue(function(exec) {
			$('<br><br><center><h4> Não houve disparo de alarmes até o momento </h4></center>').appendTo("#hist_info");
			$("#notificacoes").append('<span class="badge">' + 0 + '</span>');
			exec();
		});

	} else {
		var hist_sort = [];
		var historico = data;
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

		tabelaHist(hist_sort, num);
	}
}

function no_cookie_error(data) {
	$("#hist_info").empty().queue(function(exec) {
		$('<br><br><center><h4> Ocorreu um erro durante a requisição, tente novamente. </h4></center>').appendTo("#hist_info");
		exec();
	});
}

function tabelaHist(historico_ord, notificacoes) {

	var tabela_historico = '<table id="table_hist" class="table table-bordered"><thead><tr> <th>timestamp</th> <th>alarm_name</th> <th>type</th> <th>detail</th> </tr></thead> <tbody>';
	var array_h = historico_ord;
	var num_notf = 0;
	$.each(array_h, function(k2, v2) {
		num_notf += 1;
		var nome = array_h[k2].alarm_name;
		var row_hist = '<tr> <th>' + array_h[k2].timestamp + '</th> <th>' + nome + '</th> <th>' + array_h[k2].type + '</th> <th>' + formatDetail(array_h[k2].detail, array_h[k2].type) + '</th></tr>';
		console.log(row_hist);
		tabela_historico += row_hist;
	});

	tabela_historico += '</tbody></table>';

	$("#hist_info").empty().queue(function(exec) {
		if (notificacoes > 0 || num_notf > 0) {
			$(tabela_historico).appendTo("#hist_info");
			exec();
		} else {
			$('<br><br><center><h4> Não houve disparo de alarmes até o momento </h4></center>').appendTo("#hist_info");
			exec();
		}
	});

}
