import {Box, Button, Link, TextField, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../security/AuthContext.tsx";
import {UserService} from "../../services/UserService.ts";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {CheckCircle, Close} from "@mui/icons-material";
import SuccessfulRegistrationContainer from "../unauthorized/SuccessfulRegistrationContainer.tsx";
import {useNavigate} from "react-router-dom";
import {useMutation} from "react-query";
import axios from "axios";
import {environment} from "../../utils/Environment.ts";

const ProfileComponent=()=>{

    const {id, role} = useContext(AuthContext);
    const userService = new UserService();
    const [address, setAddress] = useState("")
    const [birthday, setBirthday] = useState("")
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    // const [id, setId] = useState("")
    const [image, setImage] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    const navigate = useNavigate()
    const [errorFirstName,setErrorName]=useState(false);
    const [errorLastName,setErrorLastname]=useState(false);
    const [errorMail,setErrorMail]=useState(false);
    const [errorAddress,setErrorAddress]=useState(false);
    const [errorBirthday,setErrorBirthday]=useState(false);
    const [errorUsername,setErrorUsername]=useState(false);
    const [errorPassword,setErrorPassword]=useState(false);
    const [errorSamePassword,setErrorSamePassword]=useState(false);
    const [axiosError,setAxiosError]=useState("");
    const [errorFile,setErrorFile]=useState(false);
    const [successfulRegistration,setSuccessfulRegistration] = useState(false);
    const [fileData,setFileData] = useState(null);
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
        margin:"8px auto",width:"400px",borderRadius:"10px"

    }

    const handleChangeFile= (e)=>{
        setFileData(e.target.files[0]);
    }
    const handleSignUp = async (event) => {
        event.preventDefault();
        const mailRegex=new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        const passwordRegex=new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
        let hasError=false;
        if(event.target.firstName.value.trim()==""){
            setErrorName(true)
            hasError=true;
        }
        else {setErrorName(false)}
        if(event.target.lastName.value.trim()==""){
            setErrorLastname(true)
            hasError=true;
        }  else {setErrorLastname(false)}
        if(event.target.email.value.trim()=="" || !mailRegex.test(event.target.email.value) ){
            setErrorMail(true)
            hasError=true;
        }else {setErrorMail(false)}
        if(event.target.username.value.trim()=="" || event.target.username.value.trim()<5){
            setErrorUsername(true)
            hasError=true;
        }else {setErrorUsername(false)}
        if(event.target.password.value.trim()=="" ||  !passwordRegex.test(event.target.password.value)){
            setErrorPassword(true)
            hasError=true;
        }else {setErrorPassword(false)}
        if(event.target.password.value!== event.target.confirmPassword.value){
            setErrorSamePassword(true)
            hasError=true;
        }else {setErrorSamePassword(false)}


        if (!hasError) {
            let data = {
                "id": id,
                "username": username,
                "password": password,
                "firstName": firstName,
                "lastName": lastName,
                "birthday": "2024-09-17T21:34:14.086Z",
                "address": address,
                "image": "static/profilePictures\\c8c40ea9-3cbe-435c-8187-c040a4fca30e.jpg"
            }
            userService.UpdateUser(data);
            navigate(0);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let user = await userService.GetLoggedUser(id);
                setAddress(user.address)
                setBirthday(user.birthday)
                setEmail(user.email)
                setFirstName(user.firstName)
                setImage(user.image)
                setLastName(user.lastName)
                setPassword(user.password)
                setUsername(user.username)
                console.log(user)
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    return <Box sx={{width:"100%", height:"100%", backgroundColor:"#DBDDEB"}}>
        <>{!successfulRegistration? <Box component="form" onSubmit={handleSignUp}  sx={{display:"flex",width:"100%",justifyContent:"center",flexDirection:"column"}}>
            <Typography mb={1} mt={4} align="center" sx={{fontSize:"48px",fontWeight:"600"}}>Profile</Typography>
            <TextField onChange={(e) => setFirstName(e.target.value)} value={firstName} name="firstName" placeholder="First Name" error={errorFirstName}  helperText={errorFirstName?"Firstname is required":""} sx={styled}></TextField>
            <TextField onChange={(e) => setLastName(e.target.value)} value={lastName} name="lastName" placeholder="Last Name" error={errorLastName}  helperText={errorLastName?"Lastname is required":""} sx={styled}></TextField>
            <TextField onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" placeholder="Email" sx={styled} error={errorMail}  helperText={errorMail?"Email is required and must me format example@example.com":""}></TextField>
            <TextField onChange={(e) => setAddress(e.target.value)} value={address} name="address" placeholder="Address" sx={styled} error={errorAddress}  helperText={errorAddress?"Address is required":""}></TextField>
            {/*<DatePicker name="birthday" sx={styled} error={errorBirthday}  helperText={errorBirthday?"Birthday is required":""} />*/}
            <TextField onChange={(e) => setUsername(e.target.value)} value={username}  name="username" placeholder="Username" error={errorUsername}  helperText={errorUsername?"Username must be at least 5 characters long":""} sx={styled}></TextField>
            <TextField onChange={(e) => setPassword(e.target.value)} name="password" type="password" variant="outlined"  placeholder="Password" error={errorPassword}  helperText={errorPassword?"Password must have 8 characters(1 number, 1 uppercase and 1 lowercase)":""} sx={styled}></TextField>
            <TextField  name="confirmPassword" type="password" variant="outlined"  placeholder="Confirm Password" error={errorSamePassword}  helperText={errorSamePassword?"Passwords do not match":""} sx={styled}></TextField>

            {errorFile &&<Typography align="center" sx={{fontSize:"0.75rem",fontWeight:"400", color:"#d32f2f"}}>File not uploaded</Typography>}
            {axiosError=='User with that email already exists!' &&<Typography align="center" sx={{fontSize:"0.75rem",fontWeight:"400", color:"#d32f2f"}}>Email already in use</Typography>}
            {axiosError=='User with that username already exists!' &&<Typography align="center" sx={{fontSize:"0.75rem",fontWeight:"400", color:"#d32f2f"}}>Username already in use</Typography>}
            {axiosError!='' && axiosError!='User with that email already exists!' && axiosError!='User with that username already exists!'&&<Typography align="center" sx={{fontSize:"0.75rem",fontWeight:"400", color:"#d32f2f"}}>Something went wrong</Typography>}
            <Button type="submit" sx={{backgroundColor:"#FBC40E",color:"black", width:"400px",fontSize:"22px",fontWeight:"600",paddingY:"10px",margin:"15px auto",borderRadius:"15px", ':hover':{backgroundColor:"#EDB90D"}}}>Update profile</Button>
        </Box> :<SuccessfulRegistrationContainer/>}</>
    </Box>
}
export default ProfileComponent;
