import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Document } from './entities/document.entity';
import { Project } from '../project/entities/project.entity';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';

const UPLOAD_DIR = 'uploads/documents';

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Project]),
    MulterModule.register({
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, cb) => {
          const fileExtension = path.extname(file.originalname);
          const timestamp = Date.now();
          const randomString = crypto.randomBytes(8).toString('hex');
          const filename = `${timestamp}-${randomString}${fileExtension}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
