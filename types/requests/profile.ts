import { SchemeType } from "../event-types";

export type UpdateProfileRequest = {
    name: string;
    email: string;
    scheme: SchemeType;
}
