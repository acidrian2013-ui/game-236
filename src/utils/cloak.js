export const CLOAK_PROFILES = [
  {
    id: 'default',
    name: 'Default Arcade',
    title: 'Nexus Arcade - Unblocked Games Hub',
    favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'%3E%3C/polygon%3E%3C/svg%3E"
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'%3E%3Cpath d='M4 6h16v12H4z' fill='%2315803d'/%3E%3Cpath d='M2 4h20v2H2zm0 14h20v2H2z' fill='%23bbf7d0'/%3E%3C/svg%3E"
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z'/%3E%3Cpath d='M14 2v6h6' fill='%2393c5fd'/%3E%3Cpath d='M8 12h8M8 15h8M8 18h5' stroke='%23fff' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8.5 3h7l5.5 9.5-3.5 6.5h-7z' fill='%23eab308'/%3E%3Cpath d='M1.5 19h14l3.5-6.5-7-12.5z' fill='%233b82f6'/%3E%3Cpath d='M1.5 19l3.5-6.5 7 12.5h-7z' fill='%2322c55e'/%3E%3C/svg%3E"
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e11d48'%3E%3Ccircle cx='12' cy='12' r='10' fill='none' stroke='%23e11d48' stroke-width='4'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%23e11d48'/%3E%3C/svg%3E"
  },
  {
    id: 'calculator',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'%3E%3Crect width='24' height='24' rx='4' fill='%23065f46'/%3E%3Cpath d='M6 18c3-12 9 0 12-12' stroke='%2334d399' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1f5f9'%3E%3Crect width='24' height='24' rx='4' fill='%23334155'/%3E%3Ctext x='4' y='18' font-family='serif' font-weight='bold' font-size='16' fill='%23ffffff'%3EW%3C/text%3E%3C/svg%3E"
  }
];

export function applyCloakProfile(profileId) {
  const profile = CLOAK_PROFILES.find(p => p.id === profileId) || CLOAK_PROFILES[0];
  document.title = profile.title;
  
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = profile.favicon;
  localStorage.setItem('unblocked_active_cloak', profile.id);
}

export function getActiveCloakId() {
  return localStorage.getItem('unblocked_active_cloak') || 'default';
}
