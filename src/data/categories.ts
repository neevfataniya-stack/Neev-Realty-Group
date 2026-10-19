export interface PropertyCategory {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  count: number;
  image: string;
  filterKey: string;
}

export const CATEGORIES: PropertyCategory[] = [
  {
    id: 'cat-flats',
    slug: 'flats-apartments',
    title: 'Flats & Apartments',
    shortDescription: 'Modern multi-storey residential apartments with community amenities in prime neighborhoods.',
    count: 8,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    filterKey: 'Flats & Apartments',
  },
  {
    id: 'cat-independent',
    slug: 'independent-houses',
    title: 'Independent Houses',
    shortDescription: 'Standalone residential homes offering privacy, terrace rights, and dedicated personal space.',
    count: 3,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    filterKey: 'Independent Houses',
  },
  {
    id: 'cat-villas',
    slug: 'villas',
    title: 'Villas',
    shortDescription: 'Spacious luxury residential villas with landscaped personal gardens and premium finishes.',
    count: 3,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    filterKey: 'Villas',
  },
  {
    id: 'cat-plots',
    slug: 'residential-plots',
    title: 'Residential Plots',
    shortDescription: 'Approved residential plots in planned gated layouts ready for customized home construction.',
    count: 2,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    filterKey: 'Residential Plots',
  },
  {
    id: 'cat-new-projects',
    slug: 'new-projects',
    title: 'New Projects',
    shortDescription: 'Upcoming residential townships and newly launched developments across growth corridors.',
    count: 4,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    filterKey: 'New Projects',
  },
  {
    id: 'cat-ready-to-move',
    slug: 'ready-to-move',
    title: 'Ready-to-Move Homes',
    shortDescription: 'Fully completed homes ready for immediate handover and occupancy across Surat.',
    count: 9,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    filterKey: 'Ready-to-Move Homes',
  },
];
