import {Box, Button, InputLabel, Link, TextField, Typography} from "@mui/material";
import React, {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {environment} from "../../utils/Environment.ts";


const SignInForm = () => {
    const googleButtonStyle = {
        color: "gray",
        backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)',
        backgroundColor: 'white',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '12px 11px',

    }
    const styled = {
        "& label.Mui-focused": {
            color: "#FBC40E"
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#FBC40E",
                borderRadius:"10px"

            },
            borderRadius:"10px"
        },
        margin:"15px auto",width:"400px",backgroundColor:"white",borderRadius:"10px"

    }
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    function submitGoogle(event) {
        window.location.href="http://localhost:5283/api/User/signin-google"
    }


    function submitHandler(event: FormEvent<HTMLDivElement>) {
        event.preventDefault()
        axios.post(environment + `/UserManagement/Login`, {
            email: username,
            password: password
        }).then(res => {
            if (res.status === 200) {
                localStorage.setItem("jwtToken", res.data);
                navigate(0)
            }
        }).catch((error) => {
            console.log(error)
            if (error.response?.status !== undefined && error.response.status === 404) {
                setError("Invalid username or password!");
            } else if (error.response?.status !== undefined && error.response.status === 400) {
                setError("Invalid input!");
            } else {
                setError("An error occurred!");
            }
        });
    }
    return <><Box component="form" onSubmit={submitHandler} sx={{display:"flex",width:"100%",justifyContent:"center",flexDirection:"column"}}>
        <Typography mb={1} align="center" sx={{fontSize:"48px",fontWeight:"600"}}>Sign In</Typography>
        <TextField id="username" placeholder="Username" sx={styled} onChange={(e) => {
            setUsername(e.target.value)
        }}></TextField>
        <TextField id="password" type="password" variant="outlined"  placeholder="Password" sx={styled} onChange={(e) => {
            setPassword(e.target.value)
        }}></TextField>
        <div>
            <InputLabel  style={{color: "red",textAlign:"center"}}>{error}</InputLabel>
        </div>
        <Button type="submit" sx={{backgroundColor:"#FBC40E",color:"black", width:"400px",fontSize:"22px",fontWeight:"600",paddingY:"10px",margin:"15px auto",borderRadius:"15px", ':hover':{backgroundColor:"#EDB90D"}}}>Sign In</Button>
        <Button
            type="button"
            onClick={submitGoogle}
            style={googleButtonStyle}
            variant="contained"
            sx={{mt:3, mb: 3,width:"400px",margin:"15px auto",borderRadius:"12px"}}
        >
            Continue with google
        </Button>
        <Typography align="center" sx={{fontSize:"18px",fontWeight:"600"}}>Don't have an account?</Typography>
        <Link  onClick={()=>{navigate("/signup")}}  align="center" sx={{fontSize:"20px",color:"#343F71",fontWeight:"600", ":hover":{cursor:"pointer"}}}>Sign up</Link>
    </Box></>
}

export default SignInForm;