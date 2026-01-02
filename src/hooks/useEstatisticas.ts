import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { bancoDados, autenticacao } from '../api/configuracao';

export function useEstatisticas(veiculoId: string) {
  const [media, setMedia] = useState<number | null>(null);
  const [gastoTotal, setGastoTotal] = useState(0);

  useEffect(() => {
    const usuarioId = autenticacao.currentUser?.uid;
    if (!usuarioId || !veiculoId) return;

    const refAbastecimentos = collection(bancoDados, 'usuarios', usuarioId, 'veiculos', veiculoId, 'abastecimentos');
    const q = query(refAbastecimentos, orderBy('data', 'desc'), limit(2));

    const desinscrever = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => d.data());
      
      // Cálculo do Gasto Total (Simples soma de todos, aqui limitado aos 2 para exemplo)
      const total = docs.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
      setGastoTotal(total);

      // Lógica da Média: Precisa de pelo menos 2 abastecimentos
      if (docs.length === 2) {
        const kmAtual = docs[0].quilometragem;
        const kmAnterior = docs[1].quilometragem;
        const litros = docs[0].litros;

        if (litros > 0) {
          const calculo = (kmAtual - kmAnterior) / litros;
          setMedia(parseFloat(calculo.toFixed(2)));
        }
      }
    });

    return () => desinscrever();
  }, [veiculoId]);

  return { media, gastoTotal };
}