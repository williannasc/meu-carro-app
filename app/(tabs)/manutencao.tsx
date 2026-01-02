import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, Chip, Divider, Checkbox } from 'react-native-paper';
import { useVerificarVeiculos } from '../../src/hooks/useVeiculos';
import { registrarManutencao } from '../../src/api/manutencao';

const TIPOS_MANUTENCAO = [
  { label: 'Óleo', icon: 'oil' },
  { label: 'Pneus', icon: 'tire' },
  { label: 'Freios', icon: 'car-brake-abs' },
  { label: 'Motor', icon: 'engine' },
  { label: 'Suspensão', icon: 'car-cog' },
  { label: 'Outros', icon: 'wrench' },
];

export default function TelaManutencao() {
  const { listaVeiculos, veiculoAtivoId } = useVerificarVeiculos();
  const [tipoSelecionado, setTipoSelecionado] = useState('Óleo');

  // Estados comuns
  const [km, setKm] = useState('');
  const [valor, setValor] = useState('');
  const [proximoKm, setProximoKm] = useState('');

  // Estados específicos (Óleo)
  const [viscosidade, setViscosidade] = useState('');
  const [marcaOleo, setMarcaOleo] = useState('');
  const [especificacao, setEspecificacao] = useState('');

  // Estados específicos (Pneus)
  const [marcaPneu, setMarcaPneu] = useState('');
  const [medidaPneu, setMedidaPneu] = useState('');

  const [carregando, setCarregando] = useState(false);

  // Estado filtros
  const [filtroOleo, setFiltroOleo] = useState(true);
  const [filtroAr, setFiltroAr] = useState(false);
  const [filtroCombustivel, setFiltroCombustivel] = useState(false);
  const [filtroCabine, setFiltroCabine] = useState(false);

  const veiculoAtual = listaVeiculos.find(v => v.id === veiculoAtivoId) || listaVeiculos[0];

  const salvar = async () => {
    if (!km) return Alert.alert("Erro", "A quilometragem é obrigatória.");
    setCarregando(true);

    let infoExtra = "";
    if (tipoSelecionado === 'Óleo') infoExtra = `${marcaOleo} ${viscosidade} ${especificacao}`;
    if (tipoSelecionado === 'Pneus') infoExtra = `${marcaPneu} ${medidaPneu}`;

    try {
      await registrarManutencao(
        veiculoAtivoId || listaVeiculos[0]?.id,
        tipoSelecionado,
        infoExtra || `Manutenção de ${tipoSelecionado}`,
        Number(km),
        Number(valor),
        proximoKm ? Number(proximoKm) : undefined
      );
      Alert.alert("Sucesso", "Registro de oficina salvo!");
      limparCampos();
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar.");
    } finally { setCarregando(false); }
  };

  const limparCampos = () => {
    setKm(''); setValor(''); setProximoKm('');
    setViscosidade(''); setMarcaOleo(''); setEspecificacao('');
    setMarcaPneu(''); setMedidaPneu('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Surface style={styles.header} elevation={1}>
        <Text style={styles.textoBranco} variant="headlineSmall">Nova Manutenção</Text>
        <Text style={styles.textoBranco} variant="bodyMedium">
          Veículo selecionado: {veiculoAtual?.nome || 'Carregando...'}
        </Text>
      </Surface>

      <View style={styles.form}>
        <Text variant="titleMedium" style={styles.labelSecao}>Selecione o Serviço</Text>

        <View style={styles.chipGroup}>
          {TIPOS_MANUTENCAO.map((item) => {
            const estaSelecionado = tipoSelecionado === item.label;
            return (
              <Chip
                key={item.label}
                selected={estaSelecionado}
                onPress={() => setTipoSelecionado(item.label)}
                style={[
                  styles.chip,
                  estaSelecionado ? styles.chipSelecionado : styles.chipInativo
                ]}
                icon={item.icon}
                mode="outlined"
                // CORREÇÃO: Cor do texto e ícone muda baseada na seleção
                selectedColor={estaSelecionado ? "white" : "#1A73E8"}
                showSelectedCheck={false}
              >
                <Text style={{ color: estaSelecionado ? 'white' : '#1A73E8' }}>
                  {item.label}
                </Text>
              </Chip>
            );
          })}
        </View>

        <TextInput
          label="KM Atual"
          value={km}
          onChangeText={setKm}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="speedometer" />}
        />

        {/* CAMPOS DINÂMICOS PARA ÓLEO */}
        {tipoSelecionado === 'Óleo' && (
          <View style={styles.areaDinamica}>

            <Text variant="labelLarge" style={styles.subtituloDinamico}>Detalhes do Óleo</Text>
            <View style={styles.row}>
              <TextInput label="Viscosidade" value={viscosidade} onChangeText={setViscosidade} mode="outlined" style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="5W30" />
              <TextInput label="Marca" value={marcaOleo} onChangeText={setMarcaOleo} mode="outlined" style={[styles.input, { flex: 1 }]} />
            </View>
            <TextInput label="Especificação" value={especificacao} onChangeText={setEspecificacao} mode="outlined" style={styles.input} placeholder="API SN, ACEA A3/B4" />

            <Divider style={{ marginVertical: 10 }} />

            <Text variant="labelLarge" style={styles.subtituloDinamico}>Filtros Trocados</Text>

            <View style={styles.gridFiltros}>
              <View style={styles.checkboxItem}>
                <Checkbox
                  status={filtroOleo ? 'checked' : 'unchecked'}
                  onPress={() => setFiltroOleo(!filtroOleo)}
                  color="#1A73E8"
                />
                <Text variant="bodyMedium">Óleo do Motor</Text>
              </View>

              <View style={styles.checkboxItem}>
                <Checkbox
                  status={filtroAr ? 'checked' : 'unchecked'}
                  onPress={() => setFiltroAr(!filtroAr)}
                  color="#1A73E8"
                />
                <Text variant="bodyMedium">Ar do Motor</Text>
              </View>

              <View style={styles.checkboxItem}>
                <Checkbox
                  status={filtroCombustivel ? 'checked' : 'unchecked'}
                  onPress={() => setFiltroCombustivel(!filtroCombustivel)}
                  color="#1A73E8"
                />
                <Text variant="bodyMedium">Combustível</Text>
              </View>

              <View style={styles.checkboxItem}>
                <Checkbox
                  status={filtroCabine ? 'checked' : 'unchecked'}
                  onPress={() => setFiltroCabine(!filtroCabine)}
                  color="#1A73E8"
                />
                <Text variant="bodyMedium">Cabine (A/C)</Text>
              </View>
            </View>


          </View>
        )}

        {/* CAMPOS DINÂMICOS PARA PNEUS */}
        {tipoSelecionado === 'Pneus' && (
          <View style={styles.areaDinamica}>
            <Text variant="labelLarge" style={styles.subtituloDinamico}>Detalhes dos Pneus</Text>
            <TextInput label="Marca/Modelo" value={marcaPneu} onChangeText={setMarcaPneu} mode="outlined" style={styles.input} />
            <TextInput label="Medida" value={medidaPneu} onChangeText={setMedidaPneu} mode="outlined" style={styles.input} placeholder="205/55 R16" />
          </View>
        )}

        <TextInput
          label="Valor Total (R$)"
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="currency-usd" />}
        />

        <Divider style={styles.divisor} />

        {tipoSelecionado === 'Óleo' && (
          <View>
          <Text variant="titleMedium" style={styles.labelPrazo}>Previsão de Próxima Troca</Text>
          <TextInput
            label="Próxima troca com (KM)"
            value={proximoKm}
            onChangeText={setProximoKm}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            placeholder="Ex: 60000"
          />
          <TextInput
            label="Próxima troca em (Data)"
            value={''}
            onChangeText={() => { }}
            mode="outlined"
            style={styles.input}
            placeholder="Ex: 01/01/2027"
            disabled
        />
        </View>
        )}

        <Button mode="contained" onPress={salvar} loading={carregando} style={styles.botao}>
          Salvar Manutenção
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  header: {
    paddingTop: 60,
    padding: 30,
    backgroundColor: '#1A73E8',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  textoBranco: { color: 'white' },
  form: { padding: 20 },
  labelSecao: { marginBottom: 12, fontWeight: 'bold', color: '#444' },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { borderRadius: 12 },
  chipSelecionado: { backgroundColor: '#1A73E8', borderColor: '#1A73E8' },
  chipInativo: { backgroundColor: 'white', borderColor: '#1A73E8' },
  areaDinamica: { backgroundColor: '#E8F0FE', padding: 15, borderRadius: 16, marginBottom: 15 },
  subtituloDinamico: { color: '#1A73E8', fontWeight: 'bold', marginBottom: 10 },
  input: { marginBottom: 12, backgroundColor: 'white' },
  row: { flexDirection: 'row' },
  divisor: { marginVertical: 15 },
  labelPrazo: { marginBottom: 10, color: '#1A73E8', fontWeight: 'bold' },
  botao: { paddingVertical: 8, borderRadius: 12, marginTop: 10 },
  gridFiltros: {
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