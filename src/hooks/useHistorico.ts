import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { bancoDados, autenticacao } from '../api/configuracao';

export function useHistorico(veiculoId: string) {
  const [abastecimentos, setAbastecimentos] = useState<any[]>([]);

  useEffect(() => {
    const usuarioId = autenticacao.currentUser?.uid;
    if (!usuarioId || !veiculoId) return;

    const ref = collection(bancoDados, 'usuarios', usuarioId, 'veiculos', veiculoId, 'abastecimentos');
    const q = query(ref, orderBy('data', 'desc'), limit(5));

    const desinscrever = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAbastecimentos(dados);
    });

    return () => desinscrever();
  }, [veiculoId]);

  return { abastecimentos };
}