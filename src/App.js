import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Employees from './components/Employees';
import FormDisabledDemo from "./components/Forms";
import Layout from './components/Layout';
import LoginPage from './components/Login';
import { UserProvider } from './schema/UserDetails';
import AboutUs from './components/AboutUs';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter >
          <Routes >
            <Route path="/" element={<LoginPage />} />
            <Route element={<Layout />} >
              <Route path="/list" element={<Employees />} />
              <Route path="/add" element={<FormDisabledDemo />} />
              <Route path="/edit/:id" element={<FormDisabledDemo />} />
              <Route path="/about-us" element={<AboutUs />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
