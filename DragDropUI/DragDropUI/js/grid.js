
// JSGrid Version 1.2: developed by Dr. Nasir Darwish (KFUPM), released on Nov. 4, 2013
 
var $gridStyle = "div#gridForm { z-index:21; color:black;padding:2px;margin:0;font-size:11pt;font-family:Tahoma;position:fixed; right:0; top:0; " +
          "background:lightgray; border:1px solid gray; border-top:0;border-right:0;width:90px; height:90px;} " +
          "div#gridForm input {font-size: 10pt; margin:3px; color:black;} " +
          "div#gridForm input[type=text] { width:30px; padding-left:2px; } "  +
          "div#gridForm input[type=button] { padding:6px; margin:8px;border:1px solid gray } " +
         "div#grid { z-index:20; font-size:3pt; position:absolute; left:-1px; top:-1px; background:transparent; padding:0;margin:0;  } " +
         "div#grid table { font-size:0.8em; border-collapse: collapse; border-spacing:0; padding:0;margin:0; table-layout:fixed; } " +
         "div#grid table td { border:1px solid gray; margin:0; padding:0; -moz-box-sizing:border-box; box-sizing:border-box;}" ;
        
var $gridFormHTML = "Height <input type='text' id='cellHeight' value='18' />" + 
           "Width&nbsp;&nbsp;<input type='text' id='cellWidth' value='18' />" +
           "<input type='button' onclick='createGrid()' value='Set Grid' />"

function createGrid()
{  
   var gridForm = document.getElementById("gridForm");  

   if (gridForm ==null) // Initialization
   {  var formdiv = document.createElement("div");
      formdiv.id = 'gridForm';
      formdiv.innerHTML = $gridFormHTML;
      var docbody = document.body;
      docbody.insertBefore(formdiv, docbody.firstChild);

      var griddiv = document.createElement("div");
      griddiv.id = 'grid';
      griddiv.innerHTML = "<table id='gridTable' ></table>";
      docbody.insertBefore(griddiv, docbody.firstChild);
 
     var gridst = document.createElement("style");
     gridst.id = 'gridstyle';
     gridst.innerHTML = $gridStyle;
    
     var gridExt = document.createElement("style");
     gridExt.id = 'gridExtra';
     document.head.appendChild(gridExt); 
     document.head.appendChild(gridst); 
   }
 
    var cellWidth = parseInt(document.getElementById("cellWidth").value); 
    var cellHeight =  parseInt(document.getElementById("cellHeight").value);  
 
    var griddiv = document.getElementById("grid");

    if ((cellWidth==0) && (cellHeight==0)) 
    { griddiv.style.display = "none"; setCanvas(); return; }

    griddiv.style.display ="block"; 
    griddiv.style.width = window.innerWidth + "px";
    // griddiv.style.height = window.innerHeight + "px";

    if (cellWidth== 0) cellWidth = window.innerWidth;
    if (cellHeight==0) cellHeight = window.innerHeight;
    
    // Note: In JavaScript, int/int produces float 
    var cols= Math.floor(window.innerWidth/cellWidth); 
    var rows= Math.floor(window.innerHeight/cellHeight);
     
    var lastcellWidth = window.innerWidth - cols*cellWidth; 
    var lastcellHeight = 0; 
    // alert(lastcellWidth); 
    if (cellWidth*cols < window.innerWidth) cols++; 
    if (cellHeight*rows < window.innerHeight)
    {  lastcellHeight = window.innerHeight - rows*cellHeight; 
       rows++; 
    }
         
    var tbody = document.getElementById("gridTable");

    tbody.innerHTML = "";  // Delete previous content
    
    for(var i=0; i < rows; i++)
    {  var row = document.createElement("tr");
        
      for(var j=0; j < cols; j++)
      {  var cell= document.createElement("td");
         if ((cols >1) && (j== cols-1)) cell.setAttribute("style","width:" + lastcellWidth + "px");
         //cell.innerHTML = "&nbsp;";
         row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
  
    var lastRowStyle = "";
    if (lastcellHeight != 0) // decide the height of cells in lastRow
    { lastRowStyle = "#grid table tr:last-child td { height:"+ lastcellHeight + "px; }"; }

    document.getElementById("gridExtra").innerHTML= "#grid table td { width:" + cellWidth +"px; height:"+ cellHeight + "px; } " + lastRowStyle ;
       
    // Call setCanvas(), user should click "Set Grid" button if browser window is resized 
    setCanvas();
}

// The code that follows is to setup canvas and handle click events 

var lastX = -1;
var lastY;
  
function  setCanvas() 
{  // alert("in setCanvas"); 
   lastX = -1;
   var canvas = document.getElementById("myCanvas");
   if (!canvas) 
    { canvas = document.createElement("canvas"); 
      canvas.id = 'myCanvas';
      canvas.setAttribute("style","position:absolute; left:0; top:0;");
      document.body.insertBefore(canvas, document.body.firstChild); 
      canvas.parentNode.addEventListener("click", handleClick, false);
      //canvas.parentNode.setAttribute("onclick","handleClick(event)");
   }
  
   canvas.setAttribute("width", window.innerWidth);
   canvas.setAttribute("height", window.innerHeight);  
}

function handleClick() 
{  oEvent = arguments[0];
   // alert(oEvent.target.tagName);

   var tagName =oEvent.target.tagName;
   if (!((tagName=="TD") || (tagName=="CANVAS"))) return;

   if (lastX==-1) 
   {  lastX = oEvent.pageX;
      lastY = oEvent.pageY;
      return;
   }

   var canvas = document.getElementById('myCanvas');    
   var ctx=canvas.getContext("2d");

   ctx.clearRect(0, 0, canvas.width, canvas.height); 

   ctx.strokeStyle="#FF0000"; // a red line
   ctx.lineWidth=1;  
   ctx.lineStyle="#ffff00";  
   ctx.beginPath();
   ctx.moveTo(lastX,lastY);
   ctx.lineTo(oEvent.pageX,oEvent.pageY);
   ctx.stroke(); 

   ctx.fillStyle="#CC00FF";
   ctx.font="14px sans-serif";
   ctx.fillText(lastX + "," + lastY , lastX-20, lastY+20);
   ctx.fillText(oEvent.pageX + "," + oEvent.pageY, oEvent.pageX-20, oEvent.pageY+20);

   lastX = oEvent.pageX; 
   lastY = oEvent.pageY;
}

window.addEventListener("load", createGrid , false);
// Next line is no longer needed, we call setCanvas() in CreateGrid()
//window.addEventListener("load", setCanvas, false); 
 