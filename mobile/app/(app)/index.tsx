import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiGetTrips, Trip } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

function TripItem({ trip, onPress }: { trip: Trip; onPress: () => void }) {
  const date = new Date(trip.created_at).toLocaleDateString('ja-JP');
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>
        {trip.origin} → {trip.destination}
      </Text>
      <Text style={styles.cardSub}>
        {trip.days}日間 · {transportLabel(trip.main_transport)} · {luggageLabel(trip.luggage_level)}
      </Text>
      <Text style={styles.cardDate}>{date}</Text>
    </TouchableOpacity>
  );
}

function transportLabel(v: string) {
  const map: Record<string, string> = {
    shinkansen: '新幹線',
    local_train: '在来線',
    bus: 'バス',
    car: '車',
    flight: '飛行機',
    undecided: '未定',
  };
  return map[v] ?? v;
}

function luggageLabel(v: string) {
  const map: Record<string, string> = { light: '軽め', normal: '普通', heavy: '重め' };
  return map[v] ?? v;
}

export default function HomeScreen() {
  const { auth, signOut } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrips = useCallback(async () => {
    try {
      const { trips: data } = await apiGetTrips();
      setTrips(data);
    } catch (e) {
      Alert.alert('エラー', e instanceof Error ? e.message : 'データの取得に失敗しました');
    }
  }, []);

  useEffect(() => {
    fetchTrips().finally(() => setLoading(false));
  }, [fetchTrips]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  }

  async function handleSignOut() {
    await signOut();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Auto Trip AI</Text>
        <View style={styles.headerRight}>
          <Text style={styles.username}>{auth?.username}</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.logout}>ログアウト</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripItem
            trip={item}
            onPress={() => router.push(`/(app)/trips/${item.id}/plans`)}
          />
        )}
        contentContainerStyle={trips.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>旅行プランがありません</Text>
            <Text style={styles.emptySubText}>下のボタンから新しい旅行を作成してください</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(app)/trips/new')}
      >
        <Text style={styles.fabText}>＋ 新しい旅行</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerRight: { alignItems: 'flex-end' },
  username: { color: '#93c5fd', fontSize: 12 },
  logout: { color: '#fff', fontSize: 13, marginTop: 2 },
  list: { padding: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  empty: { alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  cardDate: { fontSize: 12, color: '#94a3b8' },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    backgroundColor: '#1e40af',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
