# Agent Guidelines for TuTaller Blog Maintenance

This document contains essential guidelines and best practices for AI agents working on the TuTaller Hugo blog. Follow these standards to ensure consistency and quality.

## Screenshot Capture Guidelines

### Request Screenshots from User

**CRITICAL**: AI agents should **NOT** take screenshots automatically. Instead, request screenshots from the user with clear context.

**When requesting screenshots**:
1. **Identify the need**: Determine which feature/screen needs documentation
2. **Provide context**: Explain what the screenshot should show
3. **Specify usage**: Indicate where it will be used (which article, which section)
4. **Include technical specs**: Mention desired dimensions and any special requirements

**Screenshot Request Template**:
```
I need a screenshot for [Article Name - Section]:

**Screen to capture**: [Feature/page name, e.g., "User Management Modal"]
**What to show**: [Specific details that should be visible]
**Navigation**: [How to get to this screen]
**Dimensions**: 1440x900 (desktop) or 375x667 (mobile)
**Filename**: [suggested_filename.png]
**Privacy**: Please manually blur all email addresses before sharing
**Quality**: Ensure no selection frames or blue borders are visible
**Usage**: Will be used in [Tutorial X] to illustrate [specific concept]
```

**Example Request**:
```
I need 4 screenshots for Tutorial 15 (User Management):

1. **Users List Screen**
   - Screen: Main user management page showing list of users
   - What to show: User table with action buttons visible
   - Navigation: Admin panel → "Usuarios y créditos"
   - Filename: tutorial_15_users_list.png
   - Usage: Featured image and opening section

2. **User Edit Modal**
   - Screen: User edit modal opened
   - What to show: All user management options (credits, role, payment buttons)
   - Navigation: Users list → Click edit button on any user
   - Filename: tutorial_15_user_modal.png
   - Usage: "Individual User Management" section

3. **Payment Buttons Close-up**
   - Screen: Same modal but focus on the payment month buttons
   - What to show: The three buttons: Previous Month, Current Month, Next Month
   - Filename: tutorial_15_mark_paid.png
   - Usage: "Mark Month as Paid" subsection

4. **Deactivated Users Tab**
   - Screen: Switch to "Usuarios desactivados" tab
   - What to show: List of deactivated users
   - Filename: tutorial_15_deactivated.png
   - Usage: "Deactivated Users" section
```

### Screen Dimensions
- **Desktop screenshots**: 1440x900 pixels
- **Mobile screenshots**: 375x667 pixels (iPhone SE) or 390x844 pixels (iPhone 12)
- **Mobile Display**: When embedding mobile screenshots in markdown, ALWAYS use HTML `<img>` tags with `width="300"` to prevent them from appearing too large.
  - Example: `<img src="/images/path.png" alt="Description" width="300"/>`
- Use consistent dimensions across all screenshots for visual consistency

### Privacy Protection

**CRITICAL**: All email addresses in screenshots MUST be blurred before publishing.

**Workflow**:
1. User provides screenshots (must be manually blurred by user)
2. Agent places images in the correct directory **without modification**
3. Agent verifies no sensitive data is visible (if found, asks user to retake)

**Important**: The agent should NOT attempt to blur images automatically. The user is responsible for the final visual quality and privacy.

**Why?**: Automated blurring can be unreliable or aggressive. Manual review ensures privacy without compromising image quality.

**Exception**: Generic example emails like "usuario@example.com" are acceptable if clearly fake.

### Image Optimization
- **Format**: PNG for screenshots (lossless), WebP for web display
- **Max file size**: 200KB per image
- **Compression**: Use tools like `pngquant` or online compressors if needed
- **Naming**: Descriptive, lowercase with underscores

## Content Standards

### Language and Tone
- **Primary language**: Spanish (Argentina)
- **Voice**: Use "vos" form (e.g., "podés" not "puedes")
- **Tone**: Friendly, professional, conversational
- **Technical terms**: 
  - Use Spanish when clear: "usuario", "créditos", "reserva"
  - Keep English when commonly used: "dashboard", "admin", "app"

### Article Types and Structure

#### Tutorials
- **Purpose**: Step-by-step actionable guides
- **Format**: Numbered steps with screenshots
- **Tone**: Instructional, "cómo hacerlo"
- **Length**: 800-1500 words
- **Screenshots**: At least 2-3 per tutorial
- **Structure**:
  1. Introduction (what you'll learn)
  2. Prerequisites (if any)
  3. Step-by-step instructions
  4. Next steps/related tutorials

#### Blog Posts
- **Purpose**: General information, problem/solution format
- **Format**: Sections with headers
- **Tone**: Informative, persuasive
- **Length**: 1000-2000 words
- **Structure**:
  1. Hook/problem statement
  2. Context/background
  3. Solution/explanation
  4. Call to action

#### Insights Articles
- **Purpose**: Data-driven, analytical, strategic thinking
- **Format**: Analysis with data points, trends
- **Tone**: Professional, analytical
- **Length**: 1200-1800 words
- **Structure**:
  1. Key insight/finding
  2. Data/evidence
  3. Analysis
  4. Implications
  5. Actionable takeaways

#### Tips Articles
- **Purpose**: Quick, actionable advice
- **Format**: Numbered or bulleted lists
- **Tone**: Direct, practical
- **Length**: 600-1000 words
- **Structure**:
  1. Introduction (why these tips matter)
  2. Tips (5-10 items)
  3. Each tip: title + 1-2 paragraph explanation
  4. Conclusion

## Image Management

### Directory Structure
```
/static/images/
├── tutoriales/          # Tutorial screenshots
├── blog/                # Blog post images
├── insights/            # Insights article images  
├── tips/                # Tips article images
└── logo_square.svg      # Site logo
```

### Naming Convention
Pattern: `{type}_{number}_{description}.png`

Examples:
- `tutorial_01_dashboard.png`
- `tutorial_03_recurrentes_form.png`
- `blog_01_hero_image.png`
- `insights_01_attendance_chart.png`
- `tips_03_pricing_example.png`

### Updating Images
When updating tutorial screenshots:
1. Capture new screenshot following guidelines above
2. Optimize image size
3. **Blur all email addresses manually** (User responsibility)
4. Save with same filename (or update markdown if renaming)
5. Verify image displays correctly in local Hugo build
6. Commit changed image file

## SEO Optimization Standards

### Title Tags
- **Length**: 50-60 characters
- **Format**: `{Primary Keyword} - {Brand}` or `{Descriptive Title} | TuTaller`
- **Include**: Primary keyword near the beginning
- **Example**: `Gestionar Turnos Online - TuTaller Blog`

### Meta Descriptions
- **Length**: 150-160 characters
- **Format**: Compelling summary with call-to-action
- **Include**: Primary keyword, value proposition
- **Example**: `Aprendé a gestionar turnos y reservas online de forma eficiente. Sistema automatizado para talleres argentinos. Lee más →`

### Article Frontmatter
All articles must include:
```yaml
---
title: "SEO-optimized title (50-60 chars)"
date: 2024-XX-XXTXX:XX:XX-03:00
draft: false
description: "Meta description (150-160 chars)"
tags: ["tag1", "tag2", "tag3"]  # 3-6 tags
categories: ["Category"]         # Usually 1, max 2
series: ["Series Name"]          # If part of series
featured_image: "/images/path/to/image.png"
---
```

### Tag Strategy
- **Quantity**: 3-6 tags per article
- **Mix**: 
  - 1-2 specific tags ("recurrentes", "impersonar")
  - 1-2 general tags ("tutorial", "administración")
  - 1-2 feature tags ("calendario", "notificaciones")
- **Consistency**: Use same tag names across articles (check existing tags first)

### Header Hierarchy
- **H1**: Article title (one per page, defined in frontmatter)
- **H2**: Main sections
- **H3**: Subsections
- **H4+**: Rarely needed, use for deep nesting only
- **Rule**: Never skip levels (H2 → H4 is wrong)

### Internal Linking
- **Minimum**: 2-3 internal links per article
- **Method**: Use Hugo's `ref` shortcode: `{{< ref "filename.md" >}}`
- **Anchor text**: Descriptive, natural (not "click here")
- **Context**: Link to related tutorials, previous/next in series

## Hugo Build and Deployment

### Local Testing
```bash
# Start development server
cd /home/triton/go/src/github.com/workshopcore/workshop_core_blog
hugo server -D

# accessible at http://localhost:1313/
```

### Validation Commands
```bash
# Build without drafts (production preview)
hugo --gc --minify

# Check for broken links (if installed)
hugo --gc --minify && htmlproofer ./public
```

### Common Issues
1. **Template errors**: Check Hugo template syntax in layouts
2. **Missing images**: Verify paths are relative to `/static/`
3. **Broken links**: Use `ref` shortcode, not hardcoded URLs
4. **baseURL**: All links respect `baseURL` from `hugo.toml`

## Workflow for New Articles

1. **Research**: Validate feature exists in sample apps
2. **Capture**: Take screenshots (with email blurring, proper dimensions)
3. **Write**: Create markdown file in `/content/blog/posts/`
4. **Optimize**: Add proper frontmatter with SEO metadata
5. **Link**: Add internal links to related content
6. **Preview**: Test locally with `hugo server -D`
7. **Verify**: Check all images load, links work, no broken layouts
8. **Commit**: Push changes to repository

## Workflow for Updating Articles

1. **Validate**: Test current state in sample app
2. **Document**: Note what changed vs. current article
3. **Update text**: Revise descriptions to match reality
4. **Retake screenshots**: If UI changed significantly
5. **Blur emails**: Apply to any new screenshots
6. **Update frontmatter**: Adjust date, description if substantially changed
7. **Preview & verify**: Test locally before committing

## Common Pitfalls to Avoid

❌ **Don't**:
- Describe features that don't exist
- Use outdated screenshots with old UI
- Leave emails visible in screenshots
- **Capture screenshots with loading icons visible**
- Skip image optimization (large file sizes)
- Hardcode URLs instead of using `ref`
- Mix up "tú" and "vos" forms
- Forget to blur emails in user lists
- Use incorrect screen dimensions
- **Embed mobile screenshots without resizing (use width=300)**
- **Capture screenshots with selection frames or blue borders visible**
- **Forget to capture both top AND bottom of adminMetrics**
- **Skip refreshing adminNotifications if Quill editor doesn't load**

✅ **Do**:
- Validate every feature before documenting
- Capture fresh screenshots for each update
- **Wait for all loading to complete before screenshot**
- **Check that no loading icons are visible**
- Blur all email addresses in screenshots
- **Capture adminMetrics in two parts (top + bottom)**
- **Refresh adminNotifications page if Quill editor doesn't appear**
- Optimize images before committing
- Use Hugo's `ref` shortcode for internal links
- Maintain consistent "vos" voice
- Follow naming conventions strictly
- **Use HTML `<img>` tags with width="300" for mobile screenshots**
- Test locally before pushing changes

## Questions or Issues?

If you encounter:
- **Missing features**: Document in comments, discuss with user
- **Unclear workflows**: Test in sample app, capture recordings
- **Technical errors**: Check Hugo documentation or ask user  
- **Design questions**: Refer to previous articles for consistency

Remember: When in doubt, validate against the actual application!
