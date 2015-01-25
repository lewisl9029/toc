Keyboard
======

The `cordova.plugins.Keyboard` object provides functions to make interacting with the keyboard easier, and fires events to indicate that the keyboard will hide/show.

    cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git

Methods
-------

- cordova.plugins.Keyboard.hideKeyboardAccessoryBar
- cordova.plugins.Keyboard.close
- cordova.plugins.Keyboard.disableScroll
- cordova.plugins.Keyboard.show

Properties
--------

- cordova.plugins.Keyboard.isVisible

Events
--------

These events are fired on the window.

- native.keyboardshow
  * A number `keyboardHeight` is given on the event object, which is the pixel height of the keyboard.
- native.keyboardhide

Permissions
-----------

#### config.xml

            <feature name="Keyboard">
                <param name="ios-package" value="IonicKeyboard" onload="true" />
            </feature>


Keyboard.hideKeyboardAccessoryBar
=================

Hide the keyboard accessory bar with the next, previous and done buttons.

    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

Supported Platforms
-------------------

- iOS


Keyboard.close
=================

Close the keyboard if it is open.

    cordova.plugins.Keyboard.close();

Supported Platforms
-------------------

- iOS, Android


Keyboard.disableScroll
=================

Disable native scrolling, useful if you are using JavaScript to scroll

    cordova.plugins.Keyboard.disableScroll(true);
    cordova.plugins.Keyboard.disableScroll(false);

Supported Platforms
-------------------

- iOS

Keyboard.show
=================

Force keyboard to be shown on Android. This typically helps if autofocus on a text element does not pop up the keyboard automatically

    cordova.plugins.Keyboard.show();

Supported Platforms

- Android

native.keyboardshow
=================

This event fires when the keyboard will be shown

    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e){
        alert('Keyboard height is: ' + e.keyboardHeight);
    }

Properties
-----------

keyboardHeight: the height of the keyboard in pixels


Supported Platforms
-------------------

- iOS, Android


native.keyboardhide
=================

This event fires when the keyboard will hide

    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e){
        alert('Goodnight, sweet prince');
    }

Properties
-----------

None

Supported Platforms
-------------------

- iOS, Android
