package com.connectfourgame.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.connectfourgame.domain.Game;
import com.connectfourgame.domain.Player;
import com.connectfourgame.exception.ConnectFourException;


/**
 * Defines methods for a turn based game.
 * Assumptions:
 * The game assumes two players.
 * Player 1 - Player creating a new game.
 * Player 2 - Player joining an existing game.
 * 
 * The API defines methods to
 * 1) Create a new game
 * 2) Join an existing game
 * 3) Display list of game
 * 4) Play a turn
 * 
 * @author forum
 *
 */
@RestController
@RequestMapping(value="/connectfour")
public class ConnectFourController{
	private static final String GAMEID = "GameId";
	private static final String GAME = "Game";
	private static final String ALLGAMES = "AllGames";
	private static final int PLAYERONE = 1;
	private static final int PLAYERTWO = 2;
	private static final int GAME_RESULT_CONTINUE = 0;
	private static final int GAME_RESULT_DRAW = 3;
	@Autowired
	private ServletContext context;
	
	/**
	 * Starts a new Game and sets player 1.
	 * @return
	 * @throws ConnectFourException
	 */
	@RequestMapping(value="/newgame",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    public Game startNewGame() throws ConnectFourException {
		Game newGame = initialize();
		Player player1 = new Player();
		player1.setId(PLAYERONE);
		newGame.setPlayer1(player1);
		newGame.setCurrentPlayer(player1);
		return newGame;
	}
	
	/**
	 * Adds another user to an existing game
	 * @param gameId
	 * @return
	 * @throws ConnectFourException
	 */
	@RequestMapping(value="/joingame",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    public Game joinGame(@RequestParam("gameId") String gameId) throws ConnectFourException {	
		Game game = (Game)context.getAttribute(gameId);
		Player player2 = new Player();
		player2.setId(PLAYERTWO);
		game.setPlayer2(player2);
		game.setCurrentPlayer(player2);
		
		
		return game;
	}
	
	/**
	 * Plays a turn.
	 * @param player
	 * @param gameId
	 * @param column
	 * @return
	 * @throws ConnectFourException
	 */
	@RequestMapping(value="/play",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
	public Game play(@RequestParam("player") int player, @RequestParam("gameId") String gameId,@RequestParam("column") int column) throws ConnectFourException{

		Game game = (Game)context.getAttribute(gameId);
		validate(game,player,column);
	    game.setColumn(column);
	    // If the column is full, throw an exception.
        if (isColumnFilled(game)) {
        	throw new IllegalArgumentException("This column is filled! Choose another one.");
        }
        if(PLAYERONE == game.getCurrentPlayer().getId())
        	game.setCurrentPlayer(game.getPlayer2());
        else
        	game.setCurrentPlayer(game.getPlayer1());
        
        
        game.setResult(getWinner(game));
        return game;
	}
	
	
	/**
	 * Returns a list of games where both players are not set.
	 * @return
	 */
	@RequestMapping(value="/currentgame",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
	public Game getGameById(@RequestParam("gameId") String gameId){
		if(context.getAttribute(ALLGAMES) == null){
			return null;
		}
		Game game = (Game)context.getAttribute(gameId);
		return game;
		
	}
	
	
	/**
	 * Returns a list of games where both players are not set.
	 * @return
	 */
	@RequestMapping(value="/availablegames",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Game> getGamesAvailableForPlay(){
		if(context.getAttribute(ALLGAMES) == null){
			return null;
		}
		List<Game> games = (List<Game>)context.getAttribute(ALLGAMES);
		List<Game> filteredGames =  new ArrayList<Game>();
		for(Game game : games){
			if(game.getPlayer1() == null || game.getPlayer2() == null){
				filteredGames.add(game);
			}
		}
		return filteredGames;
		
	}
	
	/**
	 * Initializes a game.
	 * @return
	 */
	private Game initialize(){
		String gameId = getLatestGameId();
		context.setAttribute(GAMEID,gameId);
		Game gameBoard = new Game();
		gameBoard.setGameId(gameId);
		context.setAttribute(gameId, gameBoard);
		if(context.getAttribute(ALLGAMES) == null){
			List<Game> allGames = new ArrayList<Game>();
			allGames.add(gameBoard);
			context.setAttribute(ALLGAMES, allGames);
		}
		else{
			List<Game> games = (List<Game>)(context.getAttribute(ALLGAMES));
			games.add(gameBoard);
		}
		return gameBoard;

	}
	
	/**
	 * Validations before playing a turn.
	 * @param game
	 * @param player
	 * @param column
	 * @throws ConnectFourException
	 */
	private void validate(Game game, int player,int column) throws ConnectFourException{
		if(game.getResult() > 0)
			throw new ConnectFourException("This game " + game.getGameId() + " is over.");
		if(game.getPlayer1() == null || game.getPlayer2() == null)
			throw new ConnectFourException("Please wait for another player to join in");
		if(game.getCurrentPlayer().getId() != player)
			throw new ConnectFourException("Please wait for your turn.");        
	    if (column < 1 || column > 7) {
            System.out.println("Column should be from 1 to 7");
            throw new IllegalArgumentException("Enter a column number ranging from 1 to 7");
        }
	}
	
	/**
	 * This method is written to determine a unique game id. 
	 * @return
	 */
	private String getLatestGameId(){
		Object gameId = context.getAttribute(GAMEID);
		if(gameId == null)
			gameId = GAME+"1";
		else{
			int lastGameId = Integer.parseInt(context.getAttribute(GAMEID).toString().substring(4,gameId.toString().length()));
			gameId = GAME+(lastGameId+1);
		}
		return gameId.toString();
	}
	
	/**
	 * Check if all rows in a column are filled.
	 */
	private boolean isColumnFilled(Game game) {
		int column = game.getColumn() - 1;
		int player = game.getCurrentPlayer().getId();
        // If the first disk is there, the column is filled, returning false.
		int[][] gameBoard = game.getGameBoard();
        if (gameBoard[0][column] > 0)
            return true;

        // Check all elements in the column.
        for (int row = 0; row < 6; row++) {
            // If we found something, which means if the character is not
            // zero character
            if (gameBoard[row][column] > 0) {
                // Put the disk on top of the current one.
                gameBoard[row-1][column] = player;
                return false;
            }
        }
        // If no other disks found, we place this disk at the bottom.
        gameBoard[5][column] = player;
        return false;
    }
	
	/**
	 * Gets the winner in columns
	 * Returns 1 or 2 if a winner is found else returns 0(Continue)
	 * @param game
	 * @return
	 */
    private int getWinnerInColumns(Game game) {
    	int[][] gameBoard = game.getGameBoard();
        // Check rows and see if there are 4 of the same color
        for (int column = 0; column < 7; column++) {
            // We will compare current element with the next three
            for (int row = 0; row < 6; row++) {
                if (gameBoard[row][column] > 0 &&
                		row+3 <= 5 &&
                		gameBoard[row][column] == gameBoard[row+1][column] &&
                		gameBoard[row][column] == gameBoard[row+2][column] &&
                		gameBoard[row][column] == gameBoard[row+3][column]		
                		)
                    return gameBoard[row][column];
                }
        }
        
        return 0;
    }
    
    /**
     * Gets the winner in rows
     * Returns 1 or 2 if a winner is found else returns 0(Continue)
     * @param game
     * @return
     */
    private int getWinnerInRows(Game game) {
    	int[][] gameBoard = game.getGameBoard();
        // Check rows and see if there are 4 of the same color
        for (int row = 0; row < 6; row++) {
            // We will compare current element with the next three
            for (int column = 0; column < 7; column++) {
                if (gameBoard[row][column] > 0 &&
                		column+3 <= 6 &&
                		gameBoard[row][column] == gameBoard[row][column+1] &&
                		gameBoard[row][column] == gameBoard[row][column+2] &&
                		gameBoard[row][column] == gameBoard[row][column+3]		
                		)
                    return gameBoard[row][column];
                }
        }
        
        return 0;
    }
    
    /**
     * Gets the winner in diagonals.
     * Returns 1 or 2 if a winner is found else returns 0(Continue)
     * @param game
     * @return
     */
    private int getWinnerInDiagonals(Game game) {
       int gameBoard[][] = game.getGameBoard();
        for (int row = 0; row < 6; ++row) {
       
            for (int column = 0; column < 7; ++column) {
            	
            	if(gameBoard[row][column] > 0){
	                if ( row+3<=5 && column+3<=6 &&
	                		gameBoard[row][column] == gameBoard[row+1][column+1] &&
	                		gameBoard[row][column] == gameBoard[row+2][column+2] &&
	                		gameBoard[row][column] == gameBoard[row+3][column+3]		
	                	)
	                    return gameBoard[row][column];
	                
	                if(row+3 <=6 && column-3 > 0 &&
	                	gameBoard[row][column] == gameBoard[row+1][column-1] &&
		                gameBoard[row][column] == gameBoard[row+2][column-2] &&
		                gameBoard[row][column] == gameBoard[row+3][column-3])
	                	return gameBoard[row][column];
	                
            	
            	}
            }
        }
        
        return GAME_RESULT_CONTINUE;
    }
	
	/**
	 * Determines if a winner is found yet.
	 * The values signify
	 * 0 - Continue
	 * 1 - Player 1 is the winner
	 * 2 - Player 2 is the winner
	 * 3 - Draw
	 * @param game
	 * @return
	 */
	public int getWinner(Game game) {
        int winner = getWinnerInRows(game);
        if (winner >0) return winner;
        winner = getWinnerInColumns(game);
        if (winner >0) return winner;
        winner = getWinnerInDiagonals(game);
        if (winner > 0) return winner;

        // Now we need to check if there are empty positions, otherwise it is a draw
        int[][] gameBoard = game.getGameBoard();
        for (int i = 0; i < gameBoard.length; ++i)
            for (int j = 0; j < gameBoard[i].length; ++j)
                if (gameBoard[i][j] == 0) return GAME_RESULT_CONTINUE;

        return GAME_RESULT_DRAW;
    }


}
