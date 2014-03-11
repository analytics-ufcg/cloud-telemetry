function criaCookie(chave, value) {
	var valor = formattedDate(new Date(), 0);
	var expira = new Date();
	expira.setTime(expira.getTime() + 25375000000);
	var ck = ""+ chave + '=' + valor + ';expires=' + expira.toUTCString() + "";
	document.cookie = ck;
}

function lerCookie(chave) {
	var ChaveValor = document.cookie.match('(^|;) ?' + chave + '=([^;]*)(;|$)');
	return ChaveValor ? ChaveValor[2] : null;

}

function checkCokie(name) {
	if (lerCookie(name) != "") {
		ultimo_acesso = lerCookie(name);
		criaCookie(name, new Date());
	} else {
		criaCookie(name, new Date());
	}
}