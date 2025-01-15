import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
const NavBarTop = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => ({ ...state }));
    const currentUser = user;
  
    return (
        <Navbar bg="light" expand="lg" className="border-bottom">
        <Navbar.Brand href="#">ChatApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              <img
                src={"/img/usr2.png"}
                alt={currentUser?.full_name}
                className="rounded-circle me-2"
                width="30"
                height="30"
              />
              <span className="me-3">{currentUser?.full_name}</span>
              <Button variant="link" onClick={() => {
                localStorage.clear()
                dispatch({
                  type: "LOGOUT",
                  payload: null,
                });
                navigate("/login")
              }}>
                <BoxArrowRight size={24} />
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
}

export default NavBarTop
