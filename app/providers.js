'use client';

import ReduxProvider from './redux/provider';
import { Toaster } from 'sonner';

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      {children}
      <Toaster position="top-right" richColors />
    </ReduxProvider>
  );
}
