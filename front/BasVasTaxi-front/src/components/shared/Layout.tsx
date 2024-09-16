import {Box} from "@mui/material";
import React from "react";
import Navbar from "./Navbar";

const Layout = ({children}) => {
    return <Box style={{height:"100vh", width:"100vw",display:"flex", flexDirection:"row"}}>
            <Navbar/>
            {children}
        </Box>
}

export default Layout;