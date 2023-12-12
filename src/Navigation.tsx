import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainScreen from './screens/MainScreen';
import DetailsScreen from './screens/DetailsScreen';

export type RouteParams = {
  Main: undefined;
  Details: {
    id: number;
  };
};

const Stack = createNativeStackNavigator<RouteParams>();

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
  },
};

const Navigation = () => {
  return (
    <NavigationContainer theme={Theme}>
      <Stack.Navigator screenOptions={{headerShown: true}}>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{title: 'Curated Images'}}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
