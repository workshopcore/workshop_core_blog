/**
 * Instagram Visual Generator - Browser App
 * 
 * This application provides a live editor for creating Instagram post visuals
 * from JSON definitions. It renders images, blobs (SVGs with fill colors), and
 * styled text elements onto a canvas.
 */

// ============================================================================
// Configuration & State
// ============================================================================

const CONFIG = {
    debounceDelay: 500,
    maxCanvasDisplaySize: 600,
    defaultFont: 'Comfortaa',
    defaultFontWeight: 'bold',
    defaultTextDecoration: 'underline',
    // Default base path for resolving relative asset paths
    // When serving from tool/, assets are at ../
    defaultBasePath: '../'
};

const state = {
    visuals: [],
    currentVisualIndex: 0,
    errors: [],
    imageCache: new Map(),
    isRendering: false,
    // Base path for resolving relative paths in JSON (set when loading a file)
    basePath: CONFIG.defaultBasePath
};

// ============================================================================
// DOM Elements
// ============================================================================

const elements = {
    jsonEditor: document.getElementById('jsonEditor'),
    lineNumbers: document.getElementById('lineNumbers'),
    errorPanel: document.getElementById('errorPanel'),
    errorContent: document.getElementById('errorContent'),
    closeErrorBtn: document.getElementById('closeErrorBtn'),
    previewCanvas: document.getElementById('previewCanvas'),
    canvasWrapper: document.getElementById('canvasWrapper'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadFileBtn: document.getElementById('loadFileBtn'),
    fileInput: document.getElementById('fileInput'),
    formatBtn: document.getElementById('formatBtn'),
    validateBtn: document.getElementById('validateBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    downloadAllBtn: document.getElementById('downloadAllBtn'),
    prevVisualBtn: document.getElementById('prevVisualBtn'),
    nextVisualBtn: document.getElementById('nextVisualBtn'),
    visualIndicator: document.getElementById('visualIndicator'),
    statusText: document.getElementById('statusText'),
    dimensionsText: document.getElementById('dimensionsText')
};

// ============================================================================
// Utility Functions
// ============================================================================

function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

function setStatus(text, isError = false) {
    elements.statusText.textContent = text;
    elements.statusText.style.color = isError ? 'var(--error-text)' : 'var(--text-muted)';
}

function showLoading(show) {
    elements.loadingOverlay.classList.toggle('hidden', !show);
}

function showErrors(errors) {
    if (errors.length === 0) {
        elements.errorPanel.classList.add('hidden');
        return;
    }
    elements.errorContent.textContent = errors.join('\n');
    elements.errorPanel.classList.remove('hidden');
}

function updateLineNumbers() {
    const lines = elements.jsonEditor.value.split('\n').length;
    const numbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    elements.lineNumbers.textContent = numbers;
}

function updateVisualNavigation() {
    const total = state.visuals.length;
    const current = state.currentVisualIndex + 1;
    
    elements.visualIndicator.textContent = total > 0 
        ? `Visual ${current} of ${total}` 
        : 'No visuals';
    
    elements.prevVisualBtn.disabled = state.currentVisualIndex <= 0;
    elements.nextVisualBtn.disabled = state.currentVisualIndex >= total - 1;
}

// ============================================================================
// JSON Parsing & Validation
// ============================================================================

function parseJSON(jsonString) {
    const errors = [];
    let data = null;
    
    try {
        data = JSON.parse(jsonString);
    } catch (e) {
        errors.push(`JSON Parse Error: ${e.message}`);
        return { data: null, errors };
    }
    
    // Validate structure
    if (!data.visuals || !Array.isArray(data.visuals)) {
        errors.push('Invalid structure: "visuals" array is required');
        return { data: null, errors };
    }
    
    // Validate each visual
    data.visuals.forEach((visual, i) => {
        if (!visual.width || !visual.height) {
            errors.push(`Visual ${i + 1}: width and height are required`);
        }
        if (!visual.elements || !Array.isArray(visual.elements)) {
            errors.push(`Visual ${i + 1}: "elements" array is required`);
        }
    });
    
    return { data, errors };
}

function formatJSON() {
    try {
        const data = JSON.parse(elements.jsonEditor.value);
        elements.jsonEditor.value = JSON.stringify(data, null, 2);
        updateLineNumbers();
        setStatus('JSON formatted');
    } catch (e) {
        setStatus('Cannot format: Invalid JSON', true);
    }
}

// ============================================================================
// Asset Loading
// ============================================================================

/**
 * Resolves a relative path using the current basePath.
 * Properly handles ./ and ../ path segments.
 * Absolute paths (starting with / or http) are returned as-is.
 */
function resolvePath(path) {
    // Absolute URLs - return as-is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
        return path;
    }
    
    // Combine basePath with the relative path
    let combined = state.basePath + path;
    
    // Normalize the path
    return normalizePath(combined);
}

/**
 * Normalizes a path by resolving . and .. segments.
 * Preserves leading ../ segments for relative navigation.
 */
function normalizePath(path) {
    const parts = path.split('/');
    const result = [];
    
    for (const part of parts) {
        if (part === '..') {
            // Only pop if we have a non-.. segment to pop
            // This preserves leading ../ segments
            if (result.length > 0 && result[result.length - 1] !== '..') {
                result.pop();
            } else {
                result.push('..');
            }
        } else if (part !== '.' && part !== '') {
            result.push(part);
        }
    }
    
    return result.join('/');
}

async function loadImage(path) {
    const resolvedPath = resolvePath(path);
    
    // Check cache
    if (state.imageCache.has(resolvedPath)) {
        return state.imageCache.get(resolvedPath);
    }
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            state.imageCache.set(resolvedPath, img);
            resolve(img);
        };
        
        img.onerror = () => {
            const fullUrl = new URL(resolvedPath, window.location.href).href;
            reject(new Error(`Failed to load image: ${path}\nResolved: ${resolvedPath}\nFull URL: ${fullUrl}`));
        };
        
        img.src = resolvedPath;
    });
}

async function loadSVGWithFill(path, fillColor) {
    const resolvedPath = resolvePath(path);
    
    return new Promise(async (resolve, reject) => {
        try {
            const fullUrl = new URL(resolvedPath, window.location.href).href;
            const response = await fetch(resolvedPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch SVG: ${path}\nResolved: ${resolvedPath}\nFull URL: ${fullUrl}`);
            }
            
            let svgText = await response.text();
            
            // Replace fill color in SVG
            if (fillColor) {
                // Replace fill attributes and style fills
                svgText = svgText.replace(/fill="[^"]*"/g, `fill="${fillColor}"`);
                svgText = svgText.replace(/fill:[^;"]*/g, `fill:${fillColor}`);
                
                // If no fill found, add to root svg element
                if (!svgText.includes('fill=')) {
                    svgText = svgText.replace('<svg', `<svg fill="${fillColor}"`);
                }
            }
            
            // Convert to data URL
            const blob = new Blob([svgText], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error(`Failed to render SVG: ${path}`));
            };
            img.src = url;
        } catch (e) {
            reject(e);
        }
    });
}

// ============================================================================
// Canvas Rendering
// ============================================================================

async function renderVisual(visual) {
    const canvas = elements.previewCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = visual.width || 1080;
    canvas.height = visual.height || 1080;
    
    // Clear and fill background
    ctx.fillStyle = visual.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Sort elements by zIndex
    const sortedElements = [...(visual.elements || [])].sort((a, b) => {
        return (a.zIndex || 0) - (b.zIndex || 0);
    });
    
    const errors = [];
    
    // Render each element
    for (const element of sortedElements) {
        try {
            await renderElement(ctx, element);
        } catch (e) {
            errors.push(e.message);
            // Draw error placeholder
            drawErrorPlaceholder(ctx, element, e.message);
        }
    }
    
    // Update dimensions display
    elements.dimensionsText.textContent = `${canvas.width} × ${canvas.height}px`;
    
    // Scale canvas display size
    const scale = Math.min(
        CONFIG.maxCanvasDisplaySize / canvas.width,
        CONFIG.maxCanvasDisplaySize / canvas.height,
        1
    );
    canvas.style.width = `${canvas.width * scale}px`;
    canvas.style.height = `${canvas.height * scale}px`;
    
    return errors;
}

async function renderElement(ctx, element) {
    switch (element.type) {
        case 'image':
            await renderImage(ctx, element);
            break;
        case 'blob':
            await renderBlob(ctx, element);
            break;
        case 'text':
            renderText(ctx, element);
            break;
        default:
            throw new Error(`Unknown element type: ${element.type}`);
    }
}

async function renderImage(ctx, element) {
    const img = await loadImage(element.path);
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

async function renderBlob(ctx, element) {
    const img = await loadSVGWithFill(element.path, element.fill);
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

function drawErrorPlaceholder(ctx, element, message) {
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
    
    // Draw error text
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText('Error', x + 5, y + 15);
}

// ============================================================================
// Main Render Loop
// ============================================================================

const debouncedRender = debounce(async () => {
    await render();
}, CONFIG.debounceDelay);

async function render() {
    if (state.isRendering) return;
    state.isRendering = true;
    
    showLoading(true);
    setStatus('Rendering...');
    
    const jsonString = elements.jsonEditor.value.trim();
    
    if (!jsonString) {
        showLoading(false);
        setStatus('Enter JSON to preview');
        state.isRendering = false;
        return;
    }
    
    const { data, errors: parseErrors } = parseJSON(jsonString);
    
    if (parseErrors.length > 0) {
        showErrors(parseErrors);
        showLoading(false);
        setStatus('JSON validation failed', true);
        state.isRendering = false;
        return;
    }
    
    state.visuals = data.visuals || [];
    
    // Clamp current index
    if (state.currentVisualIndex >= state.visuals.length) {
        state.currentVisualIndex = Math.max(0, state.visuals.length - 1);
    }
    
    updateVisualNavigation();
    
    if (state.visuals.length === 0) {
        showLoading(false);
        setStatus('No visuals defined');
        state.isRendering = false;
        return;
    }
    
    const currentVisual = state.visuals[state.currentVisualIndex];
    const renderErrors = await renderVisual(currentVisual);
    
    showErrors(renderErrors);
    showLoading(false);
    
    if (renderErrors.length > 0) {
        setStatus(`Rendered with ${renderErrors.length} error(s)`, true);
    } else {
        setStatus('Ready');
    }
    
    state.isRendering = false;
}

// ============================================================================
// File Operations
// ============================================================================

function loadFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.jsonEditor.value = e.target.result;
        updateLineNumbers();
        
        // Always use '../' as base path since we are serving from 'marketing/' 
        // and the tool is in 'marketing/tool/'
        state.basePath = '../';
        
        // Clear image cache when loading new file
        state.imageCache.clear();
        
        render();
        setStatus(`Loaded: ${file.name}`);
    };
    reader.onerror = () => {
        setStatus('Failed to read file', true);
    };
    reader.readAsText(file);
}

function downloadImage(visualIndex = state.currentVisualIndex) {
    const visual = state.visuals[visualIndex];
    if (!visual) return;
    
    const link = document.createElement('a');
    link.download = `visual_${visualIndex + 1}.png`;
    link.href = elements.previewCanvas.toDataURL('image/png');
    link.click();
}

async function downloadAllImages() {
    if (state.visuals.length === 0) return;
    
    setStatus('Generating images...');
    
    // Create a temporary canvas for rendering
    const tempCanvas = document.createElement('canvas');
    const links = [];
    
    for (let i = 0; i < state.visuals.length; i++) {
        const visual = state.visuals[i];
        tempCanvas.width = visual.width || 1080;
        tempCanvas.height = visual.height || 1080;
        
        const ctx = tempCanvas.getContext('2d');
        ctx.fillStyle = visual.backgroundColor || '#FFFFFF';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        const sortedElements = [...(visual.elements || [])].sort((a, b) => {
            return (a.zIndex || 0) - (b.zIndex || 0);
        });
        
        for (const element of sortedElements) {
            try {
                await renderElementToCanvas(ctx, element);
            } catch (e) {
                console.error(e);
            }
        }
        
        // Create download
        const link = document.createElement('a');
        link.download = visual.id ? `${visual.id}.png` : `visual_${i + 1}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        links.push(link);
    }
    
    // Download all with delay
    for (const link of links) {
        link.click();
        await new Promise(r => setTimeout(r, 300));
    }
    
    setStatus(`Downloaded ${links.length} images`);
}

async function renderElementToCanvas(ctx, element) {
    switch (element.type) {
        case 'image':
            await renderImage(ctx, element);
            break;
        case 'blob':
            await renderBlob(ctx, element);
            break;
        case 'text':
            renderText(ctx, element);
            break;
    }
}

// ============================================================================
// Event Handlers
// ============================================================================

function setupEventListeners() {
    // Editor changes
    elements.jsonEditor.addEventListener('input', () => {
        updateLineNumbers();
        debouncedRender();
    });
    
    elements.jsonEditor.addEventListener('scroll', () => {
        elements.lineNumbers.scrollTop = elements.jsonEditor.scrollTop;
    });
    
    // Buttons
    elements.loadFileBtn.addEventListener('click', () => {
        elements.fileInput.click();
    });
    
    elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            loadFile(e.target.files[0]);
        }
    });
    
    elements.formatBtn.addEventListener('click', formatJSON);
    
    elements.validateBtn.addEventListener('click', () => {
        const { errors } = parseJSON(elements.jsonEditor.value);
        showErrors(errors);
        if (errors.length === 0) {
            setStatus('JSON is valid ✓');
        } else {
            setStatus(`${errors.length} validation error(s)`, true);
        }
    });
    
    elements.closeErrorBtn.addEventListener('click', () => {
        elements.errorPanel.classList.add('hidden');
    });
    
    elements.downloadBtn.addEventListener('click', () => downloadImage());
    elements.downloadAllBtn.addEventListener('click', downloadAllImages);
    
    // Navigation
    elements.prevVisualBtn.addEventListener('click', () => {
        if (state.currentVisualIndex > 0) {
            state.currentVisualIndex--;
            updateVisualNavigation();
            render();
        }
    });
    
    elements.nextVisualBtn.addEventListener('click', () => {
        if (state.currentVisualIndex < state.visuals.length - 1) {
            state.currentVisualIndex++;
            updateVisualNavigation();
            render();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 's') {
                e.preventDefault();
                downloadImage();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                render();
            }
        }
        
        // Arrow keys for navigation when not in editor
        if (document.activeElement !== elements.jsonEditor) {
            if (e.key === 'ArrowLeft') {
                elements.prevVisualBtn.click();
            } else if (e.key === 'ArrowRight') {
                elements.nextVisualBtn.click();
            }
        }
    });
}

// ============================================================================
// Initialization
// ============================================================================

function init() {
    setupEventListeners();
    updateLineNumbers();
    
    // Load example JSON
    const exampleJSON = {
        "post": {
            "name": "example",
            "description": "Example post"
        },
        "visuals": [
            {
                "id": "visual_1",
                "width": 1080,
                "height": 1080,
                "backgroundColor": "#f0f4f8",
                "elements": [
                    {
                        "type": "text",
                        "content": "Hello, Instagram!",
                        "x": 100,
                        "y": 450,
                        "fontSize": 64,
                        "fontFamily": "Comfortaa",
                        "fontWeight": "bold",
                        "textDecoration": "underline",
                        "color": "#FFFFFF",
                        "backgroundColor": "#1E3A5F",
                        "padding": 30,
                        "borderRadius": 20,
                        "zIndex": 1
                    }
                ]
            }
        ]
    };
    
    elements.jsonEditor.value = JSON.stringify(exampleJSON, null, 2);
    updateLineNumbers();
    render();
}

// Start the app
init();
