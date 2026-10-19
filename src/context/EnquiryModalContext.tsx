import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '../data/properties';
import { EnquiryModal } from '../components/EnquiryModal';

interface EnquiryModalContextType {
  openEnquiryModal: (property: Property) => void;
  closeEnquiryModal: () => void;
}

const EnquiryModalContext = createContext<EnquiryModalContextType | undefined>(undefined);

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openEnquiryModal = (property: Property) => {
    setSelectedProperty(property);
    setIsOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsOpen(false);
  };

  return (
    <EnquiryModalContext.Provider value={{ openEnquiryModal, closeEnquiryModal }}>
      {children}
      <EnquiryModal
        property={selectedProperty}
        isOpen={isOpen}
        onClose={closeEnquiryModal}
      />
    </EnquiryModalContext.Provider>
  );
}

export function useEnquiryModal() {
  const context = useContext(EnquiryModalContext);
  if (!context) {
    throw new Error('useEnquiryModal must be used within an EnquiryModalProvider');
  }
  return context;
}
