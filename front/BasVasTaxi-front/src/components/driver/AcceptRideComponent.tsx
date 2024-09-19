import { Box, Button, Typography, List, ListItem, ListItemText, Paper, Divider, Avatar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../security/AuthContext.tsx";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const AcceptRideComponent = () => {
    const [pendingRides, setPendingRides] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { id, role } = useContext(AuthContext);

    useEffect(() => {
        const fetchPendingRides = async () => {
            try {
                const response = await axios.get('http://localhost:8241/RideManagement/GetAllPendingRides');
                console.log(response.data);
                setPendingRides(response.data);
            } catch (err) {
                setError('Failed to fetch pending rides.');
            }
        };

        fetchPendingRides();
    }, []);

    const handleAcceptRide = async (rideId, driverId) => {
        try {
            const jwtToken = localStorage.getItem("jwtToken");
            await axios.put(`http://localhost:8241/RideManagement/AcceptRide/accept-ride/${rideId}/driver/${driverId}`, {}, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            setSuccess(`Ride ${rideId} accepted successfully!`);
            setError('');
            setPendingRides((prev) => prev.filter((ride) => ride.id !== rideId));
        } catch (err) {
            setError('Failed to accept the ride.');
            setSuccess('');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                padding: 3,
                height: '100vh',
                backgroundColor: '#f4f6f8'
            }}
        >
            <Typography variant="h4" gutterBottom>
                Pending Rides
            </Typography>

            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}

            <Paper elevation={3} sx={{ padding: 25, backgroundColor: '#fff', borderRadius: 2, width: '100%', maxWidth: 600 }}>
                <List>
                    {pendingRides.length === 0 ? (
                        <Typography variant="body1" color="textSecondary">
                            No pending rides available.
                        </Typography>
                    ) : (
                        pendingRides.map((ride) => (
                            <React.Fragment key={ride.id}>
                                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <DirectionsCarIcon />
                                    </Avatar>
                                    <ListItemText
                                        primary={`Ride from ${ride.startAddress} to ${ride.endAddress}`}
                                        sx={{ flex: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAcceptRide(ride.id, id)}
                                        sx={{ fontWeight: 'bold', ml: 2 }}
                                    >
                                        Accept
                                    </Button>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default AcceptRideComponent;
