import React from 'react';
import logo from './cinemau-logo.png';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {
    Navbar,
    Nav,
    Container,
    NavDropdown,
    Dropdown,
    Image,
    NavbarText,
    DropdownButton
} from 'react-bootstrap';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const DashboardHeader : React.FC < {
    onProfileClick: () => void
} > = ({onProfileClick}) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"]; // Remove token from headers
        navigate("/");
    };
    return ( <> <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand
                className="dashboard-header__brand"
                style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <Image
                    src={logo}
                    alt="Cinemau"
                    thumbnail
                    style={{
                    height: '100px'
                }}/>
            </Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/projects">Projects</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            {user && (

                <div className="d-flex justify-content-end mt-3">
                    <Navbar.Collapse id="navbar-dark-example">
                        <Nav>
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title={user.name}
                                menuVariant="dark">
                                <NavDropdown.Item onClick={onProfileClick}>My Profile</NavDropdown.Item>

                                <NavDropdown.Divider/>
                                <NavDropdown.Item onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            )}
        </Container>
    </Navbar> </>);
    
};

export default DashboardHeader;