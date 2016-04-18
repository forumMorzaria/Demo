//
//
// Problem Statement
//
// The interact.js (1.2.2) library (https://github.com/taye/interact.js) does not work well with draggable input fields such
// as input text, textarea and div.contentEditable.  When the user clicks the input element, nothing happens.
//
// Desired Outcome:
//
// When an input,textarea, div.contentEditable is made draggable, the user should still be able to place the cursor at a desired location
// with a single click. 
//
// Investigation: 
//
// Interact.js draggable intercepts pointer mousedown (click) events and therefore 
// does not allow focus to be set on an input textbox, textarea, div.contentEditable
//
// Solution:
// 
// Add a new option value for 'preventDefault' that changes the behaviour when mousedown is handled via checkAndPreventDefault
//
// In the example below, a new option preventDefault='notOnInputFields' is available and if an element is an input, textarea, or
// div.contentEditable, then element.preventDefault() is not called and allows the click event to propagate upwards.
//
// Once the patch is applied, simply pass in 'preventDefault': 'notOnInputFields' to get the expected behaviour.
//

/** interact.js **/
/** ... **/
/* Change Interactable.preventDefault to the following: */
preventDefault: function (newValue) {
    // Allow notOnInputFields option
    if (/^(always|never|auto|notOnInputFields)$/.test(newValue)) {
        this.options.preventDefault = newValue;
        return this;
    }

    if (isBool(newValue)) {
        this.options.preventDefault = newValue? 'always' : 'never';
        return this;
    }

    return this.options.preventDefault;
},
/** ... **/
/* Change checkAndPreventDefault to the following: */
checkAndPreventDefault: function (event, interactable, element) {
  if (!(interactable = interactable || this.target)) { return; }

  var options = interactable.options,
      prevent = options.preventDefault;

  /**
   *  Added by @atteeela to allow interact.js to work nicely with input fields
   */
  // Only prevent default on non input, textarea, and div.contentEditable elements
  // Test element to ensure it is not an input, textarea or a div with
  // contentEditable set to true
  if (prevent === 'notOnInputFields' && element &&
     /^input$|^textarea$/i.test(element.nodeName) ||
     (/^div$/i.test(element.nodeName) && element.contentEditable == true)) {
     return;
  }
  
  if (prevent === 'auto' && element && !/^input$|^textarea$/i.test(element.nodeName)) {
      // do not preventDefault on pointerdown if the prepared action is a drag
      // and dragging can only start from a certain direction - this allows
      // a touch to pan the viewport if a drag isn't in the right direction
      if (/down|start/i.test(event.type)
          && this.prepared.name === 'drag' && options.drag.axis !== 'xy') {

          return;
      }

      event.preventDefault();
      return;
  }

  if (prevent === 'always') {
      event.preventDefault();
      return;
  }

},
/** rest of interact.js **/

 