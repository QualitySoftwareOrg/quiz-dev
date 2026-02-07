import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuizLoadingScreen({ navigation, route }) {
  const { categoria, dificuldade } = route.params;
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      navigation.replace('Quiz', { categoria, dificuldade });
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <LinearGradient
      colors={['#510870', '#a228b0']}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>
        Iniciando em
      </Text>
      <Text style={{ color: '#fff', fontSize: 64, fontWeight: 'bold' }}>
        {count > 0 ? count : '...'}
      </Text>
    </LinearGradient>
  );
}