import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '@/constants/colors'
import { JogoCard } from '@/components/JogoCard'
import { useJogos } from '@/hooks/useJogos'
import { clearJogos } from '@/storage/jogos'
import React from 'react'

export default function Calendario() {
    const { jogos, refreshing, refresh } = useJogos()

    function handleClearCache() {
        Alert.alert(
            'Limpar cache',
            'Deseja remover todos os jogos salvos localmente?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Limpar',
                    style: 'destructive',
                    onPress: async () => {
                        await clearJogos()
                        refresh()
                    },
                },
            ]
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={jogos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <JogoCard item={item} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        tintColor={COLORS.primary}
                    />
                }
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    jogos.length > 0 ? (
                        <TouchableOpacity style={styles.clearBtn} onPress={handleClearCache}>
                            <Text style={styles.clearBtnText}>Limpar cache local</Text>
                        </TouchableOpacity>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum jogo agendado.</Text>
                        <Text style={styles.emptyHint}>Adicione jogos na aba "Adicionar".</Text>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    list: {
        padding: 16,
    },
    clearBtn: {
        alignSelf: 'flex-end',
        marginBottom: 8,
    },
    clearBtnText: {
        color: COLORS.error,
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 80,
        gap: 6,
    },
    emptyText: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: '600',
    },
    emptyHint: {
        color: COLORS.textMuted,
        fontSize: 13,
    },
})
