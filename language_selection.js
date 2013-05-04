var options = [];
options['af'] = [{value : 'ZA', innerHTML : '---'}];
options['id'] = [{value : 'ID', innerHTML : '---'}];
options['ms'] = [{value : 'MY', innerHTML : '---'}];
options['ca'] = [{value : 'ES', innerHTML : '---'}];
options['cs'] = [{value : 'CZ', innerHTML : '---'}];
options['de'] = [{value : 'DE', innerHTML : '---'}];
options['en'] = [{value : 'AU', innerHTML : 'Australia'},
                 {value : 'CA', innerHTML : 'Canada'},
                 {value : 'IN', innerHTML : 'India'},
                 {value : 'NZ', innerHTML : 'New Zealand'},
                 {value : 'ZA', innerHTML : 'South Africa'},
                 {value : 'GB', innerHTML : 'United Kingdom'},
                 {value : 'US', innerHTML : 'United States'}
];
options['es'] = [{value : 'AR', innerHTML : 'Argentina'},
                 {value : 'BO', innerHTML : 'Bolivia'},
                 {value : 'CL', innerHTML : 'Chile'},
                 {value : 'CO', innerHTML : 'Colombia'},
                 {value : 'CR', innerHTML : 'Costa Rica'},
                 {value : 'EC', innerHTML : 'Ecuador'},
                 {value : 'SV', innerHTML : 'El Salvador'},
                 {value : 'ES', innerHTML : 'España'},
                 {value : 'US', innerHTML : 'Estados Unidos'},
                 {value : 'GT', innerHTML : 'Guatemala'},
                 {value : 'HN', innerHTML : 'Honduras'},
                 {value : 'MX', innerHTML : 'México'},
                 {value : 'NI', innerHTML : 'Nicaragua'},
                 {value : 'PA', innerHTML : 'Panamá'},
                 {value : 'PY', innerHTML : 'Paraguay'},
                 {value : 'PE', innerHTML : 'Perú'},
                 {value : 'PR', innerHTML : 'Puerto Rico'},
                 {value : 'DO', innerHTML : 'República Dominicana'},
                 {value : 'UY', innerHTML : 'Uruguay'},
                 {value : 'VE', innerHTML : 'Venezuela'}
];
options['eu'] = [{value : 'ES', innerHTML : '---'}];
options['fr'] = [{value : 'FR', innerHTML : '---'}];
options['gl'] = [{value : 'ES', innerHTML : '---'}];
options['hr'] = [{value : 'HR', innerHTML : '---'}];
options['zu'] = [{value : 'ZA', innerHTML : '---'}];
options['is'] = [{value : 'IS', innerHTML : '---'}];
options['it'] = [{value : 'IT', innerHTML : 'Italia'},
                 {value : 'CH', innerHTML : 'Svizzera'}
];
options['hu'] = [{value : 'HU', innerHTML : '---'}];
options['nl'] = [{value : 'NL', innerHTML : '---'}];
options['nb'] = [{value : 'NO', innerHTML : '---'}];
options['pl'] = [{value : 'PL', innerHTML : '---'}];
options['pt'] = [{value : 'BR', innerHTML : 'Brasil'},
                 {value : 'PT', innerHTML : 'Portugal'}
];
options['ro'] = [{value : 'RO', innerHTML : '---'}];
options['sk'] = [{value : 'SK', innerHTML : '---'}];
options['fi'] = [{value : 'FI', innerHTML : '---'}];
options['sv'] = [{value : 'SE', innerHTML : '---'}];
options['tr'] = [{value : 'TR', innerHTML : '---'}];
options['bg'] = [{value : 'BG', innerHTML : '---'}];
options['ru'] = [{value : 'RU', innerHTML : '---'}];
options['sr'] = [{value : 'ESRS', innerHTML : '---'}];

function addMenu(lang, sel_coun) {
	//alert( lang + "-" + sel_coun );
	document.getElementById(lang).selected = 'selected';
	var countries = document.getElementById('countries');
	countries.innerHTML = '';
	for( var i = 0; i < options[lang].length; ++i ){
		var tag_option = document.createElement('option');
		tag_option.value = options[lang][i].value;
		tag_option.innerHTML = options[lang][i].innerHTML;
		if( options[lang][i].value == sel_coun ){
			tag_option.selected = "selected";
		}

		countries.appendChild(tag_option);
	}
}

function saveLanguage(lang, count) {
	chrome.storage.local.set({language: lang, country: count});
}

function saveBeep(value) {
	chrome.storage.local.set({beep: value});
}

function initialize() {
	chrome.storage.local.get(['language', 'country'], function(result) {
		if (result.language && result.country) {
			addMenu(result.language, result.country);
		}
		else {
			saveLanguage('en', 'US');
			addMenu('en', 'US');
		}
	});

	chrome.storage.local.get('beep', function(result) {
		if (result.beep) {
			$('#sound').attr('checked', true);
		}
		else {
			$('#sound').attr('checked', false);
		}
	});

	$('#languages').change(
		function() {
			var lang = $(this).val();
			saveLanguage(lang, options[lang][0].value);
			addMenu(lang, options[lang][0].value);
		}
	);

	$('#countries').change(
		function() {
			var sel_coun = $(this).val();
			chrome.storage.local.get(['language'], function(result) {
 				saveLanguage( result.language, sel_coun );
 				addMenu(result.language, sel_coun);
			});
		}
	);

	$('#sound').change(
		function() {
			saveBeep($('#sound').is(':checked'));
		}
	);
}

document.addEventListener('DOMContentLoaded', initialize);