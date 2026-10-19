# NEEV REALTY GROUP

**Tagline**: *Find Your Space. Build Your Future.*

NEEV REALTY GROUP is a modern, responsive residential real estate discovery platform for Surat, Gujarat, India. It enables users to browse, search, and filter residential properties across prime neighborhoods including Vesu, Adajan, Pal, Piplod, Althan, City Light, and Dumas Road.

## Key Features

1. **Brand Identity & Color Palette**:
   - Navy Blue: `#102A43`
   - White: `#FFFFFF`
   - Light Sky Blue: `#DFF1FF`
   - Primary Blue: `#2698E8`
   - Light Grey: `#F3F6F9`
   - Main Text: `#243B53`
   - Secondary Text: `#627D98`

2. **Residential Categories**:
   - Flats & Apartments
   - Independent Houses
   - Villas
   - Residential Plots
   - New Projects
   - Ready-to-Move Homes

3. **Advanced Search & Filtering**:
   - Keyword search across titles, locations, and descriptions.
   - Filtering by Locality, Category, BHK setup, Purpose (Sale / Rent), Furnishing, Availability status, and Price budget.
   - Dynamic sorting (Recommended, Price Low to High, Price High to Low, Newest Listings, Largest Area).
   - Real-time results counter and instant filter reset.

4. **Property Details Page**:
   - Dynamic routing (`/property/:id`) displaying listing-specific details.
   - Interactive high-resolution photo gallery with thumbnail selection and full-screen lightbox modal.
   - Icon-supported highlights grid (BHK, Area, Floor, Parking, Possession, Furnishing).
   - Transparent price breakdown in Indian Rupees (Lakhs & Crores) and rate per sq ft.
   - Prefilled enquiry form with validation (10-digit Indian mobile) and demo reference numbers.
   - Related property suggestions based on category, BHK, and locality match.

5. **Site Visit Booking**:
   - Dedicated scheduling flow (`/site-visit`) prefilled with selected property details.
   - Date picker with past-date prevention.
   - Time slot selection and demo pass generation.

6. **Privacy & Tracking Exclusions**:
   - Zero Google Tag Manager (GTM), GA4, ad pixels, or marketing tracking scripts.
   - Clear demo disclaimers for all sample data.

## Project Structure

```
├── index.html
├── metadata.json
├── package.json
├── README.md
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── context/
│   │   └── RouterContext.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── CategorySection.tsx
│   │   ├── PropertyFilters.tsx
│   │   ├── PropertySearch.tsx
│   │   ├── PropertyGallery.tsx
│   │   ├── PropertyHighlights.tsx
│   │   ├── AmenitiesList.tsx
│   │   ├── EnquiryForm.tsx
│   │   ├── SiteVisitForm.tsx
│   │   ├── RelatedProperties.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── EmptyState.tsx
│   │   └── ResilientImage.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Properties.tsx
│   │   ├── PropertyDetails.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── SiteVisit.tsx
│   │   └── NotFound.tsx
│   ├── data/
│   │   ├── properties.ts
│   │   └── categories.ts
│   └── utils/
│       ├── propertyFilters.ts
│       └── formValidation.ts
```

## Running the Application Locally

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Run TypeScript check / linter
npm run lint

# Build for production
npm run build
```
