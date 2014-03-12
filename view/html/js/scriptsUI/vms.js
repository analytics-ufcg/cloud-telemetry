var json_projects;
var projects_name = [];
var json_vm = {};

$.ajax({
	url : "http://analytics.lsd.ufcg.edu.br/telemetry/projects/instances",
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
