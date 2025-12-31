const fs = require('fs');
const path = require('path');

const doodlesDir = path.join(__dirname, '../common_assets/doodles');
const outputFile = path.join(doodlesDir, 'README.md');

// Get all files
const files = fs.readdirSync(doodlesDir).filter(file => {
    return (file.endsWith('.svg') || file.endsWith('.png')) && file !== 'README.md';
});

// Sort files
files.sort();

let md = `# Doodles

This directory contains ${files.length} SVG/PNG doodle assets for use in Instagram posts.

## Usage Guidelines

- **Line Doodles Only**: These assets are consistent with the brand's line-art identity.
- **Rotation**: Rotate doodles slightly (-15 to 15 degrees) for dynamism.
- **Aspect Ratio**: Always preserve the natural aspect ratio.
- **Prominence**: Use as prominent accents to add character.

## Asset Index

| Preview | Filename | Description |
|:-------:|----------|-------------|
`;

files.forEach(file => {
    // Create a readable description from the filename
    // e.g., "arrow-circle-down.svg" -> "Arrow Circle Down"
    const name = path.parse(file).name;
    const description = name
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // We can't easily embed the image itself in a markdown table cell without a proper URL or relative path that renders well in all viewers.
    // But for a local repo, a relative path image tag works.
    // Using HTML <img> tag to control width.
    md += `| <img src="./${file}" width="50" /> | \`${file}\` | ${description} |\n`;
});

fs.writeFileSync(outputFile, md);
console.log(`Generated README.md with ${files.length} assets.`);
