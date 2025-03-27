import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PrincipalPage from './pages/PrincipalPage';
import Login from './pages/Auth/Login';
import Cadastro from './pages/Auth/Cadastro';
import CadastroProfessor from './pages/Auth/CadastroProfessor';
import AlunoPage from './pages/Aluno/AlunoPage';
import ProfessorPage from './pages/Instrutor/ProfessorPage';
import AdminPage from './pages/Admin/AdminPage';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Principal" component={PrincipalPage} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="CadastroProfessor" component={CadastroProfessor} />
        <Stack.Screen name="AlunoPage" component={AlunoPage} />
        <Stack.Screen name="ProfessorPage" component={ProfessorPage} />
        <Stack.Screen name="AdminPage" component={AdminPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
