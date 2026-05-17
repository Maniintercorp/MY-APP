import {{ Routes, Route, Navigate }} from 'react-router-dom';
import { LanguageSettingsPage } from '@/features/MultilingualSupport/pages/LanguageSettingsPage.tsx';

export const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/languagesettings" replace />} />
        <Route path="/languagesettings" element={<LanguageSettingsPage />} />
  </Routes>
);
