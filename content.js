// Helper used to see if an element implements a class
function hasClass(element, cls) {
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

////////////////////////////////////////////////////////////////////////////////
var configs = {};

// This variable holds the container of the chat windows
var fbDockChat;

// Used for giving IDs for the chat windows
var chatId = 0;

var getTextArea = function(element) {
	return element.getElementsByTagName('textarea')[0];
}

var getIconSpot = function(element) {
	return element.getElementsByClassName('_552n')[0];
}

var generateIconSpot = function(iconSpot, chatId) {
	// Creates the microphone input and appends it to the chat DOM

	var txtArea = document.getElementById('fbspeech_' + chatId);

	var element = document.createElement('input');
	var elementStyle = 'width:15px; height:22px; border:0px; ' +
		'background-color:transparent; float:left;';

	element.setAttribute('style', elementStyle);
	element.setAttribute('id', 'mic_' + chatId);
	element.setAttribute('x-webkit-speech', '');
	element.addEventListener('webkitspeechchange', function(evt) {
		txtArea.value += evt.results[0].utterance + ' ';
		txtArea.focus();
		txtArea.selectionStart = txtArea.selectionEnd = txtArea.value.length;
		evt.srcElement.value = '';
	});

	element.onfocus = function() {
		txtArea.focus();
	}

	iconSpot.insertBefore(element, iconSpot.childNodes[0]);
}

var updateChatActions = function() {
	var elms = fbDockChat.getElementsByClassName('fbNubFlyoutFooter _552j');

	for (var i = 0; i < elms.length; ++i) {
		// Tests if this element wasn't changed (tagged) yet by our extension
		if (!hasClass(elms[i], 'fbspeech_tag')) {
			elms[i].className += ' fbspeech_tag';
			chatId++;



			// Make the needed changes to the chat's textarea
			var txt = getTextArea(elms[i]);
			txt.setAttribute('id', 'fbspeech_' + chatId);
			txt.style.width = '92%';

			// Updates the smile container to hold our microphone input icon
			var iconSpot = getIconSpot(elms[i]);
			generateIconSpot(iconSpot, chatId, txt);
		}
	}
}

var loadLanguage = function(){
	chrome.storage.local.get( ['language', 'country'], function(result){
		configs.language = result.language + "-" + result.country;
		//alert( configs.language );
	});
	
}

var loadConfigs = function() {
	loadLanguage();
}

var init = function() {
	fbDockChat = document.getElementById('fbDockChat');

	// If the chat dock wasn't fully loaded, try again in 500 msecs
	if (!fbDockChat) {
		setTimeout(init, 500);
		return;
	}
	
	chrome.storage.onChanged.addListener(
		function( changes, namespace ){
			loadLanguage();
		}
	)
	
	loadConfigs();
	
	// Listens for node insertions on chat dock DOM to search for a new chat
	fbDockChat.addEventListener('DOMNodeInserted', function(event) {
 		updateChatActions();
 	});
}

init();