import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function DificuldadeModal({ visible, onClose, onSelect, categoria }) {
  const dificuldades = [
    { 
      nivel: 'facil', 
      nome: 'Fácil', 
      cor: '#4CAF50', 
      emoji: '😊', 
      tempo: '10s',
      pontos: '10 pts'
    },
    { 
      nivel: 'medio', 
      nome: 'Médio', 
      cor: '#FF9800', 
      emoji: '😐', 
      tempo: '8s',
      pontos: '20 pts'
    },
    { 
      nivel: 'dificil', 
      nome: 'Difícil', 
      cor: '#F44336', 
      emoji: '😤', 
      tempo: '6s',
      pontos: '40 pts'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
      }}>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: 20,
          width: '100%',
          maxWidth: 350
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#5B1CAE'
            }}>
              Escolha a dificuldade
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#5B1CAE" />
            </TouchableOpacity>
          </View>

          <Text style={{
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            marginBottom: 20
          }}>
            {categoria}
          </Text>

          {dificuldades.map((dif) => (
            <TouchableOpacity
              key={dif.nivel}
              style={{
                backgroundColor: dif.cor,
                borderRadius: 15,
                padding: 15,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => onSelect(dif.nivel)}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 24,
                marginRight: 15
              }}>
                {dif.emoji}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  {dif.nome}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#fff',
                  opacity: 0.9
                }}>
                  {dif.tempo} por pergunta • {dif.pontos} por acerto
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}