import {Box, Container, Grid, TablePagination, Typography} from "@mui/material";
import React, { useEffect, useState } from "react";
import { UserService } from "../../services/UserService.ts";
import UserCard from "../shared/UserCard.tsx";
import { RotatingLines } from "react-loader-spinner";

const VerifyUserComponent: React.FC = () => {
    const userService = new UserService();
    const [users, setUsers] = useState<any[]>([]);
    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [username, setUsername] = useState("")
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [totalCount, setTotalCount] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let nonActivatedUsers = await userService.GetAllNonActivatedUsers();
                console.log(nonActivatedUsers);
                setUsers(nonActivatedUsers);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleAccept = async (id: string) => {
        try {
            await userService.ActivateUser(id);
            setUsers(users.filter(user => user.id !== id)); // Remove user from list
        } catch (error) {
            console.error("Error activating user:", error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await userService.BlockUser(id);
            setUsers(users.filter(user => user.id !== id)); // Remove user from list
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Box sx={{ width: "100%", height: "100%", backgroundColor: "#DBDDEB", padding: "20px" }}>
            <Typography ml={6} mt={2} sx={{ fontSize: "40px", fontWeight: "600" }} color="textSecondary">
                Verify Users
            </Typography>
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[8]}
                style={{position: 'fixed', bottom: 10, right: 30}}
            />
            <Container>
                {isLoading ? (
                    <RotatingLines width="100" strokeColor="#343F71" />
                ) : users.length === 0 ? (
                    <p>No users to verify...</p>
                ) : (
                    <Grid container sx={{ boxSizing: 'border-box', mt: "30px", height: '100%', width: '100%', px: 3 }}>
                        {users.map((user) => (
                            <Grid item key={user.id} xs={12} sm={6} md={6} lg={6} mt={"20px"}>
                                <UserCard
                                    user={user}
                                    onAccept={() => handleAccept(user.id)}
                                    onReject={() => handleReject(user.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

        </Box>
    );
};

export default VerifyUserComponent;
