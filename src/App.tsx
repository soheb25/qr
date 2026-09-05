import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FormPage } from './pages/FormPage';
import { ViewPage } from './pages/ViewPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <FormPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/view/:id" element={<ViewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
