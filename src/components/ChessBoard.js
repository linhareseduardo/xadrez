import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ChessSquare from './ChessSquare';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 400);
const SQUARE_SIZE = BOARD_SIZE / 8;

const ChessBoard = ({ board, selectedSquare, possibleMoves, onSquarePress }) => {
  const isSquareSelected = (row, col) => {
    return selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
  };

  const isPossibleMove = (row, col) => {
    return possibleMoves.some(move => move.row === row && move.col === col);
  };

  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = isSquareSelected(rowIndex, colIndex);
            const isHighlighted = isPossibleMove(rowIndex, colIndex);

            return (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                size={SQUARE_SIZE}
                onPress={() => onSquarePress(rowIndex, colIndex)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderWidth: 2,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
});

export default ChessBoard;
