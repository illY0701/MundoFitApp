import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

const Cadastro = ({ navigation }) => {
  // Estados
  const [nm_aluno, setNome] = useState('');
  const [email_aluno, setEmail] = useState('');
  const [cd_senha_al, setSenha] = useState('');
  const [cd_peso, setPeso] = useState('');
  const [cd_altura, setAltura] = useState('');
  const scale = useSharedValue(1);

  // Animação do botão
  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150, easing: Easing.inOut(Easing.ease) });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) });
  };

  // Processo de cadastro
  const handleCadastro = async () => {
    // Validação básica
    if (!nm_aluno || !email_aluno || !cd_senha_al || !cd_peso || !cd_altura) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    // Validação numérica
    if (isNaN(cd_peso) || isNaN(cd_altura)) {
      Alert.alert('Erro', 'Peso e altura devem ser números válidos');
      return;
    }

    try {
      // Requisição para o backend
      const response = await fetch('http://192.168.12.234:3000/alunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nm_aluno,
          email_aluno,
          cd_senha_al,
          cd_peso: Number(cd_peso),
          cd_altura: Number(cd_altura)
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro no cadastro');
      }

      // Sucesso
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
      
    } catch (error) {
      // Tratamento de erros
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', error.message || 'Erro ao conectar com o servidor');
    }
  };

  return (
    <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        placeholder="Nome completo"
        style={styles.input}
        value={nm_aluno}
        onChangeText={setNome}
        placeholderTextColor="#DDD"
        autoCapitalize="words"
      />

      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email_aluno}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#DDD"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={cd_senha_al}
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#DDD"
      />

      <TextInput
        placeholder="Peso (kg)"
        style={styles.input}
        value={cd_peso}
        onChangeText={setPeso}
        keyboardType="numeric"
        placeholderTextColor="#DDD"
      />

      <TextInput
        placeholder="Altura (cm)"
        style={styles.input}
        value={cd_altura}
        onChangeText={setAltura}
        keyboardType="numeric"
        placeholderTextColor="#DDD"
      />

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCadastro}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// Estilos
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

export default Cadastro;