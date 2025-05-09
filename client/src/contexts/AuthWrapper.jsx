import { createContext, useState } from "react";
import { axiosClient } from "../api/axios";

export const authContext = createContext({
    isFetchingUser: false,
    setIsFetchingUser: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    user: {},
    setUser: () => { },
    getUser: () => { },
    role: "",
    setRole: () => {},
    currentLocation: "",
    setCurrentLocation: () => {}
})

export function AuthWrapper({ children }) {
    const [isFetchingUser, setIsFetchingUser] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState({})
    const [role, setRole] = useState("guest")
    const [currentLocation, setCurrentLocation] = useState(null)
    

    const getUser = async () => {
        try {
            setIsFetchingUser(true);
            const isAdmin = localStorage.getItem('admin');
            if(isAdmin){
                const response = await axiosClient.get('http://localhost:5555/admin');
                setUser(response.data.user);
                setIsLoggedIn(true);
                setRole("admin");
            }else{
                const response = await axiosClient.get('http://localhost:5555/user');
                setUser(response.data.user);
                setIsLoggedIn(true);
                setRole("user");
            }
        } catch (err) {
            setIsLoggedIn(false);
            setUser({});
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            // console.error("Error from AuthWrapper:", err);
        }  finally {
            setIsFetchingUser(false);
        }
    };
    

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            setIsLoggedIn(false);
            setUser({});
        } catch (err) {
            console.error("error logging out: ", err);
        }
    };

    return <>
        <authContext.Provider value={{
            isFetchingUser, setIsFetchingUser,
            user, setUser,
            getUser,
            isLoggedIn, setIsLoggedIn,
            logout , 
            role, setRole,
            currentLocation , setCurrentLocation,
        }}>
            {children}
        </authContext.Provider>
    </>
}