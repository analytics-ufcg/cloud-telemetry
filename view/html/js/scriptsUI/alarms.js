var html_alarm = '<div class="row"><div class="col-lg-8">Nome do alarme:<input type="text" name="alarm_name"></input></div>';
html_alarm += '<div class="col-lg-4"><span>Tipo </span><select id="mytypes" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_alarm += '<option value="" label=""></option><option value="cpu" label="cpu">cpu</option></select></div></div>';
html_alarm += '<div class="row"><div class="col-lg-8">Parâmetro<input type="text" name="param_val"></input></div>';
html_alarm += '<div class="col-lg-4"><span>Operador: </span><select id="mytypes" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
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
				}
			}
		}
	});
}