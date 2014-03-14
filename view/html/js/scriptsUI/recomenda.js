var recomendacoes;

/*Funcao para realizar requisicao de recomendacoes*/

function gera_recomendacao() {
	console.log("recomendação");
	$('#recomendacoes_geradas').empty();
	$('<div id="load_rec" style="display:none">	<br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Realizando recomendação.. Por favor aguarde.</h4></center></div>').appendTo("#recomendacoes_geradas");
	$("#load_rec").show();

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
		//html_m += '<h4>Nenhuma opção selecionada, escolha uma das opções de <b>Período Fixo</b> \n ou <b> Período Específico</b>  </h4><br />';
		//bootbox.alert(html_m);
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
	
	//requisicao
	
	$.ajax({
		url : url_recomenda,
		async : false,
		dataType : 'json',
		success : function(data) {
			$("#load_rec").hide();
			recomendacoes = data;
			console.log(data);

		},
		error : function(data) {
			console.log("error");
		}
	});

	//criacao da tabela de maneira dinamica na div recomendacoes_geradas

	var tabela_rec = '<table class="table table-bordered"><thead><tr><th>Sugestão</th><th>Perda</th><th>Violações</th> </tr></thead><tbody>';
	var rows;
	$.each(recomendacoes, function(k, v) {
		rows = '<tr><th>' + k + '</th><th>' + recomendacoes[k][0] + '</th><th>' + recomendacoes[k][1] + '</th></tr>';
		tabela_rec += rows;
	});

	tabela_rec += '</tbdody></table>';
	$(tabela_rec).appendTo('#recomendacoes_geradas');

}
