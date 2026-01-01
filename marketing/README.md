# Instagram Visual Generator Tool

A tool for generating Instagram post images from JSON definitions, featuring a browser-based live editor and CLI batch processing.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Directory Structure](#directory-structure)
- [Design System](#design-system)
- [LLM Agent Workflow](#llm-agent-workflow)
- [JSON Schema Reference](#json-schema-reference)
- [Troubleshooting](#troubleshooting)

---

## Quick Start
1. **Explore**:
    ```bash
    cd marketing && make serve
    # Open http://localhost:8080/tool/
    ```
2. **Generate**:
    ```bash
    cd marketing && make cli INPUT=posts/example_post_1/post.json
    ```

---

## Directory Structure
```
marketing/
├── README.md               # This documentation
├── common_assets/          # Shared reusable assets
│   ├── blobs/              # SVG blob shapes (index available)
│   └── doodles/            # SVG/PNG doodles (index available)
├── posts/                  # Post definitions
│   └── post_name/          # Individual post directory
│       ├── README.md       # Description, Copy, Hashtags, Asset Guide
│       ├── post.json       # Visual definition
│       ├── assets/         # Post-specific images
│       └── output/         # Generated PNGs
└── tool/                   # Rendering engine code
```

---

## Design System

To ensure consistency and quality, all posts must adhere to these strict rules.

### 1. Typography & Colors
*   **Font**: Comfortaa (Bold).
*   **Text Containers**: Dark Slate (`#1E293B`) with White (`#FFFFFF`) text. Rounded corners (`borderRadius: 30`).
*   **Blobs**: Use only standard palette: `#1ECBE1` (Cyan), `#1E6AE1` (Blue), `#FF6B6B` (Coral), `#1E293B` (Dark Slate), `#F4F6F8` (Light Gray).

### 2. Layout & Spacing
*   **Framed Images**: **NEVER** use full-screen background images. Images must be "framed" by whitespace and blobs, looking like cards on the canvas.
*   **Canvas**: 1080x1350 (Portrait).
*   **Safe Bounds**: Text containers must **NOT** touch the borders of images or the canvas. Leave a **Safety Gap > 50px** from all edges.
*   **Separation**: Avoid "kissing edges" (elements just touching). Either overlap significantly (>50px) or have clear separation (>50px).
*   **Centering**: For easy centering, use a fixed `width` (e.g., `800`) and `textAlign: "center"`. This is more reliable than manually adjusting the `x` coordinate.

### 3. Styling Rules
*   **No Underlines**: Do not use text underlines. The tool default is `none`.
*   **Border Radius**: Always use `48` for images/screenshots and `30` for text containers.
*   **Doodles**: Always use **Black** fill (`#000000`). Rotate slightly for dynamism (-15° to 15°).

---

## LLM Agent Workflow

Follow this process exactly for every new post request.

### Step 1: Research & Plan
1.  **Understand**: Analyze the user's goal, copy, and required visuals.
2.  **Verify**: Check existing blog posts/app features to ensure what you are visualizing actually exists.
3.  **Propose**: Create an implementation plan proposing specific visuals. **Get User Approval** before implementing.

### Step 2: Implementation (Scaffolding)
1.  **Create Directory**: `marketing/posts/post_name/`.
2.  **ReadMe**: Create `post_[name]/README.md` with:
    *   Description & Copy.
    *   **Images to Replace**: A table listing every placeholder asset created, its path, and a detailed description of the real screenshot/photo required.
3.  **Post JSON**: Create `post.json` adhering to the [Design System](#design-system).
    *   Use **Placeholders** (solid colors or AI generated) for missing assets.
    *   Ensure **Safety Gaps** are calculated correctly in `x/y` coordinates.

### Step 3: Visual Verification
1.  **Generate**: Run `make cli INPUT=posts/post_name/post.json`.
2.  **Expert Evaluation**: Act as a UX Expert/Content Manager and review the images:
    *   [ ] **Safe Bounds**: Is there >50px gap between text/images/edges?
    *   [ ] **No Overflows**: Is all text visible?
    *   [ ] **Style**: Are doodles black? Are images framed? No underlines?
    *   [ ] **Spelling**: Is the copy correct?
3.  **Refine**: If any check fails, adjust the JSON coordinates/sizes and regenerate. **Do not ask the user** to fix your layout mistakes.

### Step 4: Handover
1.  Present the **Walkthrough** with the generated images.
2.  Instruct the user to replace the assets listed in the **Images to Replace** table.

### Step 5: Adaptation
Once the user has replaced the placeholder images:
1.  **Analyze**: Check the dimensions (width/height) of the user's new images.
2.  **Adapt**: Update `post.json` to fit the new aspect ratios.
    *   Maintain "Framed" style (white space around).
    *   Ensure **Safety Gaps** > 50px are preserved.
    *   Adjust text/doodle positions if the image size changes significantly.

### Step 6: Final Generation & Expert Evaluation
1.  **Generate**: Run `make cli INPUT=posts/post_name/post.json`.
2.  **Roleplay**: Act as an Expert Content Manager / UX Designer.
3.  **Review**: rigorousl check all generated images for:
    *   [ ] **Safe Bounds**: Is there >50px gap between text/images/edges?
    *   [ ] **No Overflows**: Is all text visible?
    *   [ ] **No Cut-offs**: Are all elements fully visible (not unintentionally cropped by edges)?
    *   [ ] **Content Visibility**: Are critical parts of the image (text, buttons) **NOT** obscured by doodles?
    *   [ ] **Style**: Are doodles black? Are images framed? No underlines?
    *   [ ] **Aesthetics**: Does the composition look balanced? Is it too crowded or **too empty**?
    *   [ ] **Spelling**: Is the copy correct?
4.  **Refine**: If any check fails, adjust the JSON coordinates/sizes and regenerate.
5.  **Finish**: Mark the task as done only when 100% compliant.

---

## JSON Schema Reference

### Root
```json
{
  "post": { "name": "...", "description": "..." },
  "visuals": [ { ... } ]
}
```

### Element Types

#### Image (`type: "image"`)
*   `path`: Relative path (e.g., `posts/p1/assets/img.png`).
*   `borderRadius`: Always `48`.
*   `width`/`height`: Required.

#### Text (`type: "text"`)
*   `content`: Text string (`\n` for newlines).
*   `fontSize`, `backgroundColor` (`#1E293B`), `color` (`#FFFFFF`), `padding`, `borderRadius` (`30`).
*   `width`: (Optional) Fixed width of the text box. If omitted, fits content.
*   `height`: (Optional) Fixed height of the text box. If omitted, fits content.
*   `textAlign`: Horizontal alignment: `"left"`, `"center"`, `"right"`. Default: `"left"`.
*   `verticalAlign`: Vertical alignment: `"top"`, `"middle"`, `"bottom"`. Default: `"top"`.
*   **Note**: `textDecoration` defaults to `"none"`.

#### Blob (`type: "blob"`)
*   `path`: `common_assets/blobs/Vector-N.svg`.
*   `fill`: Hex color from palette.
*   `zIndex`: `0` (Background).

---

## Troubleshooting
*   **Images not loading**: Check relative paths. Use `../../` for common assets if needed (though CLI handles `--base`).
*   **Text Overflow**: The tool does not auto-size. Open `post.json` and adjust `fontSize` or container `height`/`y`.
*   **Canvas Error**: Ensure prerequisites are installed (`npm install`, system libs for node-canvas).
