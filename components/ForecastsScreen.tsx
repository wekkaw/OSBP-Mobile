
import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';
import Header from './common/Header';
import Card from './common/Card';
import EmptyState from './common/EmptyState';
import FilterSelect from './common/FilterSelect';
import { ProcessedContact, ForecastItem } from '../types';
import ContactDetail from './ContactDetail';

interface ForecastsScreenProps {
    contacts: ProcessedContact[];
    forecasts: ForecastItem[];
}

// Configuration for mapping logical fields to potential Excel headers
const FIELD_KEYS = {
    title: ['Project Description', 'Title', 'Requirement', 'Description', 'Project Name'],
    naics: ['NAICS Code', 'NAICS'],
    value: ['Estimated Value', 'Dollar Range', 'Value', 'Cost', 'Est Value'],
    releaseDate: ['Release Date', 'Solicitation', 'Anticipated', 'Date'],
    office: ['Buying Office', 'Center', 'Location', 'Installation', 'Activity', 'Buying Activity', 'Organization'],
    status: ['Acquisition Status', 'Status'],
    phase: ['Acquisition Phase', 'Phase'],
    poc: ['SmallBusinessSpecialistPOC', 'Small Business Specialist', 'POC', 'Point of Contact', 'Specialist']
};

// Helper to normalize strings for comparison (removes non-alphanumeric, lowercases)
const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

// Helper to find best matching keys for display regardless of exact header name
const getValue = (item: ForecastItem, possibleKeys: string[]) => {
    const itemKeys = Object.keys(item);
    
    for (const targetKey of possibleKeys) {
        const normalizedTarget = normalizeKey(targetKey);
        
        // Find a key in the item that contains the target key (fuzzy match)
        const foundKey = itemKeys.find(k => {
            const normalizedK = normalizeKey(k);
            return normalizedK.includes(normalizedTarget);
        });

        if (foundKey && item[foundKey] !== undefined && item[foundKey] !== null) {
            return item[foundKey];
        }
    }
    return null;
};

const ForecastDetail: React.FC<{ 
    item: ForecastItem; 
    onBack: () => void;
    contacts: ProcessedContact[];
    onContactSelect: (contact: ProcessedContact) => void;
}> = ({ item, onBack, contacts, onContactSelect }) => {
    const title = getValue(item, FIELD_KEYS.title) || 'N/A';
    
    // Attempt to find the POC and match with existing contacts
    const pocNameRaw = getValue(item, FIELD_KEYS.poc);
    const pocName = pocNameRaw ? String(pocNameRaw).trim() : null;

    const matchedContact = useMemo(() => {
        if (!pocName || contacts.length === 0) return null;

        // Helper to clean strings: lowercase, remove special chars (commas, etc), collapse spaces
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        
        const cleanPoc = normalize(pocName);
        // Create a set of words from the POC string for flexible order matching
        const pocTokens = new Set(cleanPoc.split(' '));

        // find candidates
        const candidates = contacts.filter(c => {
            const cleanContact = normalize(c.name);
            
            // Strategy 1: Direct substring
            if (cleanPoc.includes(cleanContact)) return true;

            // Strategy 2: Token subset 
            const contactTokens = cleanContact.split(' ');
            const validContactTokens = contactTokens.filter(t => t.length > 0);
            
            const allTokensFound = validContactTokens.every(token => pocTokens.has(token));
            
            return validContactTokens.length > 0 && allTokensFound;
        });

        candidates.sort((a, b) => b.name.length - a.name.length);

        return candidates[0] || null;
    }, [contacts, pocName]);

    return (
        <div className="animate-fade-in space-y-4">
            <Header title="Forecast Details" onBack={onBack} />
            
            {matchedContact && (
                <Card 
                    onClick={() => onContactSelect(matchedContact)}
                    className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-l-4 border-indigo-500 cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                             <img
                                src={matchedContact.photo}
                                alt={matchedContact.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm bg-slate-200"
                            />
                            <div>
                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Small Business Specialist</p>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">{matchedContact.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{matchedContact.title}</p>
                            </div>
                        </div>
                        <div className="text-indigo-400">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Card>
            )}

            <Card className="p-6">
                <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200 leading-snug">{title}</h2>
                <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                    {Object.entries(item).map(([key, value]) => {
                         if (value === null || value === undefined || value === '') return null;
                         const strValue = String(value);
                         
                         return (
                            <div key={key} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                                <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm flex-shrink-0 sm:w-1/3">{key}</span>
                                <span className="text-slate-800 dark:text-slate-200 text-sm break-words flex-grow sm:text-right font-medium">{strValue}</span>
                            </div>
                         );
                    })}
                </div>
            </Card>
        </div>
    );
};

const ForecastsScreen: React.FC<ForecastsScreenProps> = ({ contacts, forecasts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedForecast, setSelectedForecast] = useState<ForecastItem | null>(null);
    const [selectedContact, setSelectedContact] = useState<ProcessedContact | null>(null);
    
    // New Filters
    const [buyingOfficeFilter, setBuyingOfficeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [phaseFilter, setPhaseFilter] = useState('all');
    const [naicsFilter, setNaicsFilter] = useState('all');

    // Extract unique values for filters
    const { uniqueBuyingOffices, uniqueStatuses, uniquePhases, uniqueNaics } = useMemo(() => {
        const offices = new Set<string>();
        const statuses = new Set<string>();
        const phases = new Set<string>();
        const naicsCodes = new Set<string>();

        forecasts.forEach(item => {
            const office = getValue(item, FIELD_KEYS.office);
            const status = getValue(item, FIELD_KEYS.status);
            const phase = getValue(item, FIELD_KEYS.phase);
            const naics = getValue(item, FIELD_KEYS.naics);

            if (office && String(office).toLowerCase() !== 'n/a') offices.add(String(office).trim());
            if (status && String(status).toLowerCase() !== 'n/a') statuses.add(String(status).trim());
            if (phase && String(phase).toLowerCase() !== 'n/a') phases.add(String(phase).trim());
            if (naics && String(naics).toLowerCase() !== 'n/a') naicsCodes.add(String(naics).trim());
        });

        return {
            uniqueBuyingOffices: Array.from(offices).sort(),
            uniqueStatuses: Array.from(statuses).sort(),
            uniquePhases: Array.from(phases).sort(),
            uniqueNaics: Array.from(naicsCodes).sort()
        };
    }, [forecasts]);

    // Filter Logic
    const filteredData = useMemo(() => {
        return forecasts.filter(item => {
             // Text Search
            const matchesSearch = !searchTerm || Object.values(item).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Buying Office Filter
            const officeVal = getValue(item, FIELD_KEYS.office);
            const matchesOffice = buyingOfficeFilter === 'all' || (officeVal && String(officeVal).trim() === buyingOfficeFilter);

            // Status Filter
            const statusVal = getValue(item, FIELD_KEYS.status);
            const matchesStatus = statusFilter === 'all' || (statusVal && String(statusVal).trim() === statusFilter);

            // Phase Filter
            const phaseVal = getValue(item, FIELD_KEYS.phase);
            const matchesPhase = phaseFilter === 'all' || (phaseVal && String(phaseVal).trim() === phaseFilter);

            // NAICS Filter
            const naicsVal = getValue(item, FIELD_KEYS.naics);
            const matchesNaics = naicsFilter === 'all' || (naicsVal && String(naicsVal).trim() === naicsFilter);

            return matchesSearch && matchesOffice && matchesStatus && matchesPhase && matchesNaics;
        });
    }, [forecasts, searchTerm, buyingOfficeFilter, statusFilter, phaseFilter, naicsFilter]);


    // Navigation Logic: Detailed Contact View -> Forecast Detail View -> List View
    if (selectedContact) {
        return <ContactDetail contact={selectedContact} onBack={() => setSelectedContact(null)} />;
    }

    if (selectedForecast) {
        return (
            <ForecastDetail 
                item={selectedForecast} 
                onBack={() => setSelectedForecast(null)} 
                contacts={contacts}
                onContactSelect={setSelectedContact}
            />
        );
    }

    return (
        <div className="space-y-4">
            <Header title="Acquisition Forecasts" />
            
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    {ICONS.search}
                </div>
                <input
                    type="text"
                    placeholder="Search forecasts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-800/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm shadow-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FilterSelect 
                    label="Buying Office" 
                    value={buyingOfficeFilter} 
                    onChange={e => setBuyingOfficeFilter(e.target.value)} 
                    options={uniqueBuyingOffices} 
                />
                <FilterSelect 
                    label="Status" 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)} 
                    options={uniqueStatuses} 
                />
                 <FilterSelect 
                    label="Phase" 
                    value={phaseFilter} 
                    onChange={e => setPhaseFilter(e.target.value)} 
                    options={uniquePhases} 
                />
                <FilterSelect 
                    label="NAICS" 
                    value={naicsFilter} 
                    onChange={e => setNaicsFilter(e.target.value)} 
                    options={uniqueNaics} 
                />
            </div>

            <div className="space-y-3 animate-fade-in">
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => {
                        const title = getValue(item, FIELD_KEYS.title) || 'N/A';
                        const naics = getValue(item, FIELD_KEYS.naics) || 'N/A';
                        const value = getValue(item, FIELD_KEYS.value) || 'N/A';
                        const releaseDate = getValue(item, FIELD_KEYS.releaseDate) || 'N/A';
                        const office = getValue(item, FIELD_KEYS.office) || 'N/A';
                        const status = getValue(item, FIELD_KEYS.status) || 'N/A';

                        return (
                            <Card 
                                key={index} 
                                onClick={() => setSelectedForecast(item)}
                                className="p-4 space-y-2 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
                                    <div className="text-slate-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    <div>
                                        <p className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Value</p>
                                        <p className="font-medium text-slate-700 dark:text-slate-300">{value}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Release Date</p>
                                        <p className="font-medium text-slate-700 dark:text-slate-300">{releaseDate}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">NAICS</p>
                                        <p className="font-mono text-xs">{naics}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</p>
                                        <p className="truncate">{status}</p>
                                    </div>
                                     <div className="col-span-2 border-t border-slate-100 dark:border-slate-700/50 pt-2 mt-1">
                                        <p className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Buying Office</p>
                                        <p>{office}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <EmptyState 
                        icon={ICONS.chart}
                        title="No Forecasts Found"
                        message="Try adjusting your filters or search terms."
                    />
                )}
            </div>
            
            <p className="text-center text-xs text-slate-400 pt-4">
                Source: NASA Acquisition Forecast
            </p>
        </div>
    );
};

export default ForecastsScreen;
