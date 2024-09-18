import {Box, Button, Container, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Apartment, LocationOn, Person, Money, Timer, HourglassBottom, DriveEta} from "@mui/icons-material";
import {environment} from "../../utils/Environment.ts";
import {UserService} from "../../services/UserService.ts";

const RideCard = (props) => {
    const data = props.ride
    const userService = new UserService();
    const isConditionMet = data.isApproved; // Replace with your actual condition
    const textStyle = { fontStyle: "bold", fontWeight: "600", color: "black", margin: "5px" };
    const iconStyle = { fontStyle: "bold", fontWeight: "600", color: "#343F71", margin: "5px" };
    const containerStyle = { display: "flex", flexDirection: "row", padding: "0 10px", alignItems: "center" };
    const [user, setUser] = useState({})
    const [driver, setDriver] = useState({})
    const boxStyle = {
        width: "18vw",
        height: "30vh",
        backgroundColor: "white",
        borderRadius: "15px",
        textAlign: "center",
        mb: "10px",
        display: "flex",
        flexDirection: "column",
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let userr = await userService.GetLoggedUser(data.userId);
                let driverr = {}
                if(data.driverId == "00000000-0000-0000-0000-000000000000")
                {
                    driverr.firstName = "Not";
                    driverr.lastName = "Found";
                }
                else
                {
                    driverr = await userService.GetLoggedUser(data.driverId);
                }
                setUser(userr);
                setDriver(driverr)
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);



    return (
        <Box sx={boxStyle}>
            <Container disableGutters sx={containerStyle}>
                <DriveEta sx={iconStyle} /><Typography sx={textStyle}>{driver.firstName + " " + driver.lastName}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <Person sx={iconStyle} /><Typography sx={textStyle}>{user.firstName + " " + user.lastName}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <LocationOn sx={iconStyle} /><Typography sx={textStyle}>{data.startAddress}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <LocationOn sx={iconStyle} /><Typography sx={textStyle}>{data.endAddress}</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <Money sx={iconStyle} /><Typography sx={textStyle}>{data.price} rsd</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <Timer sx={iconStyle} /><Typography sx={textStyle}>{data.travelTime} min</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <HourglassBottom sx={iconStyle} /><Typography sx={textStyle}>{data.waitTime} min</Typography>
            </Container>
            <Container disableGutters sx={containerStyle}>
                <HourglassBottom sx={iconStyle} /><Typography sx={textStyle}>{data.status === 0 ? "Processing" : (data.status === 1 ? "Confirmed" : "Finished")} </Typography>
            </Container>
        </Box>
    );
};

export default RideCard;