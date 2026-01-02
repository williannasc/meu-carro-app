import { bancoDados, autenticacao } from './configuracao';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export async function registrarAbastecimento(veiculoId: string, km: number, litros: number, valor: number, tanqueCheio: boolean, tipoCombustivel: string) {
  const usuarioId = autenticacao.currentUser?.uid;
  if (!usuarioId) throw new Error("Usuário não autenticado");

  try {
    // 1. Salva o histórico de abastecimento
    const refAbastecimentos = collection(bancoDados, 'usuarios', usuarioId, 'veiculos', veiculoId, 'abastecimentos');
    await addDoc(refAbastecimentos, {
      quilometragem: Number(km),
      litros: Number(litros),
      valorTotal: Number(valor),
      tanqueCheio,
      tipoCombustivel,
      data: serverTimestamp(),
    });

    // 2. Atualiza a quilometragem atual no documento do veículo
    const refVeiculo = doc(bancoDados, 'usuarios', usuarioId, 'veiculos', veiculoId);
    await updateDoc(refVeiculo, {
      quilometragemAtual: Number(km)
    });

    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao abastecer:", erro);
    throw erro;
  }
}