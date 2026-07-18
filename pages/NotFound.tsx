import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-zinc-950 px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-900/50">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
          </div>
        </div>
        
        <h1 className="font-sans font-black text-6xl text-slate-900 dark:text-white">404</h1>
        
        <div className="space-y-2">
          <h2 className="font-sans font-bold text-xl text-slate-800 dark:text-zinc-200">Halaman Tidak Ditemukan</h2>
          <p className="font-sans text-sm text-slate-500 dark:text-zinc-400">
            URL yang Anda tuju mungkin salah ketik atau halamannya sudah dipindahkan.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-sans text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};
