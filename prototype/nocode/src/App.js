import { useAPI } from './API/useAPI';
import logo from './logo.svg';
import './App.css';

function App() {
  const api = useAPI();
  const handleButtonClick = () => {
    const existingData = {
      phase1Responses: []
    }
    api.savePhase1Response(existingData, "answer");
  }

  const handleButton2Click = () => {
    const existingData = {
      id: '6de69bfe-eb3b-47b8-ad11-4514d836689c',
      phase1Responses: ["answer"]
    }
    api.savePhase1Response(existingData, "answer2");
  }

  const handleButton3Click = () => {
    const existingData = {
      id: '6de69bfe-eb3b-47b8-ad11-4514d836689c',
      phase1Responses: ["answer"],
      phase2Responses: []
    }
    api.savePhase2Response(existingData, "answer");
  }

  const handleButton4Click = () => {
    const existingData = {
      id: '6de69bfe-eb3b-47b8-ad11-4514d836689c',
      phase1Responses: ["answer"],
      phase2Responses: ["answer"]
    }
    api.savePhase2Response(existingData, "answer2");
  }

  return (
    <div className="App">
        <button onClick={handleButtonClick}> click </button>
        <button onClick={handleButton2Click}> click2 </button>
        <button onClick={handleButton3Click}> click3 </button>
        <button onClick={handleButton4Click}> click4 </button>
    </div>
  );
}

export default App;
