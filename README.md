# PDF Signer Application

## Overview

This application allows users to upload multiple PDF files, sign them with a digital certificate, and store them in a specified destination folder. The application also provides a progress bar during the signing process and lists the signed PDFs.

## Features

- Upload multiple PDF files
- Select a destination folder for signed PDFs
- Display a progress bar during the signing process
- List signed PDFs

## Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/your-username/pdf-signer.git
    cd pdf-signer
    ```

2. **Install Dependencies:**

    Make sure you have [Node.js](https://nodejs.org/) installed. Then run:

    ```bash
    npm install
    ```

3. **Install Additional Packages:**

    Install the required packages for file handling and cleanup:

    ```bash
    npm install rimraf @chilkat/ck-node22-win64 express express-fileupload
    ```

## Configuration

1. **Certificates:**

    Place your PFX certificate file in the `key` directory and update the `pfxPath` and `pfxPassword` in `index.js` as needed.

    ```javascript
    const pfxPath = path.join(__dirname, 'key', 'name.pfx');
    const pfxPassword = '12345'; // Update with your PFX password
    ```

2. **Temporary Directory:**

    The application uses a `tmp` directory for storing temporary files. Ensure this directory exists or is created automatically.

## Usage

1. **Start the Server:**

    Run the following command to start the application:

    ```bash
    node index.js
    ```

2. **Access the Application:**

    Open your web browser and navigate to `http://localhost:3000` to use the application.

3. **Upload and Sign PDFs:**

    - Use the form to upload PDF files and select a destination folder.
    - Monitor the progress bar as the files are signed.
    - The list of signed PDFs will be updated once the process is complete.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. **Fork the Repository:**

    Click the "Fork" button on the top-right corner of the repository page.

2. **Create a Branch:**

    ```bash
    git checkout -b feature/your-feature
    ```

3. **Make Changes and Commit:**

    ```bash
    git add .
    git commit -m "Add your message here"
    ```

4. **Push to Your Fork:**

    ```bash
    git push origin feature/your-feature
    ```

5. **Submit a Pull Request:**

    Go to the repository page and click on "New Pull Request."

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Chilkat](https://www.chilkatsoft.com/) for PDF signing functionality
- [Express](https://expressjs.com/) for server handling