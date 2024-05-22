import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Employees from './components/Employees';
import FormDisabledDemo from "./components/Forms";
import Layout from './components/Layout';
import LoginPage from './components/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Routes >
          <Route path="/" element={<LoginPage />} />
          <Route element={<Layout />} >
            <Route path="/list" element={<Employees />} />
            <Route path="/add" element={<FormDisabledDemo />} />
            <Route path="/edit/:id" element={<FormDisabledDemo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
