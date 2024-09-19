import axios from "axios";
import {environment} from "../utils/Environment.ts";

export class UserService {

    constructor() {
    }

    public async GetLoggedUser(id: string): Promise<object> {
         return axios.get(environment + `/UserManagement/GetById/?id=` + id)
            .then(res => {
                if (res.status === 200){
                    return res.data
                }
            }).catch((error) => {
            console.log(error);
            return {}
        });
    }

    public async UpdateUser(data: object): Promise<void> {
        return axios.put(environment + `/UserManagement/UpdateUser`, data)
    }

    public async GetAllNonActivatedUsers(): Promise<object> {
        return axios.get(environment + `/UserManagement/GetAllNonActivatedUsers/`)
            .then(res => {
                if (res.status === 200){
                    return res.data
                }
            }).catch((error) => {
                console.log(error);
                return {}
            });
    }

    public async ActivateUser(id : string): Promise<object> {
        const jwtToken = localStorage.getItem("jwtToken")
        return axios.put(environment + `/UserManagement/ActivateUser/?id=` + id, {}, {
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

    public async BlockUser(id : string): Promise<object> {
        const jwtToken = localStorage.getItem("jwtToken")
        return axios.put(environment + `/UserManagement/BlockUser/?id=` + id, {}, {
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
