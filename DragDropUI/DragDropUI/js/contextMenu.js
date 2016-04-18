$(function(){
            /**************************************************
             * Input menu methods
             **************************************************/
             
             /*
             * Reset current bg before setting new bg.
             */
             function resetbg_click(key, opt,element) {
            	var classnames = $('#drag-2').prop('class').split(' ');
 				console.log("Before " + classnames);
            	 $(element).removeClass(function (index, css) {
            		    return (css.match (/(^|\s)bg\S+/g) || []).join(' ');
            	 });
                 console.log("resetBG " + classnames);
                 
             }
             /*
              * Reset current font before setting new font.
              */
			 function resetfont_click(key, opt,element) {
            	 $(element).removeClass(function (index, css) {
            		    return (css.match (/(^|\s)fontfamily\S+/g) || []).join(' ');
            	 });
                 console.log("resetFont");
             }
             /*
              * Reset current font size before setting new size.
              */
			 function resetfontsize_click(element) {
            	 $(element).removeClass(function (index, css) {
            		    return (css.match (/(^|\s)fontsize\S+/g) || []).join(' ');
            	 });
                 console.log("resetFontSize ");
             }
			 /*
	          * Update bg.
	          */
             function changebg_click(key, opt) {
            	 var element = "#"+opt.$trigger.attr("id");
            	 //resetbg_click(key,opt,element);
            	 console.log("element " + element);
            	 $(element).css("background-color",key);
            	 //$(element).addClass("bg"+key);
                 console.log('Background:', key);
                 
             }
			 /*
			  * Update font.
			  */
             function changefont_click(key, opt) {
            	 var element = "#"+opt.$trigger.attr("id");
            	 resetfont_click(key, opt, element);
            	 $(element).addClass("fontfamily"+key);
                 console.log('FontFamily:', key);
                 
             }
			 /*
			  * Add/Remove Border
			  */
             function addborder_click(e) {
            	 var element = "#"+e.data.$trigger.attr("id");
     			 var $input = $(this).is(':checked');
     			 if($input)
     				$(element).addClass("border");
     			 else
     				$(element).removeClass("border");
             }
			 /*
			  * Add/Remove font style B,I,U
			  */
             function text_click(e){
            	 var element = "#"+e.data.$trigger.attr("id");
            	 var $input = $(this).is(':checked');
 				 var $item = $(this).val();
 	 			 if($input)
 					$(element).addClass($item);
 				else
 					$(element).removeClass($item); 
             }
			 /*
			  * Edit font size
			  */
			 function changefontsize_click(e){
				 //var classnames = $('#itemc').prop('class').split(' ');
					//console.log("Before " + classnames);
            	 var element = "#"+e.data.$trigger.attr("id");
            	 var fontsize = $(this).find('option:selected').text();
            	 console.log("classes " + $(element).css("font-size"));
            	 $(element).css('font-size',fontsize+"px");
            	 
 				 console.log("Update fontsize: " + fontsize);
             }
			 /*
			  * Resizes the font to fit the text.
			  */
			 function resizefont_click(key, opt) {
            	 var element = "#"+opt.$trigger.attr("id");
            	 
            	 var flag = false;
            	 while ($(element)[0].scrollHeight > $(element).innerHeight()) {
            		 var fontSize = parseFloat($(element).css('font-size'));
            		  console.log("font-size " + fontSize + " " + $(element).innerHeight() + " " + $(element)[0].scrollHeight);
            		   $(element).css('font-size', (fontSize - 1) + "px");
            		   if(fontSize === 8){
            			   console.log("fontSize8" + fontSize);
            			   truncatetext_click(key,opt);
            			   //$(element).css("text-overflow", "ellipsis");
            			   break;
            		   }
            		   if(flag){
            			   break;
            		   }
            		   var inner = $(element).innerHeight();
            		   var scroll = $(element)[0].scrollHeight;
            		   if((scroll - inner) < 6 ){
            			   flag = true;
            		   }
            		   
            		}
            	 jQuery(element).resizable()
             }
             /*
              * Truncates text after a max of 100 characters and adds ...
              */
			 function truncatetext_click(key, opt) {
            	 var element = "#"+opt.$trigger.attr("id");
            	 var text = '';
            	 if($(element).is("input"))
            		 text = $(element).val();
            	 else
            		 text = $(element).text();

        		 if (text.length > 100) {
        		     text = text.substr(0,100-3) + "...";
        		 }
        		 if($(element).is("input"))
        			 $(element).val(text);
            	 else
            		 $(element).text(text);
        		 
        		 jQuery(element).resizable()
             }
			 /*
			  * Add Column
			  */
             function addColumn_click(key, opt){
            	 var element = "#"+opt.$trigger.attr("id") + " tr";
            	 $(element).each(function()
	    			 {
	    			     $(this).append('<th></th>');
	    			 });
            	 var tableid =element+" th";
            	 $(tableid).resizable({
 					handles: 'e',
            	 });
            	
             }

            /**************************************************
             * Menu Input Sub-Menus
             **************************************************/
            $.contextMenu({
                selector: '.context-menu-input1', 
                items: {
                	bold: {name: "Bold", type:"checkbox",value:"bold",events:{click: text_click},selected:true},
                    italic: {name: "Italic", type:"checkbox",value:"italic",events:{click: text_click}},
                    underline: {name: "Underline", type:"checkbox",value:"underline",events:{click: text_click}},
                    sep1: "---------",
                    addborder: {name:"Add Border" ,type:"checkbox", events:{click: addborder_click} },
                    sep2: "---------",
                    foldfont:{
                        name: "Fonts",
                        items: {
                        	arial: {icon:"arialfont",className:"fonts", value:"arial", callback:changefont_click},
                        	calibri: {icon:"calibrifont", value:"Calibri", callback:changefont_click},
                            courier: {icon:"courierfont", value:"Courier", callback:changefont_click},
                        	georgia: {icon:"georgiafont", value:"Georgia", callback:changefont_click},
                        	timesnewroman: {icon:"timesnewromanfont", value:"TimesNewRoman", callback:changefont_click},
                        	trebuchetms: {icon:"trebuchetmsfont", value:"TrebuchetMS", callback:changefont_click},
                            verdana: {icon:"verdanafont", value:"Verdana", callback:changefont_click},
                        },
                    },
                    fontsize: {name: "Font Size", type:'select', options: {1: '6', 2: '8', 3: '10', 4: '12', 5: '14', 6: '16', 7: '18', 8: '20'},selected: 2, events:{click: changefontsize_click}},
                    sep3: "---------",
                    truncate: {name:"Truncate Text" ,callback : truncatetext_click },
                    resize: {name:"Resize to fit" ,callback : resizefont_click },
                    sep4: "---------",
                    foldcolors: {
                        name: "Background colors   ",
                        items: {
                        	white: {name: "White", icon:"whitecolor", value:"White", callback:changebg_click},
                        	silver: {name: "Silver", icon:"silvercolor", value:"Silver", callback:changebg_click},
                            grey: {name: "Grey", icon:"greycolor", value:"Grey", callback:changebg_click},
                        	cyan: {name: "Cyan", icon:"cyancolor", value:"Cyan", callback:changebg_click},
                        	lightblue: {name: "Blue", icon:"bluecolor", value:"Blue", callback:changebg_click},
                        	lightpink: {name: "Pink", icon:"lightpinkcolor", value:"Pink", callback:changebg_click},
                            lightcoral: {name: "Coral", icon:"coralcolor", value:"Coral", callback:changebg_click},
                        	red: {name: "Red",icon:"redcolor", value:"Red", callback:changebg_click},                            
                            yellow: {name: "Yellow", icon:"yellowcolor", value:"Yellow", callback:changebg_click},
                            lightgreen: {name: "LightGreen", icon:"lightgreencolor", value:"LightGreen", callback:changebg_click},
                            green: {name: "Green", icon:"greencolor", value:"Green", callback:changebg_click}
                        },
                    },
                    sep5: "---------",
                    addColumn: {name:"Add Column" , callback:addColumn_click,disabled: function(key, opt) {
                    	var element = "#"+opt.$trigger.attr("id");
                    	if($(element).is("table"))
                    		return false;
                    	
                    	return true;
                    	} 
                    },
                }, 
                events: {
                    show: function(opt) {
                    	
                        var $this = this;
                        // import states from data store
                        $.contextMenu.setInputValues(opt, $this.data());
                    }, 
                    hide: function(opt) {
                        var $this = this;
                        // export states to data store
                        $.contextMenu.getInputValues(opt, $this.data());
                    }
                }
            });
        });
