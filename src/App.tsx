import {{ Routes, Route, Navigate }} from 'react-router-dom';
import { LoginPage } from '@/features/LoginUIStyleUpdate/pages/LoginPage.tsx';

export const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
  </Routes>
);
export default App;
