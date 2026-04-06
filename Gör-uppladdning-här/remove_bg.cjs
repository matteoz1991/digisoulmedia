const Jimp = require('jimp');

Jimp.read('public/logga1.png')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      const maxCol = Math.max(r, g, b);
      // Remove black background.
      // If pixels are very dark, they get zero alpha.
      if (maxCol < 25) {
        this.bitmap.data[idx + 3] = 0; // Transparent
      } else if (maxCol < 80) {
        // Anti-aliasing soft edge for dark grey pixels merging into black
        this.bitmap.data[idx + 3] = Math.floor(((maxCol - 25) / 55) * 255);
      }
    });
    return image.write('public/logga1_trans.png');
  })
  .then(() => {
    console.log("Background removed successfully, saved as logga1_trans.png");
  })
  .catch(err => {
    console.error("Error processing image:", err);
  });
