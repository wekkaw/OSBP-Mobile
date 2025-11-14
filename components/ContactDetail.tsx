import React, { useState } from 'react';
import { ProcessedContact, Contract, BookmarkType } from '../types';
import Card from './common/Card';
import Header from './common/Header';
import ContractItem from './ContractItem';
import { ICONS } from '../constants';
import { useBookmarkContext } from '../contexts/BookmarkContext';
import ContractDetail from './ContractDetail';
import { formatPotentialValue, formatDate } from '../utils/formatters';
import SlackMessageModal from './SlackMessageModal';

interface ContactDetailProps {
    contact: ProcessedContact;
    onBack: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode, text: string | undefined, label: string, href?: string }> = ({ icon, text, label, href }) => {
    if (!text) return null;
    
    const content = (
        <div className="flex items-center py-3.5">
            <div className="w-6 h-6 mr-4 text-slate-400 dark:text-slate-500 flex-shrink-0">{icon}</div>
            <div className="text-sm flex-grow">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{label}</p>
                <p className={`text-slate-500 dark:text-slate-400 ${href ? 'text-indigo-600 dark:text-indigo-400 group-hover:underline' : ''}`}>{text}</p>
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block transition-colors hover:bg-slate-500/5 dark:hover:bg-white/5 rounded-lg -mx-4 px-4 group">
                {content}
            </a>
        );
    }
    
    return <div className="-mx-4 px-4">{content}</div>;
};

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onBack }) => {
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [showSlackModal, setShowSlackModal] = useState(false);
    
    // Handlers for associated contracts
    const handleToggleContractBookmark = (id: string) => {
        if (!id) return;
        if (isBookmarked(id, BookmarkType.Contract)) {
            removeBookmark(id, BookmarkType.Contract);
        } else {
            addBookmark(id, BookmarkType.Contract);
        }
    };
    
    const handleShareAssociatedContract = async (contract: Contract) => {
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

    // Handlers for this specific contact
    const handleShareContact = async () => {
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

    const handleSaveContact = () => {
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

    
    if (selectedContract) {
        return (
            <ContractDetail
                contract={selectedContract}
                onBack={() => setSelectedContract(null)}
                isBookmarked={isBookmarked(selectedContract.contract_number, BookmarkType.Contract)}
                onToggleBookmark={() => handleToggleContractBookmark(selectedContract.contract_number)}
                onShare={() => handleShareAssociatedContract(selectedContract)}
            />
        );
    }

    return (
        <>
            {showSlackModal && (
                <SlackMessageModal
                    contact={contact}
                    onClose={() => setShowSlackModal(false)}
                />
            )}
            <div className="animate-fade-in space-y-6">
                <Header title={contact.name} onBack={onBack}>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setShowSlackModal(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95">
                            {ICONS.slack}
                        </button>
                        <button onClick={handleShareContact} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95">
                            {ICONS.share}
                        </button>
                        <button onClick={handleSaveContact} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95">
                            {ICONS.save}
                        </button>
                    </div>
                </Header>
                
                <div className="flex flex-col items-center -mt-8">
                    <div className="relative">
                        <img
                            src={contact.photo}
                            alt={contact.name}
                            className="w-24 h-24 rounded-full mb-2 border-4 border-white dark:border-slate-800 shadow-lg object-cover bg-slate-200"
                        />
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-30 blur-lg"></div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">{contact.title}</h2>
                    <p className="text-md text-slate-500 dark:text-slate-400">{contact.position}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{contact.center}</p>
                </div>

                <Card className="p-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 px-4 pt-2">Contact Information</h3>
                    <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                        <InfoRow icon={ICONS.envelope} label="Email" text={contact.email} href={`mailto:${contact.email}`} />
                        <InfoRow icon={ICONS.phone} label="Phone" text={contact.phone} href={`tel:${contact.phone}`} />
                        <InfoRow icon={ICONS.fax} label="Fax" text={contact.fax} />
                        <InfoRow icon={ICONS.mapPin} label="Address" text={contact.address} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}/>
                    </div>
                </Card>

                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Associated Contracts ({contact.associatedContracts.length})</h3>
                    <div className="space-y-4">
                        {contact.associatedContracts.length > 0 ? (
                            contact.associatedContracts.map(contract => (
                            <ContractItem
                                    key={contract.id}
                                    contract={contract}
                                    isBookmarked={isBookmarked(contract.contract_number, BookmarkType.Contract)}
                                    onToggleBookmark={() => handleToggleContractBookmark(contract.contract_number)}
                                    onShare={() => handleShareAssociatedContract(contract)}
                                    onClick={() => setSelectedContract(contract)}
                            />
                            ))
                        ) : (
                            <Card className="p-4 text-center text-slate-500 dark:text-slate-400">
                                <p>No contracts associated with this contact.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactDetail;