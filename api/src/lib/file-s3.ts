import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import { slugify } from "./utils";
import sharp from "sharp";
export const s3Client = new S3Client({
  region: process.env.REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "key",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secret",
  },
});

const bucketName = process.env.BUCKET_NAME || "aprisio";

export const saveFile = async (
  blob: Blob | undefined,
  parentFolder: string,
  keyString = ""
) => {
  try {
    if (!blob) {
      return { ok: false, filename: "" };
    }

    let hash =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    let extension = blob.type.split("/")[1];
    let filename =
      "uploads/" +
      parentFolder +
      "/" +
      slugify(blob.name) +
      "." +
      hash +
      `${keyString ? `-${keyString}` : ""}` +
      "." +
      extension;


    const arrayBuffer = await blob.arrayBuffer();
    let imageBuffer = Buffer.from(arrayBuffer);
    const metadata: any = await sharp(imageBuffer).metadata();
    const fileSizeMB = imageBuffer.length / (1024 * 1024);


    if (metadata.quality && metadata.quality <= 50) {
    } else if (fileSizeMB >= 15) {
      imageBuffer = await sharp(imageBuffer)
        .resize({ width: 2000 })
        .jpeg({ quality: 70 })
        .toBuffer();
    } else if (fileSizeMB >= 3) {
      imageBuffer = await sharp(imageBuffer).jpeg({ quality: 75 }).toBuffer();
    } else if (fileSizeMB >= 1) {
      imageBuffer = await sharp(imageBuffer).jpeg({ quality: 80 }).toBuffer();
    } else {
    }
    // @ts-ignore
    const stream = Readable.from(imageBuffer);


    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: filename,
        Body: stream,
        ContentLength: imageBuffer.length,
      },
    });

    await upload.done();

    return { ok: true, filename };
  } catch (error) {
    console.error(error);
    return { ok: false, filename: "" };
  }
};

export const deleteFile = (key: any) => {
  try {
    s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete file");
  }
};

export const deliverFile = async (filename: string) => {
  try {
    if (!bucketName || !filename) {
      throw new Error("Bucket name or filename is missing");
    }

    let url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: filename,
        ResponseContentDisposition: "inline",
        ResponseContentType: "application/octet-stream",
      }),
      {
        expiresIn: 3600,
      }
    );

    if (!url) {
      return {
        ok: false,
        data: [],
      };
    }

    return {
      data: url,
      ok: true,
    };
  } catch (error) {
    console.error("Error in deliverFile:", error);
    return {
      ok: false,
      data: [],
    };
  }
};

export const getAsBlob = async (filename: string) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    const data = await s3Client.send(command);

    const stream = data.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    //@ts-ignore
    const buffer = Buffer.concat(chunks);

    return {
      data: buffer,
      ok: true,
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      data: null,
    };
  }
};
