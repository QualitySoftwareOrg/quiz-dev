import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/api';
import { colors } from '../../constants/theme';
import styles from './CadastroScreenStyles';
import LoadingModal from '../Loading/LoadingModal';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function CadastroScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const solicitarOtp = async () => {
    try {
      // Regex: permite apenas letras (maiúsculas/minúsculas, com acento) e espaços
      const nomeValido = /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
      const sobrenomeValido = /^[A-Za-zÀ-ÿ\s]+$/.test(sobrenome);
      if (!nomeValido) {
        Alert.alert('Atenção', 'O nome deve conter apenas letras.');
        return;
      }
      if (!sobrenomeValido) {
        Alert.alert('Atenção', 'O sobrenome deve conter apenas letras.');
        return;
      }
      if (!nome || !sobrenome || !email || !senha || !dataNascimento) {
        Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
        return;
      }
      if (dataNascimento.length !== 10) {
        Alert.alert('Atenção', 'Data de nascimento inválida. Use DD/MM/AAAA.');
        return;
      }
      setLoading(true);
      const response = await api.post('/usuarios/solicitar-otp', { email });
      setShowOtp(true);
      if (response.data && response.data.otp) {
        Alert.alert('Verificação', `Código OTP (debug): ${response.data.otp}`);
      } else {
        Alert.alert('Verificação', 'Enviamos um código para seu e-mail.');
      }
    } catch (error) {
      const code = error.response?.data?.code;
      const message = error.response?.data?.message;
      if (code === 'EMAIL_IN_USE') {
        Alert.alert('Erro', 'Email inserido já está em uso');
      } else if (message) {
        Alert.alert('Erro', message);
      } else {
        Alert.alert('Erro', 'Não foi possível enviar o OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  const verificarOtp = async () => {
    try {
      if (!otp || otp.length !== 6) {
        Alert.alert('Atenção', 'Informe o código OTP de 6 dígitos.');
        return;
      }
      setLoading(true);
      const response = await api.post('/usuarios/verificar-otp', {
        nome,
        sobrenome,
        data_nascimento: dataNascimento,
        email,
        password: senha,
        otp,
      });
      if (response.status >= 200 && response.status < 300) {
        const token = response.data?.token;
        const usuario = response.data?.usuario;
        if (token && usuario) {
          await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
          await AsyncStorage.setItem('token', token);
        }
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    } catch (error) {
      const code = error.response?.data?.code;
      const message = error.response?.data?.message;
      if (code === 'OTP_INVALID') {
        Alert.alert('Erro', 'OTP inválido ou expirado.');
      } else if (message) {
        Alert.alert('Erro', message);
      } else {
        Alert.alert('Erro', 'Erro ao cadastrar.');
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
      <View style={{ position: 'absolute', top: 60, left: 20, zIndex: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.inner}>
        <Text style={styles.title}>Cadastro</Text>
        {!showOtp ? (
          <>
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
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              style={styles.input}
              placeholderTextColor={colors.textLight}
            />
            <TouchableOpacity style={styles.button} onPress={solicitarOtp} disabled={loading}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={{ color: colors.white, marginBottom: 16 }}>
              Digite o código enviado para seu e-mail:
            </Text>
            <TextInput
              placeholder="Código OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={colors.textLight}
              maxLength={6}
            />
            <TouchableOpacity style={styles.button} onPress={verificarOtp} disabled={loading}>
              <Text style={styles.buttonText}>Verificar Código</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
          <Text style={styles.linkText}>Já possui conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
