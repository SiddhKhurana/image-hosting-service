# Image Hosting & Compression Service

A simple backend API to upload images, compress and resize them for optimized storage, and provide shareable URLs for the compressed images.

---

## Features

- Upload images (`.jpg`, `.jpeg`, `.png`) via HTTP POST
- Automatic image compression and resizing using Sharp.js
- Serve compressed images through a public URL
- File size and type validation (max 5MB)
- Simple health check endpoint

---

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm

### Installation

```bash
git clone https://github.com/SiddhKhurana/image-hosting-service.git
cd image-hosting-service
npm install
```
### Running the Server

```bash
node index.js
