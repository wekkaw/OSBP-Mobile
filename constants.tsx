
import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: "1.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
};

export const ICONS = {
  dashboard: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3.75M3.75 3h16.5M3.75 3v1.5M16.5 3v1.5M12 16.5h.008v.008H12v-.008zM12 3.75a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" /></svg>,
  contracts: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  contacts: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.241.252-.477.386-.702zM9 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  events: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>,
  back: <svg {...iconProps} strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>,
  briefcase: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.25L12 21m0 0l-8.25-6.75M12 21V3M21 3H3v6h18V3z" /></svg>,
  megaphone: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M19.117 2.883a1.5 1.5 0 011.06 1.06l3 7.5a1.5 1.5 0 01-2.734 1.118l-1.13-2.824a1.5 1.5 0 00-1.4-1.05H3.75A1.5 1.5 0 012.25 7.5v-1.5A1.5 1.5 0 013.75 4.5h13.19l-1.13-2.824a1.5 1.5 0 011.307-2.793zM3.75 9h12.75a1.5 1.5 0 011.4 1.05l1.13 2.824a1.5 1.5 0 01-2.734 1.118l-3-7.5a1.5 1.5 0 01-1.06-1.06" /></svg>,
  sparkles: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.452-2.452L14.25 6l1.036-.259a3.375 3.375 0 002.452-2.452L18 2.25l.259 1.035a3.375 3.375 0 002.452 2.452L21.75 6l-1.035.259a3.375 3.375 0 00-2.452 2.452zM15 15.75l-.813 2.846a4.5 4.5 0 00-3.09-3.09L8.25 15l2.846-.813a4.5 4.5 0 003.09-3.09L15 8.25l.813 2.846a4.5 4.5 0 003.09 3.09L21.75 15l-2.846.813a4.5 4.5 0 00-3.09 3.09L15 15.75z" /></svg>,
  users: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM12 15.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
  envelope: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
  phone: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></svg>,
  mapPin: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
  building: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 12h6.75M9 17.25h6.75" /></svg>,
  fax: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 18.75m10.56-4.921L18 18.75m-12-12l6-6 6 6m-12 0v12a2.25 2.25 0 002.25 2.25h8.5A2.25 2.25 0 0018 18.75V6.75" /></svg>,
  search: <svg {...iconProps} strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  share: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 5.314l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" /></svg>,
  save: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
  bookmark: <svg {...iconProps} fill="currentColor"><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>,
  bookmarkOutline: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>,
  slack: <svg {...iconProps}><path d="M8.25 10.875C8.25 10.0466 7.57843 9.375 6.75 9.375H4.125C3.29657 9.375 2.625 10.0466 2.625 10.875C2.625 11.7034 3.29657 12.375 4.125 12.375H5.25V14.625C5.25 15.4534 5.92157 16.125 6.75 16.125C7.57843 16.125 8.25 15.4534 8.25 14.625V10.875Z" /><path d="M12.375 8.25C11.5466 8.25 10.875 7.57843 10.875 6.75V4.125C10.875 3.29657 11.5466 2.625 12.375 2.625C13.2034 2.625 13.875 3.29657 13.875 4.125V5.25H16.125C16.9534 5.25 17.625 5.92157 17.625 6.75C17.625 7.57843 16.9534 8.25 16.125 8.25H12.375Z" /><path d="M15.75 13.125C15.75 13.9534 16.4216 14.625 17.25 14.625H19.875C20.7034 14.625 21.375 13.9534 21.375 13.125C21.375 12.2966 20.7034 11.625 19.875 11.625H18.75V9.375C18.75 8.54657 18.0784 7.875 17.25 7.875C16.4216 7.875 15.75 8.54657 15.75 9.375V13.125Z" /><path d="M11.625 15.75C12.4534 15.75 13.125 16.4216 13.125 17.25V19.875C13.125 20.7034 12.4534 21.375 11.625 21.375C10.7966 21.375 10.125 20.7034 10.125 19.875V18.75H7.875C7.04657 18.75 6.375 18.0784 6.375 17.25C6.375 16.4216 7.04657 15.75 7.875 15.75H11.625Z" /></svg>,
  chat: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.794 9 8.25z" /></svg>,
  hashtag: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" /></svg>,
  chart: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  clock: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  microphone: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>,
  poll: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3.75M3.75 3h16.5M3.75 3v1.5M16.5 3v1.5M12 16.5h.008v.008H12v-.008zM12 3.75a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" /></svg>,
  check: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
  bell: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  menu: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
  newspaper: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>,
  settings: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.581-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  sun: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
  moon: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>,
  desktop: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m-9-12V15a2.25 2.25 0 002.25 2.25h9.75A2.25 2.25 0 0018 15V5.25m-9 0h9M5.25 17.25h13.5" /></svg>,
  database: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
};

export const DATA_URLS_sandbox = {
  centers: "https://d33p78idni8c3b.cloudfront.net/data/centers.json",
  contacts: "https://d33p78idni8c3b.cloudfront.net/data/contacts.json",
  contractTypes: "https://d33p78idni8c3b.cloudfront.net/data/contract-types.json",
  aclRfp: "https://d33p78idni8c3b.cloudfront.net/data/acl-rfp.json",
  dashboard: "https://d33p78idni8c3b.cloudfront.net/data/dashboard.json",
  events: "https://d33p78idni8c3b.cloudfront.net/data/events.json",
  topStories: "https://d33p78idni8c3b.cloudfront.net/data/topstories.json",
  contracts: "https://d33p78idni8c3b.cloudfront.net/data/contracts.json",
  nodeContent: "https://d33p78idni8c3b.cloudfront.net/data/node-content.json",
};

export const DATA_URLS = {
  centers: "https://d33p78idni8c3b.cloudfront.net/data/centers.json",
  contacts: "https://d33p78idni8c3b.cloudfront.net/data/contacts.json",
  contractTypes: "https://d33p78idni8c3b.cloudfront.net/data/contract-types.json",
  aclRfp: "https://d33p78idni8c3b.cloudfront.net/data/acl-rfp.json",
  dashboard: "https://d33p78idni8c3b.cloudfront.net/data/dashboard.json",
  events: "https://d33p78idni8c3b.cloudfront.net/data/events.json",
  topStories: "https://d33p78idni8c3b.cloudfront.net/data/topstories.json",
  contracts: "https://d33p78idni8c3b.cloudfront.net/data/contracts.json",
  nodeContent: "https://d33p78idni8c3b.cloudfront.net/data/node-content.json",
};

export const FORECAST_URL = "data/AcqForecastNew.xlsx";
export const NAICS_URL = "data/2022_NAICS_Descriptions.xlsx";
export const NVDB_URL = "data/nvdb-sample-data.csv";
