import {Box, Button, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../security/AuthContext";
import {Group, Home, Power} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {environment} from "../../utils/Environment.ts";

const Navbar = () => {
    const { role} = useContext(AuthContext);
    const navigate=useNavigate();
    const[name,setName]=useState("")
    const[image,setImage]=useState("")
    const[myRole,setMyRole]=useState(role)
    const handleLogoutClick = (event) => {
        event.preventDefault()

        localStorage.removeItem("jwtToken");
        navigate(0);
    };

    const buttonStyle={width:"100%",color:"#FBC40EFF", justifyContent:"flex-start", paddingLeft:"15px", fontSize:"35px",textTransform:"None"}
    const typoStyle={color:"white", fontSize:"30px"}
    return <>
        <Box style={{height:"100vh", width:"360px",minWidth:"360px",backgroundColor:"#343F71FF" }}>
            {(myRole==="Admin" || myRole==="superadmin") &&<><Button onClick={()=>navigate("/home")}  sx={buttonStyle}><Home sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>Home</Typography></Button></>}
            {myRole==="superadmin" &&<><Button onClick={()=>navigate("/addAdmin")}  sx={buttonStyle}><Group sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>Add Admin</Typography></Button></>}
            {(myRole==="Admin" || myRole==="superadmin") &&<><Button onClick={()=>navigate("/consumption")}  sx={buttonStyle}><Power sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>Consumption</Typography></Button></>}
            {myRole==="User" &&<><Button onClick={()=>navigate("/userHome")}  sx={buttonStyle}><Home sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>Home</Typography></Button></>}
            <Box position="absolute" bottom="0">
                <Box padding="10px" display="flex"  alignItems="center" flexDirection="row">
                    <img src={environment + '/' + image} width="50px" height="50px" style={{objectFit:"cover",borderRadius:"100px",border:"5px solid #FBC40EFF"}}/>
                    <Box display="flex" justifyContent="center" flexDirection="column" textAlign="left" ml={1} mt={1} mb={0}>
                        <Typography textAlign="left" fontSize="22px" fontWeight="600" color="white">{name}</Typography>
                        <Typography onClick={handleLogoutClick} textAlign="left" fontSize="16px" fontWeight="600" color="#FBC40EFF" sx={{":hover":{cursor:"pointer"}}}>Logout</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    </>
}

export default Navbar;