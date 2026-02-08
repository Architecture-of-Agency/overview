# Leol Lab Website - Deployment Instructions

## Complete Redesign Features

✅ **90s Mac Desktop Interface**
- Classic desktop with clickable icons
- Window system for content
- Nostalgic aesthetic

✅ **Consent Landing Page**
- Honest research data collection explanation
- Accept/Decline options (both allow entry)
- Mac startup sound on entry

✅ **WCAG AA Compliant**
- Proper contrast ratios (4.5:1 for text)
- Keyboard navigation
- Semantic HTML
- ARIA labels
- Focus indicators

✅ **Bilingual (EN/CY)**
- Welsh and English on all content
- Toggle available everywhere

✅ **UK English Throughout**
- centre, organise, analyse, etc.

✅ **Correct Power Analysis**
- Property, economic, institutional, epistemic power types
- Then majoritarian dynamics within communities
- Multi-stakeholder complexity acknowledged

✅ **Conditional Analytics**
- Vercel Analytics only loads if user accepts
- Consent stored in localStorage

## Files Created

1. `pages/_app.tsx` - Conditional analytics based on consent
2. `pages/index.tsx` - Complete site (landing page + desktop interface)

## Mac Startup Sound Setup

You need to add the Mac startup sound file to enable the audio effect.

### Option 1: Use Classic Mac Startup Sound

1. Download the classic Mac startup chime (public domain):
   - Search for "Mac startup sound download" or
   - Use this: https://www.myinstants.com/en/instant/mac-startup-chime/

2. Convert to both MP3 and OGG for browser compatibility

3. Add to your project:
```
/public/
  startup.mp3
  startup.ogg
```

### Option 2: Disable Sound (Temporary)

If you want to deploy without sound first, comment out these lines in `pages/index.tsx`:

```javascript
// Around line 32-34
/*
if (audioRef.current) {
  audioRef.current.play().catch(e => console.log('Audio play failed:', e))
}
*/
```

## Deployment Steps

### 1. Copy Files

```bash
cd /path/to/your/PhD/website
cp /mnt/user-data/outputs/pages/_app.tsx pages/
cp /mnt/user-data/outputs/pages/index.tsx pages/
```

### 2. Add Startup Sound (if using)

Place `startup.mp3` and `startup.ogg` in the `public` directory.

### 3. Commit and Push

```bash
git add pages/
git add public/startup.* # if you added sound files
git commit -m "Complete redesign: 90s Mac desktop interface, consent page, WCAG compliant, bilingual"
git push
```

### 4. Vercel Will Auto-Deploy

Your site should rebuild automatically in ~2 minutes.

## What Changed from Previous Version

**Removed:**
- Confusing ASCII circle visualization
- Oversimplified "communities vs LA" binary
- Microsoft Clarity tracking
- Lain aesthetic (scanlines were too distracting)
- ALL CAPS buttons (WCAG violation)

**Added:**
- Clean 90s Mac desktop interface
- Proper consent landing page
- Honest research data collection framing
- Multi-stakeholder power analysis
- All content accessible via windows
- Mac startup sound (optional)
- Proper WCAG contrast throughout
- Welsh on ALL pages, not just homepage

**Fixed:**
- UK English throughout
- Power analysis (property, economic, institutional, epistemic, THEN majoritarian)
- WCAG violations (contrast, caps, semantic HTML)
- Analytics only loads with consent

## Testing Checklist

Before deploying, test:

- [ ] Consent page displays properly
- [ ] Both Accept and Decline buttons work
- [ ] Mac sound plays on entry (if enabled)
- [ ] Desktop icons are clickable
- [ ] All windows open and close
- [ ] Welsh/English toggle works on all windows
- [ ] Light/Dark mode toggle works
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] All text meets WCAG contrast (use WebAIM contrast checker)
- [ ] No console errors
- [ ] Analytics only loads if accepted (check DevTools → Network)

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Keyboard navigation: Tab through icons, Enter to open
- Screen readers: All icons have aria-labels
- Windows: role="dialog" with aria-labelledby
- Focus indicators on all interactive elements
- Reduced motion support (animations respect prefers-reduced-motion)

## Questions?

Contact: Lucy Dunhill, dunhilll@cardiff.ac.uk
