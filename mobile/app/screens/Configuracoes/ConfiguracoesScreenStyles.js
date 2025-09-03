import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7B1FA2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 100,
        fontFamily: fonts.bold,
        textAlign: 'center',
    },
    label: {
        color: '#fff',
        fontSize: 18,
    },
});

export default styles;