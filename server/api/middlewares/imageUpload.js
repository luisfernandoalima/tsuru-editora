import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const createUpload = () => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, `${uuidv4()}.${ext}`);
      },
    }),
  });
};

export default createUpload;
