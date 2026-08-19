import { S3Client } from "@aws-sdk/client-s3";

export function getObjectStorage() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const endpoint = process.env.OBJECT_STORAGE_ENDPOINT || process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
  const accessKeyId = process.env.OBJECT_STORAGE_ACCESS_KEY || process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.OBJECT_STORAGE_SECRET_KEY || process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.OBJECT_STORAGE_BUCKET || process.env.R2_BUCKET || process.env.R2_BUCKET_NAME;
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) throw new Error("Object storage is not configured.");
  return { client: new S3Client({ region: "auto", endpoint, credentials: { accessKeyId, secretAccessKey } }), bucket };
}
