export interface JwtPayload {
  email: string;
  sub: string;
}

export interface RequestWithUser {
  user: JwtPayload;
}
