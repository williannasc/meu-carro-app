import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { bancoDados, autenticacao } from '../api/configuracao';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useVerificarVeiculos() {
  const [temVeiculo, setTemVeiculo] = useState<boolean | null>(null);
  const [listaVeiculos, setListaVeiculos] = useState<any[]>([]);
  const [veiculoAtivoId, setVeiculoAtivoId] = useState<string | null>(null);

  useEffect(() => {
    const usuarioId = autenticacao.currentUser?.uid;
    if (!usuarioId) return;

    const refVeiculos = collection(bancoDados, 'usuarios', usuarioId, 'veiculos');
    
    const desinscrever = onSnapshot(refVeiculos, async (snapshot) => {
      const veiculosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setListaVeiculos(veiculosData);
      setTemVeiculo(veiculosData.length > 0);

      // Tenta recuperar o veículo que foi selecionado no carrossel da Home
      const salvo = await AsyncStorage.getItem('@veiculo_ativo');
      if (salvo) {
        setVeiculoAtivoId(salvo);
      } else if (veiculosData.length > 0) {
        setVeiculoAtivoId(veiculosData[0].id);
      }
    });

    return () => desinscrever();
  }, []);

  const selecionarVeiculo = async (id: string) => {
    setVeiculoAtivoId(id);
    await AsyncStorage.setItem('@veiculo_ativo', id);
  };

  return { temVeiculo, listaVeiculos, veiculoAtivoId, selecionarVeiculo };
}