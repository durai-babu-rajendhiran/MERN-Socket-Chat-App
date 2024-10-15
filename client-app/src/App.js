import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
const Login = React.lazy(() => import("./screens/auth/Login"));
const Register = React.lazy(() => import("./screens/auth/Register"));
const Chat = React.lazy(() => import("./screens/Chat/Index"));

function App() {

  const routes = [
    { path:"/" , element:<Chat />},
    { path:"/login" , element:<Login />},
    { path:"/register" , element:<Register />},
  ]

  return (
    <Router>
    <Suspense fallback={<div>Loading...</div>}>
    <ToastContainer />
    <Routes>
    {routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
    </Routes>
  </Suspense>
  </Router>
  );
}

export default App;
