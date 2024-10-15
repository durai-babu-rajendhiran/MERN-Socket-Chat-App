import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleUsernameChange = (e) => {
      const value = e.target.value;
  
      // Validation: Only lowercase letters and underscores, no spaces
      const isValid = /^[a-z_]+$/.test(value);
      
      if (/\s/.test(value)) {
        setError('Username should not contain spaces.');
      }  else {
        setError(''); // Clear error if valid
      }
      
      setUsername(value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!username || !email || !password) {
        setError('All fields are required.');
        return;
      }
      // Proceed with registration logic
      console.log('Register:', { username, email, password });
      setError('');
    };
    return (
        <Container className="register-container d-flex justify-content-center align-items-center">
        <Card className="register-card shadow">
          <Card.Body>
            <h2 className="mb-4 text-center">Create an Account</h2>
            {error && <div className="alert alert-danger">{error}</div>} {/* Error message in red */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <div className="input-icon">
                  <FaUser className="icon" />
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange} // Handle username change with validation
                    required
                  />
                </div>
                {/* Error message for invalid input */}
                {error && <div style={{ color: 'red', fontSize: '0.9rem' }}>{error}</div>}
              </Form.Group>
  
              <Form.Group className="mb-3" controlId="formEmail">
                <div className="input-icon">
                  <FaEnvelope className="icon" />
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
  
              <Button variant="primary" type="submit" className="w-100 register-btn">
                Register
              </Button>
            </Form>
          </Card.Body>
        </Card>
        
      </Container>
    )
}

export default Register
