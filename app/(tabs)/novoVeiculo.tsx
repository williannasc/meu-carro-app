import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Appbar, HelperText, Surface, IconButton } from 'react-native-paper';
import { cadastrarVeiculo } from '../../src/api/garagem';
import { useRouter } from 'expo-router';

export default function TelaNovoVeiculo() {
    const [nome, setNome] = useState('');
    const [placa, setPlaca] = useState('');
    const [quilometragem, setQuilometragem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const router = useRouter();

    const lidarComCadastro = async () => {
        // Validação simples de engenharia
        if (!nome || !quilometragem) {
            Alert.alert("Atenção", "O nome do carro e a quilometragem são obrigatórios.");
            return;
        }

        setCarregando(true);
        try {
            await cadastrarVeiculo(nome, placa, Number(quilometragem));
            // Após salvar, voltamos para a Home que já estará com o Hook rodando
            router.replace('/(tabs)');
        } catch (erro: any) {
            Alert.alert("Erro", "Não foi possível salvar o veículo. Tente novamente.");
            console.error(erro);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Cabeçalho Material Design 3 */}
        <Surface style={styles.header} elevation={1}>
                <View style={styles.headerRow}>
                  <IconButton icon="arrow-left" iconColor="white" onPress={() => router.push('/(tabs)/gerenciarVeiculos')} />
                  <Text style={styles.textoBranco} variant="headlineSmall">Adicionar Veículo</Text>
                </View>
              </Surface>

            <ScrollView contentContainerStyle={styles.conteudo}>
                <Text variant="titleMedium" style={styles.tituloSecao}>
                    Dados do Veículo
                </Text>

                <TextInput
                    label="Apelido do Carro (ex: Meu Onix)"
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    style={styles.input}
                    placeholder="Como você chama seu carro?"
                    left={<TextInput.Icon icon="car-info" />}
                />

                <TextInput
                    label="Placa (opcional)"
                    value={placa}
                    onChangeText={setPlaca}
                    mode="outlined"
                    style={styles.input}
                    autoCapitalize="characters"
                    placeholder="ABC-1234"
                    left={<TextInput.Icon icon="card-account-details" />}
                />

                <TextInput
                    label="Quilometragem Atual"
                    value={quilometragem}
                    onChangeText={setQuilometragem}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Ex: 45000"
                    left={<TextInput.Icon icon="speedometer" />}
                />
                <HelperText type="info">
                    Usaremos este valor para calcular suas próximas revisões.
                </HelperText>

                <Button
                    mode="contained"
                    onPress={lidarComCadastro}
                    loading={carregando}
                    disabled={carregando}
                    style={styles.botao}
                    contentStyle={styles.botaoInterno}
                >
                    Salvar na Garagem
                </Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    conteudo: { padding: 20 },
    tituloSecao: { marginBottom: 20, color: '#1A73E8' },
    input: { marginBottom: 12 },
    botao: { marginTop: 20, borderRadius: 12 },
    botaoInterno: { paddingVertical: 8 },
    
  textoBranco: { color: 'white', fontWeight: 'bold'  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#1A73E8',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
});