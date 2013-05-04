// Helper used to see if an element implements a class
function hasClass(element, cls) {
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

////////////////////////////////////////////////////////////////////////////////
// CHAT
////////////////////////////////////////////////////////////////////////////////

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

		// Scroll textarea
		txtArea.scrollTop = txtArea.scrollHeight;
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

////////////////////////////////////////////////////////////////////////////////
// COMMENT
////////////////////////////////////////////////////////////////////////////////

var commentId = 0;

var generateCommentMicInput = function(txtArea, commentId) {
	var element = document.createElement('input');
	var elementStyle = 'width:15px; height:22px; border:0px; ' +
		'background-color:transparent; float:right;';

	element.setAttribute('style', elementStyle);
	element.setAttribute('id', 'mic_comment_' + commentId);
	element.setAttribute('x-webkit-speech', '');
	element.addEventListener('webkitspeechchange', function(evt) {
		if (hasClass(txtArea, 'DOMControl_placeholder')) {
			txtArea.className =
				txtArea.className.replace('DOMControl_placeholder', '');

			txtArea.value = '';
		}

		txtArea.value += evt.results[0].utterance + ' ';
		txtArea.focus();
		txtArea.selectionStart = txtArea.selectionEnd = txtArea.value.length;
		evt.srcElement.value = '';

		// Scroll textarea
		txtArea.scrollTop = txtArea.scrollHeight;
	});

	element.onfocus = function() {
		txtArea.focus();
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
	element.addEventListener('webkitspeechchange', function(evt) {
		var outputSpan = null;

		if (richInput.children) {
			outputSpan = richInput.children[0];

			if (outputSpan && outputSpan.tagName != 'span') {
				outputSpan = null;
			}
		}

		if (!outputSpan) {
			outputSpan = document.createElement('span');
			outputSpan.setAttribute('data-si', 'true');
			richInput.appendChild(outputSpan);
			console.log(outputSpan);
		}

		outputSpan.innerHTML += evt.results[0].utterance + ' ';

		$(richInput).attr('aria-expanded', 'true');
		$(richInput).attr('aria-activedescendant', 'js_47');



		console.log($(outputSpan));
		evt.srcElement.value = '';
	});

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

			if (txtArea.tagName == 'textarea') {
				commentId++;

				txtArea.placeholder = 'Write or click on the mic and ' +
					'start speaking...';
				txtArea.value = txtArea.placeholder;
				txtArea.title = txtArea.value;

				txtArea.setAttribute('title', elms[i].placeholder);
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
				//var inputArea = $('input[name=q]',
				//	$(txtArea.children[0])).get()[0];

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
	fbDockChat = document.getElementById('fbDockChat');

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

 	updateCommentActions();
}

init();