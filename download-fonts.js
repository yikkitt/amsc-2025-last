const https = require('https');
const fs = require('fs');
const path = require('path');

const fontUrls = [
  {
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    outputPath: path.join(__dirname, 'public', 'fonts', 'Inter-Regular.woff2')
  },
  {
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2',
    outputPath: path.join(__dirname, 'public', 'fonts', 'Inter-Medium.woff2')
  },
  {
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SUc.woff2',
    outputPath: path.join(__dirname, 'public', 'fonts', 'Inter-SemiBold.woff2')
  },
  {
    url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.woff2',
    outputPath: path.join(__dirname, 'public', 'fonts', 'Inter-Bold.woff2')
  }
];

// Function to download a file and save it locally
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(outputPath);
    
    https.get(url, response => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${path.basename(outputPath)}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(outputPath, () => {}); // Delete the file async
      console.error(`Error downloading ${url}: ${err.message}`);
      reject(err);
    });
  });
}

// Download all fonts
async function downloadAllFonts() {
  console.log('Starting font downloads...');
  
  try {
    await Promise.all(fontUrls.map(font => downloadFile(font.url, font.outputPath)));
    console.log('All fonts downloaded successfully!');
  } catch (error) {
    console.error('Font download failed:', error);
  }
}

downloadAllFonts(); 