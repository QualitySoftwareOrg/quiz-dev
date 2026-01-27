import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/api';
import { colors } from '../../constants/theme';
import styles from './LoginScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../Loading/LoadingModal';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const login = async () => {
    try {
      if (!email || !password) {
        alert('Preencha todos os campos');
        return;
      }
      setLoading(true);
      setErrorMessage('')
      const response = await api.post('/usuarios/login', { email, password });
      if (response.status === 200) {
        await AsyncStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        await AsyncStorage.setItem('token', response.data.token);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setErrorMessage(error.response.data.message || 'Usuário bloqueado temporariamente');
        } else {
          setErrorMessage(error.response.data.message || 'Email ou senha incorretos.');
      }
        } else {
          setErrorMessage('Erro ao conectar ao servidor');
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
      {/* Seta fixa no canto superior esquerdo */}
      <View style={{ position: 'absolute', top: 60, left: 20, zIndex: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.inner}>
        <Text style={styles.title}>Login</Text>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor={colors.textLight}
        />
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor={colors.textLight}
        />
        <TouchableOpacity style={styles.button} onPress={login} disabled={loading}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.link}>
          <Text style={styles.linkText}>Não possui conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}