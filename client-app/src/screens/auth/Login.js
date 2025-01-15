import React, { useState,useEffect } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Login } from "../../utils/ApiRoute"
import { toast } from "react-toastify"
import { useDispatch ,useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const navigate = useNavigate()
  const [LoginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.email) navigate("/");
  }, [user]);

  const handleSubmit = async (e) => {
    try {
      var loginData = await Login(LoginForm);

      if (loginData.status) {
        localStorage.setItem("Auth", loginData.token)
        setLoginForm({
          email: "",
          password: ""
        })
        toast.success("login successfully")
        window.location.href = "/"
      }
    } catch (err) {
      toast.error(err.message)
    }
  };

  const HandleChanger = (e) => {
    const { value, name } = e.target
    setLoginForm({ ...LoginForm, [name]: value })
  }

  return (
    <Container className="login-container">
      <Card className="login-card shadow">
        <Card.Body>
          <h2 className="mb-4 text-center">Welcome Back</h2>
          <div>
            <Form.Group className="mb-3" controlId="formEmail">
              <div className="input-icon">
                <FaEnvelope className="icon" />
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  value={LoginForm.email}
                  name="email"
                  onChange={HandleChanger}
                  required
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPassword">
              <div className="input-icon">
                <FaLock className="icon" />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={LoginForm.password}
                  name="password"
                  onChange={HandleChanger}
                  required
                />
              </div>
            </Form.Group>
            <Button variant="primary"
              onClick={handleSubmit}
              type="submit" className="w-100 custom-button">
              Login
            </Button>
            <a href='/register'>Register</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginForm
