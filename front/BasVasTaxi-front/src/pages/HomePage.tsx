import UserHome from "../components/user/UserHome.tsx";
import {AuthContext} from "../security/AuthContext.tsx";
import {useContext} from "react";
import {AdminRoute} from "../security/AdminRoute";
import AdminHome from "../components/admin/AdminHome.tsx";
import DriverHome from "../components/driver/DriverHome.tsx";


const HomePage=()=>{
    const { role} = useContext(AuthContext);
    return (
        <>
            {role==="ADMINISTRATOR" &&<AdminHome/>}
            {role==="USER" &&<UserHome/>}
            {role==="DRIVER" &&<DriverHome/>}
        </>
    )
};

export default HomePage;