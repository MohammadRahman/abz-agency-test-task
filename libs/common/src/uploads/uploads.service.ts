import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  private readonly s3Client = new S3Client({
    region: 'eu-north-1',
  });
  constructor(private readonly configService: ConfigService) {}
  async uploadImage(key: string, file: Express.Multer.File) {
    const bucket = 'abz-profile-image';
    try {
      const response = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.eu-north-1.amazonaws.com/${key}`;
      }
      throw new Error('Image not uploaded');
    } catch (error) {
      throw new Error(error);
    }
  }
}
