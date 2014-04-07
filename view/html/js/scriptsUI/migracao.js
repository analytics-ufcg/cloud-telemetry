function getMigracoes(){
var panel = '<div class="col-md-6"><div class="panel panel-danger"> <div class="panel-heading"> <h3 class="panel-title">Hosts Sobrecarregados</h3> </div> <div class="panel-body">Panel content</div></div>';


$(panel).appendTo("#recomendacoes_migracoes");

var panel2 = '<div class="col-md-6"><div class="panel panel-success"> <div class="panel-heading"> <h3 class="panel-title">Hosts Subcarregado</h3> </div> <div class="panel-body"> <div class="btn-group-vertical"> <span>      <button type="button" class="btn btn-default">Button</button> </span> <span>      <button type="button" class="btn btn-default">Button</button> </span> </div>';
panel2 += '</div></div></div>';
$(panel2).appendTo("#recomendacoes_migracoes");	

}
