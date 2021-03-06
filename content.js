function hasClass(element, cls) {
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

////////////////////////////////////////////////////////////////////////////////
// CHAT
////////////////////////////////////////////////////////////////////////////////
var configs = {};

// This variable holds the container of the chat windows
var fbDockChat;

// Used for giving IDs for the chat windows
var chatId = 0;

// A function that will play a beep if desired
var fbBeep = function () {};

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
	element.setAttribute('lang', configs.language);
	element.className += 'fbspeech_input';

	element.addEventListener('webkitspeechchange', function(evt) {
		if (txtArea.value.length == 0) {
			txtArea.value += capitaliseFirstLetter(evt.results[0].utterance) + ' ';
		}
		else {
			txtArea.value += evt.results[0].utterance + ' ';
		}

		txtArea.focus();
		txtArea.selectionStart = txtArea.selectionEnd = txtArea.value.length;
		evt.srcElement.value = '';

		// Scroll textarea
		txtArea.scrollTop = txtArea.scrollHeight;

		// Dispath a key event in text area
		dispatchAKeyEvent(txtArea);
	});

	element.onfocus = function() {
		fbBeep();
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

var loadLanguage = function() {
	chrome.storage.local.get(['language', 'country'], function(result) {
		configs.language = result.language + '-' + result.country;
		$('.fbspeech_input').attr('lang', configs.language);
	});
};

var loadConfigs = function() {
	chrome.storage.local.get('beep', function(result) {
		if (result.beep) {
			fbBeep = function() {
				var elm = document.getElementById('fbspeech_audio');
				elm.play();
			};
		}
		else {
			fbBeep = function() {};
		}
	});

	loadLanguage();
};

////////////////////////////////////////////////////////////////////////////////
// COMMENT
////////////////////////////////////////////////////////////////////////////////

var commentId = 0;

var generateCommentMicInput = function(txtArea, commentId) {
	var element = document.createElement('input');
	var elementStyle = 'width:15px; height:16px; border:0px; ' +
		'background-color:transparent; float:right;';

	element.setAttribute('style', elementStyle);
	element.setAttribute('id', 'mic_comment_' + commentId);
	element.setAttribute('x-webkit-speech', '');
	element.setAttribute('lang', configs.language);
	element.className += 'fbspeech_input';

	element.addEventListener('webkitspeechchange', function(evt) {
		if (hasClass(txtArea, 'DOMControl_placeholder')) {
			txtArea.className =
				txtArea.className.replace('DOMControl_placeholder', '');

			txtArea.value = '';
		}

		if (txtArea.value.length == 0) {
			txtArea.value += capitaliseFirstLetter(evt.results[0].utterance) + ' ';
		}
		else {
			txtArea.value += evt.results[0].utterance + ' ';
		}

		txtArea.focus();
		txtArea.selectionStart = txtArea.selectionEnd = txtArea.value.length;
		evt.srcElement.value = '';

		// Scroll textarea
		txtArea.scrollTop = txtArea.scrollHeight;

		dispatchAKeyEvent(txtArea);
	});

	element.onfocus = function() {
		txtArea.focus();
		fbBeep();
	}

	return element;
}

var generateGraphSearchMicInput = function(richInput) {
	var element = document.createElement('input');
	var elementStyle = 'width:15px; margin:auto 8px; height:30px; border:0px; '
		+ 'background-color:transparent; float:right;';

	element.setAttribute('style', elementStyle);
	element.setAttribute('id', 'mic_comment_' + commentId);
	element.setAttribute('x-webkit-speech', '');
	element.setAttribute('lang', configs.language);
	element.className += 'fbspeech_input';

	element.addEventListener('webkitspeechchange', function(evt) {
		$(richInput).html('');

		outputSpan = document.createElement('span');
		outputSpan.setAttribute('data-si', 'true');
		richInput.appendChild(outputSpan);

		outputSpan.innerHTML = capitaliseFirstLetter(evt.results[0].utterance);

		$(richInput).attr('aria-expanded', 'true');
		$(richInput).attr('aria-activedescendant', 'js_47');

		dispatchAKeyEvent(richInput);

		evt.srcElement.value = '';
	});

	element.onfocus = function() {
		fbBeep();
	}

	return element;
}

var updateCommentActions = function() {
	var elms = document.getElementsByClassName('innerWrap');

	for (var i = 0; i < elms.length; ++i) {
		if (!hasClass(elms[i], 'fbspeech_tag')) {
			elms[i].className += ' fbspeech_tag';

			// Get the comment area
			var txtArea = elms[i].children[0];

			if (hasClass(txtArea, 'inputsearch')) {
				// @TODO(muriloadriano): add support for search textarea
				continue;
			}

			if (txtArea.tagName == 'TEXTAREA') {
				commentId++;

				txtArea.placeholder = 'Write or click on the mic and ' +
					'start speaking...';
				txtArea.value = txtArea.placeholder;
				txtArea.title = txtArea.value;

				txtArea.setAttribute('title', txtArea.value);
				txtArea.style.width = '92%';
				txtArea.style.float = 'left';

				var micInput = generateCommentMicInput(txtArea, commentId);
				// Append the mic input node to the DOM
				elms[i].appendChild(micInput);
			}
			else {
				// Graph Search input
				var richInput = $('.structuredRich:first', $(elms[i])).get();
					//elms[i].getElementsByClassName('structuredRich')[0];

				if (!richInput.length) return;

				richInput = richInput[0];
				var placeholder = $('.structuredPlaceholder', $(elms[i])).get();
				placeholder[0].innerHTML =
					'Type or speak out to search for people, places and things';

				var micInput = generateGraphSearchMicInput(richInput);

				if (txtArea.children[0]) {
					txtArea.children[0].style.width = '95%';
				}

				$(txtArea).prepend(micInput);
			}
		}
	}
}

var init = function() {
	fbDockChat = document.getElementById('ChatTabsPagelet');

	// If the chat dock wasn't fully loaded, try again in 500 msecs
	if (!fbDockChat) {
		setTimeout(init, 500);
		return;
	}

	// Listens for node insertions on chat dock DOM to search for a new chat
	fbDockChat.addEventListener('DOMNodeInserted', function(event) {
		updateChatActions();
	});

	document.addEventListener('DOMNodeInserted', function(event) {
		updateCommentActions();
	});

	// Initializes all comment fields with mics
	updateCommentActions();

	// Put the microphone in the chat windows already opened
	updateChatActions();

	// Update the language attribute of all speech inputs
	chrome.storage.onChanged.addListener(
		function(changes, namespace) {
			loadConfigs();
			$('.fbspeech_input').attr('lang', configs.language);
		}
	);

	var audioElement = document.createElement('audio');
	audioElement.setAttribute('src', 'http://students.ic.unicamp.br/~ra134072/beep.mp3');
	audioElement.setAttribute('preload', 'auto');
	audioElement.setAttribute('id', 'fbspeech_audio');
	audioElement.load();

	// Adds our beep element
	document.body.appendChild(audioElement);

	// Initialize the selected language
	loadConfigs();
}

$(document).ready(init);