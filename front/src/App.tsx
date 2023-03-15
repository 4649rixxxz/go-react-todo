import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Private from './pages/Private';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<Private />}>
            <Route path="home" element={<Home />} />
          </Route>  
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
