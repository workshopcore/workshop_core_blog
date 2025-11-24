# Agent Guidelines for TuTaller Blog Maintenance

This document contains essential guidelines and best practices for AI agents working on the TuTaller Hugo blog. Follow these standards to ensure consistency and quality.

## Screenshot Capture Guidelines

### Screen Dimensions
- **Desktop screenshots**: 1440x900 pixels
- **Mobile screenshots**: 375x667 pixels (iPhone SE) or 390x844 pixels (iPhone 12)
- Use consistent dimensions across all screenshots for visual consistency

### Avoiding Antigravity Blue Frame
When using browser automation to capture screenshots:
1. **Before screenshot**: Add CSS to the `<html>` element: `padding: 4em`
2. **Capture**: Take the screenshot
3. **After screenshot**: Crop the final image to remove the blue frame (top 64-80 pixels typically)

### Wait Times and Loading States
- **Minimum wait**: 15-20 seconds after page load (was 10, but loading icons need more time)
- **Purpose**: Ensures loading spinners, animations, and async content fully load
- **For dynamic content**: Wait up to 30 seconds if needed
- **Configuration pages**: Often need 20+ seconds due to form loading

**IMPORTANT - Avoid Loading Icons**:
- Always check that screenshots don't show loading spinners or icons
- If a loading icon is visible, wait longer or refresh the page
- Loading icons make screenshots look unprofessional and incomplete
- **Better to wait too long than capture with loading icons**

### Privacy Protection
**CRITICAL**: All email addresses in screenshots MUST be blurred or obscured:
- Use image editing tools to blur email fields
- Apply a gaussian blur or pixelation effect
- Covers entire email address, not just part
- Applies to: user lists, profile screens, notification recipients, login forms
- Exception: Generic example emails like "usuario@example.com" are acceptable if clearly fake

### Image Optimization
- **Format**: PNG for screenshots (lossless), WebP for web display
- **Max file size**: 200KB per image
- **Compression**: Use tools like `pngquant` or online compressors
- **Naming**: Descriptive, lowercase with underscores

## Sample Applications

### Available Environments
- **ZenFlow (Admin logged in)**: `http://zenflow.localhost:8080/app/`
  - Pre-authenticated as admin user
  - Full access to admin panel features
  - Use for validating admin-facing tutorials (Tutorials 1-9)

- **Gravity (Read/write sandbox)**:  `http://gravity.localhost:8080/app/`
  - Logged out by default
  - Use for login, registration, password reset flows
  - Use for student-facing feature validation (Tutorials 10-14)

### Feature Validation Checklist
Before writing or updating tutorials, verify the feature exists:
- [ ] Navigate to the feature in sample app
- [ ] Test the basic workflow
- [ ] Capture screenshots of key screens
- [ ] Note any differences from tutorial description
- [ ] Update tutorial if needed

### Validated Features (as of 2025-11-23)
**Admin Features** (ZenFlow):
- ✅ Dashboard / Panel de Administración
- ✅ Recurrentes (recurring classes)
- ✅ Eventos (non-recurring events) 
- ✅ Configuración (space configuration)
- ✅ Turnos reservados (calendar view)
- ✅ Usuarios y créditos (user management)
- ✅ Impersonar usuario (user impersonation)
- ✅ Enviar notificación (notifications)
- ✅ Métricas (analytics dashboard)

### Special Screenshot Requirements by Feature

**adminMetrics** (Tutorial 9):
- ⚠️ **Capture TWO screenshots**: top section AND bottom section
- Top section shows: summary cards and charts
- Bottom section shows: detailed data table
- Both sections are needed to understand the full feature

**adminNotifications** (Tutorial 8):
- ⚠️ **Known issue**: Quill text editor component has loading race condition
- **Solution**: If the text editor doesn't appear, refresh the page
- Wait for the rich text editor toolbar to fully load before screenshot
- The editor should show formatting buttons (bold, italic, lists, etc.)

**Student Features** (Gravity or via impersonation):
- ✅ Login/Registration screens
- ⚠️ Student dashboard (exists, needs further validation)
- ⚠️ Reservar (booking) - needs validation
- ⚠️ Mis Clases - needs validation
- ⚠️ Perfil - needs validation
- ⚠️ Suscripciones - needs validation
- ⚠️ Notificaciones (student view) - needs validation

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
3. **Blur all email addresses**
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
- Test locally before pushing changes

## Questions or Issues?

If you encounter:
- **Missing features**: Document in comments, discuss with user
- **Unclear workflows**: Test in sample app, capture recordings
- **Technical errors**: Check Hugo documentation or ask user  
- **Design questions**: Refer to previous articles for consistency

Remember: When in doubt, validate against the actual application!
