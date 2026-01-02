import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { autenticacao } from '../src/api/configuracao';
import { useRouter } from 'expo-router';

export default function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const router = useRouter();

  const lidarComAcesso = async () => {
    if (!email || !senha) return;
    setCarregando(true);
    setErro('');
    
    try {
      await signInWithEmailAndPassword(autenticacao, email, senha);
      router.replace('/(tabs)');
    } catch (err: any) {
      setErro('E-mail ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  const criarNovaConta = async () => {
    if (!email || !senha) return;
    setCarregando(true);
    try {
      await createUserWithEmailAndPassword(autenticacao, email, senha);
      router.replace('/(tabs)');
    } catch (err: any) {
      setErro('Erro ao criar conta. Verifique os dados.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Surface style={styles.card} elevation={1}>
          <Text variant="headlineMedium" style={styles.titulo}>Meu Carro</Text>
          <Text variant="bodyMedium" style={styles.subtitulo}>Seu diário de bordo minimalista</Text>

          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          {erro ? <HelperText type="error">{erro}</HelperText> : null}

          <Button 
            mode="contained" 
            onPress={lidarComAcesso} 
            loading={carregando}
            style={styles.botao}
          >
            Entrar
          </Button>

          <Button 
            mode="text" 
            onPress={criarNovaConta}
            disabled={carregando}
          >
            Criar nova conta
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { padding: 25, borderRadius: 24, backgroundColor: '#fff' },
  titulo: { textAlign: 'center', fontWeight: 'bold', color: '#1A73E8' },
  subtitulo: { textAlign: 'center', marginBottom: 25, color: '#666' },
  input: { marginBottom: 12 },
  botao: { marginTop: 10, paddingVertical: 4 },
});