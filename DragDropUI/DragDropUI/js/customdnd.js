	// target elements with the "draggable" class
interact('.draggable')
  .draggable({
  
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,
	
    // call this function on every dragmove event
    onmove: dragMoveListener
    // call this function on every dragend event
	
  });

 interact('.draggable').dropzone({
	  accept: '.draggable'
  });

  interact('.draggable').resizable({
    preserveAspectRatio: false,
    edges: { left: false, right: true, bottom: true, top: false },
	invert: 'reposition',
	onmove: onResizeMove,
	
	restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    }

  });

  interact('.draggable').preventDefault("notOnInputFields");
  
  interact('.draggable')
  .on(['dragstart'], onDragStart)
  .on(['dragend'], onDragEnd)
  .on(['resizestart'], onResizeStart)
  .on(['resizeend'], onResizeEnd);
