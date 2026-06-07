const fs = require('fs');
const path = require('path');

function getGLBWheelNodes(glbPath) {
  try {
    const buffer = fs.readFileSync(glbPath);
    const chunkLength = buffer.readUInt32LE(12);
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    
    const nodes = gltf.nodes || [];
    const wheelNodes = nodes.filter(n => n.name && n.name.toLowerCase().includes('wheel'));
    
    return wheelNodes.map(n => n.name);
  } catch (e) {
    return [e.message];
  }
}

const glbFolder = path.join(__dirname, '../../public');
const files = ['sf90.glb', '296gtb.glb', '812.glb', 'roma.glb'];

files.forEach(file => {
  const filePath = path.join(glbFolder, file);
  console.log(`\n=================== FILE: ${file} ===================`);
  if (fs.existsSync(filePath)) {
    const names = getGLBWheelNodes(filePath);
    console.log(names);
  } else {
    console.log('File does not exist.');
  }
});
