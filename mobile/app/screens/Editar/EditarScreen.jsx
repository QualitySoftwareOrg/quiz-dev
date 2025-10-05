import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/api';
import { colors } from '../../constants/theme';
import styles from './EditarScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatarDataParaExibicao, formatarDataParaEnvio } from '../../utils';

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

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        setNome(usuario.nome || '');
        setSobrenome(usuario.sobrenome || '');
        setDataNascimento(formatarDataParaExibicao(usuario.data_nascimento || ''));
        setEmail(usuario.email || '');
        setUsuarioId(usuario.id);
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
      // Atualiza o AsyncStorage local
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
          Alert.alert('Erro', 'Erro ao cadastrar senha.');
        } else if (error.response.status === 401) {
          Alert.alert('Erro', error.response.data.message || 'Dados inválidos.');
        } else {
          Alert.alert('Erro', 'Erro inesperado no servidor.');
        }
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };}

  return (
    <LinearGradient
      colors={['#510870', '#a228b0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Editar Perfil</Text>
        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholderTextColor={colors.textLight}
        />
        <TextInput
          placeholder="Sobrenome"
          value={sobrenome}
          onChangeText={setSobrenome}
          style={styles.input}
          placeholderTextColor={colors.textLight}
        />
        <TextInput
          placeholder="Data de Nascimento (DD/MM/AAAA)"
          value={dataNascimento}
          onChangeText={text => setDataNascimento(formatarDataNascimento(text))}
          style={styles.input}
          placeholderTextColor={colors.textLight}
          keyboardType="numeric"
          maxLength={10}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor={colors.textLight}
        />
        <TextInput
          placeholder="Nova senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
          placeholderTextColor={colors.textLight}
        />
        <TouchableOpacity style={styles.button} onPress={salvar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
  }