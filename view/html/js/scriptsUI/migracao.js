function getMigracoes() {
	var panel = '<div  id= "panel_host" class="col-md-6"><div class="panel panel-danger"> <div class="panel-heading"> <h3 class="panel-title">Hosts Power Status</h3> </div> <div id="host_status_enable" class="panel-body"></div></div>';
	var panel2 = '<div id="panel_migration" class="col-md-6"><div class="panel panel-success"> <div class="panel-heading"> <h3 class="panel-title">Suggested Server Migrations</h3></div>  <div id="migrations" class="panel-body"> </div></div></div>';

	$(panel).appendTo("#recomendacoes_migracoes");
	$(panel2).appendTo("#recomendacoes_migracoes");

	var requisicao;

	$('<div id="load_migration" style="display:none">    <br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Obtendo dados. Por favor aguarde.</h4></center></div>').appendTo("#migrations");
	$('<div id="load_migration2" style="display:none">    <br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Obtendo dados. Por favor aguarde.</h4></center></div>').appendTo("#host_status_enable");
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
			$('<h3>Ocorreu um erro durante a requisição, por favor tente novamente.</h3>').appendTo('#host_status_enable');
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
				
				destino = (i == null)? '---':i; 
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
				rows_status+= '<font color="FF0000">Shut Off</font>'+'</th>'+'</tr>';
			}else{
				rows_status+= '<font color="00FF00">Keep On</font>'+'</th>'+'</tr>';
			}	
			tabela_host_status+=rows_status;
		});
		tabela_host_status += '</tbdody></table>';
		
		$('#host_status_enable').empty().queue(function(exec) {
			$(tabela_host_status).appendTo('#host_status_enable');
			exec();
		});


		$('#migrations').empty().queue(function(exec) {
			$(tabela_migration).appendTo('#migrations');
			exec();
		});

	});

}
