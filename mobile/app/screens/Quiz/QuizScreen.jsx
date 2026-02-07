import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Animated, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './QuizScreenStyles';
import api from '../../api/api';

function embaralhar(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoria, dificuldade = 'medio' } = route.params || {};
  const [perguntas, setPerguntas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [indice, setIndice] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [alternativas, setAlternativas] = useState([]);
  const [acertos, setAcertos] = useState(0);

  // Dados do usuário (mock - depois pode vir de contexto/API)
  const usuario = {
    nick: 'Player',
    pontos: 1250,
    nivel: 5,
    xpAtual: 350,
    xpProximoNivel: 500,
  };
  
  const progressoNivel = (usuario.xpAtual / usuario.xpProximoNivel) * 100;

  // Configurações de dificuldade
  const configDificuldade = {
    facil: { nome: 'Fácil', cor: '#4CAF50', tempo: 10 },
    medio: { nome: 'Médio', cor: '#FF9800', tempo: 8 },
    dificil: { nome: 'Difícil', cor: '#F44336', tempo: 6 }
  };
  
  const tempoBase = configDificuldade[dificuldade]?.tempo || 8;
  const [tempo, setTempo] = useState(tempoBase);
  
  // Power-ups
  const [powerUps, setPowerUps] = useState({
    cinquentaCinquenta: { usado: false, quantidade: 1 },
    pular: { usado: false, quantidade: 1 },
    tempoExtra: { usado: false, quantidade: 1 },
  });

  const timerRef = useRef(null);
  const delayRef = useRef(null);
  const tempoAnimado = useRef(new Animated.Value(1)).current; // 1 = 100%
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pontosAnim = useRef(new Animated.Value(0)).current;
  
  const [pontosGanhos, setPontosGanhos] = useState(null);
  const [mostrarPontos, setMostrarPontos] = useState(false);

  useEffect(() => {
    async function carregarPerguntas() {
      setCarregando(true);
      try {
        const res = await api.get(`/perguntas/categoria?categoria=${encodeURIComponent(categoria)}`);
        // Seleciona até 10 perguntas aleatórias e sem repetição
        const todas = res.data;
        const embaralhadas = embaralhar(todas);
        const selecionadas = embaralhadas.slice(0, 10);
        setPerguntas(selecionadas);
        setIndice(0);
      } catch (e) {
        setPerguntas([]);
      }
      setCarregando(false);
    }
    carregarPerguntas();
  }, [categoria]);

  // Embaralha alternativas só quando a pergunta muda
  useEffect(() => {
    if (perguntas.length > 0 && perguntas[indice]) {
      const perguntaAtual = perguntas[indice];
      const alternativasOriginais = [
        { texto: perguntaAtual.resposta_correta, correta: true },
        ...perguntaAtual.respostas_incorretas.map(texto => ({
          texto,
          correta: false,
        })),
      ];
      const alternativasEmbaralhadas = embaralhar(alternativasOriginais);
      const letras = ['A', 'B', 'C', 'D'];
      const alternativasComLetras = alternativasEmbaralhadas.map((alt, idx) => ({
        ...alt,
        key: letras[idx],
      }));
      setAlternativas(alternativasComLetras);
      setRespostaSelecionada(null);
      setTempo(tempoBase);

      // Animação de entrada
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Barra animada: reset e inicia animação
      tempoAnimado.setValue(1);
      Animated.timing(tempoAnimado, {
        toValue: 0,
        duration: tempoBase * 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [perguntas, indice]);

  // Timer de 8 segundos
  useEffect(() => {
    if (respostaSelecionada || perguntas.length === 0) return;

    timerRef.current = setInterval(() => {
      setTempo((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          avancarPergunta();
          return tempoBase;
        }
        if (t <= 3) {
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.3,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
            ])
          ).start();
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [respostaSelecionada, perguntas, indice]);

  // Delay de 1,5 segundos após resposta
  useEffect(() => {
    if (respostaSelecionada) {
      clearInterval(timerRef.current);
      tempoAnimado.stopAnimation();
      
      // Vibração ao responder
      const alternativaSelecionada = alternativas.find(a => a.key === respostaSelecionada);
      if (alternativaSelecionada?.correta) {
        Vibration.vibrate(100); // Vibração curta para acerto
        const pontos = tempo >= 5 ? 20 : 10;
        setPontosGanhos(pontos);
      } else {
        Vibration.vibrate([0, 100, 100, 100]); // Vibração dupla para erro
        setPontosGanhos(0);
      }
      
      // Animação de pontos
      setMostrarPontos(true);
      pontosAnim.setValue(0);
      Animated.sequence([
        Animated.timing(pontosAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(800),
        Animated.timing(pontosAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setMostrarPontos(false));
      
      delayRef.current = setTimeout(() => {
        avancarPergunta();
      }, 1500);
    }
    return () => clearTimeout(delayRef.current);
  }, [respostaSelecionada]);

  function avancarPergunta() {
    setRespostaSelecionada(null);
    setTempo(tempoBase);
    tempoAnimado.setValue(1);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    setPowerUps(prev => ({ ...prev, cinquentaCinquenta: { ...prev.cinquentaCinquenta, usado: false } }));
    if (indice < perguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      navigation.replace('QuizResultado', {
        total: perguntas.length,
        acertos,
        categoria,
        dificuldade,
      });
    }
  }
  
  function usar5050() {
    if (powerUps.cinquentaCinquenta.usado || powerUps.cinquentaCinquenta.quantidade === 0 || respostaSelecionada) return;
    const alternativasErradas = alternativas.filter(alt => !alt.correta);
    const paraRemover = embaralhar(alternativasErradas).slice(0, 2);
    setAlternativas(prev => prev.map(alt => ({
      ...alt,
      desabilitada: paraRemover.some(r => r.key === alt.key)
    })));
    setPowerUps(prev => ({
      ...prev,
      cinquentaCinquenta: { usado: true, quantidade: prev.cinquentaCinquenta.quantidade - 1 }
    }));
  }
  
  function usarPular() {
    if (powerUps.pular.usado || powerUps.pular.quantidade === 0 || respostaSelecionada) return;
    setPowerUps(prev => ({
      ...prev,
      pular: { usado: true, quantidade: prev.pular.quantidade - 1 }
    }));
    avancarPergunta();
  }
  
  function usarTempoExtra() {
    if (powerUps.tempoExtra.usado || powerUps.tempoExtra.quantidade === 0 || respostaSelecionada) return;
    setTempo(prev => prev + 5);
    setPowerUps(prev => ({
      ...prev,
      tempoExtra: { usado: true, quantidade: prev.tempoExtra.quantidade - 1 }
    }));
  }

  if (carregando) {
    return (
      <LinearGradient colors={['#510870', '#a228b0']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.navigate('Temas')}
          >
            <Ionicons name="arrow-back" size={24} color="#6B2BAA" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </LinearGradient>
    );
  }

  if (!perguntas.length) {
    return (
      <LinearGradient colors={['#510870', '#a228b0']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.navigate('Temas')}
          >
            <Ionicons name="arrow-back" size={24} color="#6B2BAA" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>
            Nenhuma pergunta encontrada para este tema.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const perguntaAtual = perguntas[indice];
  const alternativaCorreta = alternativas.find(a => a.correta)?.key;

  return (
    <LinearGradient colors={['#510870', '#a228b0']} style={styles.container}>
      {/* Header compacto com botão, timer e progressão */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate('Temas')}
        >
          <Ionicons name="arrow-back" size={24} color="#6B2BAA" />
        </TouchableOpacity>
        
        {/* Timer circular */}
        <View style={styles.timerContainer}>
          <Animated.View style={[styles.timerCircle, {
            transform: [{ scale: tempo <= 3 ? pulseAnim : 1 }]
          }]}>
            <Animated.View
              style={[
                styles.timerProgress,
                {
                  transform: [{
                    rotate: tempoAnimado.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['360deg', '0deg'],
                    })
                  }]
                }
              ]}
            />
            <Text style={[styles.timerText, tempo <= 3 && styles.timerTextUrgent]}>{tempo}</Text>
          </Animated.View>
        </View>
        
        {/* Progressão */}
        <View style={styles.progressaoContainer}>
          <Text style={styles.progressaoText}>{indice + 1}/{perguntas.length}</Text>
        </View>
      </View>

      {/* Card de informações do usuário - versão compacta */}
      <View style={styles.userInfoCardCompact}>
        <View style={styles.userAvatarSmall}>
          <Ionicons name="person" size={16} color="#fff" />
        </View>
        <View style={styles.userDetailsCompact}>
          <View style={styles.userTopRow}>
            <Text style={styles.userNickSmall}>{usuario.nick}</Text>
            <Text style={styles.userLevelSmall}>Lv.{usuario.nivel}</Text>
          </View>
          <View style={styles.progressBarContainerSmall}>
            <View style={[styles.progressBarFillSmall, { width: `${progressoNivel}%` }]} />
          </View>
        </View>
        <View style={styles.userPointsSmall}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.userPointsTextSmall}>{usuario.pontos}</Text>
        </View>
      </View>

      {/* Container com badge sobreposto e card da pergunta */}
      <Animated.View style={[
        styles.perguntaWrapper,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        {/* Badge de número da pergunta sobreposto */}
        <View style={[styles.badgePergunta, { backgroundColor: configDificuldade[dificuldade]?.cor }]}>
          <Text style={styles.badgePerguntaTexto}>Pergunta {indice + 1}/{perguntas.length}</Text>
        </View>
        
        {/* Card da pergunta */}
        <View style={styles.cardPerguntaCompacto}>
          <Text style={styles.perguntaCompacta}>{perguntaAtual.pergunta}</Text>
        </View>
        
        {/* Pontos ganhos */}
        {mostrarPontos && pontosGanhos !== null && (
          <Animated.View style={[
            styles.pontosGanhosContainer,
            {
              opacity: pontosAnim,
              transform: [{
                translateY: pontosAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30]
                })
              }, {
                scale: pontosAnim
              }]
            }
          ]}>
            <Text style={styles.pontosGanhosTexto}>
              {pontosGanhos > 0 ? `+${pontosGanhos}` : '0'}
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Alternativas otimizadas */}
      <Animated.View style={[
        styles.alternativasContainerCompacto,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        {alternativas.map((alt) => {
          let borderColor = 'transparent';
          let backgroundColor = '#fff';
          if (respostaSelecionada) {
            if (alt.key === alternativaCorreta) {
              borderColor = '#00FF00';
            }
            if (alt.key === respostaSelecionada) {
              backgroundColor = '#f0f0f0';
              if (alt.key !== alternativaCorreta) {
                borderColor = '#FF3B3B';
              }
            }
          }
          return (
            <TouchableOpacity
              key={alt.key}
              style={[
                styles.alternativaCompacta,
                { borderColor, backgroundColor },
                alt.desabilitada && styles.alternativaDesabilitada
              ]}
              activeOpacity={0.85}
              disabled={!!respostaSelecionada || alt.desabilitada}
              onPress={() => {
                setRespostaSelecionada(alt.key);
                if (alt.correta) setAcertos((prev) => prev + 1);
              }}
            >
              <Text style={[styles.letraCompacta, alt.desabilitada && styles.textoDesabilitado]}>{alt.key}</Text>
              <Text style={[styles.textoAlternativaCompacta, alt.desabilitada && styles.textoDesabilitado]}>{alt.texto}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {/* Power-ups */}
      <View style={styles.powerUpsContainer}>
        <TouchableOpacity
          style={[
            styles.powerUpButton,
            (powerUps.cinquentaCinquenta.usado || powerUps.cinquentaCinquenta.quantidade === 0 || respostaSelecionada) && styles.powerUpDisabled
          ]}
          onPress={usar5050}
          disabled={powerUps.cinquentaCinquenta.usado || powerUps.cinquentaCinquenta.quantidade === 0 || !!respostaSelecionada}
        >
          <Ionicons name="options" size={20} color="#fff" />
          <Text style={styles.powerUpText}>50/50</Text>
          <View style={styles.powerUpBadge}>
            <Text style={styles.powerUpBadgeText}>{powerUps.cinquentaCinquenta.quantidade}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.powerUpButton,
            (powerUps.pular.usado || powerUps.pular.quantidade === 0 || respostaSelecionada) && styles.powerUpDisabled
          ]}
          onPress={usarPular}
          disabled={powerUps.pular.usado || powerUps.pular.quantidade === 0 || !!respostaSelecionada}
        >
          <Ionicons name="play-forward" size={20} color="#fff" />
          <Text style={styles.powerUpText}>Pular</Text>
          <View style={styles.powerUpBadge}>
            <Text style={styles.powerUpBadgeText}>{powerUps.pular.quantidade}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.powerUpButton,
            (powerUps.tempoExtra.usado || powerUps.tempoExtra.quantidade === 0 || respostaSelecionada) && styles.powerUpDisabled
          ]}
          onPress={usarTempoExtra}
          disabled={powerUps.tempoExtra.usado || powerUps.tempoExtra.quantidade === 0 || !!respostaSelecionada}
        >
          <Ionicons name="time" size={20} color="#fff" />
          <Text style={styles.powerUpText}>+5s</Text>
          <View style={styles.powerUpBadge}>
            <Text style={styles.powerUpBadgeText}>{powerUps.tempoExtra.quantidade}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
