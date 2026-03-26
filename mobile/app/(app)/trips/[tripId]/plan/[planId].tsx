import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { apiGetPlanDetail, apiReplan, PlanDetail, ItineraryDay, ItineraryItem } from '@/lib/api';

const ITEM_TYPE_ICONS: Record<string, string> = {
  spot: '📍',
  move: '🚃',
  meal: '🍽️',
  hotel: '🏨',
  luggage: '🧳',
};

function TimeRange({ start, end }: { start: string | null; end: string | null }) {
  if (!start && !end) return null;
  return (
    <Text style={styles.timeRange}>
      {start ?? ''}{start && end ? ' – ' : ''}{end ?? ''}
    </Text>
  );
}

function ItemRow({ item }: { item: ItineraryItem }) {
  const icon = ITEM_TYPE_ICONS[item.item_type] ?? '•';
  let metadata: Record<string, unknown> | null = null;
  try {
    if (item.metadata_json) metadata = JSON.parse(item.metadata_json);
  } catch {}

  const gmapsUrl = metadata?.gmaps_url as string | undefined;

  return (
    <View style={styles.itemRow}>
      <View style={styles.itemIconCol}>
        <Text style={styles.itemIcon}>{icon}</Text>
        <View style={styles.itemLine} />
      </View>
      <View style={styles.itemContent}>
        <TimeRange start={item.start_time} end={item.end_time} />
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.item_type === 'move' && metadata && (
          <Text style={styles.itemMeta}>
            {String(metadata.method ?? '')} · {String(metadata.duration_minutes ?? '')}分 · ¥{Number(metadata.price ?? 0).toLocaleString()}
          </Text>
        )}
        {gmapsUrl && (
          <TouchableOpacity onPress={() => Linking.openURL(gmapsUrl)}>
            <Text style={styles.mapsLink}>Google Mapsで見る →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function DaySection({ day }: { day: ItineraryDay }) {
  return (
    <View style={styles.daySection}>
      <Text style={styles.dayTitle}>Day {day.day_number}{day.title ? `  ${day.title}` : ''}</Text>
      {day.items.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </View>
  );
}

export default function PlanDetailScreen() {
  const { tripId, planId } = useLocalSearchParams<{ tripId: string; planId: string }>();
  const router = useRouter();
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReplan, setShowReplan] = useState(false);
  const [replanText, setReplanText] = useState('');
  const [replanning, setReplanning] = useState(false);

  const fetchPlan = useCallback(async () => {
    try {
      const data = await apiGetPlanDetail(planId);
      setPlan(data);
    } catch (e) {
      Alert.alert('エラー', e instanceof Error ? e.message : '読み込みに失敗しました');
    }
  }, [planId]);

  useEffect(() => {
    fetchPlan().finally(() => setLoading(false));
  }, [fetchPlan]);

  async function handleReplan() {
    if (!replanText.trim()) {
      Alert.alert('エラー', '変更内容を入力してください');
      return;
    }
    setReplanning(true);
    try {
      const { new_plan_id, result_summary } = await apiReplan(planId, replanText.trim());
      setShowReplan(false);
      setReplanText('');
      Alert.alert('再プラン完了', result_summary, [
        {
          text: '新しいプランを見る',
          onPress: () => router.replace(`/(app)/trips/${tripId}/plan/${new_plan_id}`),
        },
      ]);
    } catch (e) {
      Alert.alert('失敗', e instanceof Error ? e.message : '再プランに失敗しました');
    } finally {
      setReplanning(false);
    }
  }

  const planTypeLabels: Record<string, string> = {
    fastest: '⚡ 最速',
    cheapest: '💰 最安',
    relaxed: '😌 ゆったり',
    sightseeing: '📸 観光重視',
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  if (!plan) return null;

  return (
    <>
      <Stack.Screen options={{ title: planTypeLabels[plan.plan_type] ?? plan.plan_type }} />
      <ScrollView style={styles.container}>
        {/* Summary metrics */}
        <View style={styles.metricsRow}>
          {plan.estimated_cost != null && (
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>¥{plan.estimated_cost.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>費用</Text>
            </View>
          )}
          {plan.transfer_count != null && (
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{plan.transfer_count}</Text>
              <Text style={styles.metricLabel}>乗換</Text>
            </View>
          )}
          {plan.walking_score != null && (
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{plan.walking_score}/10</Text>
              <Text style={styles.metricLabel}>歩き度</Text>
            </View>
          )}
        </View>

        {plan.summary && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{plan.summary}</Text>
          </View>
        )}

        {/* Itinerary */}
        <View style={styles.itinerary}>
          {plan.days.map((day) => (
            <DaySection key={day.id} day={day} />
          ))}
        </View>

        {/* Replan button */}
        <TouchableOpacity style={styles.replanButton} onPress={() => setShowReplan(true)}>
          <Text style={styles.replanButtonText}>✏️ このプランを変更する</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Replan Modal */}
      <Modal visible={showReplan} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>プランを変更する</Text>
          <Text style={styles.modalSubtitle}>変更したい内容を自由に記入してください</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="例：2日目の午後をもっとゆっくりにしたい"
            multiline
            numberOfLines={5}
            value={replanText}
            onChangeText={setReplanText}
            autoFocus
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleReplan} disabled={replanning}>
            {replanning ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.modalButtonText}>  生成中…</Text>
              </>
            ) : (
              <Text style={styles.modalButtonText}>変更して再生成</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancel} onPress={() => setShowReplan(false)}>
            <Text style={styles.modalCancelText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  metricsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  metricValue: { fontSize: 18, fontWeight: '800', color: '#1e40af' },
  metricLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  summaryBox: {
    backgroundColor: '#eff6ff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 14,
  },
  summaryText: { fontSize: 13, color: '#1e3a8a', lineHeight: 20 },
  itinerary: { padding: 16 },
  daySection: { marginBottom: 24 },
  dayTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  itemRow: { flexDirection: 'row', marginBottom: 8 },
  itemIconCol: { width: 36, alignItems: 'center' },
  itemIcon: { fontSize: 18 },
  itemLine: { flex: 1, width: 2, backgroundColor: '#e2e8f0', marginTop: 4 },
  itemContent: { flex: 1, paddingLeft: 8, paddingBottom: 12 },
  timeRange: { fontSize: 11, color: '#94a3b8', marginBottom: 2 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  itemMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  mapsLink: { fontSize: 12, color: '#1e40af', marginTop: 4 },
  replanButton: {
    margin: 16,
    borderWidth: 2,
    borderColor: '#1e40af',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  replanButtonText: { color: '#1e40af', fontSize: 15, fontWeight: '700' },
  modal: { flex: 1, padding: 24, paddingTop: 48 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
    height: 140,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalCancel: { padding: 14, alignItems: 'center' },
  modalCancelText: { color: '#64748b', fontSize: 15 },
});
