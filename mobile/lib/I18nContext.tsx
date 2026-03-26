import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Lang, TranslationKey, t as translate } from './i18n';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LANG_KEY = 'app_language';

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ja');

  useEffect(() => {
    SecureStore.getItemAsync(LANG_KEY).then((stored) => {
      if (stored === 'en' || stored === 'ja') setLangState(stored);
    });
  }, []);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    SecureStore.setItemAsync(LANG_KEY, newLang);
  }

  function t(key: TranslationKey): string {
    return translate(key, lang);
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
