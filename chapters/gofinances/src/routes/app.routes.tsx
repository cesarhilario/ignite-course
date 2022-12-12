import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Summary } from '../screens/Summary';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        },
      }}
    >
      <Screen
        name="Listing"
        component={Dashboard}
        options={{
          tabBarLabel: 'Listagem',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="format-list-bulleted" size={size} color={color} />
          ),
        }}
      />
      <Screen
        name="Register"
        component={Register}
        options={{
          tabBarLabel: 'Cadastrar',
          tabBarIcon: ({ size, color }) => <MaterialIcons name="attach-money" size={size} color={color} />,
        }}
      />
      <Screen
        name="Summary"
        component={Summary}
        options={{
          tabBarLabel: 'Resumo',
          tabBarIcon: ({ size, color }) => <MaterialIcons name="pie-chart" size={size} color={color} />,
        }}
      />
    </Navigator>
  );
}
