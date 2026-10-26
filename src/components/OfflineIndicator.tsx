import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  language?: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language = 'en' }) => {
  const isOnline = useOnlineStatus();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (isOnline) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 flex items-center gap-2 rounded-xl bg-slate-900 border border-amber-500/50 px-3 py-1.5 text-xs font-medium text-amber-300 shadow-2xl animate-fadeIn">
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>{t.offlineBanner}</span>
    </div>
  );
};
