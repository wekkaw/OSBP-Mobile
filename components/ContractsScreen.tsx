import React, { useState, useMemo } from 'react';
import { Contract, BookmarkType } from '../types';
import Header from './common/Header';
import ContractItem from './ContractItem';
import ContractDetail from './ContractDetail';
import FilterSelect from './common/FilterSelect';
import { ICONS } from '../constants';
import EmptyState from './common/EmptyState';
import { formatPotentialValue, formatDate } from '../utils/formatters';
import { useBookmarkContext } from '../contexts/BookmarkContext';

const TabButton: React.FC<{ label: string, count: number, isActive: boolean, onClick: () => void }> = ({ label, count, isActive, onClick }) => {
    const baseClasses = "relative flex-1 text-center px-4 py-2.5 font-semibold text-sm transition-colors duration-300 focus:outline-none rounded-lg z-10";
    const activeClasses = "text-indigo-600 dark:text-indigo-400";
    const inactiveClasses = "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200";

    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label} <span className={`text-xs rounded-full px-2 py-0.5 ml-1 transition-colors ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{count}</span>
        </button>
    );
}

const TabsContainer: React.FC<{
  activeTab: 'contracts' | 'rfps';
  onTabChange: (tab: 'contracts' | 'rfps') => void;
  contractCount: number;
  rfpCount: number;
}> = ({ activeTab, onTabChange, contractCount, rfpCount }) => {
  return (
    <div className="relative flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
       <div 
          className="absolute top-1 bottom-1 w-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-transform duration-300 ease-in-out"
          style={{ transform: activeTab === 'contracts' ? 'translateX(0%)' : 'translateX(100%)' }}
       />
      <TabButton label="Contracts" count={contractCount} isActive={activeTab === 'contracts'} onClick={() => onTabChange('contracts')} />
      <TabButton label="RFPs" count={rfpCount} isActive={activeTab === 'rfps'} onClick={() => onTabChange('rfps')} />
    </div>
  );
};


interface ContractsScreenProps {
  contracts: Contract[];
}

const ContractsScreen: React.FC<ContractsScreenProps> = ({ contracts: allContractData }) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState<'contracts' | 'rfps'>('contracts');
  const [centerFilter, setCenterFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { contractList, rfpList } = useMemo(() => {
    const rfps: Contract[] = [];
    const contracts: Contract[] = [];
    allContractData.forEach(item => {
      if (item.is_rfp === true) {
        rfps.push(item);
      } else {
        contracts.push(item);
      }
    });
    return { contractList: contracts, rfpList: rfps };
  }, [allContractData]);
  
  const { uniqueCenters, uniqueTypes } = useMemo(() => {
    const centers = new Set<string>();
    const types = new Set<string>();
    allContractData.forEach(c => {
        if(c.center && c.center !== 'Unknown Center') centers.add(c.center);
        if(c.contract_type) types.add(c.contract_type);
    });
    return {
        uniqueCenters: Array.from(centers).sort(),
        uniqueTypes: Array.from(types).sort()
    };
}, [allContractData]);


  const lowercasedFilter = searchTerm.toLowerCase();

  const filterItems = (items: Contract[]) => {
    return items.filter(c => {
        const textMatch = !lowercasedFilter ||
          (c.contract_name || '').toLowerCase().includes(lowercasedFilter) ||
          (c.contractor_name || '').toLowerCase().includes(lowercasedFilter) ||
          (c.contract_number || '').toLowerCase().includes(lowercasedFilter);

        const centerMatch = centerFilter === 'all' || c.center === centerFilter;
        const typeMatch = typeFilter === 'all' || c.contract_type === typeFilter;

        return textMatch && centerMatch && typeMatch;
    });
  };

  const filteredContracts = useMemo(() => filterItems(contractList), [contractList, lowercasedFilter, centerFilter, typeFilter]);
  const filteredRFPs = useMemo(() => filterItems(rfpList), [rfpList, lowercasedFilter, centerFilter, typeFilter]);
  
  const handleToggleBookmark = (id: string) => {
    if (!id) return;
    if (isBookmarked(id, BookmarkType.Contract)) {
        removeBookmark(id, BookmarkType.Contract);
    } else {
        addBookmark(id, BookmarkType.Contract);
    }
  };

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


  if (selectedContract) {
    return (
      <ContractDetail 
        contract={selectedContract}
        onBack={() => setSelectedContract(null)}
        isBookmarked={isBookmarked(selectedContract.contract_number, BookmarkType.Contract)}
        onToggleBookmark={() => handleToggleBookmark(selectedContract.contract_number)}
        onShare={() => handleShareContract(selectedContract)}
      />
    );
  }
  
  const hasActiveFilters = searchTerm || centerFilter !== 'all' || typeFilter !== 'all';

  const renderContractList = (contracts: Contract[]) => {
    return contracts.map((contract, index) => (
        <ContractItem 
            key={`${contract.contract_number}-${index}`} 
            contract={contract} 
            isBookmarked={isBookmarked(contract.contract_number, BookmarkType.Contract)}
            onClick={() => setSelectedContract(contract)}
            onToggleBookmark={() => handleToggleBookmark(contract.contract_number)}
            onShare={() => handleShareContract(contract)}
        />
    ));
  };

  return (
    <div className="space-y-4">
      <Header title="Contracts & RFPs" />
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          {ICONS.search}
        </div>
        <input
          type="text"
          placeholder="Search by name, contractor, or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-800/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none backdrop-blur-sm shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FilterSelect label="Center" value={centerFilter} onChange={e => setCenterFilter(e.target.value)} options={uniqueCenters} />
        <FilterSelect label="Type" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} options={uniqueTypes} />
      </div>

      <TabsContainer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        contractCount={filteredContracts.length}
        rfpCount={filteredRFPs.length}
      />

      <div className="space-y-3">
        {activeTab === 'contracts' && (
          <div className="space-y-4 animate-slide-in-up">
            {filteredContracts.length > 0 ? (
              renderContractList(filteredContracts)
            ) : (
              <EmptyState 
                icon={ICONS.contracts}
                title="No Contracts Found"
                message={hasActiveFilters ? "Try adjusting your search or filters." : "There are no contracts to display."}
              />
            )}
          </div>
        )}

        {activeTab === 'rfps' && (
          <div className="space-y-3 animate-slide-in-up">
            {filteredRFPs.length > 0 ? (
              renderContractList(filteredRFPs)
            ) : (
               <EmptyState 
                icon={ICONS.megaphone}
                title="No RFPs Found"
                message={hasActiveFilters ? "Try adjusting your search or filters." : "There are no RFPs to display."}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsScreen;