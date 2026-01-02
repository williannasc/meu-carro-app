import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, Button, IconButton, Avatar, useTheme } from 'react-native-paper';
import { useVerificarVeiculos } from '../../src/hooks/useVeiculos';
import { useRouter } from 'expo-router';

export default function TelaGerenciarVeiculos() {
  const { listaVeiculos } = useVerificarVeiculos();
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Header seguindo seu padrão azul */}
      <Surface style={styles.header} elevation={1}>
        <View style={styles.headerRow}>
          <IconButton icon="arrow-left" iconColor="white" onPress={() => router.push('/(tabs)/perfil')} />
          <Text style={styles.textoBranco} variant="headlineSmall">Meus Veículos</Text>
        </View>
      </Surface>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Button 
          mode="contained" 
          icon="plus" 
          onPress={() => router.push('/(tabs)/novoVeiculo')}
          style={styles.botaoAdicionar}
        >
          Adicionar Novo Veículo
        </Button>

        {listaVeiculos.map((veiculo) => (
          <Surface key={veiculo.id} style={styles.cardVeiculo} elevation={1}>
            <View style={styles.rowVeiculo}>
              <Avatar.Icon size={48} icon="car" style={{ backgroundColor: '#E8F0FE' }} color="#1A73E8" />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{veiculo.nome}</Text>
                <Text variant="bodySmall" style={{ color: '#666' }}>{veiculo.placa || 'Sem Placa'}</Text>
              </View>
              {/* Botões de Ação */}
              <View style={styles.acoes}>
                <IconButton 
                  icon="pencil" 
                  size={20} 
                  onPress={() => Alert.alert("Em breve", "Edição de veículo será implementada.")} 
                />
              </View>
            </View>
          </Surface>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#1A73E8',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  textoBranco: { color: 'white', fontWeight: 'bold' },
  conteudo: { padding: 20 },
  botaoAdicionar: { marginBottom: 20, borderRadius: 12, paddingVertical: 4 },
  cardVeiculo: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },
  rowVeiculo: { flexDirection: 'row', alignItems: 'center' },
  acoes: { flexDirection: 'row' }
});