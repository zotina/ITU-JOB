export interface LoginRequest {
    emailOUnumero: string;
    mot_de_passe: string;
}

export interface SignupRequest {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    adresse: string | null;
    mot_de_passe: string;
    mot_de_passe_confirmation: string;
    id_role: string;
}

export interface TokenData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface User {
    id: string;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    adresse?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    role: string;
}

export interface ApiResponse<T = any> {
    status: boolean;
    message: string;
    data?: T;
}

export interface LoginResponse extends ApiResponse {
    token_data: TokenData;
    user: User;
}

export interface SignupResponse extends ApiResponse {
    session_key: string;
    telephone: string;
    expires_in: number;
}

export interface VerifySignupResponse extends ApiResponse {
    token_data: TokenData;
    user: User;
}