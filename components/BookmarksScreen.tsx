import React, { useState, useMemo } from 'react';
import { ProcessedContact, Contract, BookmarkType } from '../types';
import Header from './common/Header';
import ContractItem from './ContractItem';
import ContactDetail from './ContactDetail';
import ContractDetailView from './ContractDetail';
import EmptyState from './common/EmptyState';
import { ICONS } from '../constants';
import Card from './common/Card';
import { formatPotentialValue, formatDate } from '../utils/formatters';
import { useBookmarkContext } from '../contexts/BookmarkContext';

const BookmarkedContactItem: React.FC<{ contact: ProcessedContact, onClick: () => void }> = ({ contact, onClick }) => (
    <Card onClick={onClick} className="p-3 cursor-pointer group">
        <div className="flex items-center space-x-4">
            <img src={contact.photo} alt={contact.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/50" />
            <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{contact.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{contact.title}</p>
            </div>
        </div>
    </Card>
);

interface BookmarksScreenProps {
    allContacts: ProcessedContact[];
    allContracts: Contract[];
}

const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ allContacts, allContracts }) => {
    const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarkContext();
    const [selectedContact, setSelectedContact] = useState<ProcessedContact | null>(null);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    const bookmarkedContacts = useMemo(() => {
        const contactIds = new Set(bookmarks.filter(b => b.type === BookmarkType.Contact).map(b => b.id));
        return allContacts.filter(c => contactIds.has(c.email));
    }, [bookmarks, allContacts]);

    const bookmarkedContracts = useMemo(() => {
        const contractIds = new Set(bookmarks.filter(b => b.type === BookmarkType.Contract).map(b => b.id));
        return allContracts.filter(c => contractIds.has(c.contract_number));
    }, [bookmarks, allContracts]);
    
    const handleShareContract = async (contract: Contract) => {
        const shareData = {
            title: `Contract Opportunity: ${contract.contract_name}`,
            text: `Check out this contract opportunity:\nContract: ${contract.contract_name || 'N/A'}\nContractor: ${contract.contractor_name || 'N/A'}\nValue: ${formatPotentialValue(contract.potential_value)}\nEnd Date: ${formatDate(contract.ultimate_contract_end_date)}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                alert('Sharing is not supported on this browser.');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };
    
    const handleToggleBookmark = (id: string) => {
        if (isBookmarked(id, BookmarkType.Contract)) {
            removeBookmark(id, BookmarkType.Contract);
        } else {
            addBookmark(id, BookmarkType.Contract);
        }
    };

    if (selectedContact) {
        return <ContactDetail contact={selectedContact} onBack={() => setSelectedContact(null)} />;
    }
    if (selectedContract) {
        return <ContractDetailView 
                    contract={selectedContract} 
                    onBack={() => setSelectedContract(null)}
                    isBookmarked={isBookmarked(selectedContract.contract_number, BookmarkType.Contract)}
                    onToggleBookmark={() => handleToggleBookmark(selectedContract.contract_number)}
                    onShare={() => handleShareContract(selectedContract)}
                />;
    }

    return (
        <div className="space-y-6">
            <Header title="Bookmarks" />

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">Bookmarked Contacts ({bookmarkedContacts.length})</h2>
                    {bookmarkedContacts.length > 0 ? (
                        <div className="space-y-3">
                            {bookmarkedContacts.map(contact => (
                                <BookmarkedContactItem key={`contact-${contact.id}`} contact={contact} onClick={() => setSelectedContact(contact)} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={ICONS.contacts} title="No Bookmarked Contacts" message="Bookmark contacts to see them here." />
                    )}
                </section>
                
                <section>
                    <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">Bookmarked Contracts & RFPs ({bookmarkedContracts.length})</h2>
                    {bookmarkedContracts.length > 0 ? (
                        <div className="space-y-3">
                            {bookmarkedContracts.map(contract => (
                                <ContractItem
                                    key={`contract-${contract.id}`}
                                    contract={contract}
                                    isBookmarked={true}
                                    onToggleBookmark={() => removeBookmark(contract.contract_number, BookmarkType.Contract)}
                                    onShare={() => handleShareContract(contract)}
                                    onClick={() => setSelectedContract(contract)}
                                />
                            ))}
                        </div>
                    ) : (
                         <EmptyState icon={ICONS.contracts} title="No Bookmarked Contracts" message="Bookmark contracts or RFPs to see them here." />
                    )}
                </section>
            </div>
        </div>
    );
};
export default BookmarksScreen;