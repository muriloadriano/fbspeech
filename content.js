function hasClass(element, cls) {
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

////////////////////////////////////////////////////////////////////////////////

var fbDockChat;
var chatId = 0;

var chatWindowOpenHandler = function(element) {
	alert('Abriu chat: ' + a.href);
}

var getTextArea = function(element) {
	return element.getElementsByTagName('textarea')[0];
}

var getIconSpot = function(element) {
	return element.getElementsByClassName('_552n')[0];
}

var updateText = function(inputElement, chatId) {
	var txtArea = fbDockChat.getElementById('fbspeech_' + chatId);
	txtArea.value = inputElement.value;
	inputElement.value = '';
	txtArea.focus();
}

var generateIconSpot = function(iconSpot, chatId) {
	var element = document.createElement('input');
	var elementStyle = 'width:15px; height:22px; border:0px; ' +
		'background-color:transparent; float:left;';

	element.setAttribute('style', );
	element.setAttribute('id', 'mic_' + chatId);
	element.setAttribute('x-webkit-speech', '');
	element.addEventListener('webkitspeechchange', function(evt) {
		var txtArea = document.getElementById('fbspeech_' + chatId);
		txtArea.value += evt.results[0].utterance + ' ';
		txtArea.focus();
		txtArea.selectionStart = txtArea.selectionEnd = txtArea.value.length;
		evt.srcElement.value = '';
	});

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

var init = function() {
	fbDockChat = document.getElementById('fbDockChat');

	if (!fbDockChat) {
		setTimeout(init, 500);
		return;
	}

	fbDockChat.addEventListener('DOMNodeInserted', function(event) {
 		updateChatActions();
 	});
}

init();