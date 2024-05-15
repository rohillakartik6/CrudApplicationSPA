import { Flex } from 'antd';
import './App.css';
import FormDisabledDemo from "./components/Forms"
import Employees from './components/Employees';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Layout from './components/Layout';

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Routes >
          <Route path="/" element={<Layout />} >
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
