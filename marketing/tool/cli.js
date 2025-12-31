#!/usr/bin/env node

/**
 * Instagram Visual Generator - CLI Tool
 * 
 * Generates Instagram post images from JSON definitions via command line.
 * 
 * Usage:
 *   node cli.js --input <path-to-json> [--output <output-directory>]
 * 
 * Examples:
 *   node cli.js --input ../posts/example_post_1/post.json
 *   node cli.js --input ../posts/example_post_1/post.json --output ../posts/example_post_1/output/
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { program } = require('commander');

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
    defaultFont: 'Comfortaa',
    defaultFontWeight: 'bold',
    defaultTextDecoration: 'underline',
    defaultWidth: 1080,
    defaultHeight: 1080
};

// ============================================================================
// CLI Setup
// ============================================================================

program
    .name('visual-generator')
    .description('Generate Instagram post images from JSON definitions')
    .version('1.0.0')
    .requiredOption('-i, --input <path>', 'Path to the JSON definition file')
    .option('-o, --output <path>', 'Output directory for generated images')
    .option('-b, --base <path>', 'Base path for resolving relative assets')
    .option('-v, --verbose', 'Enable verbose output')
    .parse(process.argv);

const options = program.opts();

// ============================================================================
// Utility Functions
// ============================================================================

function log(message) {
    if (options.verbose) {
        console.log(`[INFO] ${message}`);
    }
}

function logError(message) {
    console.error(`[ERROR] ${message}`);
}

function resolvePath(basePath, relativePath) {
    if (path.isAbsolute(relativePath)) {
        return relativePath;
    }
    return path.resolve(basePath, relativePath);
}

// ============================================================================
// Asset Loading
// ============================================================================

async function loadImageAsset(imagePath) {
    try {
        return await loadImage(imagePath);
    } catch (e) {
        throw new Error(`Failed to load image: ${imagePath}`);
    }
}

async function loadSVGWithFill(svgPath, fillColor) {
    try {
        let svgContent = fs.readFileSync(svgPath, 'utf8');
        
        if (fillColor) {
            // Replace fill attributes
            svgContent = svgContent.replace(/fill="[^"]*"/g, `fill="${fillColor}"`);
            svgContent = svgContent.replace(/fill:[^;"]*/g, `fill:${fillColor}`);
            
            // Add fill to root if not present
            if (!svgContent.includes('fill=')) {
                svgContent = svgContent.replace('<svg', `<svg fill="${fillColor}"`);
            }
        }
        
        // Create buffer from modified SVG
        const buffer = Buffer.from(svgContent);
        return await loadImage(buffer);
    } catch (e) {
        throw new Error(`Failed to load SVG: ${svgPath} - ${e.message}`);
    }
}

// ============================================================================
// Rendering Functions
// ============================================================================

async function renderVisual(visual, basePath) {
    const width = visual.width || CONFIG.defaultWidth;
    const height = visual.height || CONFIG.defaultHeight;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = visual.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    
    // Sort elements by zIndex
    const sortedElements = [...(visual.elements || [])].sort((a, b) => {
        return (a.zIndex || 0) - (b.zIndex || 0);
    });
    
    const errors = [];
    
    // Render each element
    for (const element of sortedElements) {
        try {
            await renderElement(ctx, element, basePath);
        } catch (e) {
            errors.push(e.message);
            logError(e.message);
            // Draw error placeholder
            drawErrorPlaceholder(ctx, element);
        }
    }
    
    return { canvas, errors };
}

async function renderElement(ctx, element, basePath) {
    switch (element.type) {
        case 'image':
            await renderImage(ctx, element, basePath);
            break;
        case 'blob':
            await renderBlob(ctx, element, basePath);
            break;
        case 'text':
            renderText(ctx, element);
            break;
        default:
            throw new Error(`Unknown element type: ${element.type}`);
    }
}

async function renderImage(ctx, element, basePath) {
    const imagePath = resolvePath(basePath, element.path);
    log(`Loading image: ${imagePath}`);
    
    const img = await loadImageAsset(imagePath);
    const x = element.x || 0;
    const y = element.y || 0;
    const width = element.width || img.width;
    const height = element.height || img.height;
    const rotation = element.rotation || 0;
    const borderRadius = element.borderRadius || 0;
    
    ctx.save();
    
    // Handle rotation
    if (rotation !== 0) {
        const cx = x + width / 2;
        const cy = y + height / 2;
        ctx.translate(cx, cy);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-cx, -cy);
    }
    
    // Handle border radius
    if (borderRadius > 0) {
        roundRect(ctx, x, y, width, height, borderRadius);
        ctx.clip();
    }
    
    ctx.drawImage(img, x, y, width, height);
    
    ctx.restore();
}

async function renderBlob(ctx, element, basePath) {
    const svgPath = resolvePath(basePath, element.path);
    log(`Loading blob: ${svgPath} with fill: ${element.fill}`);
    
    const img = await loadSVGWithFill(svgPath, element.fill);
    const x = element.x || 0;
    const y = element.y || 0;
    const width = element.width || img.width;
    const height = element.height || img.height;
    const rotation = element.rotation || 0;
    
    ctx.save();
    
    // Handle rotation
    if (rotation !== 0) {
        const cx = x + width / 2;
        const cy = y + height / 2;
        ctx.translate(cx, cy);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-cx, -cy);
    }
    
    ctx.drawImage(img, x, y, width, height);
    
    ctx.restore();
}

function renderText(ctx, element) {
    const fontSize = element.fontSize || 32;
    const fontFamily = element.fontFamily || CONFIG.defaultFont;
    const fontWeight = element.fontWeight || CONFIG.defaultFontWeight;
    const textDecoration = element.textDecoration !== undefined 
        ? element.textDecoration 
        : CONFIG.defaultTextDecoration;
    const padding = element.padding || 0;
    const borderRadius = element.borderRadius || 0;
    const lineHeight = element.lineHeight || 1.3;
    
    // Set font
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
    ctx.textBaseline = 'top';
    
    // Handle multi-line text
    const lines = element.content.split('\n');
    const lineHeightPx = fontSize * lineHeight;
    
    // Measure text
    let maxWidth = 0;
    for (const line of lines) {
        const metrics = ctx.measureText(line);
        maxWidth = Math.max(maxWidth, metrics.width);
    }
    
    const textHeight = lines.length * lineHeightPx;
    const boxWidth = maxWidth + padding * 2;
    const boxHeight = textHeight + padding * 2;
    
    // Draw background if specified
    if (element.backgroundColor) {
        ctx.fillStyle = element.backgroundColor;
        
        if (borderRadius > 0) {
            roundRect(ctx, element.x, element.y, boxWidth, boxHeight, borderRadius);
            ctx.fill();
        } else {
            ctx.fillRect(element.x, element.y, boxWidth, boxHeight);
        }
    }
    
    // Draw text
    ctx.fillStyle = element.color || '#000000';
    
    let textY = element.y + padding;
    for (const line of lines) {
        const textX = element.x + padding;
        ctx.fillText(line, textX, textY);
        
        // Draw underline if specified
        if (textDecoration === 'underline') {
            const metrics = ctx.measureText(line);
            const underlineY = textY + fontSize * 0.9;
            const underlineThickness = Math.max(2, fontSize * 0.08);
            
            ctx.fillRect(textX, underlineY, metrics.width, underlineThickness);
        }
        
        textY += lineHeightPx;
    }
    
    log(`Rendered text: "${element.content.substring(0, 30)}..."`);
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function drawErrorPlaceholder(ctx, element) {
    const x = element.x || 0;
    const y = element.y || 0;
    const width = element.width || 100;
    const height = element.height || 100;
    
    // Draw red dashed rectangle
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);
    
    // Draw X
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y + height);
    ctx.moveTo(x + width, y);
    ctx.lineTo(x, y + height);
    ctx.stroke();
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
    const inputPath = path.resolve(process.cwd(), options.input);
    
    // Validate input file
    if (!fs.existsSync(inputPath)) {
        logError(`Input file not found: ${inputPath}`);
        process.exit(1);
    }
    
    console.log(`📸 Instagram Visual Generator`);
    console.log(`   Input: ${inputPath}`);
    
    // Parse JSON
    let data;
    try {
        const jsonContent = fs.readFileSync(inputPath, 'utf8');
        data = JSON.parse(jsonContent);
    } catch (e) {
        logError(`Failed to parse JSON: ${e.message}`);
        process.exit(1);
    }
    
    // Validate structure
    if (!data.visuals || !Array.isArray(data.visuals)) {
        logError('Invalid JSON structure: "visuals" array is required');
        process.exit(1);
    }
    
    // Determine output directory
    const basePath = options.base 
        ? path.resolve(process.cwd(), options.base)
        : path.dirname(inputPath);
        
    const outputDir = options.output 
        ? path.resolve(process.cwd(), options.output)
        : path.join(path.dirname(inputPath), 'output');
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`   Output: ${outputDir}`);
    console.log(`   Visuals: ${data.visuals.length}`);
    console.log('');
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each visual
    for (let i = 0; i < data.visuals.length; i++) {
        const visual = data.visuals[i];
        const visualId = visual.id || `visual_${i + 1}`;
        
        console.log(`   [${i + 1}/${data.visuals.length}] Rendering ${visualId}...`);
        
        try {
            const { canvas, errors } = await renderVisual(visual, basePath);
            
            // Save image
            const outputPath = path.join(outputDir, `${visualId}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(outputPath, buffer);
            
            if (errors.length > 0) {
                console.log(`       ⚠️  Rendered with ${errors.length} error(s)`);
                errorCount += errors.length;
            } else {
                console.log(`       ✅ Saved: ${outputPath}`);
            }
            
            successCount++;
        } catch (e) {
            logError(`Failed to render ${visualId}: ${e.message}`);
            errorCount++;
        }
    }
    
    console.log('');
    console.log(`✨ Complete! ${successCount} visuals generated.`);
    
    if (errorCount > 0) {
        console.log(`⚠️  ${errorCount} error(s) encountered.`);
        process.exit(1);
    }
}

main().catch(e => {
    logError(e.message);
    process.exit(1);
});
