'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Provider store={store}>
                    <Navbar />
                    <main className="container mx-auto px-4">
                        {children}
                    </main>
                    <Toaster position="top-right" />
                </Provider>
            </body>
        </html>
    );
}
