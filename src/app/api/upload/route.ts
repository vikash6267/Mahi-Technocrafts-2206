import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { cookies } from 'next/headers';
import sharp from 'sharp';

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'mahi_authenticated_session_token';
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let contentType = file.type;
    let fileName = file.name;

    // Auto-compress and optimize images (Max 1920px width, crisp WebP ~150-400KB, well under 1-2MB)
    if (file.type.startsWith('image/')) {
      try {
        const optimizedBuffer = await sharp(buffer)
          .rotate() // Auto-orient based on EXIF
          .resize({
            width: 1920,
            height: 1080,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({
            quality: 80,
            effort: 5
          })
          .toBuffer();

        buffer = Buffer.from(optimizedBuffer);
        contentType = 'image/webp';
        // Swap file extension to .webp
        fileName = file.name.replace(/\.[^/.]+$/, "") + '.webp';
        console.log(`[S3 Upload] Image compressed with Sharp: final size ${(buffer.length / 1024).toFixed(1)} KB`);
      } catch (err) {
        console.error('Sharp image optimization failed, uploading original', err);
      }
    }

    // Generate unique file path under mahi-technocrafts/ prefix
    const timestamp = Date.now();
    const sanitizedName = fileName.trim().toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const key = `mahi-technocrafts/${timestamp}-${sanitizedName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'idcard-pro-images';
    const region = process.env.AWS_REGION || 'ap-south-1';

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable'
    });

    await s3Client.send(command);

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: fileName,
      sizeKb: (buffer.length / 1024).toFixed(1)
    });
  } catch (error: any) {
    console.error('S3 Upload Failure:', error);
    return NextResponse.json({ error: error.message || 'S3 upload failed' }, { status: 500 });
  }
}
