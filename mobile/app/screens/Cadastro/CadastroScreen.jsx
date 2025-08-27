import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/api';
import { colors } from '../../constants/theme';
import styles from './CadastroScreenStyles';
import LoadingModal from '../Loading/LoadingModal';
import { Ionicons } from '@expo/vector-icons';

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
  const [confirmarSenha, setConfirmarSenha] = useState('');
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
      if (!nome || !sobrenome || !email || !senha || !confirmarSenha) {
        Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
        return;
      }
      if (senha !== confirmarSenha) {
        Alert.alert('Atenção', 'As senhas não coincidem.');
        return;
      }
      setLoading(true);
      await api.post('/usuarios/solicitar-otp', { email });
      setShowOtp(true);
      Alert.alert('Verificação', 'Enviamos um código para seu e-mail.');
    } catch (error) {
      // Verifica se a resposta do backend contém o erro de email já cadastrado
      if (
        error.response &&
        error.response.data &&
        (error.response.data.error === 'Email já cadastrado' ||
          error.response.data.message === 'Email já cadastrado')
      ) {
        Alert.alert('Erro', 'Email inserido já está em uso');
      } else {
        Alert.alert('Erro', 'Não foi possível enviar o OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  const verificarOtp = async () => {
    try {
      setLoading(true);
      const response = await api.post('/usuarios/verificar-otp', {
        nome,
        sobrenome,
        data_nascimento: dataNascimento,
        email,
        password: senha,
        otp,
      });
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'OTP inválido ou erro ao cadastrar.');
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
            <TextInput
              placeholder="Confirmar Senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
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