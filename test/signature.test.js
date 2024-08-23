// __tests__/signature.test.js
const path = require('path');
const fs = require('fs');
const { signPDFWithPFX, signPDFWithSmartCard } = require('../signature');

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

describe('signPDFWithPFX', () => {
    it('should sign PDF with PFX certificate', async () => {
        const inputPdfPath = { tempFilePath: path.join(__dirname, 'test.pdf') };
        const outputPdfPath = path.join(__dirname, 'signed_test.pdf');
        const pfxPath = path.join(__dirname, 'test.pfx');
        const pfxPassword = 'password';

        // Create a dummy PDF file
        fs.writeFileSync(inputPdfPath.tempFilePath, 'dummy content');

        await expect(signPDFWithPFX(inputPdfPath, outputPdfPath, pfxPath, pfxPassword)).resolves.not.toThrow();

        // Cleanup
        fs.unlinkSync(inputPdfPath.tempFilePath);
        if (fs.existsSync(outputPdfPath)) {
            fs.unlinkSync(outputPdfPath);
        }
    });
});

describe('signPDFWithSmartCard', () => {
    it('should sign PDF with Smart Card', async () => {
        const inputPdfPath = { tempFilePath: path.join(__dirname, 'test.pdf') };
        const outputPdfPath = path.join(__dirname, 'signed_test.pdf');
        const SmartCardPin = '12345';

        // Create a dummy PDF file
        fs.writeFileSync(inputPdfPath.tempFilePath, 'dummy content');

        await expect(signPDFWithSmartCard(inputPdfPath, outputPdfPath, SmartCardPin)).resolves.not.toThrow();

        // Cleanup
        fs.unlinkSync(inputPdfPath.tempFilePath);
        if (fs.existsSync(outputPdfPath)) {
            fs.unlinkSync(outputPdfPath);
        }
    });
});
