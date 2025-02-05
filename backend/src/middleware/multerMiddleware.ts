import express from 'express';
import { Router } from 'express'
import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const multerMiddleware = multer({ storage });


const router = Router();

router.post('/upload', upload.single('file'), (req: Request<{}, {}, { file: Express.Multer.File }, any, any>, res: Response, next: NextFunction) => {



    if (!req.file) {
        return res.status(400).send('Please upload a file');
    }
    if (req.file?.mimetype.split('/')[0] !== 'image') {
        return res.status(400).send('Please upload an image');
    }

    res.send(req.file);
});

router.get('/download/:filename', (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename;
    res.download(filename);
});

export { upload };
export default upload;
