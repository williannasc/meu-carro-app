import { bancoDados, autenticacao } from './configuracao';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function registrarManutencao(
  veiculoId: string, 
  tipo: string, 
  descricao: string, 
  km: number, 
  valor: number,
  proximaTrocaKm?: number, 
  proximaTrocaData?: string, 
  filtros?: { oleo: boolean, ar: boolean, combustivel: boolean, cabine: boolean }
) {
  const usuarioId = autenticacao.currentUser?.uid;
  if (!usuarioId) throw new Error("Não autenticado");

  const ref = collection(bancoDados, 'usuarios', usuarioId, 'veiculos', veiculoId, 'manutencoes');
  return await addDoc(ref, {
    tipo, 
    descricao,
    quilometragem: Number(km),
    valor: Number(valor),
    proximaTrocaKm: proximaTrocaKm ? Number(proximaTrocaKm) : null,
    proximaTrocaData: proximaTrocaData || null,
    filtros: filtros || null,
    data: serverTimestamp(),
  });
}