import multer from "multer";
import path from "path";
import fs from 'fs'

const uploadDir = 'uploads/avatars'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true})
}

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, uploadDir)
    },
    filename:(req, file, cb) =>{
        const userId = (req as any).user?.userId || 'anonymous'
        const unifiqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `avatar-${userId}-${unifiqueSuffix}${path.extname(file.originalname)}`)
    }
})

export const uploadAvatar = multer({
    storage: storage,
    limits: {fileSize: 4 * 1024 * 1024},
    fileFilter: (req, file, cb) =>{
        const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (png, jpg, jpeg, webp) are allowed!'));
    }
})


// ── Attachments (nou) ──────────────────────────────────────
const attachmentDir = "uploads/attachments";
if (!fs.existsSync(attachmentDir)) fs.mkdirSync(attachmentDir, { recursive: true });

const attachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, attachmentDir),
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${base}-${suffix}${ext}`);
  },
});

export const uploadAttachment = multer({
  storage: attachmentStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});