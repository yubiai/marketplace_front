import { useDispatchGlobal } from "../providers/globalProvider";
import { profileService } from "../services/profileService"

const loginPoh = (address) => {

    return new Promise(async (resolve, reject) => {
        try {
            const res = await profileService.login(address);
            return resolve(res.data);
        } catch (err) {
            console.error(err);
            return reject(false);
        }
    })

}

const logoutUser = () => {
    console.log("Logout User")
}

export {
    logoutUser,
    loginPoh
}