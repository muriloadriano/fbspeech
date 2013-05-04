var options = [];
options['en'] = {op1 : {value : 'US', innerHTML : 'United States'}, op2 : {value : 'GB', innerHTML : 'United Kingdom'}};
options['es'] = {op1 : {value : 'ES', innerHTML : 'Spaña'},         op2 : {value : 'AR', innerHTML : 'Argentina'}};
options['pt'] = {op1 : {value : 'BR', innerHTML : 'Brasil'},        op2 : {value : 'PT', innerHTML : 'Portugal'}};

function addMenu(lang, sel_coun) {
	var op1 = document.createElement('option');
	op1.value = options[lang].op1.value;
	op1.innerHTML = options[lang].op1.innerHTML;

	var op2 = document.createElement('option');
	op2.value = options[lang].op2.value;
	op2.innerHTML = options[lang].op2.innerHTML;

	if (sel_coun == 'US' || sel_coun == 'ES' || sel_coun == 'BR') {
		op1.selected = 'selected';
	}
	else {
		op2.selected = 'selected';
	}

	document.getElementById(lang).selected = 'selected';

	var countries = document.getElementById('countries');
	countries.innerHTML = '';
	countries.appendChild(op1);
	countries.appendChild(op2);
}

function saveLanguage(lang, count) {
	chrome.storage.local.set({language: lang, country: count});
}

function initialize() {
	chrome.storage.local.get(['language', 'country'], function(result) {
		if (result.language != null && result.country != null) {
			addMenu(result.language, result.country);
		}
		else {
			saveLanguage('en', 'US');
			addMenu('en', 'US');
		}
	});

	$('#languages').change(
		function() {
			var lang = $(this).val();
			switch (lang) {
				case 'en':
					saveLanguage('en', 'US');
					addMenu('en', 'US');
					break;
				case 'es':
					saveLanguage('es', 'ES');
					addMenu('es', 'ES');
					break;
				case 'pt':
					saveLanguage('pt', 'BR');
					addMenu('pt', 'BR');
					break;
			}
		}
	);

	$('#countries').change(
		function() {
			var sel_coun = $(this).val();
			var lang;
			if (sel_coun == 'US' || sel_coun == 'GB') {
				lang = 'en';
			}
			else if (sel_coun == 'ES' || sel_coun == 'AR') {
				lang = 'es';
			}
			else {
				lang = 'pt';
			}

			saveLanguage(lang, sel_coun);
		}
	);
}

$(document).ready(initialize);