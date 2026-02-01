import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B1FA2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    tintColor: '#fff',
  },
  button: {
      backgroundColor: colors.white,
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderRadius: 10,
      width: '75%',
      marginTop: 20,
      marginBottom: 40,
      alignSelf: 'center',
    },
    buttonText: {
      color: colors.purple,
      fontSize: 22,
      fontFamily: fonts.bold,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    
});

export default styles;
