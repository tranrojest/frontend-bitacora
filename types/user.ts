export type User = {
    id: number;
    name: string;
    email: string;
    pass: string;
    createdAt?: string; 
    deletedAt?: string | null;
  };
  
  export type CreateUserDto = {
    name?: string;
    email?: string;
    pass?: string;
  };
  
  export type UpdateUserDto = {
    name?: string;
    email?: string;
  };