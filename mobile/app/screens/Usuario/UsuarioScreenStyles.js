import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 36,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'left',
  },
  infoLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoValue: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 4,
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
  userIdentify: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  userHeaderLeft: {
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 8,
  },
  ratingText: {
    color: colors.white,
    fontSize: 14,
  },
  avatarCircle: {
    backgroundColor: colors.white,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickButton: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    width: '32%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  quickButtonLabel: {
    color: colors.white,
    marginTop: 8,
    fontSize: 14,
  },
  privacyCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  privacyTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
    maxWidth: '85%',
  },
  profileCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  profileLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  profileValue: {
    color: colors.white,
    fontSize: 14,
  }
});

export default styles;