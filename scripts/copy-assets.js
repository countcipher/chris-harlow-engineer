const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Musashi\\.gemini\\antigravity-ide\\brain\\9f12af4b-536d-410a-9106-baff0c7563f5';
const destDir = path.join(__dirname, '..', 'assets', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = [
  { match: /^hero_tech_architecture_.*\.jpg$/, dest: 'hero-architecture.jpg' },
  { match: /^case_study_ai_mcp_.*\.jpg$/, dest: 'case-study-ai-mcp.jpg' },
  { match: /^case_study_security_.*\.jpg$/, dest: 'case-study-security.jpg' },
  { match: /^case_study_platform_.*\.jpg$/, dest: 'case-study-platform.jpg' },
  { match: /^case_study_hybrid_.*\.jpg$/, dest: 'case-study-hybrid.jpg' }
];

try {
  const files = fs.readdirSync(srcDir);
  fileMap.forEach(({ match, dest }) => {
    const found = files.find(f => match.test(f));
    if (found) {
      fs.copyFileSync(path.join(srcDir, found), path.join(destDir, dest));
      console.log(`Copied ${found} -> assets/images/${dest}`);
    } else {
      console.warn(`File matching ${match} not found in ${srcDir}`);
    }
  });
  console.log('All image assets successfully synchronized!');
} catch (err) {
  console.error('Error copying assets:', err);
}
