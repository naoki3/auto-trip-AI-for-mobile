export type Lang = 'ja' | 'en';

export const translations = {
  // --- Auth ---
  appName: { ja: 'Auto Trip AI', en: 'Auto Trip AI' },
  appSubtitle: { ja: 'AIが最適な旅行プランを生成します', en: 'AI generates your perfect travel plan' },
  username: { ja: 'ユーザー名', en: 'Username' },
  password: { ja: 'パスワード', en: 'Password' },
  login: { ja: 'ログイン', en: 'Log In' },
  logout: { ja: 'ログアウト', en: 'Log Out' },
  createAccount: { ja: 'アカウントを作成する', en: 'Create an account' },
  register: { ja: '登録する', en: 'Sign Up' },
  backToLogin: { ja: 'ログインに戻る', en: 'Back to login' },
  registerTitle: { ja: 'アカウント作成', en: 'Create Account' },
  usernamePlaceholder: { ja: 'ユーザー名（2文字以上）', en: 'Username (min 2 chars)' },
  passwordPlaceholder: { ja: 'パスワード（4文字以上）', en: 'Password (min 4 chars)' },

  // --- Home ---
  noTrips: { ja: '旅行プランがありません', en: 'No trips yet' },
  noTripsHint: { ja: '下のボタンから新しい旅行を作成してください', en: 'Tap the button below to create a new trip' },
  newTrip: { ja: '＋ 新しい旅行', en: '＋ New Trip' },

  // --- New Trip ---
  newTripTitle: { ja: '新しい旅行', en: 'New Trip' },
  origin: { ja: '出発地', en: 'Origin' },
  originPlaceholder: { ja: '例：東京', en: 'e.g. Tokyo' },
  destination: { ja: '目的地', en: 'Destination' },
  destinationPlaceholder: { ja: '例：京都', en: 'e.g. Kyoto' },
  days: { ja: '日数', en: 'Days' },
  mainTransport: { ja: '主な移動手段', en: 'Main Transport' },
  luggageAmount: { ja: '荷物の量', en: 'Luggage' },
  notesLabel: { ja: '要望・メモ（任意）', en: 'Notes (optional)' },
  notesPlaceholder: { ja: '例：朝は遅めに出発したい、グルメ重視で', en: 'e.g. Late morning starts, food-focused itinerary' },
  generatePlans: { ja: 'プランを生成する', en: 'Generate Plans' },

  // --- Transport options ---
  transport_shinkansen: { ja: '新幹線', en: 'Shinkansen' },
  transport_local_train: { ja: '在来線', en: 'Local Train' },
  transport_bus: { ja: 'バス', en: 'Bus' },
  transport_car: { ja: '車', en: 'Car' },
  transport_flight: { ja: '飛行機', en: 'Flight' },
  transport_undecided: { ja: '未定', en: 'Undecided' },

  // --- Luggage options ---
  luggage_light: { ja: '軽め', en: 'Light' },
  luggage_normal: { ja: '普通', en: 'Normal' },
  luggage_heavy: { ja: '重め', en: 'Heavy' },

  // --- Plans screen ---
  plansTitle: { ja: 'プラン一覧', en: 'Plans' },
  noPlansYet: { ja: 'プランがまだありません', en: 'No plans yet' },
  noPlansHint: { ja: 'AIが4つのプランを自動生成します', en: 'AI will generate 4 plans for you' },
  generating: { ja: '生成中…（1〜2分かかります）', en: 'Generating… (1–2 min)' },
  transfers: { ja: '乗換', en: 'Transfers' },
  transfersUnit: { ja: '回', en: '' },
  walkingScore: { ja: '歩き', en: 'Walking' },
  cost: { ja: '費用', en: 'Cost' },

  // --- Plan type labels ---
  plan_fastest: { ja: '⚡ 最速', en: '⚡ Fastest' },
  plan_cheapest: { ja: '💰 最安', en: '💰 Cheapest' },
  plan_relaxed: { ja: '😌 ゆったり', en: '😌 Relaxed' },
  plan_sightseeing: { ja: '📸 観光重視', en: '📸 Sightseeing' },

  // --- Plan detail ---
  transfersLabel: { ja: '乗換', en: 'Transfers' },
  walkingLabel: { ja: '歩き度', en: 'Walking' },
  openInMaps: { ja: 'Google Mapsで見る →', en: 'Open in Google Maps →' },
  modifyPlan: { ja: '✏️ このプランを変更する', en: '✏️ Modify This Plan' },

  // --- Replan modal ---
  replanTitle: { ja: 'プランを変更する', en: 'Modify Plan' },
  replanSubtitle: { ja: '変更したい内容を自由に記入してください', en: 'Describe the changes you want' },
  replanPlaceholder: { ja: '例：2日目の午後をもっとゆっくりにしたい', en: 'e.g. Make the second afternoon more relaxed' },
  replanSubmit: { ja: '変更して再生成', en: 'Regenerate with Changes' },
  replanGenerating: { ja: '生成中…', en: 'Generating…' },
  cancel: { ja: 'キャンセル', en: 'Cancel' },
  replanDone: { ja: '再プラン完了', en: 'Replan Complete' },
  viewNewPlan: { ja: '新しいプランを見る', en: 'View New Plan' },

  // --- Days unit ---
  daysUnit: { ja: '日間', en: ' days' },

  // --- Errors ---
  error: { ja: 'エラー', en: 'Error' },
  errorFetch: { ja: 'データの取得に失敗しました', en: 'Failed to load data' },
  errorCreate: { ja: '作成に失敗しました', en: 'Failed to create trip' },
  errorGenerate: { ja: 'プランの生成に失敗しました', en: 'Failed to generate plans' },
  errorReplan: { ja: '再プランに失敗しました', en: 'Failed to replan' },
  errorLoad: { ja: '読み込みに失敗しました', en: 'Failed to load' },
  errorOccurred: { ja: 'エラーが発生しました', en: 'An error occurred' },
  errorLogin: { ja: 'ログイン失敗', en: 'Login Failed' },
  errorRegister: { ja: '登録失敗', en: 'Registration Failed' },
  errorEnterCredentials: { ja: 'ユーザー名とパスワードを入力してください', en: 'Please enter your username and password' },
  errorUsernameLength: { ja: 'ユーザー名は2文字以上で入力してください', en: 'Username must be at least 2 characters' },
  errorPasswordLength: { ja: 'パスワードは4文字以上で入力してください', en: 'Password must be at least 4 characters' },
  errorOriginDest: { ja: '出発地と目的地を入力してください', en: 'Please enter origin and destination' },
  errorDaysRange: { ja: '日数は1〜14で入力してください', en: 'Days must be between 1 and 14' },
  errorModifyText: { ja: '変更内容を入力してください', en: 'Please enter the changes you want' },
  generateFailed: { ja: '生成失敗', en: 'Generation Failed' },
  modifyFailed: { ja: '失敗', en: 'Failed' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}
