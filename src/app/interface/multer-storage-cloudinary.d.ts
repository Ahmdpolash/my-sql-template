declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { v2 as cloudinary } from "cloudinary";

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary;
    params?:
      | Record<string, any>
      | ((
          req: Express.Request,
          file: Express.Multer.File
        ) => Record<string, any> | Promise<Record<string, any>>);
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
  }
}
