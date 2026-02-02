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
  
  // Progressão
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
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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