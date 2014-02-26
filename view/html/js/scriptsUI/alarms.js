var retorno_alarm;

var timeoutID;

function delayedAlert() {
  timeoutID = window.setTimeout(4000);
  $('#alarm_ok').hide();
  $('#alarm_fail').hide();
}

var html_addalarm = '<div class="row"><div class="col-lg-8">Nome do alarme:<input type="text" id="name_alarm" name="alarm_name"></input></div>';
html_addalarm += '<div class="col-lg-4"><span>Tipo</span><select id="mytypes" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_addalarm += '<option value="" label=""></option><option value="cpu" label="cpu">cpu</option></select></div></div>';
html_addalarm += '<div class="row"><div class="col-lg-8">Parâmetro<input type="text" id="parametro" name="param_val"></input></div>';
html_addalarm += '<div class="col-lg-4"><span>Operador: </span><select id="myOp" class="selectpicker show-tick" data-live-search="true" data-size="auto" data-width="160px";>';
html_addalarm += '<option value="" label=""></option><option value="gt" label="&gt;">maior</option>';
html_addalarm += '<option value="lt" label="&lt;">menor</option><option value="eq" label="&#x3d;">igual</option>';
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
					var recurso = $('#mytypes').find(":selected").text();
					var nome = $('#name_alarm').val();
					var operador = $('#myOp').find(":selected").val();
					var parametro = $('#parametro').val();

					var url_alarm = "http://150.165.15.4:9090/add_alarm?";
					url_alarm += "name=" + nome;
					url_alarm += "&resource=" + recurso;
					url_alarm += "&operator=" + operador;
					url_alarm += "&threshold=" + parametro;
					url_alarm += "&period=" + 100;

					$.ajax({
						url : url_alarm,
						async : false,
						type : 'POST',
						dataType : 'json',
						success : function(data) {
							console.log(data);
							retorno_alarm = data;
							//Example.show("Alarme criado, id=" + data.alarm_id);

							//alarm_ok

							if (data.alarm_id == "null") {
								$('#alarm_fail').append("<span>Alarme não foi criado </span>");
								$('#alarm_fail').show();
								delayedAlert();
							} else {
								$('#alarm_ok').append("<span>Alarme criado com id=" + data.alarm_id + "</span>");
								$('#alarm_ok').show();
								delayedAlert();
								
							}

						},
						error : function(data) {
							console.log("error");

						}
					});

				}
			}
		}
	});
}





