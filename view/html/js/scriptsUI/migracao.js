function getMigracoes() {
	var panel = '<div  id= "panel_host" class="col-md-6"><div class="panel panel-danger"> <div class="panel-heading"> <h3 class="panel-title">Resource Savings</h3> </div> <div id="hoststatusenable" class="panel-body"></div></div>';
	var panel2 = '<div id="panel_migration" class="col-md-6"><div class="panel panel-success"> <div class="panel-heading"> <h3 class="panel-title">Migrations</h3></div>  <div id="migrations" class="panel-body"> </div></div></div>';

	$(panel).appendTo("#recomendacoes_migracoes");
	$(panel2).appendTo("#recomendacoes_migracoes");

	var requisicao;

	$('<div id="load_migration" style="display:none">    <br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Obtendo dados. Por favor aguarde.</h4></center></div>').appendTo("#migrations");
	$('<div id="load_migration2" style="display:none">    <br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Obtendo dados. Por favor aguarde.</h4></center></div>').appendTo("#hoststatusenable");
	$("#load_migration").show();
	$("#load_migration2").show();

	var url_migration = ip_server + "/host_migration";

	$.ajax({
		url : url_migration,
		dataType : 'json'
	}).fail(function(data) {
		
		$("#load_migration").hide();
		$("#load_migration2").hide();
		$("#panel_host").hide();
		$("#panel_migration").hide(); 

			$('#hosts_enable').empty().queue(function(exec) {
			$('<h3>Ocorreu um erro durante a requisição, por favor tente novamente.</h3>').appendTo('#hoststatusenable');
			exec();
		});
	}).done(function(data) {
		$("#load_migration").hide();
		$("#load_migration2").hide();
		requisicao = data;
		var tabela_migration = '<table class="table table-bordered"><thead><tr><th>Host</th><th>Server</th><th>End Host</th></tr></thead><tbody>';
		var rows;

		$.each(requisicao['Migracoes'], function(k, v) {
			rows = '<tr>';
			$.each(requisicao['Migracoes'][k], function(j, i) {
				
				destino = (i == null)? 'NOT MIGRATION':i; 
				rows += '<tr>';
				rows += '<th>' + k + '</th>' + '<th>' + j + '</th>' + '<th>' + destino + '</th>';
				rows += '</tr>';
			});
			rows += '</tr>';
			tabela_migration += rows;

			
		});
		tabela_migration += '</tbdody></table>';

		
		var tabela_host_status = '<table class="table table-bordered"><thead><tr><th>Host</th><th>Status</th></tr></thead><tbody>';
		var rows_status;

		$.each(requisicao['Hosts'], function(k, v) {
			rows_status= '<tr>'+'<th>'+k+'</th>'+'<th>';
			if(v == true){
				rows_status+= '<font color="00FF00">SHUT OFF</font>'+'</th>'+'</tr>';
			}else{
				rows_status+= '<font color="FF0000">SWITCH ON</font>'+'</th>'+'</tr>';
			}	
			tabela_host_status+=rows_status;
		});
		tabela_host_status += '</tbdody></table>';
		
		$('#hoststatusenable').empty().queue(function(exec) {
			$(tabela_host_status).appendTo('#hoststatusenable');
			exec();
		});


		$('#migrations').empty().queue(function(exec) {
			$(tabela_migration).appendTo('#migrations');
			exec();
		});

	});

}
