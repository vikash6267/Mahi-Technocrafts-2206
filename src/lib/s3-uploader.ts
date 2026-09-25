import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Downloads an image from a URL, optimizes it with Sharp (1200x675 WebP),
 * and uploads it directly to the user's AWS S3 bucket.
 */
export async function downloadAndUploadToS3(imageUrl: string, slug: string): Promise<string | null> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'idcard-pro-images';
    const region = process.env.AWS_REGION || 'ap-south-1';

    // 1. Fetch remote image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Failed to download image from ${imageUrl}: status ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 2. Process with Sharp to 1200x675 16:9 WebP
    const optimizedBuffer = await sharp(inputBuffer)
      .resize(1200, 675, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 82 })
      .toBuffer();

    // 3. Upload to S3
    const timestamp = Date.now();
    const cleanSlug = slug.replace(/[^a-z0-9-]+/g, '-').slice(0, 50);
    const key = `mahi-technocrafts/blogs/${cleanSlug}-${timestamp}.webp`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: optimizedBuffer,
      ContentType: 'image/webp',
    });

    await s3Client.send(command);

    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    console.log(`[S3 Uploader] Successfully uploaded blog cover image to S3: ${s3Url}`);
    return s3Url;
  } catch (error) {
    console.error('[S3 Uploader] Error processing and uploading image to S3:', error);
    return null;
  }
}
