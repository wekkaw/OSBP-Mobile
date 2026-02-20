
export interface Center {
  center_id: string;
  center_name: string;
}

// This interface now reflects the real data structure from contacts.json
export interface Contact {
  id: number;
  name: string;
  title: string;
  position: string;
  center_id: string;
  email: string;
  phone: string;
  address: string;
  fax: string;
  photo: string;
}

// ProcessedContact now extends the real Contact type
export interface ProcessedContact extends Contact {
  center: string; // From lookup
  associatedContracts: Contract[];
}

export interface ContractType {
  id: number;
  name: string;
}

export interface AclRfp {
  id: number;
  name:string;
}

// Data model for items in dashboard.json
export interface DashboardItem {
  title: string;
  image_url: string;
  link: string;
  weight: number;
  tid: string;
  use_icon: number;
  node_id?: string;
}

// Processed dashboard item with full image URL and navigation link/content
export interface ProcessedDashboardItem {
  title: string;
  imageUrl: string;
  screen: Screen | null;
  content?: {
    title: string;
    body: string;
  };
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface AgendaSession {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  track: 'Main Stage' | 'Workshop' | 'Networking' | 'Breakout';
  speakers: Speaker[];
  isLive?: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  isActive: boolean;
  totalVotes: number;
}

export interface TopStory {
  id: number;
  nid: number;
  title: string;
  summary: string;
  imageUrl: string;
}

export interface ProcessedTopStory extends TopStory {
  body: string;
}

// This interface now matches the actual structure of contracts.json
export interface Contract {
  id: number;
  contract_name: string;
  contract_number: string;
  naics: string;
  type_of_competition: string;
  contractor_name: string;
  potential_value: string;
  effective_date: string;
  ultimate_contract_end_date: string;
  contract_type: string;
  center: string;
  is_rfp?: boolean;
}

export interface NodeContent {
  id: number;
  nid: number;
  title: string;
  body: string;
}

export interface ForecastItem {
    [key: string]: any;
}

export interface RawNaicsRow {
    Code: string | number;
    Title: string;
    Description: string;
}

export interface AllData {
  centers: Center[];
  contacts: Contact[];
  contractTypes: ContractType[];
  aclRfp: AclRfp[];
  dashboard: DashboardItem[];
  events: Event[];
  topStories: TopStory[];
  contracts: Contract[];
  nodeContent: NodeContent[];
}

export interface ProcessedData extends Omit<AllData, 'contacts' | 'contracts' | 'topStories' | 'dashboard'> {
  processedContacts: ProcessedContact[];
  processedContracts: Contract[];
  processedTopStories: ProcessedTopStory[];
  processedDashboard: ProcessedDashboardItem[];
  forecasts: ForecastItem[];
  naicsData: RawNaicsRow[];
  processedNvdb: NvdbRow[];
}

export enum BookmarkType {
  Contact = 'Contact',
  Contract = 'Contract',
  Session = 'Session',
}

export interface Bookmark {
  id: string;
  type: BookmarkType;
}

export enum Screen {
  Dashboard = 'Dashboard',
  Contracts = 'Contracts',
  Contacts = 'Contacts',
  Events = 'Events',
  TopStories = 'Top Stories',
  Bookmarks = 'Bookmarks',
  NaicsSearch = 'NAICS',
  Forecasts = 'Forecasts',
  Settings = 'Settings',
  Nvdb = 'Vendor Database',
}

export interface NvdbRow {
  [key: string]: any;
}
