import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { I18nProvider } from '@/lib/I18nContext';

function RootGuard() {
  const { auth, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === '(auth)';
    if (!auth && !inAuth) {
      router.replace('/(auth)/login');
    } else if (auth && inAuth) {
      router.replace('/(app)/');
    }
  }, [auth, isLoading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <RootGuard />
      </AuthProvider>
    </I18nProvider>
  );
}
