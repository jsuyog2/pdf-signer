const chilkat = require('@chilkat/ck-node22-win64');

async function signPDFWithPFX(inputPdfPath, outputPdfPath, pfxPath, pfxPassword) {
    const pdf = new chilkat.Pdf();
    var success = pdf.LoadFile(inputPdfPath.tempFilePath);
    if (!success) {
        throw new Error('Failed to load PDF data: ' + pdf.LastErrorText);
    }

    const cert = new chilkat.Cert();
    success = cert.LoadPfxFile(pfxPath, pfxPassword);
    if (!success) {
        throw new Error('Failed to load PFX file: ' + cert.LastErrorText);
    }
    success = pdf.SetSigningCert(cert);
    if (!success) {
        throw new Error('Failed to set signing certificate: ' + pdf.LastErrorText);
    }

    var json = new chilkat.JsonObject();
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

    success = pdf.SignPdf(json, outputPdfPath);
    if (!success) {
        throw new Error('Failed to sign PDF: ' + pdf.LastErrorText);
    }

    console.log(inputPdfPath.name + ' PDF signed successfully.');
}

async function signPDFWithSmartCard(inputPdfPath, outputPdfPath, smartPin) {
    const pdf = new chilkat.Pdf();
    var success = pdf.LoadFile(inputPdfPath.tempFilePath);
    if (!success) {
        throw new Error('Failed to load PDF data: ' + pdf.LastErrorText);
    }

    const cert = new chilkat.Cert();
    cert.SmartCardPin = smartPin;

    var success = cert.LoadFromSmartcard("");
    if (!success) {
        throw new Error('Failed to load PFX file: ' + cert.LastErrorText);
    }
    success = pdf.SetSigningCert(cert);
    if (!success) {
        throw new Error('Failed to set signing certificate: ' + pdf.LastErrorText);
    }

    var json = new chilkat.JsonObject();
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

    success = pdf.SignPdf(json, outputPdfPath);
    if (!success) {
        throw new Error('Failed to sign PDF: ' + pdf.LastErrorText);
    }

    console.log(inputPdfPath.name + ' PDF signed successfully.');
}

module.exports = { signPDFWithPFX };