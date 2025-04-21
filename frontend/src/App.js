import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// Pages
import Login from './components/pages/auth/Login';
import Register from './components/pages/auth/Register';
import Home from './components/pages/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/register'>
          <Register />
        </Route>
        <Route path='/'>
          <Home />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
