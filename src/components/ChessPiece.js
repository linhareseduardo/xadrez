import React from 'react';
import { Text, StyleSheet } from 'react-native';

const PIECES = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
};

const ChessPiece = ({ type, color, size }) => {
  const pieceSymbol = PIECES[color][type];
  const fontSize = size * 0.7;

  return (
    <Text style={[styles.piece, { fontSize }]}>
      {pieceSymbol}
    </Text>
  );
};

const styles = StyleSheet.create({
  piece: {
    textAlign: 'center',
  },
});

export default ChessPiece;
