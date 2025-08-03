const express = require('express');
const multer  = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
// File filter for jpg, jpeg, png only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed'), false);
  }
};

// Limit file size to 5MB (5 * 1024 * 1024 bytes)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Serve static files (for access to images)
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check
app.get('/', (req, res) => {
  res.send('Image Hosting & Compression Service is running!');
});

// Upload and compress endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const baseName = path.parse(req.file.filename).name; // Get file name without extension
    const outputFilename = `compressed-${baseName}.jpg`;
    const outputPath = path.join(UPLOADS_DIR, outputFilename);

    // Compress and resize image (to width 800px, adjust as needed)
    await sharp(inputPath)
      .resize({ width: 800 })        // You can remove/adjust this line if you don't want resizing
      .jpeg({ quality: 70 })         // You can change to .png() if you want to keep PNG format
      .toFile(outputPath);

    // Optionally, delete original (uncompressed) file
    fs.unlinkSync(inputPath);

    // Return the URL to the compressed image
    res.json({ url: `/uploads/${outputFilename}` });
  } catch (err) {
    res.status(500).json({ error: 'Image upload or compression failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
