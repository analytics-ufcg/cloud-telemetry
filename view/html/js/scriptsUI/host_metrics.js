var medidas;

/*Funcao para realizar requisicao de medidas*/

function medidas_de_host() {
	$('<div id="load_met" style="display:none">    <br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Obtendo Métricas. Por favor aguarde.</h4></center></div>').appendTo("#recomendacoes_up");
	$("#load_met").show();

	var out = $("input[name='defaultTime']:checked").val();
	var dh1 = $('#data_hora1').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt1 = new Date(dh1[2], dh1[1], dh1[0], dh1[3], dh1[4]);
	var dh2 = $('#data_hora2').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt2 = new Date(dh2[2], dh2[1], dh2[0], dh2[3], dh2[4]);
	var vm = $("input[name='defaultVM']:checked").val();
	/*Verificações antes de realizar requisição*/
	var html_m = '<h2>Atenção!</h2><br />';
	//parametro de project não interfere já que só temos um.
	var url_metricas = ip_server + "/host_metrics?project=demo";

	//requisicao
	$.ajax({
		url : url_metricas,
		dataType : 'json'
	}).fail(function(data) {
		$('#recomendacoes_up').empty().queue(function(exec) {
			$('<h3>Ocorreu um erro durante a requisição, por favor tente novamente.</h3>').appendTo('#recomendacoes_up');
			exec();
		});
	}).done(function(data) {
		$("#load_met").hide();
		medidas = data;
		var tabela_met = '<table class="table table-bordered"><thead><tr><th>Host</th><th>Total de CPU</th><th>CPU Utilizada</th><th>Memoria Total</th><th>Memoria Utilizada</th><th>Disco Total</th><th>Disco Utilizado</th><th>Percentual de CPU</th> <th>Percentual de Memoria</th><th>Percentual de Disco</th></tr></thead><tbody>';
		var rows;
		$.each(medidas, function(k, v) {
			rows = '<tr><th>' + k + '</th><th>' + medidas[k]["Total"][0] + '</th><th>' + medidas[k]["Em uso"][0];
			rows += '</th><th>' + medidas[k]["Total"][1] + '</th><th>' + medidas[k]["Em uso"][1] + '</th><th>' + medidas[k]["Total"][2] + '</th><th>' + medidas[k]["Em uso"][2] + '</th><th>' + medidas[k]["Percentual"][0] + '</th><th>' + medidas[k]["Percentual"][1] + '</th><th>' + medidas[k]["Percentual"][2] + '</th></tr>';
			tabela_met += rows;
		});

		tabela_met += '</tbdody></table>';
		$('#recomendacoes_up').empty().queue(function(exec) {
			$(tabela_met).appendTo('#recomendacoes_up');
			exec();
		});

	});

}
