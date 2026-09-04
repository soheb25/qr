import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormPage } from './pages/FormPage';
import { ViewPage } from './pages/ViewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/view/:id" element={<ViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
