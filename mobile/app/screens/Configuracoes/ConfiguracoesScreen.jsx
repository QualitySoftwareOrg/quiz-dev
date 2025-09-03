import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import styles from './ConfiguracoesScreenStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConfiguracoesScreen() {
    const [musicaAtiva, setMusicaAtiva] = useState(true);
    const [efeitosAtivos, setEfeitosAtivos] = useState(true);
    const [temaDark, setTemaDark] = useState(false);

    return (
        <LinearGradient
            colors={['#510870', '#a228b0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <View style={localStyles.header}>
                <Text style={localStyles.title}>Configurações</Text>
            </View>
            <View style={localStyles.card}>
                <Text style={localStyles.label}>Música</Text>
                <Switch
                    value={musicaAtiva}
                    onValueChange={setMusicaAtiva}
                />
            </View>
            <View style={localStyles.card}>
                <Text style={localStyles.label}>Efeitos Sonoros</Text>
                <Switch
                    value={efeitosAtivos}
                    onValueChange={setEfeitosAtivos}
                />
            </View>
            <View style={localStyles.card}>
                <Text style={localStyles.label}>Tema Dark</Text>
                <Switch
                    value={temaDark}
                    onValueChange={setTemaDark}
                />
            </View>
        </LinearGradient>
    );
}

const localStyles = StyleSheet.create({
    header: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'sans-serif',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',
        marginVertical: 12,
        paddingHorizontal: 32,
        paddingVertical: 18,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#510870',
        fontFamily: 'sans-serif',
    },
});
