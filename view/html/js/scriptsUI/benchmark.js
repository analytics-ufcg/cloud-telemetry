var medidas;
function execute_bench() {
  $('<div id="load_bench" style="display:none">    <br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Obtendo dados. Por favor aguarde.</h4></center></div>').appendTo("#bench_table");
	$("#load_bench").show();  
  

  var url_benchmark = ip_server + "/benchmark_data";  

  
  $.ajax({
  	url : url_benchmark,
		dataType : 'json'
	}).fail(function(data) {
		$('#bench_table').empty().queue(function(exec) {
			$('<h3>Ocorreu um erro durante a requisição, por favor tente novamente.</h3>').appendTo('#bench_table');
			exec();
		});
	}).done(function(data) {
		$("#load_bench").hide();
		medidas = data;
		var tabela_bench = '<table class="table table-bordered"><thead><tr><th>Host</th><th>Disk Mean</th><th>Disk Median</th><th>Memory Mean</th><th>Memory Median</th><th>CPU Mean</th><th>CPU Median</th></tr></thead><tbody>';
		var rows;
		$.each(medidas, function(k, v) {
      rows = '<tr><th>' + medidas[k]["host"] + '</th><th>' + medidas[k]["disk_mean"] + '</th><th>' + medidas[k]["disk_median"];
			rows += '</th><th>' + medidas[k]["mem_mean"] + '</th><th>' + medidas[k]["mem_median"] + '</th><th>' + medidas[k]["cpu_mean"] + '</th><th>' + medidas[k]["cpu_median"]  + '</th></tr>';
			tabela_bench += rows;
		});

		tabela_bench += '</tbdody></table>';
		$('#bench_table').empty().queue(function(exec) {
			$(tabela_bench).appendTo('#bench_table');
			exec();
		});

});
}