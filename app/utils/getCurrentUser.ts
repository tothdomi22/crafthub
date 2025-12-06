import {cookies} from "next/headers";
import {jwtVerify} from "jose";
import {User, UserRole} from "@/app/types/user";

interface JWTPayloadCustom {
  sub: string;
  role: string;
  name: string;
  email: string;
}

export default async (): Promise<User | null> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  const cookieStore = await cookies();
  const jwt = cookieStore.get("accessToken");
  if (!jwt) return null;

  const secretKey = new TextEncoder().encode(secret);

  try {
    const {payload} = await jwtVerify<JWTPayloadCustom>(jwt.value, secretKey);
    const id = Number(payload.sub);
    const validRoles: UserRole[] = [UserRole.USER, UserRole.ADMIN];
    if (!validRoles.includes(payload.role as UserRole)) return null;
    const role = payload.role as UserRole;
    const name = payload.name;
    const email = payload.email;

    if (!id || !role || !name || !email) return null;

    return {id, role, name, email};
  } catch {
    return null;
  }
};
