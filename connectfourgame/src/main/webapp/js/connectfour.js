$(function() {
	window.onload=function(){
		
		// Get existing games
		$.ajax({
	        url: "connectfour/availablegames",
	        type: "POST",         
	        
	        success: function(data,status,jqXHR) {
	            $(data).each(function(index) {
	            	$("#availablegames").append("<option>"+this.gameId+"</option>");
	            });
	        },
	        error: function(request, status, error){
            	$("#error").text(request.responseJSON.message);
            }
	        
	    });
		
		
		
	}
	
	
	
	/**
	 * Plays turns
	 */
	play=function(){		
		var currentPlayer = $("#player").text();
		var gameId = $("#currentgame").text();
		var column = $("#column").val();
		$.ajax({
	        url: "connectfour/play?player="+currentPlayer+"&gameId="+gameId+"&column="+column,
	        type: "POST",
	        success: function(data,status,jqXHR) {
	        	$("#error").hide();
	        	if(data.result > 0){
	        		switch(data.result){
	        			case 1:
	        				$("#success").show();
	        				$("#success").text("The winner is Player 1");	        				
	        				break;
	        			case 2:
	        				$("#success").show();
	        				$("#success").text("The winner is Player 2");
	        				break;
	        			case 1:
	        				$("#success").show();
	        				$("#success").text("Draw");
	        				break;
	        		}
	        	}
	        	$("#gameboard").empty();
	            drawGame(data.gameBoard);	        	
	        },
	        error: function(request, status, error){
	        	$("#success").hide();
	        	$("#error").show();
	        	$("#error").text(request.responseJSON.message);
            	
            }
	    });
	}
	
	/**
	 * Start a new game.
	 */
	startNewGame = function(){
		$.ajax({
		url: "connectfour/newgame",
        type: "POST",
        success: function(data,status,jqXHR) {
        	$("#error").hide();
        	$("#availablegames").append("<option selected>"+data.gameId+"</option>");
        	$("#currentgame").text(data.gameId);
        	$("#player").text(data.currentPlayer.id);
            $("#success").text("Welcome Player" + data.currentPlayer.id +"You have joined " + data.gameId);
            var gameboard = $(data).gameBoard;
        	$("#gameboard").empty();
            drawGame(data.gameBoard);        	
        },
        error: function(request, status, error){
        	$("#success").hide();
        	$("#error").show();
        	$("#error").text(request.responseJSON.message);
        }
    });
	}
	
	/**
	 * Join an existing game.
	 */
	joinGame = function(){
		var gameId = $("#availablegames").val();
		$.ajax({
			url: "connectfour/joingame?gameId="+gameId,
	        type: "POST",
	        success: function(data,status,jqXHR) {
	        	$("#error").hide();
	        	$("#currentgame").text(data.gameId);
	        	$("#player").text(data.currentPlayer.id);
	            $("#success").text("You have joined " + data.gameId);
	            $("#gameboard").empty();
	            drawGame(data.gameBoard);
	        },
	        error: function(request, status, error){
	        	$("#success").hide();
	        	$("#error").show();
	        	$("#error").text(request.responseJSON.message);
	        }
	    });
	}
	
	/**
	 * Draws a gameboard with 0 representing an empty cell, 1 representing Player 1 and 2 representing player 2.
	 * @param gameboard
	 */
	drawGame = function(gameboard){
		$(gameboard).each(function(index){
    		var row = "<tr>";
    		var columns = $(gameboard)[index];
    		$(columns).each(function(i){
    			row = row + "<td>" + $(gameboard)[index][i] + "</td>";    		
    		});
    		row = row + "</tr>";   		
    		$("#gameboard").append(row); 
    	});
	}
	
	$('#availablegames').on('change', function(e) {
		refresh();
	});
	
	/**
	 * Refreshes the game.
	 */
	refresh = function(){
		var gameId = $("#availablegames").val();
		if(gameId === null | gameId === undefined)
			return;
		$.ajax({
			url: "connectfour/currentgame?gameId="+gameId,
	        type: "POST",
	        success: function(data,status,jqXHR) {
	        	$("#error").hide();
	        	$("#currentgame").text(data.gameId);
	        	$("#player").text(data.currentPlayer.id);
	        	$("#gameboard").empty();
	            drawGame(data.gameBoard);
	        },
	        error: function(request, status, error){
	        	$("#success").hide();
	        	$("#error").show();
	        	$("#error").text(request.responseJSON.message);
	        }
	    });
	}
		
});
