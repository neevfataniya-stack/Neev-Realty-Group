import { Property } from '../data/properties';

export interface FilterCriteria {
  keyword: string;
  category: string;
  locality: string;
  bhk: string;
  purpose: string;
  furnishing: string;
  availability: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'area-desc';
}

export const DEFAULT_FILTERS: FilterCriteria = {
  keyword: '',
  category: 'All',
  locality: 'All Localities',
  bhk: 'All',
  purpose: 'All',
  furnishing: 'All',
  availability: 'All',
  minPrice: 0,
  maxPrice: 50000000, // 5 Cr default cap
  minArea: 0,
  maxArea: 10000,
  sortBy: 'recommended',
};

export function filterAndSortProperties(
  properties: Property[],
  criteria: FilterCriteria
): Property[] {
  let filtered = properties.filter((prop) => {
    // Keyword search
    if (criteria.keyword.trim()) {
      const q = criteria.keyword.toLowerCase().trim();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchLocality = prop.locality.toLowerCase().includes(q);
      const matchCategory = prop.category.toLowerCase().includes(q);
      const matchDesc = prop.description.toLowerCase().includes(q);
      if (!matchTitle && !matchLocality && !matchCategory && !matchDesc) {
        return false;
      }
    }

    // Category filter
    if (criteria.category && criteria.category !== 'All' && criteria.category !== 'All Properties') {
      if (criteria.category === 'Ready-to-Move Homes') {
        if (prop.availability !== 'Ready to Move') return false;
      } else if (criteria.category === 'New Projects') {
        if (!prop.isNewLaunch && prop.category !== 'New Projects' && prop.availability !== 'Under Construction') {
          return false;
        }
      } else if (prop.category !== criteria.category) {
        return false;
      }
    }

    // Locality filter
    if (criteria.locality && criteria.locality !== 'All Localities' && criteria.locality !== 'All') {
      if (prop.locality.toLowerCase() !== criteria.locality.toLowerCase()) {
        return false;
      }
    }

    // Purpose filter (For Sale / For Rent)
    if (criteria.purpose && criteria.purpose !== 'All') {
      if (prop.purpose !== criteria.purpose) return false;
    }

    // BHK filter
    if (criteria.bhk && criteria.bhk !== 'All') {
      if (prop.bhk !== criteria.bhk) return false;
    }

    // Furnishing filter
    if (criteria.furnishing && criteria.furnishing !== 'All') {
      if (prop.furnishing !== criteria.furnishing) return false;
    }

    // Availability filter
    if (criteria.availability && criteria.availability !== 'All') {
      if (prop.availability !== criteria.availability) return false;
    }

    // Price range
    const effectivePrice = prop.purpose === 'For Rent' ? (prop.monthlyRent || prop.price) : prop.price;
    if (criteria.minPrice > 0 && effectivePrice < criteria.minPrice) {
      return false;
    }
    if (criteria.maxPrice > 0 && effectivePrice > criteria.maxPrice) {
      return false;
    }

    // Area range
    if (criteria.minArea > 0 && prop.area < criteria.minArea) {
      return false;
    }
    if (criteria.maxArea > 0 && prop.area > criteria.maxArea) {
      return false;
    }

    return true;
  });

  // Sorting
  switch (criteria.sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => {
        const pA = a.purpose === 'For Rent' ? (a.monthlyRent || a.price) : a.price;
        const pB = b.purpose === 'For Rent' ? (b.monthlyRent || b.price) : b.price;
        return pA - pB;
      });
      break;
    case 'price-desc':
      filtered.sort((a, b) => {
        const pA = a.purpose === 'For Rent' ? (a.monthlyRent || a.price) : a.price;
        const pB = b.purpose === 'For Rent' ? (b.monthlyRent || b.price) : b.price;
        return pB - pA;
      });
      break;
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'area-desc':
      filtered.sort((a, b) => b.area - a.area);
      break;
    case 'recommended':
    default:
      // Featured first, then newest
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
  }

  return filtered;
}

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
