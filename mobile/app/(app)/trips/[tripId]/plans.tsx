import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { apiGetPlans, apiGeneratePlans, apiGetTrip, Plan, Trip } from '@/lib/api';
import { useI18n } from '@/lib/I18nContext';
import { TranslationKey } from '@/lib/i18n';

const PLAN_TYPE_COLORS: Record<string, string> = {
  fastest: '#0ea5e9',
  cheapest: '#22c55e',
  relaxed: '#a855f7',
  sightseeing: '#f97316',
};

function PlanCard({ plan, onPress }: { plan: Plan; onPress: () => void }) {
  const { t } = useI18n();
  const color = PLAN_TYPE_COLORS[plan.plan_type] ?? '#1e40af';
  const labelKey = `plan_${plan.plan_type}` as TranslationKey;

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <Text style={[styles.planType, { color }]}>{t(labelKey)}</Text>
      {plan.summary && <Text style={styles.summary} numberOfLines={3}>{plan.summary}</Text>}
      <View style={styles.metrics}>
        {plan.estimated_cost != null && (
          <Text style={styles.metric}>¥{plan.estimated_cost.toLocaleString()}</Text>
        )}
        {plan.transfer_count != null && (
          <Text style={styles.metric}>{t('transfers')} {plan.transfer_count}{t('transfersUnit')}</Text>
        )}
        {plan.walking_score != null && (
          <Text style={styles.metric}>{t('walkingScore')} {plan.walking_score}/10</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function PlansScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [tripData, plansData] = await Promise.all([
        apiGetTrip(tripId),
        apiGetPlans(tripId),
      ]);
      setTrip(tripData);
      setPlans(plansData.plans);
    } catch (e) {
      Alert.alert(t('error'), e instanceof Error ? e.message : t('errorFetch'));
    }
  }, [tripId]);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      await apiGeneratePlans(tripId);
      await fetchData();
    } catch (e) {
      Alert.alert(t('generateFailed'), e instanceof Error ? e.message : t('errorGenerate'));
    } finally {
      setGenerating(false);
    }
  }

  const title = trip ? `${trip.origin} → ${trip.destination}` : t('plansTitle');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title }} />
      <View style={styles.container}>
        {plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('noPlansYet')}</Text>
            <Text style={styles.emptySubText}>{t('noPlansHint')}</Text>
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.generateButtonText}>  {t('generating')}</Text>
                </>
              ) : (
                <Text style={styles.generateButtonText}>{t('generatePlans')}</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={plans}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PlanCard
                plan={item}
                onPress={() => router.push(`/(app)/trips/${tripId}/plan/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  planType: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  summary: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 10 },
  metrics: { flexDirection: 'row', gap: 12 },
  metric: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 32 },
  generateButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
