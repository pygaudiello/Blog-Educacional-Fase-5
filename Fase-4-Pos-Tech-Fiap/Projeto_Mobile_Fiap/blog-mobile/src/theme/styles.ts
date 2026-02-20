import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },

  postFormContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginBottom: 20,
  },

  modalOverlay : {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  },


  cardContainer: {
    width: '100%',
    maxWidth: 500,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  postFormTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },

  postInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 16,
    color: colors.text,
  },

    postTextarea: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 20,
  },

    postTextarea2: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 20,
  },

  postButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  postButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    elevation: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    color: colors.text,
  },

  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },

  buttonContainer: {
    marginTop: 8,
  },

  error: {
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },

  button: {
    marginTop: 8,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },

  link: {
  marginTop: 16,
  textAlign: 'center',
  color: colors.textSecondary,
  fontSize: 14,
},

linkBold: {
  color: colors.primary,
  fontWeight: '600',
},

 appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    marginRight: 12,
  },

  teacherControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },

  postCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  postCard2: {
  backgroundColor: 'white',
  borderRadius: 8,
  padding: 16,
  marginBottom: 12, // Importante para espaçamento
  // Remove qualquer width fixo
  // width: '100%', // Se não tiver, adicione
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },

  postAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },

  postDescription: {
    fontSize: 14,
    color: colors.text,
  },

  
  teacherButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },

  teacherButtonText: {
    color: colors.card,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },

});
