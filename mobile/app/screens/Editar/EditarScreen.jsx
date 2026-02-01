import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/api';
import { colors } from '../../constants/theme';
import styles from './EditarScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatarDataParaExibicao, formatarDataParaEnvio } from '../../utils';
import LoadingModal from '../Loading/LoadingModal';

function formatarDataNascimento(text) {
  let cleaned = text.replace(/\D/g, '');
  cleaned = cleaned.slice(0, 8);
  if (cleaned.length >= 5) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
  } else if (cleaned.length >= 3) {
    return cleaned.replace(/(\d{2})(\d{1,2})/, '$1/$2');
  }
  return cleaned;
}

export default function EditarScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('usuario');
        if (usuarioSalvo) {
          const usuario = JSON.parse(usuarioSalvo);
          setNome(usuario.nome || '');
          setSobrenome(usuario.sobrenome || '');
          setDataNascimento(formatarDataParaExibicao(usuario.data_nascimento || ''));
          setEmail(usuario.email || '');
          setUsuarioId(usuario.id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };
    carregarUsuario();
  }, []);

  const salvar = async () => {
    try {
      if (!nome || !sobrenome || !email) {
        Alert.alert('Atenção', 'Nome, sobrenome e email são obrigatórios.');
        return;
      }
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }
      const dados = {
        nome,
        sobrenome,
        data_nascimento: formatarDataParaEnvio(dataNascimento),
        email,
      };
      if (senha) {
        dados.password = senha;
      }
      await api.put(
        `/usuarios/${usuarioId}`,
        dados,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const usuarioAtualizado = {
        ...dados,
        id: usuarioId,
      };
      await AsyncStorage.mergeItem('usuario', JSON.stringify(usuarioAtualizado));
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          Alert.alert('Erro', error.response.data.error || 'Erro ao cadastrar senha.');
        } else if (error.response.status === 401) {
          Alert.alert('Erro', error.response.data.message || 'Dados inválidos.');
        } else {
          Alert.alert('Erro', 'Erro inesperado no servidor.');
        }
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar os dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#510870', '#a228b0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <LoadingModal visible={loading} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={colors.purple} />
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                style={styles.input}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sobrenome</Text>
              <TextInput
                value={sobrenome}
                onChangeText={setSobrenome}
                style={styles.input}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data de Nascimento</Text>
              <TextInput
                value={dataNascimento}
                onChangeText={text => setDataNascimento(formatarDataNascimento(text))}
                style={styles.input}
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
                maxLength={10}
                placeholder="DD/MM/AAAA"
              />
            </View>
          </View>

          {/* Account Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações da Conta</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nova Senha (opcional)</Text>
              <TextInput
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                style={styles.input}
                placeholderTextColor={colors.textLight}
                placeholder="Deixe em branco para manter a atual"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={salvar} disabled={loading}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}