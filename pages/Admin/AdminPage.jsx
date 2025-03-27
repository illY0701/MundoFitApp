import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

const AdminPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150, easing: Easing.inOut(Easing.ease) });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) });
  };

  const testarConexao = async () => {
    try {
      const response = await fetch('http://192.168.12.234:3000/health');
      const data = await response.json();
      console.log('Resposta do health check:', data);
      return response.ok;
    } catch (error) {
      console.error('Falha no health check:', error);
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      // Teste de conexão inicial
      const conexaoOk = await testarConexao();
      if (!conexaoOk) {
        Alert.alert('Erro', 'Servidor offline. Verifique a conexão');
        return;
      }

      const response = await fetch('http://192.168.12.234:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro na autenticação');
      }

      switch(data.tipoUsuario) {
        case 'admin':
          navigation.navigate('AdminPage');
          break;
        case 'professor':
          navigation.navigate('ProfessorPage', { id: data.id });
          break;
        case 'aluno':
          navigation.navigate('AlunoPage', { id: data.id });
          break;
        default:
          Alert.alert('Erro', 'Tipo de usuário desconhecido');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      Alert.alert('Erro', error.message || 'Erro na comunicação com o servidor');
    }
  };

  return (
    <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
      <Text style={styles.title}>ESSE É ADMIN</Text>
      
      <TextInput 
        placeholder="E-mail" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#DDD"
      />
      
      <TextInput 
        placeholder="Senha" 
        style={styles.input} 
        value={senha} 
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#DDD"
      />

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// Mantenha os estilos conforme anterior

// Estilos (mantidos conforme anterior)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    color: '#FFF',
    marginBottom: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 14,
    marginVertical: 8,
    borderRadius: 8,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'rgba(92, 6, 6, 0.5)',
    paddingVertical: 14,
    paddingHorizontal: 35,
    marginTop: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  linkText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
    opacity: 0.9,
  },
});

export default AdminPage;