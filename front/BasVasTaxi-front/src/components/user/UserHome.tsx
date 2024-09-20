import {Box, Dialog, Typography} from "@mui/material";
import CreateRideComponent from "./CreateRideComponent.tsx";
import React, {useEffect, useState} from "react";
import {RideService} from "../../services/RideService.ts";
import RideCountdown from "../shared/RideCountdown.tsx";

const UserHome = () => {
    const rideService = new RideService();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [waitTime, setWaitTime] = useState(false);
    const [travelTime, setTravelTime] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            console.log("jel radi")
            let rideId = localStorage.getItem("rideId");
            if (rideId != null) {
                const fetchRideStatus = async () => {
                    let rideStatus = await rideService.GetStatusForRide(rideId);
                    console.log(rideStatus.status);

                    if (rideStatus.status === 1) {
                        setWaitTime(rideStatus.waitTime);
                        setTravelTime(rideStatus.travelTime);
                        setDialogOpen(true);
                        clearInterval(interval);
                    }
                };

                fetchRideStatus();
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Function to close the dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box sx={{ width: "100%", height: "100%", backgroundColor: "#DBDDEB" }}>
            <Typography variant="body2" color="textSecondary">
                <CreateRideComponent />
            </Typography>

            {/* Dialog component */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
            >
                <RideCountdown
                    waitTime={waitTime}
                    travelTime={travelTime}
                />
            </Dialog>
        </Box>
    );
};

export default UserHome;
