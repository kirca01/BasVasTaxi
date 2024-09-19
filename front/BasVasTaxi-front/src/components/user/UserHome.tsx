import {Box, Typography} from "@mui/material";
import CreateRideComponent from "./CreateRideComponent.tsx";

const UserHome=()=>{

    return <Box sx={{width:"100%", height:"100%", backgroundColor:"#DBDDEB"}}>
        <Typography variant="body2" color="textSecondary">
            <CreateRideComponent />
        </Typography>
    </Box>
}
export default UserHome;
