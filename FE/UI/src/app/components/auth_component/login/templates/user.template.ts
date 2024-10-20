// C:\Users\Georgi Markov\Documents\GitHub\Pawn-Shop\Pawn-Shop\FE\UI\src\app\components\auth_component\login\templates\user.template.ts
import { User } from "../login_interfaces.ts/User";
import prismDetailsTemplate from "./prismDetails.template";

const userTemplate: User = {
  isAdmin: undefined,
  ...prismDetailsTemplate
};

export default userTemplate;
