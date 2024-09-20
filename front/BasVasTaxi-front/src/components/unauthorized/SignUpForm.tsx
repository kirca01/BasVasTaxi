import {Box, Button, Link, TextField, Typography, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {CheckCircle, Close} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useMutation} from "react-query";
import axios from "axios";
import {useState} from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {environment} from "../../utils/Environment.ts";
import SuccessfulRegistrationContainer from "./SuccessfulRegistrationContainer.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";

const SignUpForm = () => {
    const navigate = useNavigate();
    const [errorName, setErrorName] = useState(false);
    const [errorLastName, setErrorLastname] = useState(false);
    const [errorMail, setErrorMail] = useState(false);
    const [errorAddress, setErrorAddress] = useState(false);
    const [errorBirthday, setErrorBirthday] = useState(false);
    const [errorUsername, setErrorUsername] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorSamePassword, setErrorSamePassword] = useState(false);
    const [axiosError, setAxiosError] = useState("");
    const [errorFile, setErrorFile] = useState(false);
    const [successfulRegistration, setSuccessfulRegistration] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [role, setRole] = useState(""); // New state for role

    const styled = {
        "& label.Mui-focused": {
            color: "#FBC40E"
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#FBC40E",
                borderRadius: "10px"
            },
            borderRadius: "10px"
        },
        margin: "8px auto", width: "400px", borderRadius: "10px"
    };

    const registrationMutation = useMutation({
        mutationFn: (data: FormData) => {
            return axios.post(environment + '/UserManagement/Register', data).then((res) => {
                if (res.status === 200) {
                    setSuccessfulRegistration(true);
                    setAxiosError('');
                    navigate("/signin");
                }
            }).catch((e) => {
                if (e.response.status === 400) {
                    setAxiosError(e.response.data.message);
                }
            });
        },
    });

    const handleChangeFile = (e) => {
        setFileData(e.target.files[0]);
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        const mailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
        let hasError = false;

        // Validate fields
        if (event.target.firstName.value.trim() === "") {
            setErrorName(true);
            hasError = true;
        } else {
            setErrorName(false);
        }

        if (event.target.lastName.value.trim() === "") {
            setErrorLastname(true);
            hasError = true;
        } else {
            setErrorLastname(false);
        }

        if (event.target.email.value.trim() === "" || !mailRegex.test(event.target.email.value)) {
            setErrorMail(true);
            hasError = true;
        } else {
            setErrorMail(false);
        }

        if (event.target.username.value.trim() === "" || event.target.username.value.trim() < 5) {
            setErrorUsername(true);
            hasError = true;
        } else {
            setErrorUsername(false);
        }

        if (event.target.password.value.trim() === "" || !passwordRegex.test(event.target.password.value)) {
            setErrorPassword(true);
            hasError = true;
        } else {
            setErrorPassword(false);
        }

        if (event.target.password.value !== event.target.confirmPassword.value) {
            setErrorSamePassword(true);
            hasError = true;
        } else {
            setErrorSamePassword(false);
        }

        if (fileData == null) {
            setErrorFile(true);
            hasError = true;
        } else {
            setErrorFile(false);
        }

        if (!hasError) {
            const formData = new FormData();
            formData.append("firstName", event.target.firstName.value);
            formData.append("lastName", event.target.lastName.value);
            formData.append("email", event.target.email.value);
            formData.append("username", event.target.username.value);
            formData.append("password", event.target.password.value);
            formData.append("address", event.target.address.value);
            formData.append("birthday", "2024-09-17T20:06:20.695Z"); // Add logic for actual date
            formData.append("imageFile", fileData);
            formData.append("role", role); // Add role to form data

            registrationMutation.mutate(formData);
        }
    };

    return (
        <>
            {!successfulRegistration ? (
                <Box component="form" onSubmit={handleSignUp} sx={{ display: "flex", width: "100%", justifyContent: "center", flexDirection: "column" }}>
                    <Typography mb={1} align="center" sx={{ fontSize: "48px", fontWeight: "600" }}>Sign Up</Typography>
                    <TextField name="firstName" placeholder="First Name" error={errorName} helperText={errorName ? "Name is required" : ""} sx={styled}></TextField>
                    <TextField name="lastName" placeholder="Last Name" error={errorLastName} helperText={errorLastName ? "Lastname is required" : ""} sx={styled}></TextField>
                    <TextField type="email" name="email" placeholder="Email" sx={styled} error={errorMail} helperText={errorMail ? "Email is required and must me format example@example.com" : ""}></TextField>
                    <TextField name="address" placeholder="Address" sx={styled} error={errorAddress} helperText={errorAddress ? "Address is required" : ""}></TextField>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker name="birthday" sx={styled} helperText={errorBirthday ? "Birthday is required" : ""} />
                    </LocalizationProvider>

                    <TextField name="username" placeholder="Username" error={errorUsername} helperText={errorUsername ? "Username must be at least 5 characters long" : ""} sx={styled}></TextField>
                    <TextField name="password" type="password" variant="outlined" placeholder="Password" error={errorPassword} helperText={errorPassword ? "Password must have 8 characters(1 number, 1 uppercase and 1 lowercase)" : ""} sx={styled}></TextField>
                    <TextField name="confirmPassword" type="password" variant="outlined" placeholder="Confirm Password" error={errorSamePassword} helperText={errorSamePassword ? "Passwords do not match" : ""} sx={styled}></TextField>

                    <FormControl sx={styled}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Role"
                        >
                            <MenuItem value="USER">User</MenuItem>
                            <MenuItem value="DRIVER">Driver</MenuItem>
                        </Select>
                    </FormControl>

                    <Button startIcon={fileData === null ? <Close style={{ color: "red", fontSize: "26px" }} /> : <CheckCircle style={{ color: "#039F13", fontSize: "26px" }} />} sx={{ backgroundColor: "transparent", color: "black", textTransform: "none", width: "400px", fontSize: "26px", fontWeight: "600", paddingY: "10px", margin: "15px auto", borderRadius: "15px", ':hover': { backgroundColor: "transparent" } }}>
                        Upload profile picture
                        <input type="file" onChange={handleChangeFile} style={{ display: "block", height: "100%", width: "100%", position: "absolute", top: 0, bottom: 0, left: 0, right: 0, opacity: 0, cursor: "pointer" }} />
                    </Button>

                    {errorFile && <Typography align="center" sx={{ fontSize: "0.75rem", fontWeight: "400", color: "#d32f2f" }}>File not uploaded</Typography>}
                    {axiosError === 'User with that email already exists!' && <Typography align="center" sx={{ fontSize: "0.75rem", fontWeight: "400", color: "#d32f2f" }}>Email already in use</Typography>}
                    {axiosError === 'User with that username already exists!' && <Typography align="center" sx={{ fontSize: "0.75rem", fontWeight: "400", color: "#d32f2f" }}>Username already in use</Typography>}
                    {axiosError !== '' && axiosError !== 'User with that email already exists!' && axiosError !== 'User with that username already exists!' && <Typography align="center" sx={{ fontSize: "0.75rem", fontWeight: "400", color: "#d32f2f" }}>Something went wrong</Typography>}

                    <Button type="submit" sx={{ backgroundColor: "#FBC40E", color: "black", width: "400px", fontSize: "22px", fontWeight: "600", paddingY: "10px", margin: "15px auto", borderRadius: "15px", ':hover': { backgroundColor: "#EDB90D" } }}>Sign Up</Button>

                    <Typography align="center" sx={{ fontSize: "18px", fontWeight: "600" }}>Already have an account?</Typography>
                    <Link onClick={() => { navigate("/signin") }} align="center" sx={{ fontSize: "20px", color: "#343F71", fontWeight: "600", ":hover": { cursor: "pointer" } }}>Sign in</Link>
                </Box>
            ) : <SuccessfulRegistrationContainer />}
        </>
    );
};

export default SignUpForm;
