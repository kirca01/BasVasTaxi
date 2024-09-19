import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: '8px',
    p: 4,
};

const formWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',  // To make sure it takes up the whole height of the viewport
    backgroundColor: '#f5f5f5'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
};

const CreateRideComponent = () => {
    const [userID, setUserID] = useState('');
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [open, setOpen] = useState(false); // State for modal visibility

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newRide = {
            userID,
            startAddress,
            endAddress
        };

        try {
            const response = await axios.post('http://localhost:8241/RideManagement/CreateRide', newRide);
            setSuccess(`Ride created successfully!`);
            setError('');

            setResponseData(response.data); // Save the response data
            handleOpen(); // Open the modal
        } catch (err) {
            setError('Failed to create the ride. Please try again.');
            setSuccess('');
        }
    };

    return (
        <Box sx={formWrapperStyle}>
            <Box sx={formStyle}>
                <Typography variant="h4" sx={{ mb: 2 }}>Create a Ride</Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="User ID"
                        variant="outlined"
                        value={userID}
                        onChange={(e) => setUserID(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Start Address"
                        variant="outlined"
                        value={startAddress}
                        onChange={(e) => setStartAddress(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="End Address"
                        variant="outlined"
                        value={endAddress}
                        onChange={(e) => setEndAddress(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, width: '100%' }}
                    >
                        Create Ride
                    </Button>
                </form>

                {error && (
                    <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </Box>

            {/* Modal for showing the response data */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="ride-data-title"
                aria-describedby="ride-data-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="ride-data-title" variant="h6" component="h2">
                        Ride Created Successfully!
                    </Typography>
                    {responseData && (
                        <div>
                            <Typography>Start Address: {responseData.startAddress}</Typography>
                            <Typography>End Address: {responseData.endAddress}</Typography>
                            <Typography>Price: {responseData.price}</Typography>
                            <Typography>Travel Time: {responseData.travelTime} min</Typography>
                            <Typography>Wait Time: {responseData.waitTime} min</Typography>
                        </div>
                    )}
                    <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
                        OK
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default CreateRideComponent;
