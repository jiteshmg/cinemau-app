import React from 'react';
import logo from './cinemau-logo.png';
import {useNavigate} from 'react-router-dom';
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
        localStorage.removeItem('user');
        navigate('/');
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
                }}/> {user && (
                    <div className="d-flex justify-content-end mt-3">
                        <DropdownButton id="dropdown-basic-button" title={user.name}>
                            <Dropdown.Item onClick={onProfileClick}>My Profile</Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </DropdownButton>
                    </div>

                )}
            </Navbar.Brand>

        </Container>
    </Navbar> < hr className = "dashboard-header__divider" /> </>);
};

export default DashboardHeader;