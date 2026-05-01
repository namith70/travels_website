# ✈️ Travel Horizon – Tour & Travel Agency Website

A complete, production-ready travel agency website inspired by Travel Comfort Tours and Travels.

---

## 📁 Project Structure

```
travel-agency/
│
├── index.html          → Homepage (Hero, Destinations, Packages, Testimonials)
├── tours.html          → Tour Packages with Filters & Sorting
├── contact.html        → Contact Form, Visa Services, FAQ
│
├── css/
│   └── style.css       → Full stylesheet (variables, components, responsive)
│
├── js/
│   └── main.js         → Navbar scroll, animations, tabs, form handling
│
└── README.md           → This file
```

---

## 🚀 How to Open

**No build tools required!**

1. Extract the ZIP file
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. Navigate using the links in the navbar

---

## 🎨 Features

### Homepage (index.html)
- Fixed navbar with dropdown menus and mobile hamburger
- Full-screen hero with animated counter stats
- Destination search bar
- Popular destinations grid
- Tour packages with category tabs (filter by All / International / Domestic / Group / Weekend)
- Browse by travel style (categories)
- Why Choose Us section with feature highlights
- Customer testimonials grid
- Newsletter signup

### Tours Page (tours.html)
- Sidebar filter (tour type, duration, region, budget slider, travel style)
- Package grid with badge labels (Recommended / Group Tour / Sale)
- Sort dropdown
- Load more button

### Contact Page (contact.html)
- Contact info card with address, phone, email, hours
- Full enquiry form (name, email, phone, destination, dates, travellers, message)
- Visa services grid (12+ countries with processing times)
- Map placeholder
- FAQ accordion

---

## 🔧 Customization Guide

### Change Brand Name
- Search and replace `Travel Horizon` with your agency name in all HTML files.

### Change Colors
Edit CSS variables at the top of `css/style.css`:
```css
:root {
  --primary: #1a3a4f;      /* Dark navy – main brand color */
  --accent:  #e8a045;      /* Gold – call-to-action color  */
}
```

### Change Phone / Email
- Replace `+91 98765 43210` with your number
- Replace `hello@travelhorizon.in` with your email

### Add Real Images
Replace the gradient placeholder divs with `<img>` tags:
```html
<!-- Replace this: -->
<div class="pkg-placeholder pp-1" style="height:100%;...">🌆</div>

<!-- With this: -->
<img src="images/your-tour.jpg" alt="Tour Name" class="pkg-img" />
```

### Connect Contact Form
The form in `contact.html` currently shows a success message on submit.
To send real emails, use a service like **Formspree**:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

---

## 🌐 Deploying Online

### Option 1 – Netlify (Free, easiest)
1. Go to netlify.com → "Add new site" → "Deploy manually"
2. Drag and drop the `travel-agency` folder
3. Your site goes live instantly!

### Option 2 – GitHub Pages
1. Upload files to a GitHub repository
2. Go to Settings → Pages → select `main` branch
3. Your site will be at `https://yourusername.github.io/travel-agency/`

---

## 📱 Responsive Breakpoints
- Desktop: 1240px max-width container
- Tablet: ≤1024px — stacked layouts
- Mobile: ≤768px — hamburger nav, single column
- Small: ≤480px — fully stacked

---

## 🔤 Fonts Used
- **Playfair Display** – Headings (elegant, serif)
- **Lora** – Body text (readable, editorial)
- **DM Sans** – UI labels, buttons, meta (clean, modern)

All loaded from Google Fonts (requires internet connection).

---

Built with ❤️ using HTML, CSS & Vanilla JavaScript.
