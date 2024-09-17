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
}
