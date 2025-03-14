const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set storage location for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp to avoid conflicts
    }
});

const upload = multer({ storage: storage });

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve static files (uploaded files)
app.use('/uploads', express.static('uploads'));

// Endpoint for uploading files
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send({ message: 'File uploaded successfully!', fileName: req.file.filename });
    } else {
        res.status(400).send({ message: 'No file uploaded' });
    }
});

// Endpoint for getting the list of uploaded files
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            res.status(500).send({ message: 'Error reading files' });
        } else {
            res.status(200).send(files);
        }
    });
});

// Endpoint for deleting a file
app.delete('/files/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).send({ message: 'Error deleting file' });
        } else {
            res.status(200).send({ message: 'File deleted successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
