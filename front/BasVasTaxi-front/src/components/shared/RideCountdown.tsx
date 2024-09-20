import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import {RideService} from "../../services/RideService.ts";
import axios from "axios";

const RideCountdown = ({ waitTime, travelTime }) => {
    const [waitTimeLeft, setWaitTimeLeft] = useState(waitTime * 60);
    const [travelTimeLeft, setTravelTimeLeft] = useState(travelTime * 60);
    const rideService = new RideService();

    useEffect(() => {
        if (waitTimeLeft > 0) {
            const interval = setInterval(() => {
                setWaitTimeLeft((prev) => prev - 1);
            }, 10);
            return () => clearInterval(interval);
        }
    }, [waitTimeLeft]);

    useEffect(() => {
        if (waitTimeLeft === 0 && travelTimeLeft > 0) {
            const interval = setInterval(() => {
                setTravelTimeLeft((prev) => prev - 1);
            }, 10);
            return () => clearInterval(interval);
        }
        if (travelTimeLeft == 0){
            let rideId = localStorage.getItem("rideId");
            rideService.FinishRide(rideId);
            localStorage.removeItem(rideId);
        }
    }, [waitTimeLeft, travelTimeLeft]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
            {waitTimeLeft > 0 ? (
                <>
                    <Typography variant="h6">Wait Time Remaining:</Typography>
                    <Typography variant="h4" color="primary">
                        {formatTime(waitTimeLeft)}
                    </Typography>
                </>
            ) : (
                <>
                    <Typography variant="h6">Travel Time Remaining:</Typography>
                    <Typography variant="h4" color="primary">
                        {formatTime(travelTimeLeft)}
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default RideCountdown;
