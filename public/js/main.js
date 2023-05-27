document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    const output = document.getElementById('output');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const filesInput = document.querySelector('input[name="folder"]');
        const files = filesInput.files;

        if (files.length !== 0) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    output.innerHTML = `<p>${data.message}</p>`;
                })
                .catch(error => {
                    output.innerHTML = `<p>Error: ${error.message}</p>`;
                });
        }

    });
});
