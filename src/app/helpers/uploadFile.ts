import fs from "fs";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads/"));
  },
  filename: function (req, file, cb) {
    const uploadsDir = path.join(process.cwd(), "/uploads/");
    const nameWithoutExt = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);

    let finalFilename = file.originalname;
    let counter = 1;

    // Check if file exists and increment counter if needed
    while (fs.existsSync(path.join(uploadsDir, finalFilename))) {
      finalFilename = `${nameWithoutExt}${counter}${extension}`;
      counter++;
    }

    cb(null, finalFilename);
  },
});

export const uploadFile = multer({
  storage: storage,
});
