import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

const CadastroProfessor = ({ navigation }) => {
  // Estados
  const [nm_professor, setNome] = useState('');
  const [email_professor, setEmail] = useState('');
  const [cd_senha_pf, setSenha] = useState('');
  const [ds_especialidade, setEspecialidade] = useState('');
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
    if (!nm_professor || !email_professor || !cd_senha_pf || !ds_especialidade) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch('http://192.168.12.234:3000/professores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nm_professor,
          email_professor,
          cd_senha_pf,
          ds_especialidade
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro no cadastro');
      }

      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!');
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', error.message || 'Erro ao conectar com o servidor');
    }
  };

  return (
    <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
      <Text style={styles.title}>Cadastro de Professor</Text>

      <TextInput
        placeholder="Nome completo"
        style={styles.input}
        value={nm_professor}
        onChangeText={setNome}
        placeholderTextColor="#DDD"
        autoCapitalize="words"
      />

      <TextInput
        placeholder="E-mail institucional"
        style={styles.input}
        value={email_professor}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#DDD"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha de acesso"
        style={styles.input}
        value={cd_senha_pf}
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#DDD"
      />

      <TextInput
        placeholder="Especialidade (ex: Musculação, Crossfit)"
        style={styles.input}
        value={ds_especialidade}
        onChangeText={setEspecialidade}
        placeholderTextColor="#DDD"
        autoCapitalize="words"
      />

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCadastro}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Cadastrar Professor</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já possui cadastro? Faça login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// Estilos (reutilizados do Cadastro com pequenos ajustes)
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

export default CadastroProfessor;