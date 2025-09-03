import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import InicioScreen from '../screens/Inicio/InicioScreen';
import UsuarioScreen from '../screens/Usuario/UsuarioScreen';
import ConfiguracoesScreen from '../screens/Configuracoes/ConfiguracoesScreen';

const Tab = createBottomTabNavigator();

function AnimatedTabBarIcon({ name, color, size, focused }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#cacacaff',
        tabBarStyle: {
          backgroundColor: 'transparent', // transparente
          borderTopWidth: 0,              // sem borda superior
          elevation: 0,                   // sem sombra Android
          position: 'absolute',           // flutuante (opcional)
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Início') iconName = 'home';
          if (route.name === 'Usuário') iconName = 'person';
          if (route.name === 'Configurações') iconName = 'settings';
          return (
            <AnimatedTabBarIcon
              name={iconName}
              color={color}
              size={size}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Início" component={InicioScreen} />
      <Tab.Screen name="Usuário" component={UsuarioScreen} />
      <Tab.Screen name="Configurações" component={ConfiguracoesScreen} />
    </Tab.Navigator>
  );
}