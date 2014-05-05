var ip_server = "http://150.165.15.4:9090";
//150.165.80.194
var dados;
var tempo = [];
var cpu_util = [];
var ultimo_acesso;
var show_hosts = true;
var tudo;

/*Habilitando seletores de data/hora */
$('#datetimepicker1').datetimepicker({
	pick12HourFormat : true
});

$('#datetimepicker2').datetimepicker({
	pick12HourFormat : true
});

/*Habilitando escolha de apenas um atributo para visualização*/
$("input[name='defaultTime']").click(function() {
	$('#data_hora1').val("");
	$('#data_hora2').val("");
});
$('.input-group-addon').click(function() {
	$('input[name=defaultTime]').prop('checked', false);
});

/*Funcao para converter dia e mês*/
function formattedDate(date, verificador) {
	var d = new Date(date || Date.now()), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = '' + d.getFullYear(), hour = '' + (d.getHours()), minuto = '' + (d.getMinutes());
	if (verificador == 1) {
		month = '' + d.getMonth();
	}
	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;
	if (hour.length < 2)
		hour = '0' + hour;
	if (minuto.length < 2)
		minuto = '0' + minuto;

	return [year, month, day].join('-') + "T" + hour + ":" + minuto + ":00";

}

function plot() {
	var out = $("input[name='defaultTime']:checked").val();
	var dh1 = $('#data_hora1').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt1 = new Date(dh1[2], dh1[1], dh1[0], dh1[3], dh1[4]);
	var dh2 = $('#data_hora2').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt2 = new Date(dh2[2], dh2[1], dh2[0], dh2[3], dh2[4]);
	var vm = $("input[name='defaultVM']:checked").val();
	/*Verificações antes de realizar requisição*/
	var html_m = '<h2>Atenção!</h2><br />';
	/*Nenhum Campo selecionado*/
	if (out == undefined && $('#data_hora1').val().length == 0 && $('#data_hora2').val().length == 0) {
		html_m += '<h4>Nenhuma opção selecionada, escolha uma das opções de <b>Período Fixo</b> \n ou <b> Período Específico</b>  </h4><br />';
		bootbox.alert(html_m);
	}
	/*Data de Inicio maior igual Data Fim*/
	if (dt1.getTime() >= dt2.getTime()) {
		html_m += '<h4>A data de início fornecida possui tempo maior ou igual à data fim.</h4><br />';
		html_m += '<h4>Escolha outra data. Obrigado</h4>';
		bootbox.alert(html_m);
	}

	var now = new Date();
	now.setTime(now.getTime() + now.getTimezoneOffset());
	/*url de requisicao do json http://150.165.80.194:9090/*/
	var url_requisicao_bubble = ip_server + "/projects";
	var url_requisicao_vm = ip_server + "/cpu_util";
	var url_requisicao_host = ip_server;
	var complemento = "";
	if (out == "ultima_hora") {
		var ontem = new Date(now - (1000 * 60 * 60 * 1));
		ontem.setTime(ontem.getTime() + ontem.getTimezoneOffset());
		complemento += "?timestamp_begin=" + formattedDate(ontem, 0);
		complemento += "&timestamp_end=" + formattedDate(now, 0);
	} else if (out == "ultimo_dia") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 1));
		ontem.setTime(ontem.getTime() + ontem.getTimezoneOffset());
		complemento += "?timestamp_begin=" + formattedDate(ontem, 0);
		complemento += "&timestamp_end=" + formattedDate(now, 0);
	} else if (out == "ultima_semana") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 7));
		ontem.setTime(ontem.getTime() + ontem.getTimezoneOffset());
		complemento += "?timestamp_begin=" + formattedDate(ontem, 0);
		complemento += "&timestamp_end=" + formattedDate(now, 0);
	} else if (out == "ultimo_mes") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 30));
		ontem.setTime(ontem.getTime() + ontem.getTimezoneOffset());
		complemento += "?timestamp_begin=" + formattedDate(ontem, 0);
		complemento += "&timestamp_end=" + formattedDate(now, 0);
	} else {
		complemento += "?timestamp_begin=" + formattedDate(dt1, 1);
		complemento += "&timestamp_end=" + formattedDate(dt2, 1);
	}
	var resource_vm = $("input[name='defaultVM']:checked").val();
	url_requisicao_vm += complemento + "&resource_id=" + $("input[name='defaultVM']:checked").val();

	$('<div id="load_rec" style="display:none">	<br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4> Realizando requisição... Isto pode levar alguns minutos. Por favor aguarde.</h4></center></div>').appendTo("#chart");
	$("#load_rec").show();
	if (!show_hosts) {
		console.log(url_requisicao_vm);
		$.ajax({
			url : url_requisicao_vm,
			dataType : 'json'
		}).fail(function(data) {
			show_plot = false;
			$('#chart').empty().queue(function(exec) {
				$('#chart').html('<p><h3>Período de tempo não consta nos dados, selecione outro período.</h3><p>');
				exec();
			});
		}).done(function(data) {
			dados = data;
			if (data.length === 0) {
				if (resource_vm == undefined) {
					$('#chart').empty().queue(function(exec) {
						$('#chart').html('<p><h3>Selecione uma vm</h3><p>');
						exec();
					});
				} else {
					$('#chart').empty().queue(function(exec) {
						$('#chart').html('<p><h3>Período de tempo não consta nos dados, selecione outro período.</h3><p>');
						exec();
					});
				}
			} else {
				var t1 = [];
				var cpu = [];
				t1.push("x");
				cpu.push("CPU usage");
				$.each(dados, function(d) {
					t1.push(dados[d].timestamp.replace("T", " "));
					cpu.push((dados[d].cpu_util_percent).toFixed(2));
				});

				var json = {
					data : {
						x : 'x',
						x_format : '%Y-%m-%d %H:%M:%S',
						columns : [t1, cpu]
					},
					subchart : {
						show : true
					},
					axis : {
						x : {
							label : 'Tempo',
							type : 'timeseries'
						},
						y : {
							label : '(%) '
						}
					},
					tooltip : {
						format : {
							title : function(d) {
								return formattedDate(new Date(d.getTime())).replace("T", " - ");
							},
							value : d3.format(',')
						}
					}
				};

				$('#chart').empty().queue(function(exec) {
					var chart = c3.generate(json);
					exec();
				});
			}
		});

	} else {
		var resource_host = $("input[name='deafultHost']:checked").val();
		var host_position = $("input[name='deafultHost']:checked").attr("id");
		var metric = $("input[name='defaultMetric']:checked").val();
		if (resource_host === undefined) {
			$('#chart').empty().queue(function(exec) {
				$('#chart').html('<p><h3>Selecione um Host</h3><p>');
				exec();
			});
		} else if (metric === undefined) {
			$('#chart').empty().queue(function(exec) {
				$('#chart').html('<p><h3>Selecione uma métrica para ser avaliada.</h3><p>');
				exec();
			});
		} else {

			if (metric == "memoria") {
				url_requisicao_host += "/hosts_memory";
			} else if (metric == "cpu") {
				url_requisicao_host += "/hosts_cpu_util";
			} else {
				url_requisicao_host += "/hosts_disk";
			}
			url_requisicao_host += complemento;
			console.log(url_requisicao_host);

			$.ajax({
				url : url_requisicao_host,
				dataType : 'json'
			}).fail(function(data) {
				show_plot = false;
				$('#chart').empty().queue(function(exec) {
					$('#chart').html('<p><h3>Período de tempo não consta nos dados, selecione outro período.</h3><p>');
					exec();
				});
			}).done(function(data) {
				dados = data;
				console.log(typeof dados);
				if (dados === null || dados.length === 0 ) {
					$('#chart').empty().queue(function(exec) {
						$('#chart').html('<p><h3>Período de tempo não consta nos dados, selecione outro período.</h3><p>');
						exec();
					});

				} else {
					var dt = dados[host_position].data;
					console.log(host_position);
					if (dt == null) {
						$('#chart').html('<p><h3>Período de tempo não consta nos dados, selecione outro período.</h3><p>');
					} else {

						var valores = selectMetric(metric, dt);
						if (valores == null) {
							console.log(" metrica nao existe");
						} else {

							var json = {
								data : {
									x : 'x',
									x_format : '%Y-%m-%d %H:%M:%S',
									columns : valores
								},
								subchart : {
									show : true
								},
								axis : {
									x : {
										label : 'Time',
										type : 'timeseries'
									},
									y : {
										label : '(%) '
									}
								},
								tooltip : {
									format : {
										title : function(d) {
											return formattedDate(new Date(d.getTime())).replace("T", " - ");
										},
										value : d3.format(',')
									}
								}
							};
							$('#chart').empty().queue(function(exec) {
								var chart = c3.generate(json);
								exec();
							});
						}
					}
				}
			});

		}
	}
};

function selectMetric(nome, json) {
	if (nome == "memoria") {
		return getMemory(json);
	} else if (nome == "cpu") {
		return getCPU(json);
	} else if (nome == "disco") {
		return getPartitions(json);
	} else {
		return null;
	}
}

function getCPU(json) {
	array_tempo = [];
	array_tempo.push("x");
	var lista_particoes = [];
	array_cpu = [];
	array_cpu.push("CPU usage");
	$.each(json, function(d) {
		array_tempo.push(json[d].timestamp.replace("T", " "));
		array_cpu.push((json[d].data).toFixed(2));
	});
	lista_particoes.push(array_tempo);
	lista_particoes.push(array_cpu);

	return lista_particoes;
}

function getMemory(json) {
	array_tempo = [];
	array_tempo.push("x");
	var lista_particoes = [];
	array_memoria = [];
	array_memoria.push("Memory usage");
	$.each(json, function(d) {
		array_tempo.push(json[d].timestamp.replace("T", " "));
		var json_memory = JSON.parse(json[d].data);
		array_memoria.push(json_memory[0].percent);
	});
	lista_particoes.push(array_tempo);
	lista_particoes.push(array_memoria);

	return lista_particoes;
}

String.prototype.replaceAll = function(de, para) {
	var str = this;
	var pos = str.indexOf(de);
	while (pos > -1) {
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
	return (str);
};

function getPartitions(json) {
	array_tempo = [];
	array_tempo.push("x");
	var map_particoes = {};
	var lista_particoes = [];
	$.each(json, function(d) {
		array_tempo.push(json[d].timestamp.replace("T", " "));
		var json_disco = JSON.parse(json[d].data);
		$.each(json_disco, function(k, v) {
			var particao = json_disco[k];
			var chave = particao.device.replaceAll("/", "\\ ");
			if (!map_particoes.hasOwnProperty(chave)) {
				map_particoes[chave] = [];
				map_particoes[chave].push(chave);
				map_particoes[chave].push(particao.percent);
			} else {
				map_particoes[chave].push(particao.percent);
			}
		});

	});
	lista_particoes.push(array_tempo);
	$.each(map_particoes, function(k, v) {
		lista_particoes.push(map_particoes[k]);
	});

	return lista_particoes;
}

/* Habilitar div selecionada de acordo com a aba selecionada*/
function show_graph() {
	$("#hist_info").empty();
  $("#bench_div").hide();
	$("#hist_div").hide();
	$("#rec_div").hide();
	$("#gerar_rec").hide();
	$("#aplicarConf").show();
	$("#chart_div").show();
	$("#panel_selection_time").show("slow");
	var $thisLi = $("#bt_vg").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
}

function show_recomendacoes() {
	$("#hist_info").empty();
	$("#chart_div").hide();
	$("#hist_div").hide();
  $("#bench_div").hide();
	$("#aplicarConf").hide();
	//esconde o botão aplicar
	$("#gerar_rec").show();

	$("#rec_div").show();

	var $thisLi = $("#bt_rec").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}

	show_rec_upgrade();
}



function show_list() {
	$("#hist_info").empty();
	$("#chart_div").hide();
	$("#rec_div").hide();
	$("#gerar_rec").hide();
  $("#bench_div").hide();
	$("#panel_selection_time").hide("slow");
	$("#hist_div").show();

	var $thisLi = $("#bt_list").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
	//chamada para atualizar o historico
	list_alarms();
}


function show_hist() {
	$("#hist_info").empty();
	$("#chart_div").hide();
	$("#rec_div").hide();
	$("#gerar_rec").hide();
  $("#bench_div").hide();
	$("#panel_selection_time").hide("slow");
	$("#hist_div").show();

	var $thisLi = $("#bt_hist").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
	//chamada para atualizar o historico
	getAlarmHistoryTime();
}



function show_rec_flavor() {
	$("#panel_selection_time").show("slow");
	$("#rec_div_upgrade").hide();
	$("#rec_div_migracao").hide();
	$("#rec_div_flavors").show();

	var $thisLi = $("#bt_rec_flavors").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
}

function show_rec_upgrade() {
	$("#panel_selection_time").hide("slow");
	$("#rec_div_flavors").hide();
	$("#rec_div_migracao").hide();
	$("#rec_div_upgrade").show();

	var $thisLi = $("#bt_rec_upgrade").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
	$("#recomendacoes_up").empty();
	medidas_de_host();
}

function show_bench() {
  $("#hist_info").empty();
  $("#chart_div").hide();
	$("#rec_div").hide();
  $("#hist_div").hide();
	$("#gerar_rec").hide();
	$("#panel_selection_time").hide("slow");
  $("#bench_div").show();
  execute_bench();
 
 var $thisLi = $("#bt_bench").parent('li');
  var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
 $("#bench_table_cpu").empty();
 execute_bench();
 
}



function show_rec_migracao() {
	$("#panel_selection_time").hide("slow");
	$("#rec_div_flavors").hide();
	$("#rec_div_upgrade").hide();
	$("#rec_div_migracao").show();

	var $thisLi = $("#bt_rec_migracao").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
	$("#recomendacoes_migracoes").empty();
	getMigracoes();
	
	/*$.ajax({
			url : ip_server + "/host_migration",
			dataType : 'json'
		}).fail(function(data) {
			show_plot = false;
			$('#chart').empty().queue(function(exec) {
				$('#chart').html('<p><h3>Erro na requisicao</h3><p>');
				exec();
			});
		}).done(function(data) {
			console.log(data);
		});*/

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}

function show_projects() {
	show_hosts = false;
	$("#chart").empty();
	$("#menu_host").hide();
	$("#menu_vm").show();

	var $thisLi = $("#bt_projects").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}

	$('<center> selecione uma VM de um projeto e um período de Tempo </center>').appendTo("#chart");
}

function show_host() {
	show_hosts = true;
	$("#chart").empty();
	$("#menu_vm").hide();
	$("#menu_host").show();

	var $thisLi = $("#bt_host").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}

	$('<center> selecione um Host e um período de Tempo </center>').appendTo("#chart");
}

/*Funcação necessária para que a aba selecionada fique active devido a um reload do bootstrap3*/
$(function() {
	$("#myTab a:last").tab('show');
});
