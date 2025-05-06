export interface User {
    name: string;
    email: string;
    password: string;
    phone:string;
}

export type SignInInput = Pick<User, 'email' | 'password'>;
