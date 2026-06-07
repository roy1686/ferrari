const fs = require('fs');
const path = require('path');

function getGLBNodeNames(glbPath) {
  try {
    const buffer = fs.readFileSync(glbPath);
    // Read GLB header
    const magic = buffer.toString('utf8', 0, 4);
    if (magic !== 'glTF') {
      return { error: 'Not a valid glTF/GLB file' };
    }
    
    const version = buffer.readUInt32LE(4);
    const length = buffer.readUInt32LE(8);
    
    // Read JSON chunk header
    const chunkLength = buffer.readUInt32LE(12);
    const chunkType = buffer.readUInt32LE(16);
    // 0x4E4F534A is "JSON"
    if (chunkType !== 0x4E4F534A) {
      return { error: 'First chunk is not JSON' };
    }
    
    // Parse JSON
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    
    const nodes = gltf.nodes || [];
    const nodeNames = nodes.map(n => n.name).filter(Boolean);
    
    const meshes = gltf.meshes || [];
    const meshNames = meshes.map(m => m.name).filter(Boolean);
    
    return {
      nodeCount: nodes.length,
      meshCount: meshes.length,
      sampleNodes: nodeNames.slice(0, 40),
      sampleMeshes: meshNames.slice(0, 40)
    };
  } catch (e) {
    return { error: e.message };
  }
}

const glbFolder = path.join(__dirname, '../../public');
const files = ['sf90.glb', '296gtb.glb'];

files.forEach(file => {
  const filePath = path.join(glbFolder, file);
  console.log(`\n=================== FILE: ${file} ===================`);
  if (fs.existsSync(filePath)) {
    const info = getGLBNodeNames(filePath);
    console.log(`Node Count: ${info.nodeCount}, Mesh Count: ${info.meshCount}`);
    console.log('Sample Nodes:', info.sampleNodes);
    console.log('Sample Meshes:', info.sampleMeshes);
  } else {
    console.log('File does not exist.');
  }
});
