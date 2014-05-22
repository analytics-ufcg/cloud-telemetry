var recomendacoes;

/*Funcao para realizar requisicao de recomendacoes*/

function gera_recomendacao() {
	console.log("funcao gera_recomendacao()");
	$('#recomendacoes_geradas').empty();
	$('<div id="load_rec" style="display:none">	<br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Running recommendation... This may take a few minutes. Please wait.</h4></center></div>').appendTo("#recomendacoes_geradas");
	$("#load_rec").show();

	var out = $("input[name='defaultTime']:checked").val();
	var dh1 = $('#data_hora1').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt1 = new Date(dh1[2], dh1[1], dh1[0], dh1[3], dh1[4]);
	var dh2 = $('#data_hora2').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt2 = new Date(dh2[2], dh2[1], dh2[0], dh2[3], dh2[4]);
	var vm = $("input[name='defaultVM']:checked").val();
	/*Verificações antes de realizar requisição*/
	var html_m = '<h2>Caution!</h2><br />';
	/*Nenhum Campo selecionado*/

	/*Data de Inicio maior igual Data Fim*/
	if (dt1.getTime() >= dt2.getTime()) {
		html_m += '<h4> start date is greater than or equal to the end date.</h4><br />';
		html_m += '<h4>Choose another date. Thanks.</h4>';
		bootbox.alert(html_m);
	}

	var now = new Date();
	now.setTime((now.getTime()+3) + now.getTimezoneOffset());
	/*url de requisicao do json http://150.165.80.194:9090/*/
	var url_recomenda = ip_server + "/cpu_util_flavors";
	if (out == "ultima_hora") {
		var ontem = new Date(now - (1000 * 60 * 60 * 1));
		ontem.setTime(ontem.getTime() + ontem.getTimezoneOffset());
		url_recomenda += "?timestamp_begin=" + formattedDate(ontem, 0);
		url_recomenda += "&timestamp_end=" + formattedDate(now, 0);
	} else if (out == "ultimo_dia") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 1));
		ontem.setTime(ontem.getTime() + ontem.getTimezoneOffset());
		url_recomenda += "?timestamp_begin=" + formattedDate(ontem, 0);
		url_recomenda += "&timestamp_end=" + formattedDate(now, 0);
	} else if (out == "ultima_semana") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 7));
		ontem.setTime(ontem.getTime() + ontem.getTimezoneOffset());
		url_recomenda += "?timestamp_begin=" + formattedDate(ontem, 0);
		url_recomenda += "&timestamp_end=" + formattedDate(now, 0);
	} else if (out == "ultimo_mes") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 30));
		ontem.setTime(ontem.getTime() + ontem.getTimezoneOffset());
		url_recomenda += "?timestamp_begin=" + formattedDate(ontem, 0);
		url_recomenda += "&timestamp_end=" + formattedDate(now, 0);
	} else if ($('#data_hora1').val().length == 0 || $('#data_hora2').val().length == 0) {
		url_recomenda = ip_server + "/cpu_util_flavors";
	} else {
		url_recomenda += "?timestamp_begin=" + formattedDate(dt1, 1);
		url_recomenda += "&timestamp_end=" + formattedDate(dt2, 1);
	}

	console.log(url_recomenda);

	var lista_rec = [];
	var lista_valores = [];
	var lista_ic = [];
	var lista_violacoes = [];
	$.ajax({
		url : url_recomenda,
		dataType : 'json'
	}).fail(function(data) {
		$("#load_rec").remove();
		$('<h3> An error has occurred during the request, please try again.</h3>').appendTo('#recomendacoes_geradas');
	}).done(function(data) {
		$("#load_rec").remove();
		recomendacoes = data;

		if (jQuery.isEmptyObject(data)) {
			$('<h3> The time period chosen has no data. </h3>').appendTo('#recomendacoes_geradas');
		} else {

			var tabela_rec = '<table class="table table-bordered"><thead><tr><th>Recommendation</th><th>Sugestion</th><th>Lose</th><th>Violations</th> </tr></thead><tbody>';
			var rows;
			var numero_da_rec = 1;

			$.each(recomendacoes, function(k, v) {
				var rec = "Recommendation " + numero_da_rec;
				lista_rec.push(rec);
				var lista = JSON.parse(recomendacoes[k][0]).split(":");
				lista_valores.push(parseFloat(lista[0]));
				var valores_ic = lista[1].replace("{", "").replace("}", "").split("-");
				var ic = [parseFloat(valores_ic[0]), parseFloat(valores_ic[1])];
				lista_ic.push(ic);
				lista_violacoes.push(parseFloat(recomendacoes[k][1]));
				var core = "";
				if(k == "1"){
					core = k + " core";
				}else{
					core = k + " cores";
				}
				rows = '<tr><th>' + 'Recommendation  ' + numero_da_rec + '</th><th>' + core.replace(':',', ') +  '</th><th>' + JSON.parse(recomendacoes[k][0]).split(':')[0]+' %' + '</th><th>' + recomendacoes[k][1] + ' %' + '</th></tr>';
				tabela_rec += rows;
				numero_da_rec += 1;
			});
			tabela_rec += '</tbdody></table>';
			$(tabela_rec).appendTo('#recomendacoes_geradas');
			grafico_rec(lista_rec, lista_valores, lista_ic);
			grafico_violacoes(lista_rec, lista_violacoes);
		}
	});

}

function grafico_rec(nomes, valores, ic) {
	var chart;
	console.log(ic);
	$('#recomendacoes_geradas_grafico').highcharts({
		chart : {
			zoomType : 'x'
		},
		title : {
			text : 'Average of Lose (%) per Recommendation'
		},
		xAxis : [{
			categories : nomes
		}],
		yAxis : {
			labels : {
				formatter : function() {
					return this.value + '%';
				}
			},
			title : {
				text : 'Lose'
			}
		},

		tooltip : {
			shared : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [{
			name : 'Lose (%)',
			type : 'column',
			data : valores,
			tooltip : {
				pointFormat : '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.2f}%</b><br/>'
			}
		}, {
			color : '#FF0000',
			name : 'Confidence Interval',
			type : 'errorbar',
			data : ic,
			tooltip : {
				pointFormat : 'Confidence Interval: {point.low}-{point.high}'
			}
		}]
	});

}

function grafico_violacoes(nomes, valores) {
	var chart;
	$('#recomendacoes_grafico_violacoes').highcharts({
		chart : {
			type : 'column',
			zoomType : 'x'
		},
		title : {
			text : 'Violations (%) per Recommendation'
		},
		xAxis : [{
			categories : nomes
		}],
		yAxis : {
			min : 0,
			labels : {
				formatter : function() {
					return this.value + '%';
				}
			},
			title : {
				text : 'Violations (%)'
			}
		},

		tooltip : {
			shared : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [{
			name : 'Violations (%)',
			type : 'column',
			data : valores,
			tooltip : {
				pointFormat : '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}%</b><br/>'
			}
		}]
	});
}
