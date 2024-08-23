const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const { signPDFWithPFX } = require('./signature');
const opn = require('opn');
const rimraf = require('rimraf');

// Run npm install and start the server
exec('npm install', (error) => {
    if (error) {
        console.error('Failed to install packages:', error);
        return;
    }

    const app = express();
    const port = 3000;
    const pfxPath = path.join(__dirname, 'key', 'name.pfx');
    const pfxPassword = '12345';
    const tmpDir = path.join(__dirname, 'tmp'); 

    // Set up view engine and middleware
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(fileUpload({ useTempFiles: true, tempFileDir: path.join(__dirname, 'tmp') }));

    // Render the index page
    app.get('/', (req, res) => {
        res.render('index');
    });

    // Handle file upload
    app.post('/upload', async (req, res) => {
        if (!req.files || !req.files.files) {
            return res.status(400).send({ message: 'No files were uploaded.' });
        }

        // Ensure files are in array format
        let files = req.files.files;
        if (!Array.isArray(files)) {
            files = [files]; // Convert single file to array
        }

        const outputPath = path.join(__dirname, 'signed_files');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        const totalFiles = files.length;
        let processedFiles = 0;

        try {
            await Promise.all(files.map(file => {
                const outputPdfPath = path.join(outputPath, `signed_${file.name}`);
                return signPDFWithPFX(file, outputPdfPath, pfxPath, pfxPassword).then(() => {
                    processedFiles++;
                    // Notify client of progress
                    io.emit('progress', { processed: processedFiles, total: totalFiles });
                });
            }));
            rimraf.sync(tmpDir);
            res.status(200).send({ message: 'PDFs signed successfully.' });
        } catch (error) {
            console.error('Failed to sign PDFs:', error);
            res.status(500).send({ message: 'Failed to save signed PDF' });
        }
    });


    // List signed PDFs
    app.get('/list-signed-pdfs', (req, res) => {
        const destinationFolder = 'signed_files';
        const outputPath = path.join(__dirname, destinationFolder);

        fs.readdir(outputPath, (err, files) => {
            if (err) {
                console.error('Failed to read directory:', err);
                return res.status(500).send({ message: 'Failed to retrieve signed PDFs' });
            }

            const pdfFiles = files.filter(file => file.endsWith('.pdf'));
            res.json(pdfFiles);
        });
    });

    // Start the server
    const server = app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        opn(`http://localhost:${port}`);
    });

    // Socket.io setup for real-time progress updates
    const io = require('socket.io')(server);
});
