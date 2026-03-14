import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import React from 'react';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

function TabIcon({ name, color, size = 22 }: { name: IoniconsName; color: string; size?: number }) {
    return <Ionicons name={name} size={size} color={color} />
}

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    height: 64,
                    paddingBottom: 10,
                    paddingTop: 4,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.white,
                headerTitleStyle: { fontWeight: 'bold', fontSize: 17 },
            }}
        >
            <Tabs.Screen
                name="classificacao"
                options={{
                    title: 'Ranking',
                    tabBarIcon: ({ color }) => <TabIcon name="trophy-outline" color={color} />,
                    headerTitle: 'Ranking',
                }}
            />
            <Tabs.Screen
                name="adicionar-jogo"
                options={{
                    title: 'Jogos',
                    tabBarIcon: ({ color }) => <TabIcon name="football-outline" color={color} />,
                    headerTitle: 'Jogos',
                }}
            />
            <Tabs.Screen
                name="times"
                options={{
                    title: 'Times',
                    tabBarIcon: ({ color }) => <TabIcon name="people-outline" color={color} />,
                    headerTitle: 'Times',
                }}
            />
            <Tabs.Screen
                name="resultado"
                options={{
                    title: 'Resultados',
                    tabBarIcon: ({ color }) => <TabIcon name="flag-outline" color={color} />,
                    headerTitle: 'Resultados',
                }}
            />
            {/* Telas ocultas da navbar */}
            <Tabs.Screen
                name="index"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="calendario"
                options={{ href: null }}
            />
        </Tabs>
    )
}
