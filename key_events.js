function hasClass(element, cls) {
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

///////////////////////////////////////////////////////////////////////////////
// Key Events
///////////////////////////////////////////////////////////////////////////////

var dispatchKeyboardEvent = function(target, initKeyboradEventArgs) {
	var e = document.createEvent('KeyboardEvents');
	e.initKeyboardEvent.apply(e, Array.prototype.slice.call(arguments, 1));
	target.dispatchEvent(e);
};

var dispatchTextEvent = function(target, initTextEventArgs) {
	var e = document.createEvent('TextEvent');
	e.initTextEvent.apply(e, Array.prototype.slice.call(arguments, 1));
	target.dispatchEvent(e);
};

var dispatchSimpleEvent = function(target, type, canBubble, cancelable) {
	var e = document.createEvent('Event');
	e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
	target.dispatchEvent(e);
};

var dispatchAKeyEvent = function(element) {
	var canceled = !dispatchKeyboardEvent(element,
		'keydown', true, true,  // type, bubbles, cancelable
		null,  // window
		'h',  // key
		0, // location: 0=standard, 1=left, 2=right, 3=numpad, 4=mobile, 5=joystick
	'');  // space-sparated Shift, Control, Alt, etc.

	dispatchKeyboardEvent(element, 'keypress', true, true, null, 'h', 0, '');

	if (!canceled) {
		if (dispatchTextEvent(element, 'textInput', true, true, null, 'h', 0)) {
			element.value += 'h';
			dispatchSimpleEvent(element, 'input', false, false);
			// not supported in Chrome yet
			// if (element.form) element.form.dispatchFormInput();
			dispatchSimpleEvent(element, 'change', false, false);
			// not supported in Chrome yet
			// if (element.form) element.form.dispatchFormChange();
	 	}
	}
	dispatchKeyboardEvent(element, 'keyup', true, true, null, 'h', 0, '');
};