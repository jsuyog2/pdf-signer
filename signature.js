// signature.js
const chilkat = require('@chilkat/ck-node22-win64');

async function signPDFWithPFX(inputPdfPath, outputPdfPath, pfxPath, pfxPassword) {
    const pdf = new chilkat.Pdf();
    
    // Load the PDF file
    if (!pdf.LoadFile(inputPdfPath.tempFilePath)) {
        throw new Error('Failed to load PDF data: ' + pdf.LastErrorText);
    }

    const cert = new chilkat.Cert();
    
    // Load the PFX file
    if (!cert.LoadPfxFile(pfxPath, pfxPassword)) {
        throw new Error('Failed to load PFX file: ' + cert.LastErrorText);
    }

    // Set the signing certificate
    if (!pdf.SetSigningCert(cert)) {
        throw new Error('Failed to set signing certificate: ' + pdf.LastErrorText);
    }

    const json = new chilkat.JsonObject();
    json.UpdateInt('signingCertificateV2', 1);
    json.UpdateInt('signingTime', 1);
    json.UpdateInt('page', 1);
    json.UpdateString('appearance.y', 'bottom');
    json.UpdateString('appearance.x', 'right');
    json.UpdateString('appearance.margin_x', '25');
    json.UpdateString('appearance.fontScale', '10.0');
    json.UpdateString('appearance.text[0]', 'Digitally signed by: cert_cn');
    json.UpdateString('appearance.text[1]', 'current_dt');
    json.UpdateString('appearance.text[2]', 'HSBC Sign');

    // Sign the PDF
    if (!pdf.SignPdf(json, outputPdfPath)) {
        throw new Error('Failed to sign PDF: ' + pdf.LastErrorText);
    }
}

module.exports = { signPDFWithPFX };
