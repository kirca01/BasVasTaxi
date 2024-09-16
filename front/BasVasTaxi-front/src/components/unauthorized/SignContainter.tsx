import {Box, Container, CssBaseline} from "@mui/material";

const SignContainter = ({component:Component}) => {
    return <><Container  maxWidth="xl" sx={{display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }} >
        <CssBaseline/>
        <Box sx={{width:"100%",height: "900px",display:"flex",flexDirection:"row", backgroundColor: "#DBDDEB", boxShadow:"0px 15px 30px 15px rgba(0, 0, 0, 0.25)",borderRadius:"52px",overflow:"hidden"}}>
            <img src="/background.jpeg" style={{width:"50%",height:"100%",objectFit:"cover"}} alt={"Cover image"}/>

            <Component/>
        </Box>
    </Container></>
}

export default SignContainter;