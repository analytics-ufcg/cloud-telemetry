var json_projects;
var projects_name = [];
var json_vm = {};
var hosts_ip = [];
var alarm_data = [];
var total_alarms = 0;
$.ajax({
	url : (ip_server + "/projects/instances"),
	global : false,
	dataType : 'json'
}).fail(function(data) {
	//colocar mensagem que nao conseguiu
	console.log("vms erro");
}).done(function(data) {
	json_projects = data;

	$.each(json_projects.children, function(key1, value1) {
		var nome = json_projects.children[key1].name;
		projects_name.push(nome);
		json_vm[nome] = [];
		$.each(json_projects.children[key1].children, function(key2, value2) {
			json_vm[json_projects.children[key1].name].push(json_projects.children[key1].children[key2].resource_id);
			json_vm[json_projects.children[key1].name].push(json_projects.children[key1].children[key2].instance_name);
		});
	});

	$('<div id="painel_projetos" class="panel panel-primary">' + '</div>').appendTo('#menu_vm');
	$('<div class="panel-heading">' + '<h3 class="panel-title">Projects</h3>' + '</div>').appendTo('#painel_projetos');
	//Mudancas serão necessárias para aparecer o nome das VMs
	$.each(projects_name, function(k, v) {
		var projeto = projects_name[k];
		var vms = json_vm[projeto];
		var add_vm = '';
		if (vms.length > 0) {
			for(var i = 0; i < vms.length; i = i + 2){
				add_vm += '<div class="radio"><label data-toggle="tooltip"'+ 'title=' + vms[i+1].toString()+ '><input type="radio" name="defaultVM" ' + 'value=' + vms[i].toString() + '>' + vm_name(vms[i+1].toString());
				add_vm += '</label></div>';
			}
			$('<div class="panel-body">' + '<strong> Projeto ' + projeto + ' <strong>' + add_vm + '</div>').appendTo('#painel_projetos');
		}
	});

});


function vm_name(nome){
	if(nome.length < 18){
		return nome;
	}else{
		return nome.substring(0,19)+"...";
	}
	
}


$.ajax({
	url : (ip_server + "/hosts"),
	global : false,
	dataType : 'json'
}).fail(function(data) {
	//colocar mensagem que nao conseguiu
	console.log("host erro");
}).done(function(data) {
	var ips = data.children;
	$.each(ips, function(k, v) {
		hosts_ip.push(ips[k].ip);
	});

	$('<div id="painel_metrica" class="panel panel-primary"></div>').appendTo('#menu_host');
	$('<div class="panel-heading"> <h3 class="panel-title">Metrics</h3></div>').appendTo("#painel_metrica");
	var metricas = '<div class="radio"><label><input type="radio" name="defaultMetric" value="cpu">CPU</label></div>';
	metricas += '<div class="radio"><label><input type="radio" name="defaultMetric" value="disco">Disco</label></div>';
	metricas += '<div class="radio"><label><input type="radio" name="defaultMetric" value="memoria">Memória</label></div>';
	$('<div class="panel-body">' + metricas + '</div>').appendTo("#painel_metrica");

	$('<div id="painel_hosts" class="panel panel-primary">' + '</div>').appendTo('#menu_host');
	$('<div class="panel-heading">' + '<h3 class="panel-title">Hosts</h3>' + '</div>').appendTo('#painel_hosts');
	var add_host = '';
	var posicao = 0;
	$.each(hosts_ip, function(k2, v2) {
		add_host += '<div class="radio"><label><input type="radio" name="deafultHost" ' + 'value=' + hosts_ip[k2] +  ' ';
		add_host += 'id='+posicao +'>' + hosts_ip[k2] + '</label></div>';
		posicao += 1;
	});
	$('<div class="panel-body">' + add_host + '</div>').appendTo('#painel_hosts');
	
	$(function() {
    var $radios = $('input:radio[name=defaultMetric]');
    if($radios.is(':checked') === false) {
        $radios.filter('[value="cpu"]').prop('checked', true);
    }});
    
    $(function() {
    var $radios2 = $('input:radio[name=deafultHost]');
    if($radios2.is(':checked') === false) {
        $radios2.filter('[id=0]').prop('checked', true);
    }});
	
	
	
});

function count_alarms() {
	$.ajax({
		url : (ip_server + "/alarms_history"),
		global : false,
		dataType : 'json'
	}).fail(function(data) {
		//colocar mensagem que nao conseguiu
		console.log("count erro");
	}).done(function(data) {
		$("#notificacoes .badge").remove();
		alarm_data = data;
    	var num = 0;
		$.each(data, function(k, v) {
			num += data[k].history.length;
		});
		total_alarms = num;
		$("#notificacoes").append('<span class="badge">' + num + '</span>');
	});
}