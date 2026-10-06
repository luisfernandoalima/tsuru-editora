import multer from "multer";

const createUpload = (filename: string) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, `${filename}.${ext}`);
      },
    }),
  });
};

export default createUpload;
