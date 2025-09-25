# Trip2Trip - Luxury Villas & Resorts

A premium vacation rental platform showcasing luxury villas and resorts across Mumbai, Maharashtra. Trip2Trip by Exlusive Escapades offers curated, high-end accommodations with personalized concierge services.

## 🌟 Overview

Trip2Trip is a modern, responsive web application that connects travelers with exclusive luxury properties. The platform features handpicked villas and resorts with amenities like private pools, sea views, and premium services across Mumbai's most prestigious locations.

## ✨ Features

### 🏠 Property Showcase
- **6 Premium Properties** including:
  - Mountain Majestic Villa (Mahabaleshwar)
  - Valley View Room Pachgani Resort (Satara)
  - De Leisure Staycation (Boisar)
  - Conrad Marine Bay (Bandra, Mumbai)
  - Sea Cliff Mansion (Malabar Hill, Mumbai)
  - Lotus Cove Retreat (Versova, Mumbai)

### 🔍 Advanced Search & Filtering
- Location-based search (Alibaug, Juhu, Bandra, etc.)
- Property type filters (Villas, Resorts, Sea View, Private Pool)
- Guest capacity selection
- Check-in/Check-out date selection
- Theme-based browsing (Sea View, Private Pool, Family Friendly, Ultra Luxury)

### 📱 User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme Toggle** - User preference theme switching
- **Smooth Animations** - Page transitions with walking person animation
- **Interactive Property Gallery** - Image galleries with multiple views
- **Real-time Search** - Dynamic property filtering and suggestions

### 🛎️ Booking System
- **Integrated Booking Dialog** - Streamlined reservation process
- **Property Details Pages** - Comprehensive information for each listing
- **Contact Forms** - Multiple ways to get in touch with property owners
- **User Authentication** - Login and signup functionality

### 🎨 Design Features
- **Modern UI/UX** - Clean, professional design with luxury aesthetics
- **Google Fonts Integration** - Poppins and Playfair Display typography
- **Custom CSS Animations** - Smooth transitions and hover effects
- **Social Media Integration** - Links to Instagram, Twitter, Facebook
- **Professional Branding** - T2T logo and consistent brand identity

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **React Integration**: React 17 for component-based architecture
- **Styling**: Custom CSS with responsive design principles
- **Fonts**: Google Fonts (Poppins, Playfair Display)
- **Icons**: Custom SVG icons and graphics
- **Media**: Video backgrounds and high-quality property images

## 📁 Project Structure

```
Trip2Trip/
├── Project/
│   ├── index.html                    # Homepage
│   ├── villa.html                    # Villa category page
│   ├── details.html                  # Property details template
│   ├── login.html                    # User login page
│   ├── signup.html                   # User registration page
│   ├── auth.js                       # Authentication logic
│   ├── script.js                     # Main application logic
│   ├── villa.js                      # Villa-specific functionality
│   ├── data.js                       # Property data and configurations
│   ├── react-app.js                  # React component integration
│   ├── styles.css                    # Main stylesheet
│   ├── styles-footer-bottom.css      # Footer styling
│   ├── Images/                       # Property photos and assets
│   │   ├── villaA.jpg - villaD.jpg
│   │   ├── bayA.jpg - bayC.jpg
│   │   ├── marina1.jpg - marina3.jpg
│   │   ├── Palm1.jpg - Palm4.jpg
│   │   ├── sea1.jpg - sea3.jpg
│   │   ├── cove1.jpg - cove2.jpg
│   │   └── [Other assets]
│   ├── arabian-vista-villa.html      # Individual property page
│   ├── bayfront-royale-resort.html   # Individual property page
│   ├── conrad-marine-bay.html        # Individual property page
│   ├── lotus-cove-retreat.html       # Individual property page
│   ├── palm-grove-estate.html        # Individual property page
│   ├── sea-cliff-mansion.html        # Individual property page
│   └── TODO.md                       # Development tasks
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation
1. Clone or download the project files
2. Navigate to the `Trip2Trip/Project/` directory
3. Open `index.html` in a web browser, or
4. Serve the files using a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

5. Open `http://localhost:8000` in your browser

## 📊 Property Data

The application includes detailed property information stored in `data.js`:

- **Property Types**: Villas and Resorts
- **Locations**: Mahabaleshwar, Satara, Boisar, Mumbai (Bandra, Malabar Hill, Versova)
- **Price Range**: ₹2,700 - ₹40,000 per night
- **Capacity**: 2-70+ guests
- **Amenities**: Private pools, sea views, Wi-Fi, air conditioning, chef services, etc.
- **Owner Information**: Contact details for each property

## 🎯 Key Features Implemented

### ✅ Completed Features
- [x] Responsive homepage with hero section
- [x] Property search and filtering system
- [x] Individual property detail pages
- [x] User authentication pages (login/signup)
- [x] Contact forms and booking system
- [x] Theme toggle functionality
- [x] Social media integration
- [x] Footer implementation on main pages

### 🔄 In Progress
- [ ] Footer-bottom-bar implementation on remaining property pages
  - [ ] arabian-vista-villa.html
  - [ ] bayfront-royale-resort.html
  - [ ] conrad-marine-bay.html
  - [ ] lotus-cove-retreat.html
  - [ ] palm-grove-estate.html
  - [ ] sea-cliff-mansion.html

## 🎨 Design System

### Colors
- **Primary**: Saffron/Orange theme for luxury feel
- **Typography**: Poppins (body), Playfair Display (headings)
- **Interactive Elements**: Blue accent colors for buttons and links

### Components
- Navigation header with brand identity
- Hero section with search functionality
- Property grid with filtering
- Collection/category browsing
- Footer with contact information
- Booking dialog modal

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized images and media
- Cross-browser compatibility

## 🔧 Development Notes

### Current Status
The project is in active development with most core features implemented. The main remaining task is adding the footer-bottom-bar to individual property pages.

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Optimizations
- Optimized images and media files
- Efficient CSS and JavaScript loading
- Google Fonts preconnection for faster loading
- Minimal external dependencies

## 📞 Contact Information

**Trip2Trip by Exlusive Escapades**
- Email: owner@trip2trip.example
- Phone: +91 9372560325
- Location: Mumbai, Maharashtra

## 👥 Development Team

Made with ❤️ by [TwinCode Studio](https://share.google/KQhHQpwJLBSnccTtf)

## 📄 License

© 2025 Trip2Trip. All Rights Reserved.

---

*This README provides an overview of the Trip2Trip luxury villa and resort booking platform. For technical details or support, please contact the development team.*
