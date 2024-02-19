// src/auth/types/user.type.ts
export interface UserWithoutPassword {
  id: string;
  username: string;
  // inclua outros campos do usuário, exceto a senha
}
