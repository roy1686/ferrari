const fs = require('fs');

function logAllTkhd(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 0;
  const results = [];
  
  while (true) {
    const tkhdOffset = buffer.indexOf(Buffer.from('tkhd'), offset);
    if (tkhdOffset === -1) break;
    
    const version = buffer[tkhdOffset + 4];
    let widthOffset, heightOffset;
    if (version === 1) {
      widthOffset = tkhdOffset + 92;
      heightOffset = tkhdOffset + 96;
    } else {
      widthOffset = tkhdOffset + 80;
      heightOffset = tkhdOffset + 84;
    }
    
    if (widthOffset + 8 <= buffer.length) {
      const widthInt = buffer.readUInt16BE(widthOffset);
      const widthFrac = buffer.readUInt16BE(widthOffset + 2);
      const heightInt = buffer.readUInt16BE(heightOffset);
      const heightFrac = buffer.readUInt16BE(heightOffset + 2);
      
      results.push({
        offset: tkhdOffset,
        version,
        width: `${widthInt}.${widthFrac}`,
        height: `${heightInt}.${heightFrac}`
      });
    }
    
    offset = tkhdOffset + 4;
  }
  return results;
}

console.log('video1.mp4:', logAllTkhd('src/assets/video1.mp4'));
console.log('video2.mp4:', logAllTkhd('src/assets/video2.mp4'));
console.log('video3.mp4:', logAllTkhd('src/assets/video3.mp4'));
