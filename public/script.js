document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);


    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    const messageElement = document.getElementById('message');

    if (response.ok) {
        messageElement.textContent = result.message;
        messageElement.style.color = 'green';
        fetchSignedPDFs();
    } else {
        messageElement.textContent = result.message;
        messageElement.style.color = 'red';
    }
});

const socket = io();

socket.on('progress', (data) => {
    const progressContainer = document.getElementById('progressContainer');
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');

    progressContainer.style.display = 'block';
    progressText.textContent = `Progress: ${data.processed}/${data.total}`;
    progressFill.style.width = `${(data.processed / data.total) * 100}%`;
});

async function fetchSignedPDFs() {
    const response = await fetch('/list-signed-pdfs');
    const pdfFiles = await response.json();
    const pdfListItems = document.getElementById('pdfListItems');
    pdfListItems.innerHTML = '';

    pdfFiles.forEach(file => {
        console.log(file);
        if (file.includes('signed_')) {
            const li = document.createElement('li');
            li.textContent = file;
            pdfListItems.appendChild(li);
        }
    });
}
