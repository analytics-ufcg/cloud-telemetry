var medidas;

/*Funcao para realizar requisicao de medidas*/

function medidas_de_host() {
    console.log("Metricas");
    $('#metricas_de_host').empty();
    $('<div id="load_met" style="display:none">    <br><br><center><img src="images/ajax-loader.gif"></img> <br> <h4>Obtendo Métricas. Por favor aguarde.</h4></center></div>').appendTo("#metricas_de_host");
    $("#load_met").show();

    var out = $("input[name='defaultTime']:checked").val();
    var dh1 = $('#data_hora1').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
    var dt1 = new Date(dh1[2], dh1[1], dh1[0], dh1[3], dh1[4]);
    var dh2 = $('#data_hora2').val().replace("/", " ").replace("/", " ").replace(":", " ").split(" ");
    var dt2 = new Date(dh2[2], dh2[1], dh2[0], dh2[3], dh2[4]);
    var vm = $("input[name='defaultVM']:checked").val();
    /*Verificações antes de realizar requisição*/
    var html_m = '<h2>Atenção!</h2><br />';
    //parametro de project não interfere já que só temos um.
    var url_metricas = ip_server + "/host_metrics?project=demo";
    

   
    //requisicao
    
    $.ajax({
        url : url_metricas,
        async : false,
        dataType : 'json',
        success : function(data) {
            $("#load_met").hide();
            medidas = data;
            console.log(data);

        },
        error : function(data) {
            console.log("error");
        }
    });

    //criacao da tabela de maneira dinamica na div metricas_de_host

    var tabela_met = '<table class="table table-bordered"><thead><tr><th>Host</th><th>Total de CPU</th><th>CPU Utilizada</th><th>Memoria Total</th><th>Memoria Utilizada</th><th>Percentual de CPU</th> <th>Percentual de memoria</th></tr></thead><tbody>';
    var rows;
    $.each(medidas, function(k, v) {
    	console.log(medidas[k]);
        rows = '<tr><th>' + k + '</th><th>' + medidas[k]["Total"][0] + '</th><th>' + medidas[k]["Em uso"][0];  
        rows += '</th><th>'+ medidas[k]["Total"][1] + '</th><th>' + medidas[k]["Em uso"][1] + '</th><th>'+ medidas[k]["Percentual"][0] + '</th><th>'+ medidas[k]["Percentual"][1] +'</th></tr>';
        tabela_met += rows;
    });

    tabela_met += '</tbdody></table>';
    $(tabela_met).appendTo('#recomendacoes_up');

}