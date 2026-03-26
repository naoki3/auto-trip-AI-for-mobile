import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { apiCreateTrip } from '@/lib/api';
import { useI18n } from '@/lib/I18nContext';
import { TranslationKey } from '@/lib/i18n';

function OptionGroup({
  options,
  selected,
  onSelect,
}: {
  options: { labelKey: TranslationKey; value: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const { t } = useI18n();
  return (
    <View style={styles.optionGroup}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.option, selected === opt.value && styles.optionSelected]}
          onPress={() => onSelect(opt.value)}
        >
          <Text style={[styles.optionText, selected === opt.value && styles.optionTextSelected]}>
            {t(opt.labelKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const TRANSPORT_OPTIONS: { labelKey: TranslationKey; value: string }[] = [
  { labelKey: 'transport_shinkansen', value: 'shinkansen' },
  { labelKey: 'transport_local_train', value: 'local_train' },
  { labelKey: 'transport_bus', value: 'bus' },
  { labelKey: 'transport_car', value: 'car' },
  { labelKey: 'transport_flight', value: 'flight' },
  { labelKey: 'transport_undecided', value: 'undecided' },
];

const LUGGAGE_OPTIONS: { labelKey: TranslationKey; value: string }[] = [
  { labelKey: 'luggage_light', value: 'light' },
  { labelKey: 'luggage_normal', value: 'normal' },
  { labelKey: 'luggage_heavy', value: 'heavy' },
];

export default function NewTripScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('2');
  const [transport, setTransport] = useState('undecided');
  const [luggage, setLuggage] = useState('normal');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert(t('error'), t('errorOriginDest'));
      return;
    }
    const daysNum = parseInt(days, 10);
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 14) {
      Alert.alert(t('error'), t('errorDaysRange'));
      return;
    }

    setLoading(true);
    try {
      const { id } = await apiCreateTrip({
        origin: origin.trim(),
        destination: destination.trim(),
        days: daysNum,
        main_transport: transport,
        luggage_level: luggage,
        optional_note: note.trim() || undefined,
      });
      router.replace(`/(app)/trips/${id}/plans`);
    } catch (e) {
      Alert.alert(t('error'), e instanceof Error ? e.message : t('errorCreate'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: t('newTripTitle') }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          <Text style={styles.label}>{t('origin')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('originPlaceholder')}
            value={origin}
            onChangeText={setOrigin}
          />

          <Text style={styles.label}>{t('destination')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('destinationPlaceholder')}
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={styles.label}>{t('days')}</Text>
          <TextInput
            style={[styles.input, styles.inputSmall]}
            placeholder="2"
            keyboardType="number-pad"
            value={days}
            onChangeText={setDays}
          />

          <Text style={styles.label}>{t('mainTransport')}</Text>
          <OptionGroup options={TRANSPORT_OPTIONS} selected={transport} onSelect={setTransport} />

          <Text style={styles.label}>{t('luggageAmount')}</Text>
          <OptionGroup options={LUGGAGE_OPTIONS} selected={luggage} onSelect={setLuggage} />

          <Text style={styles.label}>{t('notesLabel')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('notesPlaceholder')}
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
          />

          <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('generatePlans')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  inner: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  inputSmall: { width: 100 },
  textArea: { height: 100, textAlignVertical: 'top' },
  optionGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  optionSelected: { backgroundColor: '#1e40af', borderColor: '#1e40af' },
  optionText: { fontSize: 13, color: '#475569' },
  optionTextSelected: { color: '#fff', fontWeight: '600' },
  button: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
