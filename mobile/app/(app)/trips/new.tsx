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
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { apiCreateTrip } from '@/lib/api';

const TRANSPORT_OPTIONS = [
  { label: '新幹線', value: 'shinkansen' },
  { label: '在来線', value: 'local_train' },
  { label: 'バス', value: 'bus' },
  { label: '車', value: 'car' },
  { label: '飛行機', value: 'flight' },
  { label: '未定', value: 'undecided' },
];

const LUGGAGE_OPTIONS = [
  { label: '軽め', value: 'light' },
  { label: '普通', value: 'normal' },
  { label: '重め', value: 'heavy' },
];

function OptionGroup({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={styles.optionGroup}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.option, selected === opt.value && styles.optionSelected]}
          onPress={() => onSelect(opt.value)}
        >
          <Text style={[styles.optionText, selected === opt.value && styles.optionTextSelected]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function NewTripScreen() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('2');
  const [transport, setTransport] = useState('undecided');
  const [luggage, setLuggage] = useState('normal');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('エラー', '出発地と目的地を入力してください');
      return;
    }
    const daysNum = parseInt(days, 10);
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 14) {
      Alert.alert('エラー', '日数は1〜14で入力してください');
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
      Alert.alert('エラー', e instanceof Error ? e.message : '作成に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: '新しい旅行' }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          <Text style={styles.label}>出発地</Text>
          <TextInput
            style={styles.input}
            placeholder="例：東京"
            value={origin}
            onChangeText={setOrigin}
          />

          <Text style={styles.label}>目的地</Text>
          <TextInput
            style={styles.input}
            placeholder="例：京都"
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={styles.label}>日数</Text>
          <TextInput
            style={[styles.input, styles.inputSmall]}
            placeholder="2"
            keyboardType="number-pad"
            value={days}
            onChangeText={setDays}
          />

          <Text style={styles.label}>主な移動手段</Text>
          <OptionGroup options={TRANSPORT_OPTIONS} selected={transport} onSelect={setTransport} />

          <Text style={styles.label}>荷物の量</Text>
          <OptionGroup options={LUGGAGE_OPTIONS} selected={luggage} onSelect={setLuggage} />

          <Text style={styles.label}>要望・メモ（任意）</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="例：朝は遅めに出発したい、グルメ重視で"
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
          />

          <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>プランを生成する</Text>
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
