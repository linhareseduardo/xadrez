import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import ChessGame from './src/components/ChessGame';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ChessGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312e2b',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
