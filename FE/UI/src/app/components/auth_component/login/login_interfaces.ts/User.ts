// UI\src\app\components\auth_component\login\login_interfaces.ts\User.ts
import { PrismData } from "./prismData";

/**
 * The interface describes whether the pawn shop
 */
export interface User extends PrismData {
  isAdmin?: boolean;

  isEmployee?: boolean;
}
