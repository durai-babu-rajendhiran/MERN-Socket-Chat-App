import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/ApiRoute';
import io from 'socket.io-client';
import { ListGroup, Form, Button, InputGroup, Card, Navbar, Nav, Modal } from 'react-bootstrap';
import { BoxArrowRight, Plus, Send } from 'react-bootstrap-icons';

const socket = io(BASE_URL);
const Index = () => {

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', avatar: "/img/usr3.png" },
    { id: 2, name: 'Jane Smith', avatar: "/img/usr2.png" },
    { id: 3, name: 'Alice Johnson', avatar: "/img/usr3.png" },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, userId: 1, text: 'Hello, how are you?' },
    { id: 2, userId: 2, text: "I'm good, thanks! How about you?" },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = users[0]; // Assuming the first user is the logged-in user

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, userId: currentUser.id, text: newMessage }]);
      setNewMessage('');
    }
  };

  const handleAddUser = () => {
    setShowModal(true);
    setSearchTerm('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  useEffect(() => {
    socket.on('msg_id', (objectMSG) => {
      alert(JSON.stringify(objectMSG))
    });
  }, []);

  const BtnTEST = () => {
    socket.emit('sendMSG', { id: "msg_id", data: "any data like array object" });
    alert("show THe Alert")
  }
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="border-bottom">
        <Navbar.Brand href="#">ChatApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="rounded-circle me-2"
                width="30"
                height="30"
              />
              <span className="me-3">
                {currentUser.name}
              </span>
              <Button variant="link" onClick={() => console.log('Logout')}>
                <BoxArrowRight size={24} />
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="row flex-grow-1">
        {/* Sidebar for Users */}
        <div className="col-md-3 p-0 border-end bg-white shadow-sm">
          <div className="p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-dark">Users</h5>
              <Button variant="outline-primary" size="sm" onClick={handleAddUser}>
                <Plus />
              </Button>
            </div>
            <ListGroup className="shadow-sm">
              {filteredUsers.map((user) => (
                <ListGroup.Item
                  key={user.id}
                  action
                  className="d-flex align-items-center mb-2 rounded"
                  style={{ cursor: 'pointer', transition: 'background-color 0.3s ease' }} // Smooth transition for hover
                  onClick={() => console.log(`Selected user: ${user.name}`)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007bff')} // Hover color
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')} // Reset on leave
                >
                  <img src={user.avatar} alt={user.name} className="rounded-circle me-2" width="40" height="40" />
                  <div className="flex-grow-1">
                    <span className="text-dark">{user.name}</span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

          </div>
        </div>

        {/* Main Chat Area */}
        <div className="col-md-9 d-flex flex-column p-0">
          <div className="flex-grow-1 p-3 bg-white overflow-auto">
            {messages.map((message) => {
              const user = users.find((u) => u.id === message.userId);
              return (
                <div
                  key={message.id}
                  className={`d-flex align-items-start mb-3 ${user.id === currentUser.id ? 'justify-content-end' : ''}`}
                >
                  {user.id !== currentUser.id && (
                    <img src={user.avatar} alt={user.name} className="rounded-circle me-2" width="40" height="40" />
                  )}
                  <div className="d-flex flex-column" style={{ maxWidth: '75%' }}>
                    <small className={`text-muted ${user.id === currentUser.id ? 'text-end' : 'text-start'} mb-1`}>
                      {user.name}
                    </small>
                    <Card className={`p-2 ${user.id === currentUser.id ? 'bg-primary text-white' : 'bg-light'}`}>
                      <Card.Body className="p-2">
                        <div className="message-content">{message.text}</div>
                      </Card.Body>
                    </Card>
                  </div>
                  {user.id === currentUser.id && (
                    <img src={user.avatar} alt={user.name} className="rounded-circle ms-2" width="40" height="40" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Input for Sending Messages */}
          <Form onSubmit={handleSendMessage} className="p-3 border-top bg-light">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <Send />
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>

      {/* Modal for Adding Users */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Search Users</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <ListGroup>
            {filteredUsers.map((user) => (
              <ListGroup.Item key={user.id} className="d-flex align-items-center">
                <img src={user.avatar} alt={user.name} className="rounded-circle me-2" width="40" height="40" />
                {user.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Index
