import { success } from "@/lib/api-contracts";
import { getRequestId } from "@/lib/request-id";

export function GET(request: Request) {
  const requestId = getRequestId(request);
  return Response.json(success({ status: "ok", service: "junvo-web" }, requestId), { headers: { "Cache-Control": "no-store" } });
}
