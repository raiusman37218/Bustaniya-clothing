'use client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import CartDrawerRoot from '@/src/components/cart/CartDrawerRoot';
import WhatsAppButton from '@/src/components/layout/WhatsAppButton';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <CartDrawerRoot />
      <ToastContainer position="top-center" />
      <WhatsAppButton />
    </Provider>
  );
}

