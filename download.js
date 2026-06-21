const https = require('https');
const fs = require('fs');

const fileId = '1nFOKE3RxeiCYl0PF7dhoIvrXLU-9g-RR';
const url = `https://docs.google.com/uc?export=download&id=${fileId}`;

function download(url, dest) {
  const file = fs.createWriteStream(dest);
  https.get(url, function(response) {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // Follow redirect
      console.log('Redirecting to:', response.headers.location);
      download(response.headers.location, dest);
      return;
    }
    response.pipe(file);
    file.on('finish', function() {
      file.close(() => {
        console.log('Download completed. File size:', fs.statSync(dest).size);
      });
    });
  }).on('error', function(err) {
    fs.unlink(dest, () => {});
    console.error('Error downloading file:', err.message);
  });
}

download(url, 'courier-doc.pdf');
