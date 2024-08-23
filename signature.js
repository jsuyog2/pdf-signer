const chilkat = require('@chilkat/ck-node22-win64');

/**
 * Signs a PDF file using a PFX certificate.
 * @param {object} inputPdfPath - The path to the input PDF file.
 * @param {string} outputPdfPath - The path where the signed PDF will be saved.
 * @param {string} pfxPath - The path to the PFX certificate file.
 * @param {string} pfxPassword - The password for the PFX certificate.
 * @throws {Error} Throws an error if the PDF fails to load, PFX fails to load, or signing fails.
 */
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

/**
 * Signs a PDF file using a Smart Card.
 * @param {object} inputPdfPath - The path to the input PDF file.
 * @param {string} outputPdfPath - The path where the signed PDF will be saved.
 * @param {string} SmartCardPin - The PIN for accessing the Smart Card.
 * @throws {Error} Throws an error if the PDF fails to load, Smart Card fails to load, or signing fails.
 */
async function signPDFWithSmartCard(inputPdfPath, outputPdfPath, SmartCardPin) {
    const pdf = new chilkat.Pdf();

    // Load the PDF file
    if (!pdf.LoadFile(inputPdfPath.tempFilePath)) {
        throw new Error('Failed to load PDF data: ' + pdf.LastErrorText);
    }

    const cert = new chilkat.Cert();

    // Load the Smart Card
    cert.SmartCardPin = SmartCardPin;

    if (!cert.LoadFromSmartcard("")) {
        throw new Error('Failed to load Smart Card: ' + cert.LastErrorText);
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

module.exports = { signPDFWithPFX, signPDFWithSmartCard };
