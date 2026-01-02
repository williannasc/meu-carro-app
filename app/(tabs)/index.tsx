import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, ActivityIndicator, Surface, useTheme, Avatar, TouchableRipple } from 'react-native-paper';
import { autenticacao } from '../../src/api/configuracao';
import { useVerificarVeiculos } from '../../src/hooks/useVeiculos';
import { useEstatisticas } from '../../src/hooks/useEstatisticas';
import { useHistorico } from '../../src/hooks/useHistorico';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function TelaHome() {
  const { temVeiculo, listaVeiculos, selecionarVeiculo } = useVerificarVeiculos();
  const [indiceVeiculo, setIndiceVeiculo] = useState(0);
  const theme = useTheme();

  // Identidade do usuário logado
  const nomeUsuario = autenticacao.currentUser?.displayName ||
    autenticacao.currentUser?.email?.split('@')[0] ||
    'Motorista';

  // Lógica do veículo selecionado
  const veiculoSelecionado = listaVeiculos[indiceVeiculo];
  const veiculoId = veiculoSelecionado?.id;

  // Hooks de dados que reagem à mudança do veiculoId
  const { media, gastoTotal } = useEstatisticas(veiculoId);
  const { abastecimentos } = useHistorico(veiculoId);

  // Sincroniza o veículo ativo no carregamento inicial
  useEffect(() => {
    if (veiculoId) {
      selecionarVeiculo(veiculoId);
    }
  }, [veiculoId]);

  if (temVeiculo === null) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator animating={true} color="#1A73E8" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER PREMIUM */}
      <View style={styles.header}>
        <View>
          <Text variant="bodyLarge" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Bem-vindo de volta,
          </Text>
          <Text variant="headlineMedium" style={styles.tituloHeader}>
            {nomeUsuario}
          </Text>
        </View>
        <TouchableRipple
          onPress={() => router.push('/perfil')}
          rippleColor="rgba(255, 255, 255, .3)"
          borderless={true}
          style={{ borderRadius: 24 }}
        >
          <Avatar.Icon size={48} icon="account" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="white" />
        </TouchableRipple>
      </View>

      {/* CARROSSEL DE VEÍCULOS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center" // Mude para center para melhor foco
        decelerationRate="fast"
        snapToInterval={width * 0.7 + 20} // Ajuste proporcional ao novo width do card
        style={styles.scrollCarrossel}
        contentContainerStyle={{ paddingHorizontal: 15 }} // Garante que o primeiro card não cole no canto
      >
        {listaVeiculos.map((veiculo, index) => (
          <Surface
            key={veiculo.id}
            style={[
              styles.cardCarrossel,
              indiceVeiculo === index && { borderColor: '#FFF', borderWidth: 2 }
            ]}
            elevation={indiceVeiculo === index ? 4 : 1}
          >
            <TouchableRipple
              onPress={() => {
                setIndiceVeiculo(index);
                selecionarVeiculo(veiculo.id); // Esta é a chave para as outras telas
              }}
              rippleColor="rgba(255, 255, 255, .3)"
              style={styles.ripple}
            >
              <View style={{ padding: 15 }}>
                <Text
                  variant="titleMedium"
                  style={{ color: 'white', fontWeight: 'bold' }}
                >
                  {veiculo.nome}
                </Text>
                <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {veiculo.placa || 'Sem Placa Informada'}
                </Text>
              </View>
            </TouchableRipple>
          </Surface>
        ))}
      </ScrollView>

      <View style={styles.conteudo}>
        {/* CARD DE CONSUMO MÉDIO */}
        <Surface style={styles.cardPrincipal} elevation={4}>
          <Text variant="labelLarge" style={styles.labelBranco}>CONSUMO MÉDIO ATUAL</Text>
          <View style={styles.row}>
            <Text variant="displayMedium" style={styles.valorPrincipal}>
              {media ? media.toString().replace('.', ',') : '--'}
            </Text>
            <Text variant="headlineSmall" style={styles.unidade}>km/l</Text>
          </View>
          <View style={styles.divisor} />
          <Text variant="bodySmall" style={styles.labelBranco}>Cálculo baseado em tanque cheio</Text>
        </Surface>

        <View style={styles.grid}>
          {/* CARD DE GASTOS */}
          <Surface style={[styles.cardInfo, { borderLeftColor: '#4CAF50', borderLeftWidth: 5 }]} elevation={1}>
            <Avatar.Icon size={32} icon="cash" style={styles.miniIcon} color="#4CAF50" />
            <Text variant="labelMedium" style={styles.labelCinza}>GASTO RECENTE</Text>
            <Text variant="titleLarge" style={styles.valorNegrito}>R$ {gastoTotal.toFixed(2)}</Text>
          </Surface>

          {/* CARD DE KM */}
          <Surface style={[styles.cardInfo, { borderLeftColor: '#FF9800', borderLeftWidth: 5 }]} elevation={1}>
            <Avatar.Icon size={32} icon="speedometer" style={styles.miniIcon} color="#FF9800" />
            <Text variant="labelMedium" style={styles.labelCinza}>ÚLTIMO ODÔMETRO</Text>
            <Text variant="titleLarge" style={styles.valorNegrito}>{veiculoSelecionado?.quilometragemAtual || 0} km</Text>
          </Surface>
        </View>

        {/* LISTA DE HISTÓRICO */}
        <Text variant="titleMedium" style={styles.secaoTitulo}>
          Últimos Abastecimentos
        </Text>
        {abastecimentos.map((item) => (
          <Surface key={item.id} style={styles.cardHistorico} elevation={1}>
            <View style={styles.rowHistorico}>
              <Avatar.Icon size={36} icon="gas-station" style={{ backgroundColor: '#E8F0FE' }} color="#1A73E8" />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                  {item.data?.seconds ? new Date(item.data.seconds * 1000).toLocaleDateString('pt-BR') : 'Data Indisp.'}
                </Text>
                <Text variant="bodySmall" style={{ color: '#666' }}>{item.litros}L • {item.quilometragem} km</Text>
              </View>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#1A1C1E' }}>
                R$ {item.valorTotal?.toFixed(2)}
              </Text>
            </View>
          </Surface>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#1A73E8',
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tituloHeader: { color: 'white', fontWeight: 'bold' },
  conteudo: { paddingHorizontal: 20, marginTop: -50 },
  scrollCarrossel: {
    marginTop: -30, // Reduzi o negativo para não subir demais no texto
    marginBottom: 50,
    height: 110 // Altura fixa para não empurrar o card preto de forma estranha
  },
  cardCarrossel: {
    backgroundColor: '#3b82f6', // Um azul levemente diferente para destacar do fundo
    width: width * 0.7, // Um pouco maior para preencher melhor a tela
    height: 90,
    borderRadius: 20,
    marginRight: 15,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  ripple: { flex: 1, justifyContent: 'center' },
  cardPrincipal: {
    backgroundColor: '#1E1E1E',
    borderRadius: 28,
    padding: 25,
    marginBottom: 20,
  },
  labelBranco: { color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', fontSize: 10 },
  row: { flexDirection: 'row', alignItems: 'baseline', marginTop: 10 },
  valorPrincipal: { color: 'white', fontWeight: 'bold' },
  unidade: { color: '#4CAF50', marginLeft: 8, fontWeight: 'bold' },
  divisor: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  cardInfo: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    width: (width - 55) / 2,
  },
  miniIcon: { backgroundColor: 'transparent', marginBottom: 5 },
  labelCinza: { color: '#757575', fontSize: 10, fontWeight: 'bold' },
  valorNegrito: { fontWeight: 'bold', color: '#1A1C1E' },
  secaoTitulo: { marginBottom: 15, color: '#1A1C1E', fontWeight: 'bold' },
  cardHistorico: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  rowHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});