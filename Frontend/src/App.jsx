import "./App.css";
import { Routes, Route } from "react-router-dom";
import Gpt from "./Gpt";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Gpt />} />
    </Routes>
  );
  
}

export default App;
