import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../pages/loading";

export default function AuthRoute({ children }) {
    const {
        getUser,
        isLoggedIn,
        isFetchingUser,
        setCurrentLocation,  
        role,
    } = useContext(authContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        setCurrentLocation(window.location.pathname);
        if (!isLoggedIn && localStorage.getItem('token') != null)  {
            getUser();
        } else if (!isLoggedIn && !isFetchingUser) {
            navigate('/admin/signin');
        }else if(isLoggedIn && !isFetchingUser && role !== "admin"){
            navigate('/admin/signin');
        }
    }, [isLoggedIn,isFetchingUser,role]);
  
    return ( !isFetchingUser && isLoggedIn ) ? children : <LoadingPage />;
}
