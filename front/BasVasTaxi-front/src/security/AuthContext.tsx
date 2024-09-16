import {createContext, useState, useEffect} from 'react';
import axios from "axios";
import {environment} from "../utils/Environment.ts";

export const AuthContext = createContext({
    isAuthenticated: false,
    role: null,
    changedPassword:null,
    isLoading: true,
    id: null
});

export const AuthProvider = ({ children } : any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [id, setId] = useState(null);
    const [changedPassword, setChangedPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        let token = localStorage.getItem("jwtToken")
        axios.get(`${environment}/UserManagement/whoAmI`, {
            headers: {
                'Authorization': `Bearer ${token}` // Set the Bearer token in the Authorization header
            }
        })
            .then(res => {
                if (res.status === 200){
                    setIsAuthenticated(true);
                    setRole(res.data.role);
                    setId(res.data.id);
                    setChangedPassword(res.data.passwordChanged)
                }
                setIsLoading(false);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setIsLoading(false);
                setChangedPassword(null);
                setId(null)
            });
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, role,changedPassword ,id }}>
            {children}
        </AuthContext.Provider>
    );
};
