import { useState, useEffect, useMemo,useCallback } from 'react';
import {  Button, ListGroup, Modal, Form, InputGroup, Card } from 'react-bootstrap';
import {  Plus, Send } from 'react-bootstrap-icons';
import { Listuser, connectUser,connectList } from "../../utils/ApiRoute"

import {  useSelector } from 'react-redux';
import NavBarTop from './NavBarTop';

const Index = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([{ id: 1, userId: 1, text: 'Hello, how are you?' }]);
  const [chatUser, setChatUser] = useState([]);
  const [active, setActive] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const currentUser = user;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, userId: currentUser?._id, text: newMessage },
      ]);
      setNewMessage('');
    }
  };

  const handleAddUser = () => {
    setShowModal(true);
    setSearchTerm('');
  };

  const handleCloseModal = () => setShowModal(false);

  const filteredUsers = users.filter(user =>
    user?.full_name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const listUser = useCallback(async () => {
    const res = await Listuser();
    setUsers(res.data);
  }, []);
  const connectListUser = useCallback(async () => {
    const res = await connectList();
    setChatUser(res.data);
  }, []);

  useEffect(() => {
    listUser();
    connectListUser()
  }, [listUser]);

  const handleUserSelection = async (item) => {
    connectListUser()
     const connectuser = await connectUser(item._id)
    console.log(connectuser)
    setUsers(prevUsers => prevUsers.filter(user => user.email !== item.email));

  };

  const renderMessage = (message) => {
    const user = users.find((u) => u?._id === message.userId);
    const isCurrentUser = user?._id === currentUser?._id;
    return (
      <div key={message?.id} className={`d-flex align-items-start mb-3 ${isCurrentUser ? 'justify-content-end' : ''}`}>
        {!isCurrentUser && (
          <img src={"/img/usr2.png"} alt={user?.full_name} className="rounded-circle me-2" width="40" height="40" />
        )}
        <div className="d-flex flex-column" style={{ maxWidth: '75%' }}>
          <small className={`text-muted ${isCurrentUser ? 'text-end' : 'text-start'} mb-1`}>
            {user?.full_name}
          </small>
          <Card className={`p-2 ${isCurrentUser ? 'bg-primary text-white' : 'bg-light'}`}>
            <Card.Body className="p-2">
              <div className="message-content">{message.text}</div>
            </Card.Body>
          </Card>
        </div>
        {isCurrentUser && (
          <img src={"/img/usr2.png"} alt={user?.full_name} className="rounded-circle ms-2" width="40" height="40" />
        )}
      </div>
    );
  };

  const userList = useMemo(() => {
    return chatUser.map((user) => (
      <ListGroup.Item
        key={user?.nodeId}
        className={`d-flex align-items-center mb-2 rounded ${user?.nodeId === active ? "activeUser" : ""}`}
        onClick={() => setActive(user?.nodeId)}
        role="button"
      >
        <img
          src={"/img/usr2.png"}
          alt={user?.userData?.full_name}
          className="rounded-circle me-2"
          width="40"
          height="40"
        />
        <div className="flex-grow-1">
          <span className="text-dark">{user?.userData?.full_name}</span>
        </div>
      </ListGroup.Item>
    ));
  }, [chatUser, active]);

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <NavBarTop/>
      <div className="row flex-grow-1">
        <div className="col-md-3 p-0 border-end bg-white shadow-sm">
          <div className="bg-light h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-dark">Users</h5>
              <Button variant="outline-primary" size="sm" onClick={handleAddUser}>
                <Plus />
              </Button>
            </div>
            <ListGroup>
              {userList}
            </ListGroup>
          </div>
        </div>

        <div className="col-md-9 d-flex flex-column p-0">
          <div className="flex-grow-1 p-3 bg-white overflow-scroll" style={{ minHeight: "80vh" }}>
            {messages.map(renderMessage)}
          </div>

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
              <ListGroup.Item key={user?._id} className="d-flex align-items-center justify-content-between">
                <div>
                  <img src={"/img/usr2.png"} alt={user?.full_name} className="rounded-circle me-2" width="40" height="40" />
                  {user?.full_name}
                </div>
                <div
                  role="button"
                  className="btn btn-primary"
                  onClick={() => handleUserSelection(user)}
                >
                  Add
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Index;
