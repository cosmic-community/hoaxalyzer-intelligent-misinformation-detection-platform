const fs = require('fs');
const path = require('path');

function injectConsoleCapture() {
  const outDir = path.join(process.cwd(), '.next/standalone');
  const serverDir = path.join(process.cwd(), '.next/server');
  
  const scriptContent = fs.readFileSync(
    path.join(process.cwd(), 'public/dashboard-console-capture.js'),
    'utf8'
  );
  
  const scriptTag = `<script>${scriptContent}</script>`;
  
  function processDirectory(directory) {
    if (!fs.existsSync(directory)) return;
    
    const files = fs.readdirSync(directory, { recursive: true });
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      
      if (fs.statSync(filePath).isFile() && filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (!content.includes('dashboard-console-capture')) {
          content = content.replace('</head>', `${scriptTag}</head>`);
          fs.writeFileSync(filePath, content);
          console.log(`✓ Injected console capture into ${filePath}`);
        }
      }
    });
  }
  
  processDirectory(outDir);
  processDirectory(serverDir);
  
  console.log('✓ Console capture injection complete');
}

injectConsoleCapture();