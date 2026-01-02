import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LayoutAbas() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1A73E8' }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Resumo',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="car" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="abastecimento"
        options={{
          headerShown: false,
          title: 'Abastecer',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="gas-station" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="novoVeiculo"
        options={{
          href: null, // Esconde a aba
          headerShown: false,
          title: 'Veículos',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="car" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manutencao"
        options={{
          headerShown: false,
          title: 'Manutenção',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="wrench" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          headerShown: false,
          title: 'Perfil',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gerenciarVeiculos"
        options={{
          href: null, // Escondido da barra de abas
          headerShown: false,
        }}
      />
    </Tabs>
  );
}