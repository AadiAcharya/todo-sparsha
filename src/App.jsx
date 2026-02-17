import { BrowserRouter, Routes, Route } from "react-router-dom";
import Memo from "./components/Memo";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/memo" element={<Memo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;