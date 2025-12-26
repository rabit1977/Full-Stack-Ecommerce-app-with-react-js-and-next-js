
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name}`;
  const path = join(process.cwd(), 'public/uploads', filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    
    // Return the public URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });

  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' });
  }
}
