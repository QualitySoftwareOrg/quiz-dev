import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './InicioScreenStyles';

export default function HomeScreen() {
  const navigation = useNavigation();

  const logout = async () => {
    await AsyncStorage.removeItem('usuario');
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <LinearGradient
      colors={['#510870', '#a228b0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={{ position: 'absolute', top: 60, left: 20, zIndex: 10 }}>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={36} color="#fff" />
        </TouchableOpacity>
      </View>

      <View>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Temas')}
      >
        <Text style={styles.buttonText}>PLAY</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}


