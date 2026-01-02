import { bancoDados, autenticacao } from './configuracao';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function cadastrarVeiculo(nome: string, placa: string, kmInicial: number) {
  const usuarioId = autenticacao.currentUser?.uid;
  if (!usuarioId) throw new Error("Usuário não logado");

  try {
    const refVeiculos = collection(bancoDados, 'usuarios', usuarioId, 'veiculos');
    await addDoc(refVeiculos, {
      nome,
      placa,
      quilometragemAtual: Number(kmInicial),
      dataCriacao: serverTimestamp(),
    });
    return { sucesso: true };
  } catch (e) {
    throw e;
  }
}