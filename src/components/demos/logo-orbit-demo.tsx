'use client';

import { LogoOrbit, type LogoOrbitItem } from '@/components/anticraft/LogoOrbit';
import './logo-orbit-demo.css';

// Monochrome marks: Simple Icons (CC0), https://github.com/simple-icons/simple-icons.
// Brand names identify the sample integrations; replace these nodes with your own logos.
const marks = {
  dropbox: <svg className="logo-orbit-demo__app" viewBox="0 0 24 24" fill="#0061ff" aria-hidden="true" focusable="false"><path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z"/></svg>,
  linear: <svg className="logo-orbit-demo__app" viewBox="0 0 24 24" fill="#6469df" aria-hidden="true" focusable="false"><path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"/></svg>,
  figma: <svg className="logo-orbit-demo__app logo-orbit-demo__figma" viewBox="0 0 20 30" aria-hidden="true" focusable="false"><path d="M5 0h5v10H5A5 5 0 0 1 5 0Z" fill="#f24e1e"/><path d="M10 0h5a5 5 0 0 1 0 10h-5Z" fill="#ff7262"/><path d="M5 10h5v10H5a5 5 0 0 1 0-10Z" fill="#a259ff"/><circle cx="15" cy="15" r="5" fill="#1abcfe"/><path d="M5 20h5v5a5 5 0 1 1-5-5Z" fill="#0acf83"/></svg>,
  stripe: <svg className="logo-orbit-demo__app" viewBox="0 0 24 24" fill="#635bff" aria-hidden="true" focusable="false"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/></svg>,
  drive: <svg className="logo-orbit-demo__app" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 2h8l8 14h-8Z" fill="#fbbc04"/><path d="M8 2 0 16l4 7 8-14Z" fill="#34a853"/><path d="M4 23h16l4-7H8Z" fill="#4285f4"/></svg>,
  discord: <svg className="logo-orbit-demo__app" viewBox="0 0 24 24" fill="#5865f2" aria-hidden="true" focusable="false"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>,
  notion: <svg className="logo-orbit-demo__app" viewBox="0 0 24 24" fill="#191919" aria-hidden="true" focusable="false"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>,
  github: <svg className="logo-orbit-demo__app" viewBox="0 0 24 24" fill="#24292f" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  vercel: <svg className="logo-orbit-demo__app" viewBox="0 0 24 24" fill="#111" aria-hidden="true" focusable="false"><path d="m12 1.608 12 20.784H0Z"/></svg>,
};

const integrations: LogoOrbitItem[] = [
  { id: 'dropbox', label: 'Dropbox', logo: marks.dropbox, size: 64 },
  { id: 'linear', label: 'Linear', logo: marks.linear, size: 72 },
  { id: 'figma', label: 'Figma', logo: marks.figma, size: 60 },
  { id: 'stripe', label: 'Stripe', logo: marks.stripe, size: 76 },
  { id: 'drive', label: 'Google Drive', logo: marks.drive, size: 64 },
  { id: 'discord', label: 'Discord', logo: marks.discord, size: 78 },
  { id: 'notion', label: 'Notion', logo: marks.notion, size: 64 },
  { id: 'github', label: 'GitHub', logo: marks.github, orbit: 'inner', size: 54 },
  { id: 'vercel', label: 'Vercel', logo: marks.vercel, orbit: 'inner', size: 52 },
];

export function LogoOrbitDemo({ paused = false }: { paused?: boolean }) {
  return <div className="demo diagram-demo logo-orbit-demo"><LogoOrbit
    center={<svg className="logo-orbit-demo__center" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false"><path d="M6 25 14 7h5l7 18h-6l-4-11-2 6h4l2 5Z" fill="currentColor"/></svg>}
    centerLabel="Anticraft UI"
    items={integrations}
    paused={paused}
  /></div>;
}
