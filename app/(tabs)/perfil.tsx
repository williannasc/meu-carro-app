import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, List, Divider, Surface, Button } from 'react-native-paper';
import { autenticacao } from '../../src/api/configuracao';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

export default function TelaPerfil() {
  const router = useRouter();
  const versaoApp = Constants.expoConfig?.version || '1.0.0';
  
  // Dados do usuário vindos do Firebase Auth
  const usuario = autenticacao.currentUser;
  const nomeUsuario = usuario?.displayName || usuario?.email?.split('@')[0] || 'Motorista';
  const emailUsuario = usuario?.email || 'Sem e-mail';

  const lidarComSair = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          onPress: async () => {
            try {
              await signOut(autenticacao);
              router.replace('/login');
            } catch (error) {
              Alert.alert("Erro", "Não foi possível sair.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header seguindo o padrão azul arredondado que você aprovou */}
      <Surface style={styles.header} elevation={1}>
        <View style={styles.avatarContainer}>
          <Avatar.Icon size={80} icon="account" style={styles.avatar} color="white" />
          <Text variant="headlineSmall" style={styles.nomeBranco}>{nomeUsuario}</Text>
          <Text variant="bodyMedium" style={styles.emailBranco}>{emailUsuario}</Text>
        </View>
      </Surface>

      <View style={styles.conteudo}>
        <Text variant="titleMedium" style={styles.secaoTitulo}>Minha Conta</Text>
        
        <Surface style={styles.cardOpcoes} elevation={1}>
          <List.Item
            title="Editar Perfil"
            left={props => <List.Icon {...props} icon="account-edit" color="#1A73E8" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Notificações"
            left={props => <List.Icon {...props} icon="bell" color="#1A73E8" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Surface>

        <Text variant="titleMedium" style={styles.secaoTitulo}>Preferências</Text>
        
        <Surface style={styles.cardOpcoes} elevation={1}>
          <List.Item
            title="Unidades de Medida"
            description="km, litros, R$"
            left={props => <List.Icon {...props} icon="tune" color="#1A73E8" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          {/*MEUS VEICULOS*/ }
          <List.Item
            title="Meus Veículos"
            description="Gerenciar os veículos da sua garagem"
            left={props => <List.Icon {...props} icon="car" color="#1A73E8" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(tabs)/gerenciarVeiculos')}
          />
          <Divider />
          <List.Item
            title="Sobre o App"
            description="Informações sobre o aplicativo"
            left={props => <List.Icon {...props} icon="information" color="#1A73E8" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Surface>

        <Button 
          mode="outlined" 
          onPress={lidarComSair} 
          style={styles.botaoSair}
          textColor="#B00020"
          icon="logout"
        >
          Sair da Conta
        </Button>
        
        <Text variant="bodySmall" style={styles.versao}>Versão {versaoApp}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#1A73E8',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: { alignItems: 'center' },
  avatar: { backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 15 },
  nomeBranco: { color: 'white', fontWeight: 'bold' },
  emailBranco: { color: 'rgba(255,255,255,0.7)' },
  conteudo: { padding: 20 },
  secaoTitulo: { marginBottom: 10, marginTop: 15, fontWeight: 'bold', color: '#666' },
  cardOpcoes: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  botaoSair: { marginTop: 30, borderRadius: 12, borderColor: '#B00020' },
  versao: { textAlign: 'center', marginTop: 20, color: '#999', marginBottom: 40 }
});