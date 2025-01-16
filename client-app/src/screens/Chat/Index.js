import { useState, useEffect,useRef,useMemo, useCallback } from 'react';
import { Button, ListGroup, Modal, Form, InputGroup, Card } from 'react-bootstrap';
import { Plus, Send } from 'react-bootstrap-icons';
import { Listuser, BASE_URL, connectUser, connectList, addMessage, listMessage } from "../../utils/ApiRoute"
import { useSelector } from 'react-redux';
import NavBarTop from './NavBarTop';
import io from 'socket.io-client';
const socket = io(BASE_URL);
const Index = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [active, setActive] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      const DataObject = {
        _id: Date.parse(new Date()),
        chatID: Date.parse(new Date()) + "AB" + active?.userData?._id, //user id+ business user id
        text: newMessage,
        image: '',
        video: '',
        audio: '',
        type: 0,
        createdAt: new Date().toString(),
        date: new Date().toLocaleString().split(',')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        receiverId: active?.userData?._id,
        nodeId: active?.nodeId
      }
      const res = await addMessage(DataObject);
      socket.emit('sendMessage', active?.nodeId);
      setNewMessage('');
    };
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
  }, [listUser,connectListUser]);


  const fetchMessage = async () => {
    if (active?.nodeId) {
      const Item = await listMessage(active.nodeId)
      setMessages(Item.data)
    }
  }
  useEffect(() => {
    fetchMessage()
    socket.on(active?.nodeId, fetchMessage);
  }, [active.nodeId])

  const handleUserSelection = async (item) => {
    connectListUser()
    const connectuser = await connectUser(item._id)
    console.log(connectuser)
    setUsers(prevUsers => prevUsers.filter(user => user.email !== item.email));

  };

  const renderMessage = (message) => {
    const user = message.myData;
    const senderData = message.userData;
    const isCurrentUser = user?._id === message?.userId;
    return (
      <div key={message?.id} className={`d-flex align-items-start mb-3 ${isCurrentUser ? 'justify-content-end' : ''}`}>
        {!isCurrentUser && (
          <img src={"/img/usr2.png"} alt={user?.full_name} className="rounded-circle me-2" width="40" height="40" />
        )}
        <div className="d-flex flex-column" style={{ maxWidth: '75%' }}>
          <small className={`text-muted ${isCurrentUser ? 'text-end' : 'text-start'} mb-1`}>
            {isCurrentUser ? user?.full_name : senderData?.full_name}
          </small>
          <Card className={`${isCurrentUser ? 'bg-primary text-white' : 'bg-light'}`}>
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
        className={`d-flex align-items-center mb-2 rounded ${user?.nodeId === active?.nodeId ? "activeUser" : ""}`}
        onClick={() => setActive(user)}
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
      <NavBarTop />
      <div className="row flex-grow-1">
        <div className="col-md-3 p-0 border-end bg-white shadow-sm"
        >
          <div className="bg-light h-100 p-3 position-fixed w-25">
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
          {active && (
            <>
              <div
                className="container-fluid rounded-2 d-flex justify-content-between py-2 pl-4 background shadow-sm"
                style={{ position: "sticky", top: "0%", zIndex: 10, backgroundColor: "#f8f9fa" }}
              >
                <div className="d-flex column-gap-2 align-items-center">
                  <img
                    src="/img/usr2.png"
                    style={{ width: 33, height: 33, borderRadius: "50%" }}
                  />
                  <div className="d-flex flex-column">
                    <span className="">user : {active?.userData?.full_name}</span>
                    <span className="">{active?.nodeId} </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center column-gap-3" />
              </div>
              <div className="flex-grow-1 p-3 bg-white overflow-scroll" style={{ height: "70vh", scrollbarWidth: "none" }}>
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
            </>
          )}
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
