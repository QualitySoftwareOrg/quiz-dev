import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import styles from './UsuarioScreenStyles';
import { colors } from '../../constants/theme';
import { formatarDataParaExibicao } from '../../utils';

export default function UsuarioScreen() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState({
    nome: '',
    sobrenome: '',
    data_nascimento: '',
    email: '',
    pontuacao: 0,
  });

  const carregarUsuario = useCallback(() => {
    let isActive = true;
    const run = async () => {
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      if (usuarioSalvo && isActive) {
        const user = JSON.parse(usuarioSalvo);
        let historico = user.historico_pontuacoes || {};
        if (typeof historico === 'string') {
          try {
            historico = JSON.parse(historico);
          } catch (_e) {
            historico = {};
          }
        }
        setUsuario({
          nome: user.nome || '',
          sobrenome: user.sobrenome || '',
          data_nascimento: user.data_nascimento || '',
          email: user.email || '',
          pontuacao: historico.total || 0,
        });
      }
    };
    run();
    return () => {
      isActive = false;
    };
  }, []);

  useFocusEffect(carregarUsuario);

  return (
    <LinearGradient
      colors={['#510870', '#a228b0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.userIdentify}>
          <View style={styles.userHeaderLeft}>
            <Text style={styles.title}>{usuario.nome} {usuario.sobrenome}</Text>

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.ratingText}>{(usuario.pontuacao || 0).toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={colors.purple} />
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickButton}>
            <Ionicons name="cog-outline" size={20} color={colors.white} />
            <Text style={styles.quickButtonLabel}>Ajustes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickButton}>
            <Ionicons name="sparkles-outline" size={20} color={colors.white} />
            <Text style={styles.quickButtonLabel}>Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickButton}>
            <Ionicons name="list-outline" size={20} color={colors.white} />
            <Text style={styles.quickButtonLabel}>Partidas</Text>
          </TouchableOpacity>
          
        </View>

        <TouchableOpacity style={styles.privacyCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.privacyTitle}>Políticas de Privacidade</Text>
            <Text style={styles.privacyText}>
              Levamos sua privacidade a sério. 
              Toque aqui para ver como cuidamos dos seus dados.
            </Text>
          </View>
          <Ionicons name="document-text-outline" size={38} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Nome</Text>
            <Text style={styles.profileValue}>{usuario.nome}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Sobrenome</Text>
            <Text style={styles.profileValue}>{usuario.sobrenome}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Data de Nascimento</Text>
            <Text style={styles.profileValue}>{formatarDataParaExibicao(usuario.data_nascimento) || 'Não informado'}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Email</Text>
            <Text style={styles.profileValue}>{usuario.email}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Pontuação</Text>
            <Text style={styles.profileValue}>{usuario.pontuacao}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Editar')}
        >
          <Text style={styles.buttonText}>Editar informações</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
