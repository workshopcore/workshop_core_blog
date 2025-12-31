# Instagram Visual Generator Tool

A tool for generating Instagram post images from JSON definitions, featuring a browser-based live editor and CLI batch processing.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Directory Structure](#directory-structure)
- [JSON Schema Reference](#json-schema-reference)
- [Browser Editor](#browser-editor)
- [CLI Usage](#cli-usage)
- [Extending the Tool](#extending-the-tool)
- [LLM Agent Instructions](#llm-agent-instructions)

---

## Quick Start

### Browser Editor
```bash
cd marketing
make serve
3. Open your browser to **http://localhost:8080/tool/**
```

### CLI Generation
```bash
cd marketing
make install          # First time only
make cli INPUT=posts/example_post_1/post.json
```

---

## Directory Structure

```
marketing/
├── README.md              # This documentation
├── Makefile               # Build commands
├── common_assets/         # Shared reusable assets
│   ├── blobs/             # SVG blob shapes
│   └── doodles/           # SVG/PNG doodles & icons
├── tool/                  # Tool source code
│   ├── index.html         # Browser editor
│   ├── styles.css         # Editor styling
│   ├── app.js             # Browser rendering logic
│   ├── cli.js             # Node.js CLI tool
│   └── package.json       # CLI dependencies
└── posts/                 # Post definitions
    └── example_post_1/    # Example post
        ├── README.md      # Post description/copy
        ├── post.json      # Visual definitions
        ├── assets/        # Post-specific assets
        └── output/        # Generated images
```

---

## JSON Schema Reference

### Root Structure

```json
{
  "post": {
    "name": "post_name",
    "description": "Description of the post content"
  },
  "visuals": [
    { /* Visual 1 */ },
    { /* Visual 2 */ }
  ]
}
```

### Visual Object

| Property          | Type     | Required | Default   | Description                        |
|-------------------|----------|----------|-----------|------------------------------------|
| `id`              | string   | No       | visual_N  | Identifier for output filename     |
| `width`           | number   | Yes      | -         | Canvas width in pixels             |
| `height`          | number   | Yes      | -         | Canvas height in pixels            |
| `backgroundColor` | string   | No       | #FFFFFF   | Background color (hex)             |
| `elements`        | array    | Yes      | -         | Array of element objects           |

### Element Types

### Image Element

```json
{
  "type": "image",
  "path": "./assets/screenshot.png",
  "x": 100,
  "y": 50,
  "width": 400,
  "height": 600,
  "rotation": 15,
  "borderRadius": 32,
  "zIndex": 1
}
```

| Property      | Type   | Required | Description                              |
|---------------|--------|----------|------------------------------------------|
| `type`        | string | Yes      | Must be `"image"`                        |
| `path`        | string | Yes      | Relative path to image file (PNG/JPG)    |
| `x`           | number | No       | X position (default: 0)                  |
| `y`           | number | No       | Y position (default: 0)                  |
| `width`       | number | No       | Display width (default: natural width)   |
| `height`      | number | No       | Display height (default: natural height) |
| `rotation`    | number | No       | Rotation in degrees (default: 0)         |
| `borderRadius`| number | No       | Border radius in pixels (default: 0)     |
| `zIndex`      | number | No       | Layer order, higher = on top (default: 0)|

#### Blob Element

SVG files with dynamic fill color replacement.

```json
{
  "type": "blob",
  "path": "common_assets/blobs/Vector.svg",
  "x": 600,
  "y": 50,
  "width": 300,
  "height": 300,
  "rotation": -10,
  "fill": "#FF6B6B",
  "zIndex": 0
}
```

| Property  | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| `type`    | string | Yes      | Must be `"blob"`                         |
| `path`    | string | Yes      | Relative path to SVG file                |
| `fill`    | string | No       | Fill color to apply (hex)                |
| `x`       | number | No       | X position (default: 0)                  |
| `y`       | number | No       | Y position (default: 0)                  |
| `width`   | number | No       | Display width                            |
| `height`  | number | No       | Display height                           |
| `rotation`| number | No       | Rotation in degrees (default: 0)         |
| `zIndex`  | number | No       | Layer order (default: 0)                 |

#### Text Element

```json
{
  "type": "text",
  "content": "¿Tu celular explota\nun domingo a la noche?",
  "x": 100,
  "y": 850,
  "fontSize": 48,
  "fontFamily": "Comfortaa",
  "fontWeight": "bold",
  "textDecoration": "underline",
  "color": "#FFFFFF",
  "backgroundColor": "#1E3A5F",
  "padding": 25,
  "borderRadius": 15,
  "lineHeight": 1.3,
  "zIndex": 10
}
```

| Property         | Type   | Required | Default    | Description                          |
|------------------|--------|----------|------------|--------------------------------------|
| `type`           | string | Yes      | -          | Must be `"text"`                     |
| `content`        | string | Yes      | -          | Text content (use `\n` for newlines) |
| `x`              | number | No       | 0          | X position                           |
| `y`              | number | No       | 0          | Y position                           |
| `fontSize`       | number | No       | 32         | Font size in pixels                  |
| `fontFamily`     | string | No       | Comfortaa  | Font family                          |
| `fontWeight`     | string | No       | bold       | Font weight (normal, bold)           |
| `textDecoration` | string | No       | underline  | Text decoration (none, underline)    |
| `color`          | string | No       | #000000    | Text color (hex)                     |
| `backgroundColor`| string | No       | -          | Background box color (hex)           |
| `padding`        | number | No       | 0          | Padding around text                  |
| `borderRadius`   | number | No       | 0          | Border radius for background         |
| `lineHeight`     | number | No       | 1.3        | Line height multiplier               |
| `zIndex`         | number | No       | 0          | Layer order                          |

---

## Browser Editor

### Features

- **Live Preview**: JSON changes update the preview in real-time
- **Multi-Visual Navigation**: Use Prev/Next buttons to navigate between visuals
- **Error Display**: Missing files and invalid JSON show as errors
- **Download**: Export individual or all visuals as PNG

### Keyboard Shortcuts

| Shortcut      | Action                    |
|---------------|---------------------------|
| `Ctrl+S`      | Download current visual   |
| `Ctrl+Enter`  | Force re-render           |
| `←` / `→`     | Navigate visuals          |

### Loading Files

1. Click **📁 Load JSON** button
2. Select a `post.json` file
3. The editor loads the JSON and renders the first visual

---

## CLI Usage

### Installation

```bash
cd marketing
make install
```

### Basic Usage

```bash
# Generate images (output to ./output/ by default)
make cli INPUT=posts/example_post_1/post.json

# Specify custom output directory
make cli INPUT=posts/example_post_1/post.json OUTPUT=posts/example_post_1/output/
```

### Direct Node.js Usage

```bash
cd marketing/tool
node cli.js --input ../posts/example_post_1/post.json --output ../posts/example_post_1/output/ --base .. --verbose
```

### CLI Options

| Option                | Description                          |
|-----------------------|--------------------------------------|
| `-i, --input <path>`  | Path to JSON definition (required)   |
| `-o, --output <path>` | Output directory (optional)          |
| `-b, --base <path>`   | Base path for assets (optional)      |
| `-v, --verbose`       | Enable verbose logging               |

---

## Extending the Tool

### Adding New Element Types

To add a new element type (e.g., `rectangle`, `circle`):

1. **Browser (`app.js`)**: Add a new case in `renderElement()`:
   ```javascript
   case 'rectangle':
       renderRectangle(ctx, element);
       break;
   ```

2. **CLI (`cli.js`)**: Add the same case in `renderElement()`:
   ```javascript
   case 'rectangle':
       renderRectangle(ctx, element);
       break;
   ```

3. **Implement the render function** in both files:
   ```javascript
   function renderRectangle(ctx, element) {
       ctx.fillStyle = element.fill || '#000000';
       ctx.fillRect(element.x, element.y, element.width, element.height);
   }
   ```

4. **Update this documentation** with the new element schema.

### Adding New Fonts

For the browser editor, fonts are loaded via Google Fonts in `index.html`.

For the CLI, you may need to register fonts using `registerFont()` from node-canvas:
```javascript
const { registerFont } = require('canvas');
registerFont('path/to/font.ttf', { family: 'FontName' });
```

---

## LLM Agent Workflow

When a user requests a new Instagram post, follow this precise workflow:

### Step 1: Gather Input
The user will provide:
- Description of the post and its objective.
- Visual descriptions (one or more images).
- Exact copy (text) for the post.

### Step 2: Improve & Verify
1. **Research**: Read relevant blog posts in `content/blog/` and existing marketing posts in `marketing/posts/`.
2. **Suggest Improvements**: Propose changes to the goal, visuals, or copy to make the post more impactful and accurate to the real functionalities of the TuTaller app.
3. **Cohesion Check**: Ensure proposed visuals are cohesive with the brand identity but not overly repetitive (introduce new elements where appropriate).
4. **Functionality Check**: **CRITICAL**: Explicitly verify that any functionality described in the visuals or copy actually exists in the app (refer to blog posts for confirmation).
5. **Confirmation**: Present the improved plan to the user and ask for confirmation.

### Step 3: Implementation & Placeholders
Once the plan is agreed upon:

1. **Create Directory**: Create `marketing/posts/post_[number]/` with the following structure:
   ```
   marketing/posts/post_[name_or_number]/
   ├── README.md      # Post description, copy, hashtags
   ├── post.json      # Visual definitions
   ├── assets/        # Post-specific images (screenshots, photos)
   └── output/        # Generated images (created by tool)
   ```

2. **Create README.md**: Document the post concept using this template:
   ```markdown
   # Post: [Title]

   ## Description
   [What this post is about]

   ## Copy
   [The Instagram caption text]

   ## Hashtags
   #hashtag1 #hashtag2 #hashtag3

   ## Target Audience
   [Who this post is for]
   ```

3. **Generate post.json**: Define all visuals following the [JSON Schema Reference](#json-schema-reference). Consider:
   - **Standard Instagram dimensions**: 1080x1080 (square), 1080x1350 (portrait), 1080x608 (landscape)
   - **Use `zIndex`** to layer elements correctly (blobs in back, images in middle, text on top)
   - **Reference common assets** with paths like `common_assets/blobs/Vector.svg`
   - **Reference post-specific assets** with paths like `posts/post_name/assets/screenshot.png`
   - **Use `borderRadius`** (e.g., 32 or 48) for screenshots to match the style.
   - **Use `rotation`** to add dynamism to doodles and blobs.
   - **Preserve Aspect Ratio**: Ensure `width` and `height` match the natural aspect ratio of the SVG to avoid distortion. Check the SVG file dimensions if unsure.

4. **Asset Guidelines**:
   - **Screenshots**: Save as PNG in `assets/` folder with descriptive names.
   - **Blobs**: Use SVGs from `common_assets/blobs/` with custom `fill` colors. Check `common_assets/blobs/README.md` for the index.
   - **Doodles**: Use SVGs from `common_assets/doodles/`. Check `common_assets/doodles/README.md` for the index.
   - **Placeholders**: For missing images, screenshots, or custom doodles, create a placeholder file (e.g., a small plain color PNG) with a relevant name in the `assets/` directory.

5. **User Action**: Ask the user to replace these placeholders with the real images, providing precise descriptions of what each screenshot or photo should contain.

### Step 4: Final Generation
After the user confirms the assets have been updated:
1. **Run CLI**: Execute the generation command:
   ```bash
   make cli INPUT=posts/post_[name]/post.json
   ```
2. **Verify**: Check the generated PNGs in the `output/` directory.

---

## Design Guidelines

To ensure consistency with the brand identity, follow these rules:

### Color Palette

| Color          | Hex       | Usage                   |
|----------------|-----------|-------------------------|
| Cyan           | #1ECBE1   | Accent blob             |
| Blue           | #1E6AE1   | Accent blob             |
| Coral          | #FF6B6B   | Accent blob             |
| Dark Slate     | #1E293B   | Accent blob / Text bg   |
| Light Gray     | #F4F6F8   | Background / Accent blob|
| Navy Blue (Old)| #1E3A5F   | Legacy Text background  |
| White          | #FFFFFF   | Text color              |

> [!IMPORTANT]
> **Allowed Blob Colors**: Only use `#1ECBE1`, `#1E6AE1`, `#FF6B6B`, `#1E293B`, and `#F4F6F8` for blobs.

### Typography
- **Font**: Comfortaa (Bold).
- **Text Containers**: Text should almost always be inside a Dark Blue/Slate container with rounded corners (`borderRadius: 30`) and White (`#FFFFFF`) text.
- **Alignment**: Center or Left aligned depending on the layout balance.

### Images (Screenshots/UI)
- **Border Radius**: ALWAYS use `borderRadius: 48` for screenshots and UI elements to match the rounded aesthetic.
- **Shadows**: (Optional) Can add depth, but flat with rounded corners is the baseline.

### Elements (Blobs & Doodles)
- **Blobs**: Large but supportive. They should not overwhelm the content. Scale them down slightly if they compete with the main subject.
- **Doodles**: Prominent accents. Make them large enough to be clearly visible and add character.
  - **Rotation**: Rotate doodles slightly (-15 to 15 degrees) to add dynamism.
  - **Aspect Ratio**: ALWAYS preserve the natural aspect ratio of the SVG.

### Layout & Spacing
- **Overlap vs. Separation**: Avoid "kissing" edges (elements just touching). Elements should either:
  - **Overlap significantly** (e.g., >50px) to show connection/depth.
  - **Have clear separation** to show distinctness.

---

## Available Common Assets

Please refer to the index files in each directory for a list of available assets and their descriptions:

- **Blobs**: [`common_assets/blobs/README.md`](common_assets/blobs/README.md)
- **Doodles**: [`common_assets/doodles/README.md`](common_assets/doodles/README.md)

---

## Troubleshooting

### Browser: Images not loading
- Ensure paths are relative to the JSON file location
- Check browser console for CORS errors
- Use `../../common_assets/` for common assets

### CLI: Canvas installation fails
- On Ubuntu/Debian: `sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev librsvg2-dev`
- On macOS: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`

### Fonts not rendering correctly
- Browser: Ensure Google Fonts are loaded in `index.html`
- CLI: Register fonts using `registerFont()` before rendering
