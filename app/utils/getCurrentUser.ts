import {cookies} from "next/headers";
import {jwtVerify} from "jose";

export default async () => {
  const cookieStore = await cookies();
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  const jwt = cookieStore.get("accessToken");

  let id;
  try {
    if (jwt && secretKey) {
      const {payload} = await jwtVerify(jwt.value, secretKey);
      id = payload.sub;
      if (!id) {
        return null;
      }
      return id;
    }
  } catch {
    return null;
  }
  return null;
};
