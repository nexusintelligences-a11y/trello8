# Trello Clone Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing directly from Trello's established design patterns and visual identity, with inspiration from other productivity tools like Notion, Asana, and Linear for enhanced UX patterns.

**Key Design Principles:**
- Functional minimalism with clear visual hierarchy
- Drag-and-drop focused interface design
- Card-based information architecture
- Collaborative workspace aesthetics

## Core Design Elements

### A. Color Palette
**Primary Colors (Dark & Light Mode):**
- Brand Purple: `252 100% 67%` (Trello's signature purple)
- Secondary Purple: `252 25% 85%` (lighter purple for backgrounds)
- Success Green: `142 70% 50%` (for completed items)
- Warning Orange: `38 95% 62%` (for due dates)
- Danger Red: `350 85% 60%` (for overdue items)

**Neutral Colors:**
- Background: `220 13% 97%` (light) / `222 20% 11%` (dark)
- Card Background: `0 0% 100%` (light) / `222 15% 17%` (dark)
- Border: `220 13% 91%` (light) / `222 20% 20%` (dark)
- Text Primary: `222 20% 15%` (light) / `210 20% 90%` (dark)

### B. Typography
**Primary Font:** Inter or system fonts via Google Fonts CDN
- Headers: 600 weight, 1.25-1.75rem
- Body text: 400 weight, 0.875-1rem  
- Labels/Meta: 500 weight, 0.75rem

### C. Layout System
**Tailwind Spacing:** Primary units of 2, 4, 6, and 8
- Card padding: `p-4`
- List gaps: `gap-6` 
- Container margins: `m-8`
- Button spacing: `px-4 py-2`

### D. Component Library

**Core Components:**
- **Board Layout:** Horizontal scrolling container with vertical lists
- **List Containers:** Rounded corners, subtle shadows, min-height constraints
- **Card Elements:** Clean white/dark cards with hover states and drag handles
- **Modal Overlays:** Full-screen card detail modal with blur backdrop
- **Form Controls:** Rounded inputs matching Trello's style
- **Action Buttons:** Purple primary, ghost secondary, icon-only variants
- **Labels:** Pill-shaped colored tags with rounded corners
- **Avatars:** Circular user images with fallback initials

**Navigation:**
- Top navigation bar with board title and user menu
- Breadcrumb navigation for board hierarchy
- Sidebar for board switching (collapsed by default)

**Data Displays:**
- Kanban board grid layout
- Progress bars for checklists
- Due date badges with color coding
- Activity timeline in card details
- Member assignment chips

### E. Interactions
**Drag & Drop:** Smooth card movement between lists with visual feedback
**Animations:** Minimal - only for card hover states and modal transitions
**Loading States:** Skeleton screens for card loading

## Visual Treatment
**Card Shadows:** Subtle elevation with increased shadow on hover
**Border Radius:** Consistent 8px radius for cards and containers
**Spacing:** Generous whitespace between elements for clarity
**Focus States:** Clear purple outline for keyboard navigation

This design maintains Trello's familiar productivity-focused aesthetic while ensuring modern usability standards and accessibility compliance.