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

$('#aplicarConf').click(function() {
	var out = $("input[name='defaultTime']:checked").val();
	var dh1 = $('#data_hora1').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt1 = new Date(dh1[2], dh1[1], dh1[0], dh1[3], dh1[4]);
	var dh2 = $('#data_hora2').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
	var dt2 = new Date(dh2[2], dh2[1], dh2[0], dh2[3], dh2[4]);
	/*Verificações antes de realizar requisição*/
	var html_m = '<h2>Atenção!</h2><br />';
	/*Nenhum Campo selecionado*/
	if (out == undefined && $('#data_hora1').val().length == 0 && $('#data_hora2').val().length == 0) {
		html_m += '<h4>Nenhuma opção selecionada, escolha uma das opções de <b>Período Fixo</b> \n ou <b> Período Específico</b>  </h4><br />';
		bootbox.alert(html_m);
	}
	/*Verificacao de Datas futuras*/
	var dtsys = new Date();
	var atual = new Date(dtsys.getFullYear(), dtsys.getMonth() + 1, dtsys.getDay(), dtsys.getHours(), dtsys.getMinutes());
	console.log(dt1.getTime() - atual.getTime() > 60);
	console.log();
	/*Data de Inicio maior igual Data Fim*/
	if (dt1.getTime() >= dt2.getTime()) {
		html_m += '<h4>A data de início fornecida possui tempo maior ou igual à data fim.</h4><br />';
		html_m += '<h4>Escolha outra data. Obrigado</h4>';
		bootbox.alert(html_m);
	}

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

var html_alarm = '<div class="row"><div class="col-lg-8">Nome do alarme:<input type="text" name="alarm_name"></input></div>';
html_alarm += '<div class="col-lg-4"><span>Tipo </span><select id="mytypes" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_alarm += '<option value="" label=""></option><option value="cpu" label="cpu">cpu</option></select></div></div>';
html_alarm += '<div class="row"><div class="col-lg-8">Parâmetro<input type="text" name="param_val"></input></div>';
html_alarm += '<div class="col-lg-4"><span>Expressão: </span><select id="mytypes" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_alarm += '<option value="" label=""></option><option value="maior" label="&gt;"></option><option value="maiorque" label="&ge;"></option>';
html_alarm += '<option value="menor" label="&lt;"></option><option value="menorque" label="&le;"></option><option value="igual" label="&#x3d;"></option>';
html_alarm += '</select></div></div>';
/*Funcao que oferece a adição de alarme*/
function addAlarme() {
	bootbox.dialog({
		
		message : html_alarm,
		title : "Adição de Alarmes",
		buttons : {
			main : {
				label : "Adicionar",
				className : "btn-primary",
				callback : function() {
					console.log("Hi " + $('#first_name').val());
				}
			}
		}
	});
}