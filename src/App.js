import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import { UserProvider } from './schema/UserDetails';
import { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import Employees from './pages/Employees';
import AddEditForm from './pages/AddEditForm';
import LoginPage from './pages/LoginPage';
import AboutUs from './pages/AboutUs';
import AppLayout from './components/AppLayout';

function App() {
  const [primary, setPrimary] = useState(0);
  // const { darkAlgorithm, defaultAlgorithm, compactAlgorithm } = theme;
  const themes = [theme.defaultAlgorithm, theme.darkAlgorithm]

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: themes[primary]
        }}
      >
        <UserProvider>
          <BrowserRouter >
            <Routes >
              <Route path="/" element={<LoginPage />} />
              <Route element={<AppLayout theme={primary} setTheme={setPrimary} />} >
                <Route path="/list" element={<Employees />} />
                <Route path="/add" element={<AddEditForm />} />
                <Route path="/edit/:id" element={<AddEditForm />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/jokes" element={<AboutUs />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;
