import logo from './logo.svg';
import './App.css';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import NotFoundComponent from './Components/NotFoundComponent';
import LoginComponent from './Components/LoginComponent';
import HomeComponent from './Components/HomeComponent';
import NavigationComponent from './Components/NavigationComponent';
import AddItemComponent from './Components/AddItemComponent';

function App() {
  return (
      <div className="App">
          <header className="App-header">
            <Navbar bg="dark" variant="dark" expand={false}>
              <Container fluid>
                <Navbar.Brand>
                  <Link to="/" className="navRouteLink">
                    <span>The Neighborhood - Staff Panel</span>
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="sidebar"/>
                <Navbar.Offcanvas id="sidebar" aria-labelledby="sidebarLabel" placement="end" bg="dark" variant="dark">
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>The Neighborhood - Staff Panel</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                      <NavigationComponent/>
                    </Nav>
                  </Offcanvas.Body>
                </Navbar.Offcanvas>
              </Container>
            </Navbar>

            <Routes>
              <Route path="/login" element={<LoginComponent/>}/>
              <Route path="/home" element={<HomeComponent/>}/>
              <Route path="/add" element={<AddItemComponent/>}/>
              <Route path="/" element={<Navigate replace to="/home"/>}/>
              <Route path='*' element={<NotFoundComponent/>}/>
            </Routes>
          </header>
      </div>
  );
}

export default App;
