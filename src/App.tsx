import {{ Routes, Route, Navigate }} from 'react-router-dom';
import { LoginRegistrationPage } from '@/features/LoginRegistrationPage/pages/LoginRegistrationPage.tsx';

export const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/loginregistration" replace />} />
        <Route path="/loginregistration" element={<LoginRegistrationPage />} />
  </Routes>
);
export default App;
