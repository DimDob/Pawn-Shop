import { User } from "../login_interfaces.ts/User";
import prismDetailsTemplate from "./prismDetails.template";

const userTemplate: User = {
    isAdmin: undefined,
    ...prismDetailsTemplate
    
}

export default userTemplate;