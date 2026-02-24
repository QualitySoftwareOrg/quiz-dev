import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home/HomeScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import CadastroScreen from '../screens/Cadastro/CadastroScreen';
import TabNavigator from './TabNavigator';
import TemaScreen from '../screens/Temas/TemaScreen';
import EditarScreen from '../screens/Editar/EditarScreen';  
import QuizScreen from '../screens/Quiz/QuizScreen';
import QuizLoadingScreen from '../screens/Quiz/QuizLoadingScreen';
import QuizResultadoScreen from '../screens/Quiz/QuizResultadoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Temas" component={TemaScreen} />
        <Stack.Screen name="Editar" component={EditarScreen} />
        <Stack.Screen name="QuizLoading" component={QuizLoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QuizResultado" component={QuizResultadoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
