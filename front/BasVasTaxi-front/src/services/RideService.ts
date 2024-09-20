import axios from "axios";
import {environment} from "../utils/Environment.ts";

export class RideService {
    constructor() {
    }

    public async GetAllRides(): Promise<object> {
        return axios.get(environment + `/RideManagement/GetAllRides`)
            .then(res => {
                if (res.status === 200){
                    return res.data
                }
            }).catch((error) => {
                console.log(error);
                return {}
            });
    }

    public async GetRidesForUser(id: string): Promise<object> {
        return axios.get(environment + `/RideManagement/GetRidesForUser/${id}`)
            .then(res => {
                if (res.status === 200){
                    return res.data
                }
            }).catch((error) => {
                console.log(error);
                return {}
            });
    }

    public async GetRidesForDriver(id: string): Promise<object> {
        return axios.get(environment + `/RideManagement/GetRidesForDriver/${id}`)
            .then(res => {
                if (res.status === 200){
                    return res.data
                }
            }).catch((error) => {
                console.log(error);
                return {}
            });
    }
    public async GetStatusForRide(id: string): Promise<object> {
        const jwtToken = localStorage.getItem("jwtToken")
        return axios.get(environment + `/RideManagement/GetRideStatus/${id}/status`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
            .then(res => {
                if (res.status === 200){
                    return res.data
                }
            }).catch((error) => {
                console.log(error);
                return {}
            });
    }

    public async FinishRide(id: string): Promise<object> {
        const jwtToken = localStorage.getItem("jwtToken")
        return axios.put(environment + `/RideManagement/FinishRide/finish-ride/${id}`,  {}, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
            .then(res => {
                if (res.status === 200){
                    return res.data
                }
            }).catch((error) => {
                console.log(error);
                return {}
            });
    }


}
