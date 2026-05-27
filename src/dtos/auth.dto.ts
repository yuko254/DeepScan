import { UserAccountDto } from "./user.dto.js";

export interface TokensDto {
  access_token: string;
  refresh_token: string;
}

export interface AuthDto {
  user: UserAccountDto;
  tokens: TokensDto;
}