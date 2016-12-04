package com.connectfourgame.domain;

/**
 * Defines a Connect Four game with 2 players and a gameboard.
 * @author forum
 *
 */
public class Game {
	private static final int ROWS = 6;
	private static final int COLUMNS = 7;
	
	private String gameId;
	private int[][] gameBoard = new int[ROWS][COLUMNS];
	private Player player1;
	private Player player2;
	private Player currentPlayer;
	private int column;
	private int result;
	
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public int[][] getGameBoard() {
		return gameBoard;
	}
	public void setGameBoard(int[][] gameBoard) {
		this.gameBoard = gameBoard;
	}
	public Player getPlayer1() {
		return player1;
	}
	public void setPlayer1(Player player1) {
		this.player1 = player1;
	}
	public Player getPlayer2() {
		return player2;
	}
	public void setPlayer2(Player player2) {
		this.player2 = player2;
	}
	public Player getCurrentPlayer() {
		return currentPlayer;
	}
	public void setCurrentPlayer(Player currentPlayer) {
		this.currentPlayer = currentPlayer;
	}
	public int getColumn() {
		return column;
	}
	public void setColumn(int column) {
		this.column = column;
	}
	public int getResult() {
		return result;
	}
	public void setResult(int result) {
		this.result = result;
	}

}
