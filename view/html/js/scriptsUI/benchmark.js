var medidas;
function execute_bench() {
	$('<div id="load_bench" style="display:none">    <br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Obtendo dados. Por favor aguarde.</h4></center></div>').appendTo("#bench_table_cpu");
	$("#load_bench").show();

	var url_benchmark = ip_server + "/benchmark_data";

	$.ajax({
		url : url_benchmark,
		dataType : 'json'
	}).fail(function(data) {
		$('#bench_table_cpu').empty().queue(function(exec) {
			$('<h4>There was an error with the request. Please try again.</h4>').appendTo('#bench_table_cpu');
			exec();
		});
	}).done(function(data) {
		$("#load_bench").hide();
		medidas = data;
		var tabela_bench_cpu = '<table class="table table-bordered"><thead><tr><th>Host</th><th>Average</th><th>Median</th><th>Min</th><th>Max</th><th>First Quarter</th><th>Second Quarter</th><th>Third Quarter</th><th>Fourth Quarter</th></tr></thead><tbody>';
		var tabela_bench_memory = '<table class="table table-bordered"><thead><tr><th>Host</th><th>Average</th><th>Median</th><th>Min</th><th>Max</th><th>First Quarter</th><th>Second Quarter</th><th>Third Quarter</th><th>Fourth Quarter</th></tr></thead><tbody>';
		var tabela_bench_disk = '<table class="table table-bordered"><thead><tr><th>Host</th><th>Average</th><th>Median</th><th>Min</th><th>Max</th><th>First Quarter</th><th>Second Quarter</th><th>Third Quarter</th><th>Fourth Quarter</th></tr></thead><tbody>';
		var rows_cpu, rows_mem, rows_disk;
		for (var i = 0; i < data.length; i++) {
			rows_cpu = '<tr><th>' + data[i]['host'] + '</th><th>' + data[i]['cpu_average'] + '</th><th>' + data[i]['cpu_median'] + '</th><th>' + data[i]['cpu_min'] + '</th><th>' + data[i]['cpu_max'] + '</th><th>' + data[i]['cpu_first_quarter'] + '</th><th>' + data[i]['cpu_second_quarter'] + '</th><th>' + data[i]['cpu_third_quarter'] + '</th><th>' + data[i]['cpu_fourth_quarter'] + '</th></tr>';
			rows_mem = '<tr><th>' + data[i]['host'] + '</th><th>' + data[i]['mem_average'] + '</th><th>' + data[i]['mem_median'] + '</th><th>' + data[i]['mem_min'] + '</th><th>' + data[i]['mem_max'] + '</th><th>' + data[i]['mem_first_quarter'] + '</th><th>' + data[i]['mem_second_quarter'] + '</th><th>' + data[i]['mem_third_quarter'] + '</th><th>' + data[i]['mem_fourth_quarter'] + '</th></tr>';
			rows_disk = '<tr><th>' + data[i]['host'] + '</th><th>' + data[i]['disk_average'] + '</th><th>' + data[i]['disk_median'] + '</th><th>' + data[i]['disk_min'] + '</th><th>' + data[i]['disk_max'] + '</th><th>' + data[i]['disk_first_quarter'] + '</th><th>' + data[i]['disk_second_quarter'] + '</th><th>' + data[i]['disk_third_quarter'] + '</th><th>' + data[i]['disk_fourth_quarter'] + '</th></tr>';

			tabela_bench_cpu += rows_cpu;
			tabela_bench_memory += rows_mem;
			tabela_bench_disk += rows_disk;
		}

		tabela_bench_cpu += '</tbdody></table>';
		tabela_bench_memory += '</tbdody></table>';
		tabela_bench_disk += '</tbdody></table>';

		$('#bench_table_cpu').empty().queue(function(exec) {
			$(tabela_bench_cpu).appendTo('#bench_table_cpu');
			exec();
		});
		$('#bench_table_memory').empty().queue(function(exec) {
			$(tabela_bench_memory).appendTo('#bench_table_memory');
			exec();
		});
		$('#bench_table_disk').empty().queue(function(exec) {
			$(tabela_bench_disk).appendTo('#bench_table_disk');
			exec();
		});

	});

}

function load_bench() {
	var url_benchmark = ip_server + "/start_bench_th";
	$.ajax({
		url : url_benchmark,
			dataType : 'json'
	}).fail(function(data) {
		console.log("fail");
	}).done(function(data) {
		console.log(data);
		if (data == "ja ha uma instancia chamada benchmark") {
			$('#alarm_fail').append("<span>There is already a benchmark execution scheduled</span>");
			$('#alarm_fail').show(0).delay(4300).hide(0).queue(function(next) {
				$('#alarm_fail').find('span').remove();
				next();
			});

		} else if (data == "instancia disparada") {
			$('#alarm_ok').append("<span>Benchmark scheduled.</span>");
			$('#alarm_ok').show(0).delay(4300).hide(0).queue(function(next) {
				$('#alarm_fail').find('span').remove();
				next();
			});
		}

	});

}
