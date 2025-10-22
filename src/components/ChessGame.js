import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ChessEngine } from '../engine/ChessEngine';
import ChessBoard from './ChessBoard';

const ChessGame = () => {
  const [engine] = useState(() => new ChessEngine());
  const [board, setBoard] = useState(engine.board);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(engine.currentPlayer);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleSquarePress = (row, col) => {
    if (gameOver) return;

    // Se há uma peça selecionada
    if (selectedSquare) {
      const { row: fromRow, col: fromCol } = selectedSquare;
      
      // Tentar fazer o movimento
      const moveMade = engine.makeMove(fromRow, fromCol, row, col);
      
      if (moveMade) {
        setBoard([...engine.board]);
        setCurrentPlayer(engine.currentPlayer);
        setGameOver(engine.gameOver);
        setWinner(engine.winner);
      }
      
      // Limpar seleção
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else {
      // Selecionar uma peça
      const piece = engine.board[row][col];
      if (piece && piece.color === engine.currentPlayer) {
        setSelectedSquare({ row, col });
        const moves = engine.getPossibleMoves(row, col);
        setPossibleMoves(moves);
      }
    }
  };

  const handleReset = () => {
    engine.resetGame();
    setBoard([...engine.board]);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setCurrentPlayer(engine.currentPlayer);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♟ Xadrez ♟</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {gameOver 
            ? `${winner === 'white' ? 'Brancas' : 'Pretas'} venceram!` 
            : `Turno: ${currentPlayer === 'white' ? 'Brancas' : 'Pretas'}`}
        </Text>
      </View>

      <ChessBoard
        board={board}
        selectedSquare={selectedSquare}
        possibleMoves={possibleMoves}
        onSquarePress={handleSquarePress}
      />

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Novo Jogo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statusContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#4a4a4a',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ChessGame;
