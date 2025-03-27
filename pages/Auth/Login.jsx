import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150, easing: Easing.inOut(Easing.ease) });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.12.234:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        switch(data.tipoUsuario) {
          case 'admin':
            navigation.navigate('AdminPage', { 
              usuario: {
                id: data.id,
                nome: data.nome
              }
            });
            break;
          case 'professor':
            navigation.navigate('ProfessorPage', { 
              usuario: {
                id: data.id,
                nm_professor: data.nome,
                ds_especialidade: data.especialidade
              }
            });
            break;
          case 'aluno':
            navigation.navigate('AlunoPage', { 
              usuario: {
                id: data.id,
                nm_aluno: data.nm_aluno, // Corrigido aqui
                cd_peso: data.peso,
                cd_altura: data.altura
              }
            });
            break;
          default:
            Alert.alert('Erro', 'Tipo de usuário desconhecido');
        }
      } else {
        Alert.alert('Erro', data.mensagem || 'Credenciais inválidas');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    }
  };

  return (
    <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput 
        placeholder="E-mail" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        placeholderTextColor="#DDD"
        autoCapitalize="none"
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

// Estilos mantidos conforme anteriorr

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

export default Login;