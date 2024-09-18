import {Box, Container, Grid, TablePagination, Typography} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {RideService} from "../../services/RideService.ts";
import RideCard from "../shared/RideCard.tsx";
import {RotatingLines} from "react-loader-spinner";
import {AuthContext} from "../../security/AuthContext.tsx";
import {UserService} from "../../services/UserService.ts";


const OldRidesComponent=()=>{

    const rideService = new RideService();
    const [rides, setRides] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [totalCount, setTotalCount] = useState(0);
    const {id, role} = useContext(AuthContext);
    const userService = new UserService();


    useEffect(() => {
        const fetchUser = async () => {
            try {
                let rideslist = await rideService.GetRidesForUser(id);
                console.log(rideslist);
                setRides(rideslist)
                setTotalCount(rideslist.length)
                setIsLoading(true);
                console.log(rides)

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    const renderPanel = () => {
        return <>


            {rides.length === 0 ? <p>No rides to show...</p> : <div>
                <Grid container sx={{boxSizing: 'border-box', mt: "30px", height: '100%', width: '100%', px: 3}}>
                    {rides.map((item) => (
                        <Grid item key={item.id} xs={12} sm={6} md={6} lg={6} mt={"20px"}>
                            <RideCard ride={item}/>
                        </Grid>
                    ))}
                </Grid>
            </div>
            }
        </>
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return <Box sx={{width:"100%", height:"100%", backgroundColor:"#DBDDEB"}}>
        <Typography ml={6} mt={2}  sx={{fontSize: "40px", fontWeight: "600"}} color="textSecondary">
            Old rides
        </Typography>
        <Container style={{position: 'relative'}}>
            {renderPanel()}
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[8]}
                style={{position: 'fixed', bottom: 10, right: 30}}
            />
        </Container>
    </Box>
}
export default OldRidesComponent;
