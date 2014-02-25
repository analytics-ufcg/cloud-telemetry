var json_projects;
var projects_name = [];
var json_vm = {};

$.ajax({
	url : "http://150.165.15.4:9090/projects",
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

$('<div id="painel_projetos" class="panel panel-primary">'+'</div>').appendTo('#menu_vm');

/*
 * 
 * 
 * 
 * <!--<div class="panel-heading">
									<h3 class="panel-title">Projetos</h3>
								</div>-->
 */
