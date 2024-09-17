import {useContext} from "react";
import {AuthContext} from "./AuthContext.tsx";
import {Navigate} from "react-router-dom";

export const DriverRoute = ({ children } : any) => {
    const { role , isLoading,changedPassword } = useContext(AuthContext);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (role != "DRIVER"){
        return <Navigate to="/home" />
    }

    return <>
        {children}
    </>;
};