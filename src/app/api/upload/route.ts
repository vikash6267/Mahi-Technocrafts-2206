import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { cookies } from 'next/headers';

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
    const buffer = Buffer.from(bytes);

    // Generate unique file path under mahi-technocrafts/ prefix
    const timestamp = Date.now();
    const sanitizedName = file.name.trim().toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const key = `mahi-technocrafts/${timestamp}-${sanitizedName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'idcard-pro-images';

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name
    });
  } catch (error: any) {
    console.error('S3 Upload Failure:', error);
    return NextResponse.json({ error: error.message || 'S3 upload failed' }, { status: 500 });
  }
}
