// __tests__/index.test.js
const path = require('path');
const fs = require('fs');
const express = require('express');
const request = require('supertest');
const fileUpload = require('express-fileupload');
const { signPDFWithSmartCard } = require('../signature');

// Mock Chilkat library
jest.mock('@chilkat/ck-node22-win64', () => {
    return {
        Pdf: jest.fn().mockImplementation(() => ({
            LoadFile: jest.fn().mockReturnValue(true),
            SetSigningCert: jest.fn().mockReturnValue(true),
            SignPdf: jest.fn().mockReturnValue(true),
            LastErrorText: ''
        })),
        Cert: jest.fn().mockImplementation(() => ({
            LoadPfxFile: jest.fn().mockReturnValue(true),
            LoadFromSmartcard: jest.fn().mockReturnValue(true),
            SmartCardPin: ''
        })),
        JsonObject: jest.fn().mockImplementation(() => ({
            UpdateInt: jest.fn(),
            UpdateString: jest.fn()
        }))
    };
});

describe('POST /upload', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp' }));
        app.post('/upload', async (req, res) => {
            if (!req.files || !req.files.files) {
                return res.status(400).send({ message: 'No files were uploaded.' });
            }

            const file = req.files.files;
            const outputPath = path.join(__dirname, 'signed_files', 'signed_test.pdf');

            try {
                await signPDFWithSmartCard(file, outputPath, '12345');
                res.status(200).send({ message: 'PDF signed successfully.' });
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                res.status(500).send({ message: 'Failed to sign PDF' });
            }
        });
    });

    it('should sign a PDF successfully', async () => {
        const filePath = path.join(__dirname, 'test.pdf');
        
        // Create a dummy PDF file for testing
        fs.writeFileSync(filePath, 'dummy content');

        const response = await request(app)
            .post('/upload')
            .attach('files', filePath);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('PDF signed successfully.');

        // Cleanup
        fs.unlinkSync(filePath);
    });

    it('should return error if no file is uploaded', async () => {
        const response = await request(app)
            .post('/upload');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No files were uploaded.');
    });
});
