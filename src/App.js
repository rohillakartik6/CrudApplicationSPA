import { Flex } from 'antd';
import './App.css';
import FormDisabledDemo from "./components/Forms"
import Employees from './components/Employees';

function App() {
  return (
    <div className="App">
      <Flex justify='center' align='center'>

        {/* <Routes> */}
        {/* <Employees /> */}
        {/* </Routes> */}
        <FormDisabledDemo />
      </Flex>
    </div>
  );
}

export default App;
