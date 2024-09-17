import {Box, Link, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";


const SuccessfulRegistrationContainer = () => {
    const navigate = useNavigate()

    return <Box sx={{display:"flex",width:"100%",justifyContent:"center",flexDirection:"column"}}>
        <Typography mb={3} align="center" sx={{fontSize:"56px",fontWeight:"600"}}>Congratulations!</Typography>
        <Typography align="center" sx={{width:"70%",fontSize:"24px",fontWeight:"600",margin:"15px auto"}}>Your account is successfully created.</Typography>
        <Link  onClick={()=>{navigate("/signin")}}  align="center" sx={{fontSize:"24px",color:"#343F71",fontWeight:"600", ":hover":{cursor:"pointer"}}}>Sign in</Link>
    </Box>
}

export default SuccessfulRegistrationContainer;