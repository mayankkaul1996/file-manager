import AWS from 'aws-sdk';
import { CloudStorage } from './type';
import * as fs from 'fs';

class AwsStorage implements CloudStorage {
    private s3: AWS.S3;
  
    constructor(awsConfig: AWS.S3.ClientConfiguration) {
      this.s3 = new AWS.S3(awsConfig);
    }
  
    async listFiles(bucketName: string, prefix: string): Promise<string[]> {
      const s3Params = { Bucket: bucketName, Prefix: prefix };
      const s3Objects = await this.s3.listObjectsV2(s3Params).promise();
      const fileNames = s3Objects.Contents?.map((file) => file.Key || '') || [];
      return fileNames;
    }
  
    async downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
      const s3Params = { Bucket: bucketName, Key: fileName };
      const s3Object = await this.s3.getObject(s3Params).promise();
      return s3Object.Body as Buffer;
    }
  
    async uploadFile(bucketName: string, filePath: string, fileName?: string): Promise<void> {
      const fileStream = fs.createReadStream(filePath);
      const s3Params = { Bucket: bucketName, Key: fileName ?? filePath, Body: fileStream };
      await this.s3.upload(s3Params).promise();
    }
  
    async deleteFile(bucketName: string, fileName: string): Promise<void> {
      const s3Params = { Bucket: bucketName, Key: fileName };
      await this.s3.deleteObject(s3Params).promise();
    }
  }