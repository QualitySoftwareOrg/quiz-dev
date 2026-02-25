import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';

export default function QuizResultadoScreen({ route, navigation }) {
  const { total, acertos, categoria, dificuldade = 'medio' } = route.params;

  // Configurações de dificuldade
  const configDificuldade = {
    facil: { nome: 'Fácil', cor: '#4CAF50' },
    medio: { nome: 'Médio', cor: '#FF9800' },
    dificil: { nome: 'Difícil', cor: '#F44336' }
  };

  useEffect(() => {
    const registrarPontuacao = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const usuarioRaw = await AsyncStorage.getItem('usuario');
        if (!token || !usuarioRaw) return;
        const usuario = JSON.parse(usuarioRaw);
        if (!usuario?.id) return;

        const response = await api.post(
          `/usuarios/${usuario.id}/pontuacao`,
          { categoria, acertos, total },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response?.data?.usuario) {
          await AsyncStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        }
      } catch (_error) {
        // falha silenciosa para nao travar a tela de resultado
      }
    };

    registrarPontuacao();
  }, [acertos, categoria, total]);

  // Mensagem personalizada
  let mensagem = '';
  let emoji = '';
  if (acertos === total) {
    mensagem = 'Perfeito! Você acertou tudo!';
    emoji = '🎉';
  } else if (acertos >= total * 0.7) {
    mensagem = 'Mandou bem!';
    emoji = '👏';
  } else if (acertos >= total * 0.4) {
    mensagem = 'Continue praticando!';
    emoji = '💪';
  } else {
    mensagem = 'Não desista! Tente de novo!';
    emoji = '🤓';
  }

  return (
    <LinearGradient
      colors={['#510870', '#a228b0']}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</Text>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#6B2BAA',
          marginBottom: 8,
          textAlign: 'center'
        }}>
          {mensagem}
        </Text>
        <Text style={{
          fontSize: 20,
          color: '#8e24aa',
          marginBottom: 8,
          textAlign: 'center'
        }}>
          Tema: <Text style={{ fontWeight: 'bold' }}>{categoria}</Text>
        </Text>
        <View style={{
          backgroundColor: configDificuldade[dificuldade]?.cor,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
          marginBottom: 24,
          alignSelf: 'center'
        }}>
          <Text style={{
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
          }}>
            {configDificuldade[dificuldade]?.nome}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <Ionicons name="checkmark-circle" size={36} color="#00C851" style={{ marginRight: 8 }} />
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#6B2BAA',
          }}>
            {acertos}
          </Text>
          <Text style={{
            fontSize: 20,
            color: '#6B2BAA',
            marginLeft: 6,
          }}>
            / {total} acertos
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#8e24aa',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 32,
            marginBottom: 12,
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => navigation.replace('QuizLoading', { categoria, dificuldade })}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#8e24aa',
            paddingVertical: 14,
            paddingHorizontal: 32,
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('Temas')}
        >
          <Text style={{ color: '#8e24aa', fontSize: 18, fontWeight: 'bold' }}>Escolher outro tema</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}