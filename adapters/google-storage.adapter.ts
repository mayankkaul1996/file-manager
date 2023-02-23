import { Storage } from '@google-cloud/storage';
import { CloudStorage } from "./type";

export class GcpStorage implements CloudStorage {
  private gcpStorage: Storage;

  constructor(gcpProjectId: string) {
    this.gcpStorage = new Storage({ projectId: gcpProjectId });
  }

  async listFiles(bucketName: string, prefix: string): Promise<string[]> {
    const [files] = await this.gcpStorage.bucket(bucketName).getFiles({ prefix });
    const fileNames = files.map((file) => file.name);
    return fileNames;
  }

  async downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
    const file = this.gcpStorage.bucket(bucketName).file(fileName);
    const [fileBuffer] = await file.download();
    return fileBuffer;
  }

  async uploadFile(bucketName: string, filePath: string, fileName?: string): Promise<void> {
    const file = this.gcpStorage.bucket(bucketName).file(fileName ?? filePath);
    await file.save(filePath);
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    const file = this.gcpStorage.bucket(bucketName).file(fileName);
    await file.delete();
  }
}