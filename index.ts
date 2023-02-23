import { GcpStorage } from "./adapters/google-storage.adapter";
import { CloudStorage } from "./adapters/type";


enum CloudProvider  {
  GCP = 'GCP',
  AWS = 'AWS'
}

class FileManager {
  private cloudStorage: CloudStorage;

  constructor(cloudProvider: CloudProvider, config: any) {
    if (cloudProvider === CloudProvider.GCP) {
      this.cloudStorage = new GcpStorage(config.projectId);
    } 
  }

  setCloudProvider(provider: CloudStorage) {
    this.cloudStorage = provider;
  }

  async listFiles(bucketName: string, prefix: string): Promise<string[]> {
    return this.cloudStorage.listFiles(bucketName, prefix);
  }

  async downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
    return this.cloudStorage.downloadFile(bucketName, fileName);
  }

  async uploadFile(bucketName: string, filePath: string, fileName?: string): Promise<void> {
    return this.cloudStorage.uploadFile(bucketName, filePath, fileName);
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    return this.cloudStorage.deleteFile(bucketName, fileName);
  }
}

export default FileManager;