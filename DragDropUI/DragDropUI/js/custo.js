  function onDragStart(event){
	var target = event.target;																																																																																																																																																																																																																														
	x = (parseFloat(target.getAttribute('data-x')) || 0),
    y = (parseFloat(target.getAttribute('data-y')) || 0);
	target.setAttribute('curr_data-x',x);
	target.setAttribute('curr_data-y',y);
	
  }
  
  function onResizeEnd(event){
	var target = event.target;
	if(!onDragEnd(event)){
		
		var curr_width = (parseFloat(target.getAttribute('curr_width')) || 0);
        var curr_height = (parseFloat(target.getAttribute('curr_height')) || 0);
		
		//console.log('target.style.width ='+target.style.width);
		//console.log('target.style.height ='+target.style.height);
		//console.log('target.style.top ='+target.offsetTop);
		//console.log('target.style.left ='+target.offsetLeft);
		
		//console.log('curr_width ='+curr_width);
		//console.log('curr_height ='+curr_height);
		
		target.style.width  = curr_width+'px';
		target.style.height = curr_height+'px';
		
		//console.log('target.style.width ='+target.style.width);
		//console.log('target.style.height ='+target.style.height);
		
		//var x = document.getElementsByClassName("drag-element");
		//var i;
		//for (i = 0; i < x.length; i++) {
			//console.log('x.style.width ='+x[i].offsetWidth);
			//console.log('x.style.height ='+x[i].offsetHeight);
			//console.log('x.style.top ='+x[i].offsetTop);
			//console.log('x.style.left ='+x[i].offsetLeft);
		//}
		
	  var x = (parseFloat(target.getAttribute('data-x')) || 0);
	  var y = (parseFloat(target.getAttribute('data-y')) || 0);

	  translatexy(target,x,y,true);
	  return true;

	}
  }
  
  function onResizeStart(event){
	var target = event.target;
	var curr_width = target.clientWidth;
	var curr_height = target.clientHeight;
	
	
	var x = (parseFloat(target.getAttribute('data-x')) || 0);
    var y = (parseFloat(target.getAttribute('data-y')) || 0);
	target.setAttribute('curr_data-x',x);
	target.setAttribute('curr_data-y',y);
	
	//console.log('onResizeStart curr_width='+curr_width);
	//console.log('onResizeStart curr_height='+curr_height);
	
	target.setAttribute('curr_width',curr_width);
	target.setAttribute('curr_height',curr_height);
  }
  
  function onResizeMove(event) {
    //console.log('----- OnResizeMove ------');
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
	var curr_width = target.style.width;
	var curr_height = target.style.height;
	
	//console.log('main curr_width='+curr_width);
	//console.log('main curr_height='+curr_height);
	
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';
	
	//target.style.width  = '20%';
	//target.style.height = '20%';
	
    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    return translatexy(target,x,y,false);
    //target.textContent = Math.round(event.rect.width) + '�' + Math.round(event.rect.height);

  }
  
  function reAlignAssociatedElement(target){
    var returnFlag = true; 
	var x = (parseFloat(target.getAttribute('data-x'))|| 0);
	var y = (parseFloat(target.getAttribute('data-y'))|| 0);
	var associatedElementName = target.getAttribute("associatedElement");
	if(associatedElementName && target.classList.contains("drag-element")){
		var associatedElement = document.getElementById(associatedElementName);
		if(associatedElement){
		    returnFlag = false;
			var elementX = (parseFloat(associatedElement.getAttribute('data-x'))|| 0);
			var elementY = (parseFloat(associatedElement.getAttribute('data-y'))|| 0);
			
			var relativeElementX = (parseFloat(associatedElement.getAttribute('relative-data-x'))|| 0);
			var relativeElementY = (parseFloat(associatedElement.getAttribute('relative-data-y'))|| 0);
			//console.log('x='+x+' elementX='+elementX+' relativeElementX='+relativeElementX);
			//console.log('y='+y+' elementY='+elementY+' relativeElementY='+relativeElementY);
			
			if(translatexy(associatedElement,(x+elementX-relativeElementX),(y+elementY-relativeElementY),false)){
				associatedElement.setAttribute('relative-data-x', x);
				associatedElement.setAttribute('relative-data-y', y);	
				returnFlag = true;
			}			
		}
	}
	return returnFlag;;
  }
  
  function reAlign(target){
    var pixelsize=18;
	var containerX = parseFloat(document.getElementById("live-demo").offsetLeft);
	var containerY = parseFloat(document.getElementById("live-demo").offsetTop);
	
	var x = (parseFloat(target.offsetLeft) + parseFloat(target.getAttribute('data-x')) - containerX);
	var y = (parseFloat(target.offsetTop) + parseFloat(target.getAttribute('data-y')) - containerY);
	
	var deltax =(Math.floor((x/pixelsize)+0.5)*pixelsize)-x;	
	var deltay=(Math.floor((y/pixelsize)+0.5)*pixelsize)-y;
	
	var curr_x = (parseFloat(target.getAttribute('data-x'))|| 0);
	var curr_y = (parseFloat(target.getAttribute('data-y'))|| 0);
	
	//console.log(" x ="+ x +" deltax=" +deltax + " curr_x="+curr_x);
	//console.log(" y ="+ y +" deltay=" +deltay + "curr_y="+curr_y);
	return translatexy(target,(deltax+curr_x),(deltay+curr_y),true);	
  }
  
  function translatexy(target,x,y,roundoff){
    //console.info(' Translate element '+target.id+' to x='+x+' y ='+y);
	
	var containerX1 = parseFloat(document.getElementById("live-demo").offsetLeft);
	var containerX2 = (parseFloat(document.getElementById("live-demo").offsetWidth) + parseFloat(document.getElementById("live-demo").offsetLeft));
	
	var containerY1 = parseFloat(document.getElementById("live-demo").offsetTop);
	var containerY2 = (parseFloat(document.getElementById("live-demo").offsetHeight) + parseFloat(document.getElementById("live-demo").offsetTop));
	
	var elementX1 = target.offsetLeft + x;
	var elementX2 = target.offsetLeft + target.offsetWidth + x;
	
	var elementY1 = target.offsetTop + y;
	var elementY2 = target.offsetTop + target.offsetHeight + y;
	
	//console.log('containerX1 ='+containerX1+' containerX2='+containerX2 + ' containerY1='+containerY1+' containerY2='+containerY2);
	//console.log('elementX1 ='+elementX1+' elementX2='+elementX2+' elementY1='+elementY1+' elementY2='+elementY2);
	
	if(!(elementX1 < containerX1 || elementX2 > containerX2 || elementY1 < containerY1 || elementY2 > containerY2)){
		target.style.webkitTransform = target.style.transform =
		  'translate(' + x + 'px,' + y + 'px)';
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
		target.setAttribute('data-curr-x', x);
		target.setAttribute('data-curr-y', y);
		
		//console.log('Translated the element');
		return true;
	}
	return false;
  }
  
  function onDragEnd(event) {
	  //console.log('Inside onDragEndListner');
      //alert("clientX ="+event.clientX+ "  clientX0 ="+event.clientX0+" clientY ="+event.clientY + " clientY0 ="+event.clientY0+" dx ="+event.dx+" dy ="+event.dy+" pageX ="+event.pageX+" pageY ="+event.pageY+" x0 ="+event.x0+" y0 ="+event.y0);
	  var checkForNextElement = true;
	  var curr_target = event.target;
	  var currentElement = event.interaction.matchElements[0];
	  var curr_x1 =(parseFloat(currentElement.offsetLeft) + parseFloat((currentElement.getAttribute('data-x'))|| 0));
	  var curr_y1 = (parseFloat(currentElement.offsetTop) + parseFloat((currentElement.getAttribute('data-y'))|| 0));
	  
	  var curr_x2=curr_x1+parseFloat(currentElement.clientWidth);
	  var curr_y2=curr_y1+parseFloat(currentElement.clientHeight);
	  
	  var curr_index = parseFloat(currentElement.id.split('-')[1]);
	  
	  var prev_index = curr_index - 1;
	  
	  var next_index = curr_index + 1;
	  
	  //var prevElement = $('drag-'+prev_index);
	  //var nextElement = $('drag-'+next_index);
	  
	  var prevElement = document.getElementById('drag-'+prev_index);
	  var nextElement = document.getElementById('drag-'+next_index);
	  
	  var curr_data_x = (parseFloat(curr_target.getAttribute('curr_data-x')) || 0);
      var curr_data_y = (parseFloat(curr_target.getAttribute('curr_data-y')) || 0);
	  
	  while(prevElement){
		var prev_x1 =parseFloat(prevElement.offsetLeft);
		if(prevElement.attributes['data-x']){
			prev_x1 =(parseFloat(prevElement.offsetLeft) + (parseFloat(prevElement.getAttribute('data-x'))|| 0));
		}
		
		var prev_y1 = parseFloat(prevElement.offsetTop);
		if(prevElement.attributes['data-y']){
			prev_y1 = (parseFloat(prevElement.offsetTop) + (parseFloat(prevElement.getAttribute('data-y'))|| 0));
		}
		
	  
	    var prev_x2=prev_x1+parseFloat(prevElement.clientWidth);
	    var prev_y2=prev_y1+parseFloat(prevElement.clientHeight);
	  
	  
		if(!((curr_x1>=prev_x2 || curr_y1 >= prev_y2 ) && (curr_y1 >= prev_y1))){
			//alert('Invalid Selection wrt to previous elements'+' curr_x1 ='+curr_x1+' prev_x2='+prev_x2+' curr_y1='+curr_y1+' prev_y2='+prev_y2+' prev_y1='+prev_y1);
			checkForNextElement = false;
				
			translatexy(curr_target,curr_data_x,curr_data_y,false);
			
			return false;
		}
		prev_index = prev_index - 1;
		//prevElement = $('drag-'+prev_index);
		prevElement = document.getElementById('drag-'+prev_index);
	  }
	  
	  	
	  while(checkForNextElement && nextElement){
			var next_x1 =parseFloat(nextElement.offsetLeft);
		if(nextElement.attributes['data-x']){
			next_x1 =(parseFloat(nextElement.offsetLeft) + (parseFloat(nextElement.getAttribute('data-x'))|| 0));
		}
		
		var next_y1 = parseFloat(nextElement.offsetTop);
		if(nextElement.attributes['data-y']){
			next_y1 = (parseFloat(nextElement.offsetTop) + (parseFloat(nextElement.getAttribute('data-y'))|| 0));
		}
		
	  
	    var next_x2=next_x1+parseFloat(nextElement.clientWidth);
	    var next_y2=next_y1+parseFloat(nextElement.clientHeight);
		
		if(!((curr_x2<=next_x1 || curr_y2 <= next_y1 ) && (curr_y1 <= next_y1))){
			//alert('Invalid Selection wrt to next elements'+' curr_x2 ='+curr_x2+' next_x1 ='+next_x1+' curr_y2='+curr_y2+' next_y1='+next_y1+' curr_y1='+curr_y1+' next_y1='+next_y1);
			translatexy(curr_target,curr_data_x,curr_data_y,false);
			return false;
		}
		next_index = next_index + 1;
		//nextElement = $('drag-'+next_index);
		nextElement = document.getElementById('drag-'+next_index);
	  }
	  
	  //var new_x=(Math.floor((()/20)+0.5)*20);
	  //var new_y=(Math.floor((()/20)+0.5)*20);

	  //curr_target.style.webkitTransform =
	 // curr_target.style.transform =
     // 'translate(' + new_x + 'px, ' + new_y + 'px)';
	  
	  if(curr_target.classList.contains("drag-newspacer")){
		 addSpacerForAllNodes(curr_target);
	  }
	  
	  //Check for label elements 
	  if(curr_target.classList.contains("drag-label")){
		var associatedElementName = curr_target.getAttribute("associatedElement");
		if(associatedElementName){
			var associatedElement = document.getElementById(associatedElementName);
			if(associatedElement){
				var elementX1 =(parseFloat(associatedElement.offsetLeft) + (parseFloat(associatedElement.getAttribute('data-x'))|| 0));
				var elementX2 = elementX1+parseFloat(associatedElement.clientWidth);
				var elementY1 =(parseFloat(associatedElement.offsetTop) + (parseFloat(associatedElement.getAttribute('data-y'))|| 0));
				var elementY2 = elementY1+parseFloat(associatedElement.clientHeight);
				
				
				//var curr_x1 =(parseFloat(currentElement.offsetLeft) + parseFloat(currentElement.getAttribute('data-x')));
			    //var curr_y1 = (parseFloat(currentElement.offsetTop) + parseFloat(currentElement.getAttribute('data-y')));
			  
			    //var curr_x2=curr_x1+parseFloat(currentElement.clientWidth);
			    //var curr_y2=curr_y1+parseFloat(currentElement.clientHeight);
				
				if(!(((curr_y1 >= elementY1) && (curr_y2 < elementY2) && (curr_x2 +9 ) < elementX1  ) || ((curr_x1 >= elementX1) && (curr_x1 < (elementX1 + 9)) && (curr_x2 < elementX2) && (curr_y2 + 9) < elementY1))){
					translatexy(curr_target,curr_data_x,curr_data_y,false);
					return false;
					//console.log('Label position is not correct');	
				}
			}
		}		
		 
	  }
	  
	  //var x = (parseFloat(curr_target.getAttribute('data-x')) || 0);
	  //var y = (parseFloat(curr_target.getAttribute('data-y')) || 0);

	  
	  //setTimeout(translatexy(curr_target,x,y,true),100000);
	  if(reAlign(curr_target)){
		if(!reAlignAssociatedElement(curr_target)){
			translatexy(curr_target,curr_data_x,curr_data_y,false);
			return false;	
		}
	  }
	  return true;
    }
	
	
  function dragMoveListener (event) {
    var target = event.target;
        // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	curr_x = (parseFloat(target.getAttribute('data-x')) || 0);
    curr_y = (parseFloat(target.getAttribute('data-y')) || 0);

	//console.log(" new x:"+x+" y:"+y);
	//console.log(" new position x:"+(parseFloat(target.offsetLeft) + curr_x) + " y:"+(parseFloat(target.offsetTop) + curr_y) );
	//console.log(" final position x:"+(Math.floor(((parseFloat(target.offsetLeft) + curr_x)/20)+0.5)*20) + " y:"+(Math.floor(((parseFloat(target.offsetTop) + curr_y)/20)+0.5)*20) );
	//console.log();
	
	//console.log("final position x:"+x+" y:"+y);
	//console.log(((parseFloat(target.offsetLeft) + curr_x)/(parseFloat(document.getElementById("live-demo").offsetWidth) + parseFloat(document.getElementById("live-demo").offsetLeft)))*100);
	//console.log(((parseFloat(target.offsetTop) + curr_y)/(parseFloat(document.getElementById("live-demo").offsetHeight) + parseFloat(document.getElementById("live-demo").offsetTop)))*100);
    // translate the element
	//console.log('Inside dragMoveListner');
	translatexy(target,x,y,false);
	//translatexy(target,x,y,true);
	
    // update the posiion attributes
	target.setAttribute('data-curr-x', curr_x);
    target.setAttribute('data-curr-y', curr_y);
    
  }

  function removeLabelContainer(element,shiftElements){
	var r = confirm("Do you want to delete this text label ="+element.id);
	if(r == true){
		deleteLabelContainer(element,shiftElements)
	}
  }
  
  function deleteLabelContainer(element,shiftElements){
	
	if(element.classList.contains("drag-newspacer")){
		var spacerElement = element;
		var childNodes = document.getElementById("live-demo").childNodes;
		var dy = spacerElement.clientHeight;
		var range_dy = (parseFloat(spacerElement.offsetTop) + (parseFloat(spacerElement.getAttribute('data-y')|| 0)));
		if(shiftElements){
			for(var i=0; i<childNodes.length; i+=1) {
				if(childNodes[i].id){
					var target = childNodes[i];
					if(target.classList.contains("drag-element") || target.classList.contains("drag-newimage")|| target.classList.contains("drag-newlabel")){
						var x = (parseFloat(target.getAttribute('data-x')) || 0);
						var y = (parseFloat(target.getAttribute('data-y')) || 0);
						var y0 = (parseFloat(target.offsetTop) + (parseFloat(target.getAttribute('data-y')|| 0)));
						var y1 = (parseFloat(target.offsetTop) + (parseFloat(target.getAttribute('data-y')|| 0)) + parseFloat(target.clientHeight));
						
						//console.log('Element Id ='+childNodes[i].id + ' y0='+y0 + ' y1='+y1+' dy0='+range_dy+' dy1 ='+(range_dy+dy));
						if(y0 >=(range_dy+dy)){
							y = y - dy;
							translatexy(target,x,y,false);
							
							reAlignAssociatedElement(target);	
							
							reAlign(target);	
						}
					}
				}
			}
		}
	}   
	element.remove();
  }
  
  function getRandomId(){
	return Math.floor((Math.random() * 1000000) + 1);
  }
  
  function addSpacer(){
	var randomId = getRandomId();
	var mainContainer = document.createElement("div");
	var para = document.createElement("div");
	
	var imageNode = document.createElement("img");
	imageNode.setAttribute("id","drag-img-"+randomId);
	imageNode.classList.add("remove-img");
	imageNode.setAttribute("align","right");
	imageNode.onclick=function() { removeLabelContainer(mainContainer,true); };
	
	var imageFixNode = document.createElement("img");
	imageFixNode.setAttribute("id","drag-fiximg-"+randomId);
	imageFixNode.classList.add("remove-img");
	imageFixNode.onclick=function() { removeLabelContainer(mainContainer,false); };
	
	para.appendChild(imageNode);
	para.appendChild(imageFixNode);
	mainContainer.appendChild(para);
	
	
	mainContainer.setAttribute("id","drag-spacer-"+randomId);
	
	
	mainContainer.classList.add("draggable");
	mainContainer.classList.add("drag-newspacer");
	
	var element = document.getElementById("live-demo");
	var marginWidth = (element.offsetWidth*0.2);
	mainContainer.style.width = (element.offsetWidth-marginWidth) +"px";
	element.appendChild(mainContainer);
	
  }
  
  function save(){
	//var element = document.getElementById("live-demo");
	var childNodes = document.getElementById("live-demo").childNodes;
		for(var i=0; i<childNodes.length; i+=1) {
			if(childNodes[i].id){
				var target = childNodes[i];
				
			}
		}
  }
  
  function addTextBox(){
	var randomId = Math.floor((Math.random() * 10000) + 1)
	var mainContainer = document.createElement("div");
	var para = document.createElement("div");
	
	var node = document.createElement("input");
	node.setAttribute("type","textbox");
	node.setAttribute("value","Input Text");
	node.setAttribute("id","drag-textlabel-"+randomId);
	
	
	var imageNode = document.createElement("img");
	imageNode.setAttribute("id","drag-img-"+randomId);
	imageNode.classList.add("remove-img");
	imageNode.onclick=function() { removeLabelContainer(mainContainer,true); };
	para.appendChild(node);
	
	para.appendChild(imageNode);
	mainContainer.appendChild(para);
	
	
	mainContainer.setAttribute("id","drag-textbox-"+randomId);
	mainContainer.classList.add("draggable");
	mainContainer.classList.add("drag-newlabel");
	
	var element = document.getElementById("live-demo");
	element.appendChild(mainContainer);
	
  }
  
  function addLabel(){
		var randomId = Math.floor((Math.random() * 10000) + 1)
		var mainContainer = document.createElement("div");
	
		var imageNode = document.createElement("img");
		imageNode.setAttribute("id","drag-img-"+randomId);
		imageNode.classList.add("remove-img");
		imageNode.onclick=function() { removeLabelContainer(mainContainer,true); };		
		mainContainer.appendChild(imageNode);
		
		mainContainer.setAttribute("id","drag-label-"+randomId);
		mainContainer.setAttribute("contenteditable","true");
		mainContainer.classList.add("draggable");
		mainContainer.classList.add("drag-label");
		mainContainer.classList.add("context-menu-input1");
		mainContainer.classList.add("menu-1");
		
		var element = document.getElementById("live-demo");
		element.appendChild(mainContainer);
		
  }
  
  function addTextArea(){
		var randomId = Math.floor((Math.random() * 10000) + 1)
		var mainContainer = document.createElement("div");
		
		var imageNode = document.createElement("img");
		imageNode.setAttribute("id","drag-img-"+randomId);
		imageNode.classList.add("remove-img");
		imageNode.onclick=function() { removeLabelContainer(mainContainer,true); };		
		mainContainer.appendChild(imageNode);
		
		mainContainer.setAttribute("id","drag-element-"+randomId);
		mainContainer.setAttribute("contenteditable","true");
		mainContainer.classList.add("draggable");
		mainContainer.classList.add("drag-element");
		mainContainer.classList.add("context-menu-input1");
		mainContainer.classList.add("menu-1");
		
		var element = document.getElementById("live-demo");
		element.appendChild(mainContainer);
		
  }
  
  function addTable(){
  	var noCols = $("#noOfCols").val();
  	var randomId = Math.floor((Math.random() * 10000) + 1);
  	var mainContainer = document.createElement("div");
	
	var tableNode = document.createElement("table");
	var imageNode = document.createElement("img");
	imageNode.setAttribute("id","drag-img-"+randomId);
	imageNode.classList.add("remove-img");
	imageNode.onclick=function() { removeLabelContainer(mainContainer,true); };		
	mainContainer.appendChild(imageNode);
	//mainContainer.classList.add("dragdiv");
	mainContainer.classList.add("allItems");
	mainContainer.setAttribute("id","drag-element-"+randomId);
	

	tableNode.border = '1px';
	tableNode.cellspacing = '0';

    var tableBody = document.createElement('TBODY');
    tableNode.appendChild(tableBody);

    for (var i = 0; i < 2; i++) {
    	console.log("noOfCols " + noCols);
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < noCols; j++) {
            var th = document.createElement('TH');
            th.classList.add("context-menu-input1");
            tr.appendChild(th);
        }
    }
	
	tableNode.classList.add("classDataTable");
	mainContainer.appendChild(tableNode);
	var element = document.getElementById("maindiv");
	element.appendChild(mainContainer);
	
  }
  
  function previewFile(fileElement,imageElement){
       var preview = imageElement; //selects the query named img`
       var file    = fileElement.files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
       }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
  }
  
  function addSpacerForAllNodes(spacerElement){
  
  var childNodes = document.getElementById("live-demo").childNodes;
  var dy = spacerElement.clientHeight;
  var range_dy = (parseFloat(spacerElement.offsetTop) + (parseFloat(spacerElement.getAttribute('data-y')|| 0)));
  var updateFlag = false;
  
  for(var i=0; i<childNodes.length; i+=1) {
    if(childNodes[i].id){
		var target = childNodes[i];
		if(target.classList.contains("drag-element") || target.classList.contains("drag-newimage")|| target.classList.contains("drag-newlabel")){
			var x = (parseFloat(target.getAttribute('data-x')) || 0);
			var y = (parseFloat(target.getAttribute('data-y')) || 0);
			var y0 = (parseFloat(target.offsetTop) + (parseFloat(target.getAttribute('data-y')|| 0)));
			var y1 = (parseFloat(target.offsetTop) + (parseFloat(target.getAttribute('data-y')|| 0)) + parseFloat(target.clientHeight));
			
			if((y0 <= range_dy && y1 >= range_dy) || (y0 >= (range_dy) && y0 <= (range_dy+dy))){
				updateFlag = true;
				break;	
			}
		}
	}
  }
  
  if(updateFlag){
	 for(var i=0; i<childNodes.length; i+=1) {
		if(childNodes[i].id){
			var target = childNodes[i];
			if(target.classList.contains("drag-element") || target.classList.contains("drag-newimage")|| target.classList.contains("drag-newlabel")){
				var x = (parseFloat(target.getAttribute('data-x')) || 0);
				var y = (parseFloat(target.getAttribute('data-y')) || 0);
				var y0 = (parseFloat(target.offsetTop) + (parseFloat(target.getAttribute('data-y')|| 0)));
				var y1 = (parseFloat(target.offsetTop) + (parseFloat(target.getAttribute('data-y')|| 0)) + parseFloat(target.clientHeight));
				
				console.log('Element Id ='+childNodes[i].id + ' y0='+y0 + ' y1='+y1+' dy0='+range_dy+' dy1 ='+(range_dy+dy));
				if((y0 <= range_dy && y1 >= range_dy) || (y0 >= (range_dy) && y0 <= (range_dy+dy)) || y0 >=(range_dy+dy)){
					y = y + dy;
					translatexy(target,x,y,false);
					
					reAlignAssociatedElement(target);	
					
					reAlign(target);	
				}
			}
		  }
		}
	 }
  }
  
  function addImageBox(){
	var randomId = Math.floor((Math.random() * 10000) + 1)
	var mainContainer = document.createElement("div");
	var para = document.createElement("div");
	var node = document.createElement("input");
	node.setAttribute("type","file");
	node.setAttribute("id","drag-imagelabel-"+randomId);
	
	
	var imagePreviewNode = document.createElement("img");
	node.onchange=function() { previewFile(node,imagePreviewNode); };
	
	imagePreviewNode.setAttribute("id","drag-previewimg-"+randomId);
	imagePreviewNode.setAttribute("height","60%");
	imagePreviewNode.setAttribute("width","95%");
	
	
	var imageNode = document.createElement("img");
	imageNode.setAttribute("id","drag-img-"+randomId);
	imageNode.classList.add("remove-img");
	imageNode.onclick=function() { removeLabelContainer(mainContainer,true); };
	
	
	para.appendChild(node);
	para.appendChild(imagePreviewNode);
	para.appendChild(imageNode);
	mainContainer.appendChild(para);
	
	
	mainContainer.setAttribute("id","drag-imagebox-"+randomId);
	mainContainer.classList.add("draggable");
	mainContainer.classList.add("drag-newimage");
	
	var element = document.getElementById("live-demo")
	element.appendChild(mainContainer)
	
  }
