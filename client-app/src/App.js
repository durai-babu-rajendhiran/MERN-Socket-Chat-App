import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { getCurrentUser } from './utils/ApiRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useDispatch} from "react-redux";
import { UserRoute } from "./utils/UserRoute";
// Lazy loading of components
const Login = React.lazy(() => import("./screens/auth/Login"));
const Register = React.lazy(() => import("./screens/auth/Register"));
const Chat = React.lazy(() => import("./screens/Chat/Index"));

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userData = async () => {
      try {
        const User = await getCurrentUser();
        if (User.status) {
          const userItem = User.data;
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              full_name: userItem.full_name,
              email: userItem.email,
              _id: userItem._id,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    userData();
  }, [dispatch]);

  const routes = [
    { path: "/", element: <UserRoute Component={Chat} /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ];

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
