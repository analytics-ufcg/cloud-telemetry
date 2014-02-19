var dados;

/* Habilitando seletores de data/hora */
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
function formattedDate(date) {
    var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
}

$('#aplicarConf').click(function() {
	var out = $("input[name='defaultTime']:checked").val();
	var dh1 = $('#data_hora1').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt1 = new Date(dh1[2], dh1[1], dh1[0], dh1[3], dh1[4]);
	var dh2 = $('#data_hora2').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt2 = new Date(dh2[2], dh2[1], dh2[0], dh2[3], dh2[4]);
	console.log($('#data_hora1').val());
	console.log($('#data_hora2').val());

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
	now.setTime( now.getTime() + now.getTimezoneOffset() );
	var url_requisicao = "/cpu_util?";
	if (out == "ultima_hora") {
		var ontem = new Date(now - (1000 * 60 * 60 * 1));
		ontem.setTime( ontem.getTime() + ontem.getTimezoneOffset() );
		console.log(ontem.getDate());
		url_requisicao += "start_date=" + formattedDate(ontem) + " " +ontem.getHours() + ":" + ontem.getMinutes() ;
		url_requisicao += "&end_date" + formattedDate(now) + " " +now.getHours() + ":" + now.getMinutes() ;
		console.log(url_requisicao);
	} else if (out == "ultimo_dia") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 1));
		ontem.setTime( ontem.getTime() + ontem.getTimezoneOffset() );
		url_requisicao += "start_date=" + formattedDate(ontem) + " " +ontem.getHours() + ":" + ontem.getMinutes() ;
		url_requisicao += "&end_date" + formattedDate(now) + " " +now.getHours() + ":" + now.getMinutes() ;		
		console.log(url_requisicao);
	} else if (out == "ultima_semana") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 7));
		ontem.setTime( ontem.getTime() + ontem.getTimezoneOffset() );
		url_requisicao += "start_date=" + formattedDate(ontem) + " " +ontem.getHours() + ":" + ontem.getMinutes() ;
		url_requisicao += "&end_date" + formattedDate(now) + " " +now.getHours() + ":" + now.getMinutes() ;
		console.log(url_requisicao);
	} else if (out == "ultimo_mes") {
		var ontem = new Date(now - (1000 * 60 * 60 * 24 * 30));
		ontem.setTime( ontem.getTime() + ontem.getTimezoneOffset() );
		url_requisicao += "start_date=" + formattedDate(ontem) + " " +ontem.getHours() + ":" + ontem.getMinutes() ;
		url_requisicao += "&end_date" + formattedDate(now) + " " +now.getHours() + ":" + now.getMinutes() ;
		console.log(url_requisicao);
	} else {
		url_requisicao += "start_date=" + $('#data_hora1').val();
		url_requisicao += "&end_date" + $('#data_hora2').val();
	}

	$.get(url_requisicao, function(data) {
		dados = JSON.parse(data);
		console.log(url_requisicao);
	});
});

/* Habilitar div selecionada de acordo com a aba selecionada*/
function show_graph() {
	$("#hist_div").hide();
	$("#rec_div").hide();
	$("#chart_div").show();

	var $thisLi = $("#bt_vg").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
}

function show_recomendacoes() {
	$("#chart_div").hide();
	$("#hist_div").hide();
	$("#rec_div").show();

	var $thisLi = $("#bt_rec").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
}

function show_hist() {
	$("#chart_div").hide();
	$("#rec_div").hide();
	$("#hist_div").show();

	var $thisLi = $("#bt_hist").parent('li');
	var $ul = $thisLi.parent('ul');

	if (!$thisLi.hasClass('active')) {
		$ul.find('li.active').removeClass('active');
		$thisLi.addClass('active');
	}
}

/*Funcação necessária para que a aba selecionada fique active devido a um reload do bootstrap3*/
$(function() {
	$("#myTab a:last").tab('show');
});