import "server-only";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { headers } from "next/headers";

export const api = createCaller(
  await createTRPCContext({
    req: {
      headers: await headers(),
    } as { headers: Headers },
    res: {} as Response,
  })
);
