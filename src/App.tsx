// src/App.tsx
import { Toaster } from 'sonner';
import { AuthProvider } from '@/viewModels/hooks/AuthProvider';
import { ThemeProvider } from './components/themeProvider';
import { Suspense } from 'react';
import AppRouter from './routes';
import Loading from '@/components/Loading'; 

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster richColors />
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <AppRouter />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}
