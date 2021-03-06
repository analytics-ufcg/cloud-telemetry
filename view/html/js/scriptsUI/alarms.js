//input para nome do alarme
var html_addalarm = '<div class="row"><div class="col-lg-8 col-md-8">Alarm name:  <input type="text" id="name_alarm" name="alarm_name"></input></div>';
//criacao de dropdown com os recursos
html_addalarm += '<div class="col-lg-4 col-md-4"><span>Resource</span><select id="myRecursos" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_addalarm += '<option value="" label=""></option><option value="cpu_util" label="cpu_util">cpu_util</option></select></div></div>';
//valor de threshold
html_addalarm += '<div class="row"><div class="col-lg-8 col-md-8">Threshold  <input type="text" id="threshold" name="param_val"></input></div>';
//criacao de dropdown para escolhar do operador
html_addalarm += '<div class="col-lg-4 col-md-4"><span>Operator: </span><select id="myOp" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_addalarm += '<option value="" label=""></option><option value="gt" label="greater">greater</option><option value="lt" label="less">less</option></select></div></div>';
//div para adição de novo parametro
html_addalarm += '<div class="row"><div class="col-lg-8 col-md-8">Evaluation Period <input type="text" id="eval_period" name="evalperiod_val"></input></div> ';
html_addalarm += '<div class="col-lg-4 col-md-4">Time <input type="text" id="time" name="time_val"></input></div></div>';

function addAlarme() {
	bootbox.dialog({

		message : html_addalarm,
		title : "Add Alarms",
		buttons : {
			main : {
				label : "Add",
				className : "btn-primary",
				callback : function(result) {
					var recurso = $('#myRecursos').find(":selected").text();
					var nome = $('#name_alarm').val();
					var operador = $('#myOp').find(":selected").val();
					var threshold = $('#threshold').val();
					var period_time = $('#time').val();
					var eval_period = $('#eval_period').val();
					/*
					 * Criar variavel para receber o parametro de tempo e modificar a chamada de criação do alarme
					 */
					var url_alarm = ip_server + "/add_alarm?";
					url_alarm += "name=" + nome;
					url_alarm += "&resource=" + recurso;
					url_alarm += "&operator=" + operador;
					url_alarm += "&threshold=" + threshold;
					url_alarm += "&period=" + period_time;
					url_alarm += "&evalperiod=" + eval_period;

					// Requisicao para adicionar o alarme
					$.ajax({
						url : url_alarm,
						type : 'POST',
						dataType : 'json'
					}).fail(function(data) {
						$('#alarm_fail').append("<span>Server Error when trying to create alarm.<br>Alarm was not created</span>");
						$('#alarm_fail').show(0).delay(4300).hide(0).queue(function(next) {
							$('#alarm_fail').find('span').remove();
							next();
						});
					}).done(function(data) {
						if (data.alarm_id == "null") {
							$('#alarm_fail').append("<span>Alarm was not created</span>");
							$('#alarm_fail').show(0).delay(4300).hide(0).queue(function(next) {
								$('#alarm_fail').find('span').remove();
								next();
							});

						} else {
							$('#alarm_ok').append("<span>Alarm created with id=" + data.alarm_id + "</span>");
							$('#alarm_ok').show(0).delay(4300).hide(0).queue(function(next) {
								$('#alarm_ok').find('span').remove();
								next();
							});
						}
					});

				}
			}
		}
	});
}

function deleteAlarme() {

	var url_list_alarms = ip_server + "/alarm_description";
	var alarms_list = new Array();
	var indice = 0;
	var html_deletealarm = '<div class="row"><div class="col-lg-8 col-md-8"><span>Alarm Name: </span><select id="myAlarm" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';

	$.ajax({
		url : url_list_alarms,
		dataType : 'json'
	}).fail(function(data) {
	}).done(function(data) {
		var lista = data;
		$.each(lista, function(k, v) {
			html_deletealarm += '<option value="' + k + '" label="' + lista[k][0] + '">' + lista[k][0] + '</option>';

		});
		console.log(html_deletealarm);
		html_deletealarm += '</div></div>';
		bootbox.dialog({

			message : html_deletealarm,
			title : "Remove Alarms",
			buttons : {
				main : {
					label : "Remove",
					className : "btn-primary",
					callback : function(result) {
						var alarme_escolhido = $('#myAlarm').find(":selected").val();
						var url_alarm = ip_server + "/alarm_delete?";
						url_alarm += 'alarm_id=' + alarme_escolhido;
						console.log(url_alarm);

						$.ajax({
							url : url_alarm,
							dataType : 'json'
						}).fail(function(data) {
							$('#recomendacoes_up').empty().queue(function(exec) {
								$('<h3>An error occurred during the request, please try again.</h3>').appendTo('#recomendacoes_up');
								exec();
							});
						}).done(function(data) {
							$('#alarm_ok').append("<span>Alarm successfully removed</span>");
							$('#alarm_ok').show(0).delay(4300).hide(0).queue(function(next) {
								$('#alarm_ok').find('span').remove();
								next();
							});

						});

					}
				}
			}
		});

	});

}

function list_alarms() {
	show_hist();
	var $thisLi = $("#bt_alarm_list").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
	$("#bt_hist_alarm").hide();
	var url_list_alarms = ip_server + "/alarm_description";
	console.log(url_list_alarms);
	$.ajax({
		url : url_list_alarms,
		dataType : 'json'
	}).fail(function(data) {
	}).done(function(data) {
		var lista = data;
		console.log(data);
		var tabela_list = '<table class="table table-bordered"><thead><tr> <th> Alarm Name </th> <th>Alarm Id</th> <th>Enabled</th> <th>Description</th> </tr> </thead><tbody>';
		var rows;
		$.each(lista, function(k, v) {
			rows = '<tr><th>' + lista[k][0] + '</th><th>' + k + '</th><th>' + lista[k][1] + '</th><th>' + lista[k][2] + '</th></tr>';
			tabela_list += rows;
		});

		tabela_list += '</tbdody></table>';

		console.log(tabela_list);
		$('#hist_info').empty().queue(function(exec) {
			$(tabela_list).appendTo('#hist_info');
			exec();
		});

	});

}

