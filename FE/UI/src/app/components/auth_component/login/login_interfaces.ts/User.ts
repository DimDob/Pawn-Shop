import { PrismData } from "./prismData";

/**
 * The interface describes whether the pawn shop
 */
export interface User extends PrismData{
    isAdmin?: boolean
    
    isEmployee?: boolean

}