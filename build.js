const fs = require('fs');
const path = require('path');

const videosDir = path.join(__dirname, 'videos');

fs.readdir(videosDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Get the file stats for each video file
  const fileStats = files.map(file => {
    const filePath = path.join(videosDir, file);
    return { file, stats: fs.statSync(filePath) };
  });

  // Sort the files by their last modified time
  const sortedFiles = fileStats.sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());

  const videoListHTML = sortedFiles.map(({ file }) => `
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-body">
          <div class="embed-responsive embed-responsive-16by9 mb-3">
            <video class="embed-responsive-item" autoplay muted loop>
              <source src="videos/${file}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <button class="btn btn-primary copy-link" data-video="https://github.com/jomarweb/sora-videos/raw/main/videos/${file}">Copy Link</button>
        </div>
      </div>
    </div>
  `).join('\n');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MP4 Videos</title>
      <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
      <div class="container">
        <h1 class="mt-4 mb-4">MP4 Videos</h1>
        <div class="row">
          ${videoListHTML}
        </div>
      </div>
      <script>
        document.querySelectorAll('.copy-link').forEach(button => {
          button.addEventListener('click', () => {
            const videoSrc = button.getAttribute('data-video');
            const videoLink =  videoSrc;
            navigator.clipboard.writeText(videoLink).then(() => {
              alert('Link copied to clipboard: ' + videoLink);
            }).catch(err => {
              console.error('Failed to copy link: ', err);
            });
          });
        });
      </script>
    </body>
    </html>
  `;

  fs.writeFile('index.html', htmlContent, err => {
    if (err) {
      console.error('Error writing HTML file:', err);
      return;
    }
    console.log('HTML file generated successfully.');
  });
});
