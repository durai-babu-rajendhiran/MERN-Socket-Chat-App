import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Register } from "../../utils/ApiRoute"
import { HandleChanger } from "../../utils/FormHandler"
import { toast } from 'react-toastify';
const RegisterForm = () => {
  const [FormData, setFormData] = useState({
    email: "",
    password: "",
    user_name: ""
  })

  const handleSubmit = async (e) => {
    try {
      console.log(FormData)
      const loginData = await Register(FormData);
      if(loginData.status){
        window.location.href = "/login"
        toast.success("Login SuccessFully");
      }
    } catch (error) {
      toast.error(error.message)
    }
  };
  return (
    <Container className="register-container d-flex justify-content-center align-items-center">
      <Card className="register-card shadow">
        <Card.Body>
          <h2 className="mb-4 text-center">Create an Account</h2>
          <div >
            <Form.Group className="mb-3" controlId="formUsername">
              <div className="input-icon">
                <FaUser className="icon" />
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  value={FormData.full_name}
                  name="full_name"
                  onChange={(e) => HandleChanger(e, setFormData)} // Handle username change with validation
                  required
                />
              </div>
              {/* Error message for invalid input */}
              {/* {error && <div style={{ color: 'red', fontSize: '0.9rem' }}>{error}</div>} */}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <div className="input-icon">
                <FaEnvelope className="icon" />
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={FormData.email}
                  name="email"
                  onChange={(e) => HandleChanger(e, setFormData)}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <div className="input-icon">
                <FaLock className="icon" />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={FormData.password}
                  name="password"
                  onChange={(e) => HandleChanger(e, setFormData)}
                  required
                />
              </div>
            </Form.Group>

            <Button variant="primary" type="submit"
              onClick={handleSubmit}
              className="w-100 register-btn">
              Register
            </Button>
            <a href='/login'>login</a>
          </div>
        </Card.Body>
      </Card>

    </Container>
  )
}

export default RegisterForm
