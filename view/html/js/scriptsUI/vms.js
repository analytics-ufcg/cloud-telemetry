var json_projects;
var projects_name = [];
var json_vm = {};
var hosts_ip = [];
$.ajax({
	url : (ip_server + "/projects/instances"),
	async : false,
	dataType : 'json',
	success : function(data) {
		json_projects = data;
		console.log(data);

		$.each(json_projects.children, function(key1, value1) {
			var nome = json_projects.children[key1].name;
			projects_name.push(nome);
			json_vm[nome] = [];
			$.each(json_projects.children[key1].children, function(key2, value2) {
				json_vm[json_projects.children[key1].name].push(json_projects.children[key1].children[key2].resource_id);
			});
		});

	},
	error : function(data) {
		console.log("error");
		console.log(data);
	}
});

$.ajax({
	url : (ip_server + "/hosts"),
	async : false,
	dataType : 'json',
	success : function(data) {
		var ips = data.children;
		$.each(ips, function(k, v) {
			hosts_ip.push(ips[k].ip);
		});
	},
	error : function(data) {

	}
});

$.ajax({
	url : (ip_server + "/alarms_history"),
	async : false,
	dataType : 'json',
	success : function(data) {
		var num = 0;
		$.each(data, function(k, v) {
			num += data[k].history.length;
		});
		console.log(num);
		$("#notificacoes").append('<span class="badge">' + num + '</span>');
	},
	error : function(data) {

	}
}); 