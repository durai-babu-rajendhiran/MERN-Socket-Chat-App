import { useEffect } from "react";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
export const UserRoute = ({ Component }) => {
    const { user } = useSelector((state) => state); // Direct access to user from state
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [user]);
  
    // If user is logged in, render the Component, otherwise, navigate will handle the redirect
    return user && user.email ? <Component /> : null;
  };