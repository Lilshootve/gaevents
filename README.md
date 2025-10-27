# GAEVENTS PRODUCTION LLC - Website

Professional static website for GAEVENTS PRODUCTION LLC, a full-service corporate event production company based in Dawsonville, Georgia.

## Overview

This is a static, multi-page website built with:
- **HTML5** for structure
- **Tailwind CSS** (via CDN) for styling
- **PHP** for contact form handling
- **AOS (Animate On Scroll)** for subtle animations
- **Vanilla JavaScript** for interactions

## Features

### Accessibility (WCAG 2.2 AA)
- Skip link for keyboard navigation
- ARIA labels and landmarks (header, nav, main, footer)
- Focus states on all interactive elements
- Screen reader friendly markup
- Semantic HTML structure

### SEO
- Meta tags (description, keywords, author)
- Open Graph and Twitter Card metadata
- Canonical URLs
- JSON-LD structured data (Organization, BreadcrumbList)
- Sitemap.xml and robots.txt

### Security
- Hardened contact.php with:
  - Input sanitization
  - Honeypot anti-spam field
  - Header injection prevention
  - CSRF-like validation
  - Security headers

### Performance
- Font preconnect and font-display: swap
- Lazy loading support
- Minimal external dependencies
- Optimized for Lighthouse scores (90+)

### Design
- Brand colors: Carbon black, Blue steel, Golden accent
- Typography: Orbitron (headings) + Sora (body)
- Responsive design (mobile-first)
- Sticky navigation
- Subtle animations (respects prefers-reduced-motion)

## File Structure

```
gaevents/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services catalog
├── gallery.html            # Image gallery
├── clients.html            # Client testimonials
├── contact.html            # Contact form
├── contact.php             # Form handler (hardened)
├── terms.html              # Terms & Conditions
├── privacy.html            # Privacy Policy
├── refund.html             # Refund Policy
├── thank-you.html          # Thank you page
├── 404.html                # 404 error page
├── robots.txt              # Search engine directives
├── sitemap.xml             # Site map for search engines
├── css/
│   └── main.css           # Main stylesheet (accessibility & utilities)
├── components/
│   ├── header.html         # Header component
│   ├── footer.html         # Footer component
│   └── init.js             # JavaScript initialization
└── images/                 # Image assets
    ├── logo.png
    ├── hero.jpg
    ├── gallery1.jpg
    ├── gallery2.jpg
    └── gallery3.jpg
```

## Deployment to Hostinger

### Option 1: Git Pull Method
If you have SSH access:

```bash
# SSH into your Hostinger server
ssh your_username@your_server_ip

# Navigate to public_html
cd public_html

# Clone or pull the repository
git pull origin main

# Or if first time
git clone https://github.com/Lilshootve/gaevents.git .
```

### Option 2: Direct Upload
1. Compress all files (excluding .git/)
2. Upload via Hostinger File Manager
3. Extract in public_html directory
4. Ensure file permissions are correct:
   ```bash
   chmod 644 *.html
   chmod 755 images/ css/ components/
   chmod 600 contact.php
   ```

### Option 3: GitHub Actions (Automated)
Set up automatic deployment via SFTP/SSH:
1. Add GitHub Actions workflow file (`.github/workflows/deploy.yml`)
2. Configure SFTP credentials as secrets
3. Push to main branch triggers deployment

## Configuration

### Contact Form
Edit `contact.php` to update:
- **TO_EMAIL**: Destination email address
- **COMPANY**: Company name constant

### Domain
Update canonical URLs in all HTML files:
- Replace `https://gaeventsprod.com` with your actual domain

### Sitemap
Update `sitemap.xml` with:
- Your actual domain
- Last modified dates
- Change frequencies (if different)

## Required PHP Settings
Ensure PHP is configured on Hostinger with:
- `mail()` function enabled
- Appropriate `max_execution_time` and `memory_limit`
- Security settings for form handling

## Testing

### Lighthouse Audit
Run Lighthouse (Chrome DevTools):
```bash
# Install globally
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=https://gaeventsprod.com
```

### Accessibility Testing
Use WAVE (https://wave.webaim.org/) or AXE DevTools

### Manual Checks
- [ ] Form submission works
- [ ] All links navigate correctly
- [ ] Images load properly
- [ ] Navigation active states work
- [ ] Footer copyright year auto-updates
- [ ] Skip link visible on keyboard focus
- [ ] All pages pass Lighthouse 90+ scores

## Performance Goals

Target scores:
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 95
- **SEO**: ≥ 95

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 GAEVENTS PRODUCTION LLC. All rights reserved.

## Contact

**GAEVENTS PRODUCTION LLC**  
190 FOUNDERS DR  
DAWSONVILLE, GA 30534, USA  
Email: info@gaeventsprod.com

---

**Last Updated**: January 21, 2025

