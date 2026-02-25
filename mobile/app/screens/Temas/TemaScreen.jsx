import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './TemaScreenStyles';
import DificuldadeModal from '../../components/DificuldadeModal';

const temas = [
  { nome: 'Conhecimentos Gerais', emoji: '🌍', tela: 'QuizGerais' },
  { nome: 'Futebol', emoji: '⚽', tela: 'QuizFutebol' },
  { nome: 'Filmes', emoji: '📺', tela: 'QuizFilmes' },
  { nome: 'Séries', emoji: '🎬', tela: 'QuizSeries' },
  { nome: 'Música', emoji: '🎵', tela: 'QuizMusica' },
  { nome: 'História', emoji: '📜', tela: 'QuizHistoria' },
  { nome: 'Geografia', emoji: '🗺️', tela: 'QuizGeografia' },
  { nome: 'Matemática', emoji: '➗', tela: 'QuizMatematica' },
  { nome: 'Ciência', emoji: '🔬', tela: 'QuizCiencia' },
  { nome: 'Jogos', emoji: '🎮', tela: 'QuizJogos' },
  { nome: 'Esportes', emoji: '🏅', tela: 'QuizEsportes' },
];

export default function TemaScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [temaSelecionado, setTemaSelecionado] = useState(null);

  return (
    <LinearGradient
      colors={['#510870', '#a228b0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      {/* Título e seta na mesma linha */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 70, marginBottom: 18, paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.title, { marginTop: 0, marginBottom: 0, flex: 1 }]}>Escolha um tema</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.temasGrid}>
          {temas.map((tema) => (
            <TouchableOpacity
              key={tema.nome}
              style={styles.temaCard}
              activeOpacity={0.85}
              onPress={() => {
                setTemaSelecionado(tema.nome);
                setModalVisible(true);
              }}
            >
              <View style={styles.emojiCircle}>
                <Text style={styles.emoji}>{tema.emoji}</Text>
              </View>
              <Text style={styles.temaText}>{tema.nome}</Text>
              <Ionicons name="chevron-forward" size={24} color="#5B1CAE" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <DificuldadeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categoria={temaSelecionado}
        onSelect={(dificuldade) => {
          setModalVisible(false);
          navigation.navigate('QuizLoading', { 
            categoria: temaSelecionado, 
            dificuldade: dificuldade 
          });
        }}
      />
    </LinearGradient>
  );
}