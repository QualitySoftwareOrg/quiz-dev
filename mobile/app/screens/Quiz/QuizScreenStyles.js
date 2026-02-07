import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B1FA2',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  
  // Header compacto
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  botaoVoltar: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Timer circular
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timerProgress: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerTextUrgent: {
    color: '#FF3B3B',
  },
  
  // Progressão e Badge
  progressaoContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  progressaoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Card de informações do usuário - versão compacta
  userInfoCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  userAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userDetailsCompact: {
    flex: 1,
  },
  userTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  userNickSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userLevelSmall: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  progressBarContainerSmall: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFillSmall: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  userPointsSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 3,
  },
  userPointsTextSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Wrapper para badge sobreposto e card da pergunta
  perguntaWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  
  // Badge sobreposto (metade dentro, metade fora)
  badgePergunta: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    position: 'absolute',
    top: -20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  badgePerguntaTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Pontos ganhos
  pontosGanhosContainer: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  pontosGanhosTexto: {
    color: '#6B2BAA',
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  // Logo compacta
  logoContainerCompacto: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCompacto: {
    width: 320,
    height: 160,
    tintColor: '#fff',
  },
  
  // Card pergunta compacto
  cardPerguntaCompacto: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  perguntaCompacta: {
    color: '#6B2BAA',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
  
  // Alternativas compactas
  alternativasContainerCompacto: {
    width: '100%',
    gap: 16,
    marginBottom: 30,
  },
  alternativaCompacta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  letraCompacta: {
    fontSize: 17,
    color: '#6B2BAA',
    fontWeight: 'bold',
    marginRight: 14,
    width: 22,
    textAlign: 'center',
  },
  textoAlternativaCompacta: {
    fontSize: 17,
    color: '#6B2BAA',
    fontWeight: '600',
    flexShrink: 1,
    lineHeight: 24,
  },
  alternativaDesabilitada: {
    opacity: 0.3,
  },
  textoDesabilitado: {
    textDecorationLine: 'line-through',
  },
  
  // Power-ups
  powerUpsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 12,
  },
  powerUpButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
  },
  powerUpDisabled: {
    opacity: 0.4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  powerUpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  powerUpBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B3B',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerUpBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  // Estilos originais mantidos para compatibilidade
  logoContainer: {
    alignItems: 'center',
    marginTop: -100,
  },
  logo: {
    width: 300,
    height: 200,
    tintColor: '#fff',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardPergunta: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 18,
    marginBottom: 32,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pergunta: {
    color: '#6B2BAA',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
  },
  alternativasContainer: {
    width: '100%',
    gap: 16,
  },
  alternativa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 0,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  letra: {
    fontSize: 18,
    color: '#6B2BAA',
    fontWeight: 'bold',
    marginRight: 18,
    width: 22,
    textAlign: 'center',
  },
  textoAlternativa: {
    fontSize: 20,
    color: '#6B2BAA',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  tempoBarraContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#8e24aa',
    borderRadius: 8,
    marginTop: 32,
    marginBottom: 12,
    overflow: 'hidden',
  },
  tempoBarra: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

export default styles;