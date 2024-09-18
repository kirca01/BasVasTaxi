import {Box, Button, Typography} from "@mui/material";
import {Profiler, useContext, useEffect, useState} from "react";
import {AuthContext} from "../../security/AuthContext";
import {Group, Home, Power, Person, History, Verified, LocalTaxi, Add} from "@mui/icons-material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {environment} from "../../utils/Environment.ts";
import {UserService} from "../../services/UserService.ts"

const Navbar = () => {
    const { id, role} = useContext(AuthContext);
    const navigate=useNavigate();
    const[name,setName]=useState("")
    const[image,setImage]=useState("")
    const[myRole,setMyRole]=useState(role)
    const userService = new UserService();



    const handleLogoutClick = (event) => {
        event.preventDefault()

        localStorage.removeItem("jwtToken");
        navigate(0);
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                let user = await userService.GetLoggedUser(id);
                setName(user.firstName + " " + user.lastName)
                setImage(user.image)
                console.log(user)
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [])

    const buttonStyle={width:"100%",color:"#FBC40EFF", justifyContent:"flex-start", paddingLeft:"15px", fontSize:"35px",textTransform:"None"}
    const typoStyle={color:"white", fontSize:"30px"}
    return <>
        <Box style={{height:"100vh", width:"360px",minWidth:"360px",backgroundColor:"#343F71FF" }}>
            {(myRole==="USER" || myRole==="DRIVER" || myRole==="ADMINISTRATOR") &&<><Button onClick={()=>navigate("/home")}  sx={buttonStyle}><Home sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>Home</Typography></Button></>}
            {(myRole==="USER" || myRole==="DRIVER" || myRole==="ADMINISTRATOR") && <><Button onClick={()=>navigate("/profile")}  sx={buttonStyle}><AccountBoxIcon sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>Profile</Typography></Button></>}
            {(myRole==="USER") && <><Button onClick={()=>navigate("/history")}  sx={buttonStyle}><History sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>History</Typography></Button></>}
            {(myRole==="ADMINISTRATOR") && <><Button onClick={()=>navigate("/verify")}  sx={buttonStyle}><Verified sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>Verification</Typography></Button></>}
            {(myRole==="ADMINISTRATOR") && <><Button onClick={()=>navigate("/allrides")}  sx={buttonStyle}><LocalTaxi sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>All rides</Typography></Button></>}
            {(myRole==="DRIVER") && <><Button onClick={()=>navigate("/newrides")}  sx={buttonStyle}><Add sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>New rides</Typography></Button></>}
            {(myRole==="DRIVER") && <><Button onClick={()=>navigate("/oldrides")}  sx={buttonStyle}><LocalTaxi sx={{marginRight:"10px"}} fontSize="inherit"/><Typography sx={typoStyle}>Old rides</Typography></Button></>}
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