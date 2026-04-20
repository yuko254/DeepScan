export interface JwtPayload {
  user_id: string;
  username: string;
  role_name: string | null | undefined;
}