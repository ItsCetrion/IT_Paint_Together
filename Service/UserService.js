import { checkUserRepo } from "../Repository/UserRepository.js";

export function checkUser(data){
    return checkUserRepo(data);
}