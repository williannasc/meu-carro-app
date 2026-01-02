import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Checkbox, Surface, TouchableRipple, Divider } from 'react-native-paper';
import { useVerificarVeiculos } from '../../src/hooks/useVeiculos';
import { registrarAbastecimento } from '../../src/api/abastecimento';

const { width } = Dimensions.get('window');

const TIPOS_COMBUSTIVEL = [
  { label: 'Gasolina Comum' },
  { label: 'Gasolina Aditivada' },
  { label: 'Etanol' },
  { label: 'GNV' },
  { label: 'Diesel S10' },
  { label: 'Diesel S500 (Comum)' },
  
];

export default function TelaAbastecimento() {
  const { listaVeiculos, veiculoAtivoId, selecionarVeiculo } = useVerificarVeiculos();
  const [indiceLocal, setIndiceLocal] = useState(0);

  const [km, setKm] = useState('');
  const [litros, setLitros] = useState('');
  const [valor, setValor] = useState('');
  const [tanqueCheio, setTanqueCheio] = useState(true);
  const [carregando, setCarregando] = useState(false);
  
  const [tipoSelecionado, setTipoSelecionado] = useState('Gasolina Comum');


  // Sincroniza o índice local com o veículo ativo global
  useEffect(() => {
    const idx = listaVeiculos.findIndex(v => v.id === veiculoAtivoId);
    if (idx !== -1) setIndiceLocal(idx);
  }, [veiculoAtivoId, listaVeiculos]);

  const veiculoAtual = listaVeiculos[indiceLocal];

  const salvarAbastecimento = async () => {
    if (!km || !litros || !valor) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    setCarregando(true);
    try {
      await registrarAbastecimento(veiculoAtual.id, Number(km), Number(litros), Number(valor), tanqueCheio, tipoSelecionado);
      Alert.alert("Sucesso", `Abastecimento de ${tipoSelecionado} registrado para o ${veiculoAtual.nome}!`);
      setKm(''); setLitros(''); setValor('');
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Surface style={styles.header} elevation={1}>
        <Text style={{ color: 'white', fontWeight: 'bold' }} variant="headlineSmall">Registrar Abastecimento</Text>
      </Surface>

      {/* CARROSSEL DE SELEÇÃO RÁPIDA */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={width * 0.6 + 15}
        style={styles.scrollCarrossel}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {listaVeiculos.map((veiculo, index) => (
          <Surface
            key={veiculo.id}
            style={[
              styles.cardCarrossel,
              indiceLocal === index && { borderColor: '#1A73E8', borderWidth: 2, backgroundColor: '#E8F0FE' }
            ]}
            elevation={indiceLocal === index ? 2 : 1}
          >
            <TouchableRipple
              onPress={() => {
                setIndiceLocal(index);
                selecionarVeiculo(veiculo.id);
              }}
              style={styles.ripple}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: indiceLocal === index ? '#1A73E8' : '#fff' }}>
                  {veiculo.nome}
                </Text>
                <Text variant="bodySmall" style={{ color: '#000' }}>{veiculo.placa || 'Sem Placa Informada'}</Text>
              </View>
            </TouchableRipple>
          </Surface>
        ))}
      </ScrollView>
      <View style={{ paddingLeft: 20, paddingRight: 20 }} >


        <Text variant="labelLarge" style={styles.subtituloDinamico}>Combustível</Text>

        <View style={styles.gridCombustivel}>
          {TIPOS_COMBUSTIVEL.map((combustivel) => (
            <TouchableOpacity
              key={combustivel.label}
              onPress={() => setTipoSelecionado(combustivel.label)}
              style={[
                styles.checkboxItem,
                tipoSelecionado === combustivel.label && { backgroundColor: '#E8F0FE', borderColor: '#1A73E8' }
              ]}
            >
              <Checkbox
                status={tipoSelecionado === combustivel.label ? 'checked' : 'unchecked'}
                onPress={() => setTipoSelecionado(combustivel.label)}
                color="#1A73E8"
              />
              <Text variant="bodyMedium">{combustivel.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.form}>
        <Text variant="labelLarge" style={styles.subtituloDinamico}>Dados do Abastecimento</Text>
        <TextInput label="KM Atual" value={km} onChangeText={setKm} keyboardType="numeric" mode="outlined" style={styles.input} left={<TextInput.Icon icon="speedometer" />} />
        <TextInput label="Litros" value={litros} onChangeText={setLitros} keyboardType="numeric" mode="outlined" style={styles.input} left={<TextInput.Icon icon="gas-station" />} />
        <TextInput label="Valor Total (R$)" value={valor} onChangeText={setValor} keyboardType="numeric" mode="outlined" style={styles.input} left={<TextInput.Icon icon="currency-usd" />} />

        <View style={styles.checkboxRow}>
          <Checkbox status={tanqueCheio ? 'checked' : 'unchecked'} onPress={() => setTanqueCheio(!tanqueCheio)} color="#1A73E8" />
          <Text onPress={() => setTanqueCheio(!tanqueCheio)}>Tanque Cheio (para média)</Text>
        </View>

        <Button mode="contained" onPress={salvarAbastecimento} loading={carregando} style={styles.botao}>
          Confirmar Lançamento
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  header: { paddingTop: 60, padding: 30, backgroundColor: '#1A73E8', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  scrollCarrossel: { marginTop: 20, marginBottom: 10 },
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
  form: { padding: 20 },
  input: { marginBottom: 15, backgroundColor: 'white' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  botao: { paddingVertical: 8, borderRadius: 12 },
  
  subtituloDinamico: { color: '#1A73E8', fontWeight: 'bold', marginBottom: 10 },
  gridCombustivel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Faz caber dois por linha
    marginBottom: 5,
  },
});