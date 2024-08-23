/**
 * Handles form submission for uploading PDFs.
 * Prevents the default form submission, sends the form data to the server via a POST request,
 * and displays the result message on the page.
 * Also fetches the list of signed PDFs if the upload is successful.
 * 
 * @param {Event} event - The form submission event.
 */
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.target); // Create FormData object from form

    try {
        // Send POST request to the server with form data
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        // Parse JSON response
        const result = await response.json();
        const messageElement = document.getElementById('message');

        // Display message based on response status
        if (response.ok) {
            messageElement.textContent = result.message;
            messageElement.style.color = 'green';
            fetchSignedPDFs(); // Fetch and display signed PDFs
        } else {
            messageElement.textContent = result.message;
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during file upload:', error);
    }
});

// Initialize Socket.io client
// eslint-disable-next-line no-undef
const socket = io();

/**
 * Updates the progress bar based on real-time progress data from the server.
 * Displays the progress container and updates the progress text and fill width.
 * 
 * @param {Object} data - Progress data containing processed and total file counts.
 * @param {number} data.processed - Number of processed files.
 * @param {number} data.total - Total number of files.
 */
socket.on('progress', (data) => {
    const progressContainer = document.getElementById('progressContainer');
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');

    progressContainer.style.display = 'block'; // Show progress container
    progressText.textContent = `Progress: ${data.processed}/${data.total}`; // Update progress text
    progressFill.style.width = `${(data.processed / data.total) * 100}%`; // Update progress bar width
});

/**
 * Fetches the list of signed PDFs from the server and updates the displayed list.
 * Sends a GET request to the server and appends each signed PDF to the list on the page.
 */
async function fetchSignedPDFs() {
    try {
        // Send GET request to fetch signed PDFs
        const response = await fetch('/list-signed-pdfs');
        const pdfFiles = await response.json();
        const pdfListItems = document.getElementById('pdfListItems');
        pdfListItems.innerHTML = ''; // Clear existing list items

        // Append each signed PDF to the list
        pdfFiles.forEach(file => {
            console.log(file);
            if (file.includes('signed_')) { // Check if the file is a signed PDF
                const li = document.createElement('li');
                li.textContent = file; // Set list item text
                pdfListItems.appendChild(li); // Append list item to the list
            }
        });
    } catch (error) {
        console.error('Error fetching signed PDFs:', error);
    }
}
