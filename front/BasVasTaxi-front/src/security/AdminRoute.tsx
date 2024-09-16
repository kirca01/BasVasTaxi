import {useContext} from "react";
import {AuthContext} from "./AuthContext.tsx";
import {Navigate} from "react-router-dom";

export const AdminRoute = ({ children } : any) => {
    const { role , isLoading,changedPassword } = useContext(AuthContext);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (role != "Admin"){
        return <Navigate to="/home" />
    }
    if (changedPassword=="False"){
        return <Navigate to="/passwordChange" />
    }

    return <>
        {children}
    </>;
};