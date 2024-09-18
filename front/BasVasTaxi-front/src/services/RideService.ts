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
}
