import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
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
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);

  const handleSquarePress = (row, col) => {
    if (gameOver) return;

    // Se há uma peça selecionada
    if (selectedSquare) {
      const { row: fromRow, col: fromCol } = selectedSquare;
      const piece = engine.board[fromRow][fromCol];
      
      // Verificar se é promoção de peão
      if (piece && piece.type === 'pawn') {
        const promotionRow = piece.color === 'white' ? 0 : 7;
        if (row === promotionRow && engine.isValidMove(fromRow, fromCol, row, col)) {
          setPendingMove({ fromRow, fromCol, toRow: row, toCol: col });
          setShowPromotionModal(true);
          return;
        }
      }
      
      // Tentar fazer o movimento
      const moveMade = engine.makeMove(fromRow, fromCol, row, col);
      
      if (moveMade) {
        updateGameState();
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

  const handlePromotion = (pieceType) => {
    if (pendingMove) {
      const { fromRow, fromCol, toRow, toCol } = pendingMove;
      engine.makeMove(fromRow, fromCol, toRow, toCol, pieceType);
      updateGameState();
    }
    setShowPromotionModal(false);
    setPendingMove(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const updateGameState = () => {
    setBoard([...engine.board]);
    setCurrentPlayer(engine.currentPlayer);
    setGameOver(engine.gameOver);
    setWinner(engine.winner);
    setIsCheck(engine.isCheck);
    setIsCheckmate(engine.isCheckmate);
    setMoveHistory([...engine.moveHistory]);
  };

  const handleUndo = () => {
    if (engine.undoMove()) {
      updateGameState();
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
    setIsCheck(false);
    setIsCheckmate(false);
    setMoveHistory([]);
  };

  const getStatusText = () => {
    if (gameOver) {
      if (isCheckmate) {
        return `♔ XEQUE-MATE! ${winner === 'white' ? 'Brancas' : 'Pretas'} venceram!`;
      }
      return `${winner === 'white' ? 'Brancas' : 'Pretas'} venceram!`;
    }
    if (isCheck) {
      return `⚠️ XEQUE! Turno: ${currentPlayer === 'white' ? 'Brancas' : 'Pretas'}`;
    }
    return `Turno: ${currentPlayer === 'white' ? 'Brancas' : 'Pretas'}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♟ Xadrez ♟</Text>
      
      <View style={[styles.statusContainer, isCheck && styles.checkContainer]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <ChessBoard
        board={board}
        selectedSquare={selectedSquare}
        possibleMoves={possibleMoves}
        onSquarePress={handleSquarePress}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.undoButton]} 
          onPress={handleUndo}
          disabled={moveHistory.length === 0}
        >
          <Text style={styles.buttonText}>↩️ Desfazer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>🔄 Novo Jogo</Text>
        </TouchableOpacity>
      </View>

      {moveHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Movimentos ({moveHistory.length})</Text>
          <ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={false}>
            {moveHistory.map((move, index) => (
              <Text key={index} style={styles.historyText}>
                {index + 1}. {move.piece.color === 'white' ? '⚪' : '⚫'} {move.piece.type} {String.fromCharCode(97 + move.fromCol)}{8 - move.fromRow} → {String.fromCharCode(97 + move.toCol)}{8 - move.toRow}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}

      <Modal
        visible={showPromotionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha a peça para promoção:</Text>
            <View style={styles.promotionOptions}>
              <TouchableOpacity 
                style={styles.promotionButton} 
                onPress={() => handlePromotion('queen')}
              >
                <Text style={styles.promotionText}>♕ Rainha</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.promotionButton} 
                onPress={() => handlePromotion('rook')}
              >
                <Text style={styles.promotionText}>♖ Torre</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.promotionButton} 
                onPress={() => handlePromotion('bishop')}
              >
                <Text style={styles.promotionText}>♗ Bispo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.promotionButton} 
                onPress={() => handlePromotion('knight')}
              >
                <Text style={styles.promotionText}>♘ Cavalo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
  },
  statusContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#4a4a4a',
    borderRadius: 8,
    minWidth: 250,
    alignItems: 'center',
  },
  checkContainer: {
    backgroundColor: '#d32f2f',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
  },
  undoButton: {
    backgroundColor: '#FF9800',
  },
  resetButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  historyContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    maxHeight: 120,
    width: '90%',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  historyScroll: {
    maxHeight: 80,
  },
  historyText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  promotionOptions: {
    width: '100%',
  },
  promotionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  promotionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ChessGame;
