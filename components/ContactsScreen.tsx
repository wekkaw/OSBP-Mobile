import React, { useState, useMemo } from 'react';
import { ProcessedContact, BookmarkType } from '../types';
import Header from './common/Header';
import ContactDetail from './ContactDetail';
import { ICONS } from '../constants';
import FilterSelect from './common/FilterSelect';
import EmptyState from './common/EmptyState';
import ContactItem from './ContactItem';
import { useBookmarkContext } from '../contexts/BookmarkContext';
import SlackMessageModal from './SlackMessageModal';

interface ContactsScreenProps {
  contacts: ProcessedContact[];
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ contacts }) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<ProcessedContact | null>(null);
  const [contactForSlack, setContactForSlack] = useState<ProcessedContact | null>(null);
  const [centerFilter, setCenterFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');

  const { uniqueCenters, uniquePositions } = useMemo(() => {
    const centers = new Set<string>();
    const positions = new Set<string>();
    contacts.forEach(c => {
        if(c.center && c.center !== 'Unknown Center') centers.add(c.center);
        if(c.position) positions.add(c.position);
    });
    return {
        uniqueCenters: Array.from(centers).sort(),
        uniquePositions: Array.from(positions).sort()
    };
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return contacts.filter(c => {
      const textMatch = !lowercasedFilter ||
        (c.name || '').toLowerCase().includes(lowercasedFilter) ||
        (c.title || '').toLowerCase().includes(lowercasedFilter);

      const centerMatch = centerFilter === 'all' || c.center === centerFilter;
      const positionMatch = positionFilter === 'all' || c.position === positionFilter;
      
      return textMatch && centerMatch && positionMatch;
    });
  }, [contacts, searchTerm, centerFilter, positionFilter]);

  const handleToggleBookmark = (id: string) => {
    if (!id) return;
    if (isBookmarked(id, BookmarkType.Contact)) {
        removeBookmark(id, BookmarkType.Contact);
    } else {
        addBookmark(id, BookmarkType.Contact);
    }
  };

  const handleShareContact = async (contact: ProcessedContact) => {
      const shareData = {
          title: `Contact: ${contact.name}`,
          text: `Here's the contact information for ${contact.name}:\nTitle: ${contact.title}\nEmail: ${contact.email}\nPhone: ${contact.phone}`,
          url: window.location.href,
      };
      try {
          if (navigator.share) {
              await navigator.share(shareData);
          } else {
              alert('Sharing is not supported on this browser.');
          }
      } catch (error) {
          console.error('Error sharing contact:', error);
      }
  };

  const handleSaveContact = (contact: ProcessedContact) => {
      const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
ORG:${contact.center}
TITLE:${contact.title}
TEL;TYPE=WORK,VOICE:${contact.phone || ''}
TEL;TYPE=WORK,FAX:${contact.fax || ''}
EMAIL:${contact.email || ''}
ADR;TYPE=WORK:;;${contact.address || ''}
PHOTO;VALUE=URL:${contact.photo || ''}
END:VCARD`;

      const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contact.name.replace(/\s/g, '_')}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  if (selectedContact) {
    return <ContactDetail contact={selectedContact} onBack={() => setSelectedContact(null)} />;
  }
  
  const hasActiveFilters = searchTerm || centerFilter !== 'all' || positionFilter !== 'all';

  return (
    <>
      {contactForSlack && (
        <SlackMessageModal
            contact={contactForSlack}
            onClose={() => setContactForSlack(null)}
        />
       )}
      <div className="space-y-4">
        <Header title="Contacts" />
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {ICONS.search}
          </div>
          <input
            type="text"
            placeholder="Search by name or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-800/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm shadow-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FilterSelect label="Center" value={centerFilter} onChange={e => setCenterFilter(e.target.value)} options={uniqueCenters} />
          <FilterSelect label="Position" value={positionFilter} onChange={e => setPositionFilter(e.target.value)} options={uniquePositions} />
        </div>
        <div className="space-y-3">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <ContactItem
                  key={contact.id}
                  contact={contact}
                  isBookmarked={isBookmarked(contact.email, BookmarkType.Contact)}
                  onClick={() => setSelectedContact(contact)}
                  onToggleBookmark={() => handleToggleBookmark(contact.email)}
                  onShare={() => handleShareContact(contact)}
                  onSave={() => handleSaveContact(contact)}
                  onSlack={() => setContactForSlack(contact)}
              />
            ))
          ) : (
            <EmptyState 
                  icon={ICONS.contacts}
                  title="No Contacts Found"
                  message={hasActiveFilters ? "Try adjusting your search or filters." : "There are no contacts to display."}
              />
          )}
        </div>
      </div>
    </>
  );
};

export default ContactsScreen;