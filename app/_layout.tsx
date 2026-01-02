import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native'; // Importe estes
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { autenticacao } from '../src/api/configuracao';
import { PaperProvider } from 'react-native-paper';
import { temaCustomizado } from '../src/temas/configuracao';

export default function RootLayout() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    // O onAuthStateChanged é assíncrono, ele demora alguns milissegundos
    const desinscrever = onAuthStateChanged(autenticacao, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return desinscrever;
  }, []);

  useEffect(() => {
    if (carregando) return;

    const estaNaAreaLogada = segmentos[0] === '(tabs)';

    if (!usuario && estaNaAreaLogada) {
      router.replace('/login');
    } else if (usuario && !estaNaAreaLogada) {
      router.replace('/(tabs)');
    }
  }, [usuario, carregando, segmentos]);

  // --- SPINNER LOADING ---
  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1A73E8" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={temaCustomizado}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        
      </Stack>
    </PaperProvider>
  );
}