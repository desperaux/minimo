const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;

export function getRequestId(request: Request): string {
  const candidate = request.headers.get("x-request-id");
  return candidate && REQUEST_ID_PATTERN.test(candidate) ? candidate : crypto.randomUUID();
}
