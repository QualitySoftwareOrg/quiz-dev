import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B1FA2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
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
    flexShrink: 1, // Permite quebra de linha
    flexWrap: 'wrap', // Permite quebra de linha
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