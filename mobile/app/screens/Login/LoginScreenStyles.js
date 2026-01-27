import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // centraliza verticalmente
    alignItems: 'center',     // centraliza horizontalmente
  },
  errorContainer: {
  backgroundColor: 'rgba(255, 0, 0, 0.2)',
  padding: 10,
  borderRadius: 5,
  marginBottom: 15,
  width: '100%',
  },
  errorText: {
    color: '#ff3333',
    textAlign: 'center',
    fontSize: 14,
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 40,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.white,
    marginBottom: 20,
    fontSize: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    color: colors.white,
    fontFamily: fonts.regular,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    minWidth: 220,
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.purple,
    fontSize: 18,
    fontFamily: fonts.bold,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default styles;