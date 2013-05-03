var selected_language = "en-US";

function addEnglishMenu(){
	
	var op1 = document.createElement("option");
	op1.value = "en-US";
	op1.innerHTML = "United States";
	
	var op2 = document.createElement("option");
	op2.value = "en-GB";
	op2.innerHTML = "United Kingdom";
	
	var countries = document.getElementById("countries");
	countries.innerHTML = "";
	countries.appendChild( op1 );
	countries.appendChild( op2 );
	
}

function addSpanishMenu(){
	var op1 = document.createElement("option");
	op1.value = "es-ES";
	op1.innerHTML = "Spaña";
	
	var op2 = document.createElement("option");
	op2.value = "es-AR";
	op2.innerHTML = "Argentina";
	
	var countries = document.getElementById("countries");
	countries.innerHTML = "";
	countries.appendChild( op1 );
	countries.appendChild( op2 );
}

function addPortugueseMenu(){
	var op1 = document.createElement("option");
	op1.value = "pt-BR";
	op1.innerHTML = "Brasil";
	
	var op2 = document.createElement("option");
	op2.value = "pt-PT";
	op2.innerHTML = "Portugal";
	
	var countries = document.getElementById("countries");
	countries.innerHTML = "";
	countries.appendChild( op1 );
	countries.appendChild( op2 );
}

function saveLanguage(){
	
	chrome.storage.local.set( { "lang": selected_language } );
	
	var lang = "";
	chrome.storage.local.get("lang", function(result){
		lang = result.lang;
		alert(lang);
	});
}

function initialize(){
	$("#languages").change(
		function () {
			var lang = $(this).val();
			switch( lang ){
				case 'english':
					selected_language = "en-US";
					addEnglishMenu();
					break;
				case 'spanish':
					selected_language = "sp-SP";
					addSpanishMenu();
					break;
				case 'portuguese':
					selected_language = "pt-BR";
					addPortugueseMenu();
					break;
			}
			saveLanguage();
		}
	);
	
	$("#countries").change(
		function () {
			selected_language = $(this).val();
			saveLanguage();
		}
	);
	
}

document.addEventListener( 'DOMContentLoaded', initialize );
