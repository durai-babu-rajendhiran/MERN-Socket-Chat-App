import React,{useState} from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // TODO: Implement login logic
      console.log('Login:', { email, password });
    };
  
    return (
      <Container className="login-container">
        <Card className="login-card shadow">
          <Card.Body>
            <h2 className="mb-4 text-center">Welcome Back</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <div className="input-icon">
                  <FaEnvelope className="icon" />
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
  
              <Button variant="primary" type="submit" className="w-100 custom-button">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
}

export default Login
