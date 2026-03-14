import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { COLORS } from '@/constants/colors'
import { MODALIDADES } from '@/constants/modalidades'
import { Modalidade } from '@/types'
import React from 'react'

export default function Home() {
    const router = useRouter()

    function handleModalidade(nome: Modalidade) {
        router.push({ pathname: '/classificacao', params: { modalidade: nome } })
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <Text style={styles.title}>Interclasse 2026</Text>
                <Text style={styles.subtitle}>FIAP – Temporada 2026</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Modalidades</Text>
            <Text style={styles.sectionHint}>Selecione para ver a classificação</Text>

            <FlatList
                data={MODALIDADES}
                keyExtractor={(item) => item}
                numColumns={2}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleModalidade(item)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cardName}>{item}</Text>
                        <Text style={styles.cardAction}>Ver classificação</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>Check Point 1 – 2026</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 32,
        paddingBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    sectionHint: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginBottom: 16,
    },
    grid: {
        gap: 12,
    },
    row: {
        gap: 12,
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
        minHeight: 110,
    },
    cardName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 6,
    },
    cardAction: {
        fontSize: 12,
        color: COLORS.primary,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        color: COLORS.textMuted,
        fontSize: 12,
    },
})
