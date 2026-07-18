import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center">
                <span className="text-white font-sans font-black text-xs">H</span>
              </div>
              <span className="font-sans font-black text-xl tracking-tight text-white">HEIMDALL</span>
            </div>
            <p className="font-sans text-sm text-slate-400 max-w-xs leading-relaxed">
              Platform QA automation end-to-end yang cerdas. Menjaga kualitas aplikasi Anda melalui pengujian berbasis bahasa manusia.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div className="flex flex-col gap-3 font-sans text-sm">
              <span className="font-bold text-white uppercase tracking-wider text-xs">Hubungiku</span>
              <a href="https://github.com/dhiyo7" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Profile</a>
              <a href="mailto:example@email.com" className="hover:text-white transition-colors">Email</a>
            </div>
            <div className="flex flex-col gap-3 font-sans text-sm">
              <span className="font-bold text-white uppercase tracking-wider text-xs">Resource</span>
              <a href="/#features-timeline" className="hover:text-white transition-colors">Daftar Fitur</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 text-center md:text-left font-sans text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <span>© {new Date().getFullYear()} Dhiyo7. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-600">Status:</span>
            <a href="https://app.netlify.com/sites/heimdallqa/deploys" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="https://api.netlify.com/api/v1/badges/803a9d52-640e-4f5d-b8e6-942a3aea2ffa/deploy-status" alt="Netlify Status" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};