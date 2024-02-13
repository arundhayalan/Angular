export interface User{
    
    id:number;
    firstName: String;
    lastName: String;
    phoneNumber: number;
    dob: Date;
    gender: String;
    email: String;
    password: String;
    role: 'buyer' | 'seller';
    productcategories: string;
    panNumber : String;
}