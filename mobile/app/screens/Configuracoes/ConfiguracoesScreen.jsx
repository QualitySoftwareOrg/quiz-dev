import React from 'react';
import { View, Text } from 'react-native';
import styles from './ConfiguracoesScreenStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/theme';

export default function ConfiguracoesScreen() {
    return (
        <LinearGradient
            colors={['#510870', '#a228b0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <Text style={styles.title}>Configurações</Text>
            {/* Adicione aqui os componentes de configurações */}
        </LinearGradient>
    );
}
