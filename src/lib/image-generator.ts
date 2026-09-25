import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Curated High-Definition, Editorial, 4K Professional Photography mapped to each industry.
 * No watermarks, no blurry rooms, no abstract 3D boxes.
 */
const INDUSTRY_PHOTOS: Record<string, string[]> = {
  pricing: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=675&q=85',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&h=675&q=85',
  ],
  healthcare: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&h=675&q=85',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&h=675&q=85',
  ],
  ecommerce: [
    'https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&w=1200&h=675&q=85',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&h=675&q=85',
  ],
  realestate: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=675&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=675&q=85',
  ],
  ai: [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&h=675&q=85',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=675&q=85',
  ],
  mobile: [
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&h=675&q=85',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&h=675&q=85',
  ],
  webdev: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=675&q=85',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=675&q=85',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=675&q=85',
  ]
};

function selectIndustryPhoto(category?: string, title?: string): string {
  const query = `${category || ''} ${title || ''}`.toLowerCase();
  
  if (query.includes('health') || query.includes('doctor') || query.includes('clinic') || query.includes('hospital') || query.includes('medical')) {
    const arr = INDUSTRY_PHOTOS.healthcare;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (query.includes('commerce') || query.includes('shop') || query.includes('retail') || query.includes('store') || query.includes('upi') || query.includes('d2c')) {
    const arr = INDUSTRY_PHOTOS.ecommerce;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (query.includes('real estate') || query.includes('builder') || query.includes('property') || query.includes('flat') || query.includes('house')) {
    const arr = INDUSTRY_PHOTOS.realestate;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (query.includes('ai') || query.includes('bot') || query.includes('automation') || query.includes('chatbot') || query.includes('neural')) {
    const arr = INDUSTRY_PHOTOS.ai;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (query.includes('cost') || query.includes('price') || query.includes('pricing') || query.includes('guide') || query.includes('analytics')) {
    const arr = INDUSTRY_PHOTOS.pricing;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (query.includes('mobile') || query.includes('app') || query.includes('ios') || query.includes('android')) {
    const arr = INDUSTRY_PHOTOS.mobile;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const arr = INDUSTRY_PHOTOS.webdev;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Uploads any image Buffer directly to AWS S3 after converting to WebP (1200x675)
 */
export async function uploadBufferToS3(inputBuffer: Buffer, slug: string): Promise<string | null> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'idcard-pro-images';
    const region = process.env.AWS_REGION || 'ap-south-1';

    // Optimize and crop with Sharp (1200x675 16:9 WebP at 85% quality)
    const webpBuffer = await sharp(inputBuffer)
      .resize(1200, 675, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toBuffer();

    const timestamp = Date.now();
    const cleanSlug = slug.replace(/[^a-z0-9-]+/g, '-').slice(0, 45);
    const key = `mahi-technocrafts/blogs/${cleanSlug}-${timestamp}.webp`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: webpBuffer,
      ContentType: 'image/webp',
    });

    await s3Client.send(command);

    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    console.log(`[Image Generator] Successfully uploaded image to AWS S3: ${s3Url}`);
    return s3Url;
  } catch (error) {
    console.error('[Image Generator] S3 Upload Error:', error);
    return null;
  }
}

/**
 * Generates or fetches a high-definition professional image and uploads it to AWS S3.
 */
export async function generateAndUploadBlogImage(topic: {
  title: string;
  category?: string;
  slug: string;
  imagePrompt?: string;
}): Promise<string> {
  const { title, category, slug, imagePrompt } = topic;
  const slugClean = slug || 'blog-cover';

  // Step 1: Attempt Google Gemini Imagen 3 API if key is available
  try {
    const imagenEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;
    const res = await fetch(imagenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        instances: [{
          prompt: imagePrompt || `High-end professional photography of ${title}, modern corporate software agency workspace, ultra realistic, clean lighting, 4k`
        }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const base64Data = data?.predictions?.[0]?.bytesBase64Encoded;
      if (base64Data) {
        console.log('[Image Generator] Successfully generated image via Google Imagen 3!');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const s3Url = await uploadBufferToS3(imageBuffer, slugClean);
        if (s3Url) return s3Url;
      }
    }
  } catch (imagenErr) {
    console.warn('[Image Generator] Google Imagen 3 endpoint unreachable, fetching high-definition editorial visual...');
  }

  // Step 2: Download Curated HD Editorial Photography & Upload Directly to AWS S3
  const sourceUrl = selectIndustryPhoto(category, title);

  try {
    const photoRes = await fetch(sourceUrl);
    if (photoRes.ok) {
      const buffer = Buffer.from(await photoRes.arrayBuffer());
      const s3Url = await uploadBufferToS3(buffer, slugClean);
      if (s3Url) {
        return s3Url;
      }
    }
  } catch (photoErr) {
    console.error('[Image Generator] Error uploading curated photo to S3:', photoErr);
  }

  // Fallback to direct HD URL if S3 credentials not present
  return sourceUrl;
}
