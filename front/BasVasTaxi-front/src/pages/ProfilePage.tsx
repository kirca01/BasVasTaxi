import UserHome from "../components/user/UserHome.tsx";
import {AuthContext} from "../security/AuthContext.tsx";
import {useContext, useEffect, useState} from "react";
import {AdminRoute} from "../security/AdminRoute";
import AdminHome from "../components/admin/AdminHome.tsx";
import DriverHome from "../components/driver/DriverHome.tsx";
import ProfileComponent from "../components/user/ProfileComponent.tsx";
import {UserService} from "../services/UserService.ts";


const ProfilePage=()=>{
    return (
        <>
            <ProfileComponent/>
        </>
    )
};

export default ProfilePage;