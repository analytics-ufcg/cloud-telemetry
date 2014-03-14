var retorno_alarm;

//input para nome do alarme
var html_addalarm = '<div class="row"><div class="col-lg-8">Nome do alarme:<input type="text" id="name_alarm" name="alarm_name"></input></div>';
//criacao de dropdown com os recursos
html_addalarm += '<div class="col-lg-4"><span>Recurso</span><select id="myRecursos" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_addalarm += '<option value="" label=""></option><option value="cpu_util" label="cpu_util">cpu_util</option></select></div></div>';
//valor de threshold
html_addalarm += '<div class="row"><div class="col-lg-8">Threshold<input type="text" id="parametro" name="param_val"></input></div>';
//criacao de dropdown para escolhar do operador
html_addalarm += '<div class="col-lg-4"><span>Operador: </span><select id="myOp" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_addalarm += '<option value="" label=""></option><option value="eq" label="igual">igual</option><option value="gt" label="maior">maior</option>';
html_addalarm += '<option value="ge" label="maior igual">maior igual</option><option value="lt" label="menor">menor</option><option value="le" label"menor igual">menor igual</option>';
html_addalarm += '</select></div></div>';


/*Funcao que oferece a adição de alarme*/
function addAlarme() {
	bootbox.dialog({

		message : html_addalarm,
		title : "Adição de Alarmes",
		buttons : {
			main : {
				label : "Adicionar",
				className : "btn-primary",
				callback : function(result) {
					var recurso = $('#myRecursos').find(":selected").text();
					var nome = $('#name_alarm').val();
					var operador = $('#myOp').find(":selected").val();
					var parametro = $('#parametro').val();

					var url_alarm = ip_server + "/add_alarm?";
					url_alarm += "name=" + nome;
					url_alarm += "&resource=" + recurso;
					url_alarm += "&operator=" + operador;
					url_alarm += "&threshold=" + parametro;
					url_alarm += "&period=" + 100;

					// Requisicao para adicionar o alarme
					$.ajax({
						url : url_alarm,
						async : false,
						type : 'POST',
						dataType : 'json',
						success : function(data) {
							retorno_alarm = data;
						},
						error : function(data) {
							console.log("error");
						}
					});

					// Alerta sobre resultado da criacao do alarme
					if (retorno_alarm.alarm_id == "null") {
						$('#alarm_fail').append("<span>Alarme não foi criado </span>");
						$('#alarm_fail').show(0).delay(4300).hide(0).queue(function(next){
							$('#alarm_fail').find('span').remove();
							next();
						});
						
					} else {
						$('#alarm_ok').append("<span>Alarme criado com id=" + retorno_alarm.alarm_id + "</span>");
						$('#alarm_ok').show(0).delay(4300).hide(0).queue(function(next){
							$('#alarm_ok').find('span').remove();
							next();
						});
					}

				}
			}
		}
	});
}





