import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// Componente da Tela Principal
const MainScreen = ({ route, navigation }) => {
  const { usuario } = route.params;
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTreinos = async () => {
    try {
      const response = await fetch(`http://192.168.12.234:3000/treinos?cd_fk_aluno=${usuario.id}`);
      const data = await response.json();
      setTreinos(data);
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreinos();
  }, []);

  return (
    <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <>
          <Text style={styles.screenTitle}>Bem-vindo, {usuario.nm_aluno}!</Text>
          <Text style={styles.sectionTitle}>Seus Treinos Ativos</Text>
          <FlatList
            data={treinos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('TreinoDetalhes', { treinoId: item.id })}
              >
                <Text style={styles.cardTitle}>{item.nm_treino}</Text>
                <Text style={styles.cardText}>Objetivo: {item.ds_objetivo}</Text>
                <Text style={styles.cardDate}>
                  {new Date(item.dt_treino.seconds * 1000).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </LinearGradient>
  );
};

// Componente de Detalhes do Treino
const TreinoScreen = ({ route }) => {
  const [treino, setTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar detalhes do treino
        const treinoResponse = await fetch(`http://192.168.12.234:3000/treinos/${route.params.treinoId}`);
        const treinoData = await treinoResponse.json();
        setTreino(treinoData);

        // Buscar exercícios relacionados
        const exerciciosResponse = await fetch(`http://192.168.12.234:3000/exercicios`);
        const exerciciosData = await exerciciosResponse.json();
        setExercicios(exerciciosData);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <ScrollView>
          <Text style={styles.screenTitle}>{treino.nm_treino}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercícios do Treino</Text>
            {exercicios
              .filter(ex => ex.id === treino.cd_fk_exercicio)
              .map(exercicio => (
                <View key={exercicio.id} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{exercicio.nm_exercicio}</Text>
                  <Text style={styles.exerciseDescription}>{exercicio.ds_exercicio}</Text>
                  <Text style={styles.exerciseType}>Tipo: {exercicio.tipo_exercicio}</Text>
                </View>
              ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.observationsText}>{treino.ds_observacao}</Text>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
};

// Componente de Desempenho
const DesempenhoScreen = ({ route }) => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await fetch(`http://192.168.12.234:3000/historicos?cd_fk_aluno=${route.params.usuario.id}`);
        const data = await response.json();
        setHistorico(data);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  return (
    <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
      <Text style={styles.screenTitle}>Seu Desempenho</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <FlatList
          data={historico}
          renderItem={({ item }) => (
            <View style={styles.historyCard}>
              <Text style={styles.historyDate}>
                {new Date(item.dt_treino_realizado.seconds * 1000).toLocaleDateString()}
              </Text>
              <Text style={styles.historyDetails}>Peso Registrado: {item.cd_fk_peso} kg</Text>
              <Text style={styles.historyComments}>Observações: {item.ds_comentarios}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </LinearGradient>
  );
};

// Componente de Perfil
const PerfilScreen = ({ route }) => {
  const [aluno, setAluno] = useState(route.params.usuario);
  const [editando, setEditando] = useState(false);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://192.168.12.234:3000/alunos/${aluno.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nm_aluno: aluno.nm_aluno,
          cd_peso: aluno.cd_peso,
          cd_altura: aluno.cd_altura
        })
      });

      if (response.ok) {
        setEditando(false);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    }
  };

  return (
    <LinearGradient colors={['#C70039', '#900C3F']} style={styles.container}>
      <Text style={styles.screenTitle}>Meu Perfil</Text>
      
      <View style={styles.profileSection}>
        <Text style={styles.profileLabel}>Nome Completo:</Text>
        {editando ? (
          <TextInput
            style={styles.input}
            value={aluno.nm_aluno}
            onChangeText={(text) => setAluno({...aluno, nm_aluno: text})}
          />
        ) : (
          <Text style={styles.profileText}>{aluno.nm_aluno}</Text>
        )}
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.profileLabel}>Peso Atual:</Text>
        {editando ? (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(aluno.cd_peso)}
            onChangeText={(text) => setAluno({...aluno, cd_peso: Number(text)})}
          />
        ) : (
          <Text style={styles.profileText}>{aluno.cd_peso} kg</Text>
        )}
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.profileLabel}>Altura:</Text>
        {editando ? (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(aluno.cd_altura)}
            onChangeText={(text) => setAluno({...aluno, cd_altura: Number(text)})}
          />
        ) : (
          <Text style={styles.profileText}>{aluno.cd_altura} cm</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={editando ? handleUpdate : () => setEditando(true)}
      >
        <Text style={styles.buttonText}>
          {editando ? 'Salvar Alterações' : 'Editar Perfil'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// Componente Principal de Navegação
const AlunoPage = ({ route }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Início') iconName = 'home';
          if (route.name === 'Treinos') iconName = 'barbell';
          if (route.name === 'Desempenho') iconName = 'stats-chart';
          if (route.name === 'Perfil') iconName = 'person';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopWidth: 0,
          paddingVertical: 5,
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="Início" component={MainScreen} initialParams={route.params} />
      <Tab.Screen name="Treinos" component={TreinoScreen} initialParams={route.params} />
      <Tab.Screen name="Desempenho" component={DesempenhoScreen} initialParams={route.params} />
      <Tab.Screen name="Perfil" component={PerfilScreen} initialParams={route.params} />
    </Tab.Navigator>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cardText: {
    color: '#DDD',
    fontSize: 14,
    marginTop: 5,
  },
  cardDate: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 8,
  },
  section: {
    marginBottom: 25,
  },
  exerciseCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  exerciseName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseDescription: {
    color: '#DDD',
    fontSize: 14,
    marginTop: 5,
  },
  exerciseType: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 5,
  },
  observationsText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  historyDate: {
    color: '#FFD700',
    fontSize: 16,
  },
  historyDetails: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 5,
  },
  historyComments: {
    color: '#DDD',
    fontStyle: 'italic',
    marginTop: 5,
  },
  profileSection: {
    marginBottom: 20,
  },
  profileLabel: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 5,
  },
  profileText: {
    color: '#FFF',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#900C3F',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AlunoPage;