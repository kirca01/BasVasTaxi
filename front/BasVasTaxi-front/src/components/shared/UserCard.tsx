import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { Build, Email, Home, Person } from "@mui/icons-material";
import { UserService } from "../../services/UserService.ts";

// Define the props interface
interface UserCardProps {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        address: string;
        role: string;
    };
    onAccept: () => void;
    onReject: () => void;
}

const UserCard: React.FC<UserCardProps> = ( props ) => {
    const textStyle = { fontStyle: "bold", fontWeight: "600", color: "black", margin: "5px" };
    const iconStyle = { fontStyle: "bold", fontWeight: "600", color: "#343F71", margin: "5px" };
    const containerStyle = { display: "flex", flexDirection: "row", padding: "0 10px", alignItems: "center" };
    const user = props.user
    let onAccept = props.onAccept
    let onReject = props.onReject

    const boxStyle = {
        width: "18vw",
        height: "30vh",
        backgroundColor: "white",
        borderRadius: "15px",
        textAlign: "center",
        mb: "10px",
        display: "flex",
        flexDirection: "column",
        padding: "10px"
    };

    return (
        <Box sx={boxStyle}>
            <Container disableGutters sx={containerStyle}>
                <Person sx={textStyle} /><Typography sx={textStyle}>{user.firstName}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <Person sx={textStyle} /><Typography sx={textStyle}>{user.lastName}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <Email sx={textStyle} /><Typography sx={textStyle}>{user.email}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <Person sx={textStyle} /><Typography sx={textStyle}>{user.username}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <Home sx={textStyle} /><Typography sx={textStyle}>{user.address}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <Build sx={textStyle} /><Typography sx={textStyle}>{user.role === 0 ? "User" : (user.role === 1 ? "Administrator" : "Driver")} </Typography>
            </Container>
            <Container disableGutters sx={containerStyle} style={{ marginTop: '10px' }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={onAccept}
                    style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}
                >
                    Accept
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onReject}
                    style={{ backgroundColor: 'red', color: 'white' }}
                >
                    Reject
                </Button>
            </Container>
        </Box>
    );
};

export default UserCard;