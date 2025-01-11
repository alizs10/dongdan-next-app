export type LoginCredentialsRequest = {
    email: string;
    password: string;
}

export type RegisterCredentialsRequest = {
    email: string;
    password: string;
    password_confirmation: string;
}

export type ChangePasswordRequest = {
    password: string;
    new_password: string;
    new_password_confirmation: string;
}

export type ForgotPasswordRequest = {
    email: string;
}

export type DeleteAccountRequest = {
    password: string;
}

export type ResetPasswordRequest = {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}