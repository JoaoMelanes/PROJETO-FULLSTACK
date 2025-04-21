import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

// components
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Container from './components/layouts/Container'
import Message from './components/layouts/Message';

// Pages
import Login from './components/pages/auth/Login';
import Register from './components/pages/auth/Register';
import Home from './components/pages/Home';


// contexts
import { UserProvider } from './context/UserContext';

function App() {
  return (
      <Router>
        <UserProvider>
          <Navbar />
          <Message />
            <Container>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Register />} />
              </Routes>
            </Container>
          <Footer />
        </UserProvider>
      </Router>
  );
}

export default App;
