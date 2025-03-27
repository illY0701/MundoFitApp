import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PrincipalPage = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
        {/* Container da Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo.avif')} 
            style={styles.logo} 
            resizeMode="cover" 
          />
        </View>

        {/* Cabeçalho com Título */}
        <View style={styles.header}>
          <Text style={styles.title}>MundoFit</Text>
          <Text style={styles.tagline}>Transforme seu estilo de vida</Text>
        </View>

        {/* Container dos Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonOutline]} 
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Cadastrar</Text>
          </TouchableOpacity>

          {/* Link para Cadastro de Professor */}
          <TouchableOpacity 
            style={styles.professorLink} 
            onPress={() => navigation.navigate('CadastroProfessor')}
          >
            <Text style={styles.professorLinkText}>Já sou professor</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Bem-vindo ao seu novo estilo de vida.</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  header: {
    marginTop: 200,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
  },
  tagline: {
    fontSize: 18,
    color: '#FFEDED',
    marginTop: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C70039',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonOutlineText: {
    color: '#FFFFFF',
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    color: '#FFEBEB',
    fontSize: 16,
    textAlign: 'center',
  },
  professorLink: {
    marginTop: 15,
  },
  professorLinkText: {
    color: '#FFF',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default PrincipalPage;