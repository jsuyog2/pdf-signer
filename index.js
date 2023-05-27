const { exec } = require('child_process');
exec('npm install', (error) => {
    if (error) {
        console.error('Failed to install packages:', error);
        return;
    }

    const fs = require('fs');
    const path = require('path');

    const express = require('express');
    const fileUpload = require('express-fileupload');
    const { signPDFWithPFX } = require('./signature');
    const opn = require('opn');
    const app = express();


    app.set('view engine', 'ejs');

    app.use(express.static('public'));

    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: './tmp/'
    }));
    // Render the index page
    app.get('/', (req, res) => {
        res.render('index');
    });

    // Handle file upload
    app.post('/upload', (req, res) => {
        const pfxPath = './key/name.pfx';
        const pfxPassword = '12345';
        var outputPath = `C:/pdfSigned`;
        var path_exist = fs.existsSync(path);
        if (!path_exist) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        Promise.all(
            req.files.files.map((file, index) => {
                const outputPdfPath = path.join(outputPath, `/signed_${file.name}`);
                return signPDFWithPFX(file, outputPdfPath, pfxPath, pfxPassword);
            })
        ).then(() => {
            res.status(200).send({ message: 'PDFs signed successfully.' });
        }).catch((error) => {
            console.log('Failed to sign PDFs:', error);
            res.status(500).send({ message: `Failed to save signed PDF` });
        })
    });

    // Start the server
    const port = 3001;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        opn('http://localhost:' + port);
    });
});