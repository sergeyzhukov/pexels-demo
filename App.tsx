import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Navigation from './src/Navigation';
import {StyleSheet} from 'react-native';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Navigation />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
