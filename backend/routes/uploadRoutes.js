import express from 'express';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
// import path from 'path';
// import multer from 'multer';

dotenv.config();
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename(req, file, cb) {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/png'
//     ) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type'));
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
// }).single('image');

// router.post('/', upload, (req, res) => {
//     res.send({
//         message: 'Image uploaded successfully',
//         image: `${req.file.path}`,
//     });
// });

router.post('/', (req, res, next) => {
    const file = req.files.image;

    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
    ) {
        cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'proshoppk'
        }, (err, result) => {
            res.send({
                message: 'Image uploaded successfully',
                image: result.url
            });
        });
    } else {
        throw new Error('Invalid file type');
    }
});

export default router;