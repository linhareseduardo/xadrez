import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import ChessPiece from './ChessPiece';

const ChessSquare = ({ piece, isLight, isSelected, isHighlighted, size, onPress }) => {
  const backgroundColor = isSelected 
    ? '#7cb342'
    : isHighlighted 
    ? '#ffd54f'
    : isLight 
    ? '#f0d9b5' 
    : '#b58863';

  return (
    <TouchableOpacity
      style={[
        styles.square,
        {
          width: size,
          height: size,
          backgroundColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isHighlighted && !piece && (
        <View style={styles.possibleMoveIndicator} />
      )}
      {piece && <ChessPiece type={piece.type} color={piece.color} size={size} />}
      {isHighlighted && piece && (
        <View style={styles.captureIndicator} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  possibleMoveIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  captureIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: 'rgba(255, 0, 0, 0.5)',
    borderRadius: 4,
  },
});

export default ChessSquare;
