"use client";

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import './practical-art.css';

export type ProjectVariant = 'kin' | 'forma' | 'folio' | 'mono' | 'atlas' | 'sound' | 'still';

export function BagArt({ inside = false }: { inside?: boolean }) {
  return <svg viewBox="0 0 240 250" fill="none" aria-hidden="true"><ellipse cx="122" cy="227" rx="81" ry="10" fill="#4c382f" opacity=".1"/>{inside ? <><path d="m45 58 153-9 15 159-162 15Z" fill="#e2d6b4" stroke="#a59370"/><path d="m56 66 131-7 11 134-134 13Z" fill="#8b8c68"/><path d="m83 67 2-32 66-4 3 34" stroke="#716647" strokeWidth="13"/><path d="m67 109 116-7 6 86-118 8Z" fill="#bbc0a0" stroke="#777f5f"/><path d="m79 118 55-3 3 67-55 4Z" fill="#d4d3b8"/><path d="m148 114 26-1 3 65-27 2Z" fill="#596b54"/><path d="m77 82 66-4" stroke="#e9e3cb" strokeWidth="4"/></> : <><path d="m51 71 143-8 16 150-165 5Z" fill="#ddd5bd" stroke="#b5a78b"/><path d="m80 74 2-46q29-27 62-1l5 45" stroke="#807257" strokeWidth="11"/><path d="m58 78 129-7 11 129-141 6Z" fill="#e5ddc6"/><path d="m67 139 111-5 3 63-114 4Z" fill="#d2cab1" stroke="#b2a68c"/><path d="m75 82 5 119M166 77l8 118" stroke="#b2a68c" strokeWidth="2"/><rect x="105" y="151" width="37" height="22" rx="1" fill="#5c6950"/><text x="123" y="166" textAnchor="middle" fill="#f8f3e3" fontFamily="Arial" fontSize="11" letterSpacing="2">KIN</text></>}</svg>;
}

function BuildingArt({ office = false }: { office?: boolean }) {
  return <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="480" height="300" fill={office ? '#b6c2ad' : '#d8d6ce'}/><rect y="238" width="480" height="62" fill={office ? '#889d7c' : '#a8aa9f'}/><path d="M68 76h313v178H68Z" fill={office ? '#e9e7d7' : '#b7b7a8'}/><path d="m68 76 58-29h285l-30 29Z" fill="#f3f0e5"/><path d="m381 76 30-29v179l-30 28Z" fill="#858d81"/>{Array.from({length:7},(_,i)=><g key={i}><rect x={83+i*43} y="95" width="30" height="105" fill={office ? '#5b6e64' : '#56655e'}/><path d={`M${98+i*43} 95v105M${83+i*43} 147h30`} stroke="#d7d9cb" strokeWidth="2"/></g>)}<path d="M48 210h355v13H48Z" fill="#e3dfd0"/><path d="M55 224v31m338-31v31" stroke="#b8b8a4" strokeWidth="8"/><path d="m21 278 163-29h209l74 33" stroke="#d5d5be" strokeWidth="3"/><g fill={office ? '#445c3d' : '#66735b'}><circle cx="43" cy="195" r="32"/><circle cx="451" cy="207" r="38"/><circle cx="422" cy="225" r="29"/></g></svg>;
}

export function ProjectArt({ variant }: { variant: ProjectVariant }) {
  if (variant === 'still' || variant === 'sound') return <div className={`practical-art practical-art-${variant}`}><div className="practical-art-browser" aria-hidden="true"><i/><i/><i/><span>{variant === 'still' ? 'still.architecture' : 'mono.sound'}</span></div><div className="practical-art-masthead"><b>{variant === 'still' ? 'STILL / CASA FORMA' : 'MONO / SOUND'}</b><span>{variant === 'still' ? 'Space is a feeling.' : 'Sound. In its purest form.'}</span></div><img src={variant === 'still' ? '/images/demos/forma-house.webp' : '/images/demos/mono-graphite.webp'} alt="" style={{display:'block',width:'100%',height:'calc(100% - 64px)',objectFit:variant === 'still' ? 'cover' : 'contain'}}/></div>;
  return <div className={`practical-art practical-art-${variant}`}><div className="practical-art-browser" aria-hidden="true"><i/><i/><i/><span>{variant}.studio</span></div>{variant === 'kin' ? <><div className="practical-art-masthead"><b>KIN.</b><span>Made for the everyday.</span><span>SHOP ↗</span></div><div className="practical-art-product"><div><span>LESS TO CARRY. MORE TO KEEP.</span><strong>Carry the<br/><em>everyday.</em></strong><small>Considered essentials. Built to stay.</small></div><BagArt/></div><span className="practical-art-bottom">THE EVERYDAY COLLECTION / 01</span></> : variant === 'folio' ? <><div className="practical-art-masthead"><b>folio®</b><span>Make room for better.</span><span>GET STARTED ↗</span></div><strong className="practical-art-finance-title">Your money.<br/><em>In good company.</em></strong><div className="practical-art-dashboard"><div><span>YOUR BALANCE</span><b>$8,420.00</b><small>Everything in its right place.</small></div><div className="practical-art-bars">{[32,58,44,72,67,94,82].map((height,i)=><i key={i} style={{height:`${height}%`}}/>)}</div></div></> : variant === 'atlas' ? <><div className="practical-art-masthead"><b>atlas</b><span>A different way out.</span><span>EXPLORE ↗</span></div><strong className="practical-art-travel-title">Less planning.<br/><em>More getting lost.</em></strong><svg viewBox="0 0 480 200" className="practical-art-landscape" aria-hidden="true"><rect width="480" height="200" fill="#b8d3ce"/><circle cx="342" cy="46" r="22" fill="#e7e3ac"/><path d="m0 150 95-92 77 54 70-84 105 119 64-62 69 72v43H0Z" fill="#759788"/><path d="m0 182 141-77 116 63 86-51 137 63v20H0Z" fill="#3e6b60"/><path d="m220 200 37-44 22 4-20 40Z" fill="#d4c9a1"/></svg></> : <><div className="practical-art-masthead"><b>{variant === 'forma' ? 'FORMA' : 'mono /'}</b><span>{variant === 'forma' ? 'Better spaces. Better days.' : 'Architecture & interiors'}</span><span>VIEW WORK ↗</span></div><strong className="practical-art-space-title">{variant === 'forma' ? <>Room for<br/><em>what’s next.</em></> : <>Spaces with<br/><em>a point of view.</em></>}</strong><BuildingArt office={variant==='forma'}/></>}</div>;
}

export function PortraitArt({ variant }: { variant: 0 | 1 | 2 }) {
  const backgrounds = ['#b8c7ad','#b5bbd4','#d9bbaa'];
  const skin = ['#b77f5d','#d4ad8b','#8b5e48'];
  const hair = ['#3e352d','#343333','#332d2a'];
  return <svg viewBox="0 0 260 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="260" height="300" fill={backgrounds[variant]}/><circle cx="130" cy="125" r="87" fill="#f3eddf" opacity=".22"/><path d="M36 300q5-91 94-94t94 94Z" fill={['#3d5041','#525970','#8d4e42'][variant]}/><path d="M109 177h43v57q-21 19-43 0Z" fill={skin[variant]}/><ellipse cx="130" cy="130" rx="53" ry="67" fill={skin[variant]}/><path d={variant===1 ? 'M77 127q-19-86 55-88 69 5 52 88l-18-42-55 5-21 39Z' : 'M76 140Q39 40 122 38q99-2 65 117l-20-74q-36 40-78 15l-6 55Z'} fill={hair[variant]}/><g fill="#332d2a"><ellipse cx="111" cy="130" rx="3" ry="2.7"/><ellipse cx="150" cy="130" rx="3" ry="2.7"/></g><path d="m131 135-5 18h8m-18 13q15 11 30-2" stroke="#553e33" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="m91 235 38 30 37-32" stroke="#ffffff30" strokeWidth="2" fill="none"/></svg>;
}

const projectStories = {
  sound: { title: 'MONO / 01. Sound in its purest form.', category: 'Product design / Sound', overview: 'An original speaker concept built around a clear form, tactile materials, and useful choices. MONO is a fictional product design study; its prices and dimensions are example data.', approach: 'Graphite, Chalk, and Copper renders make each finish tangible. A close view reveals the machined volume dial, while model choices keep the current dimensions and price together. The selected configuration can be passed into a real product flow.', details: ['Three distinct finish renders', 'A detailed view of the precision dial', 'Model options with dimensions and price'] },
  still: { title: 'STILL / Casa Forma. Space is a feeling.', category: 'Architecture / Selected work', overview: 'A fictional coastal residence exploring how a frame can change our relationship with a place. Weathered concrete, a long panoramic window, and an open courtyard connect the interior to the horizon.', approach: 'The introduction moves from a narrow architectural detail to a panoramic view and a full scene. Typography, crop, and project information move together, while an ordinary link keeps the next step within reach.', details: ['An original architectural image study', 'Three coordinated viewing compositions', 'Native scrolling and a static reduced-motion layout'] },
  kin: { title: 'KIN. Essentials for the everyday.', category: 'E-commerce / Digital design', overview: 'A storefront for a small collection of thoughtfully made carry goods. The brief was to help people understand each product, find the right size, and buy with confidence.', approach: 'We brought product information closer to the imagery, simplified collection browsing, and gave each product room to tell its story.', details: ['A clear collection and product hierarchy', 'Useful exterior and interior product views', 'A responsive shopping experience with accessible controls'] },
  forma: { title: 'FORMA. Room for what’s next.', category: 'Brand identity / Website', overview: 'An independent workspace brand needed a clearer way to introduce its locations and the people who use them.', approach: 'A warm identity, an image-led location directory, and a straightforward enquiry path turn an abstract service into a place you can imagine yourself in.', details: ['A flexible visual identity', 'Location and amenity content that answers real questions', 'A direct path from discovery to an enquiry'] },
  folio: { title: 'Folio. Money in good company.', category: 'Product strategy / Interface design', overview: 'A finance product concept built around a simple question: can a daily money check feel clear and calm?', approach: 'We organized balances, recent activity, and upcoming commitments into a small set of readable views, with plain language throughout.', details: ['A consistent set of product components', 'Clear account and activity views', 'An onboarding flow that explains the next step'] },
  mono: { title: 'Mono. Spaces with a point of view.', category: 'Architecture / Portfolio website', overview: 'A project archive for an architecture practice, designed to make the work easy to explore without losing the detail behind each space.', approach: 'A concise project index leads into image-led case studies with location, scope, and material information kept close to the work.', details: ['A project index with immediate visual context', 'Case studies with useful project facts', 'A readable mobile portfolio'] },
  atlas: { title: 'Atlas. A different way out.', category: 'Travel / Digital product', overview: 'A travel planning concept that helps people move from a rough idea to a useful shortlist of places.', approach: 'We paired a clear search and filter system with a shared trip view, so planning can stay light without losing the essentials.', details: ['A focused destination discovery flow', 'A shared itinerary and shortlist', 'Flexible cards for places, stays, and activities'] },
};

const articleStories = {
  'article-1': { title: 'Designing for the next chapter', intro: 'A useful redesign starts with what the site needs to do next. A new look can help, but the first questions are about the audience, the content, and the decisions people need to make.', points: ['Start with a task: what should a visitor be able to finish?', 'Give each page one clear purpose and a sensible next step.', 'Keep successful content and improve the parts that create friction.'] },
  'article-2': { title: 'A useful website starts with a clear story', intro: 'Visitors need to understand what you offer before an interaction can add value. Clear headings, specific examples, and useful project details make a much stronger starting point than an effect on its own.', points: ['Name the service in words your audience uses.', 'Show work that demonstrates the result of that service.', 'Use motion to make a change of state easier to follow.'] },
  'article-3': { title: 'Why small details build trust', intro: 'A well-labeled button, a predictable focus state, and a form that explains an error are small details with practical value. They make a site feel considered because they help people continue.', points: ['Make links and buttons describe their result.', 'Keep keyboard and touch interactions as useful as pointer interactions.', 'Check the experience with real content and narrow screens.'] },
};

/** These example links open complete local stories without taking visitors out of the library. */
export function DemoStory({ children }: { children: ReactNode }) {
  const [story, setStory] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const project = story && story in projectStories ? projectStories[story as keyof typeof projectStories] : null;
  const article = story && story in articleStories ? articleStories[story as keyof typeof articleStories] : null;

  useEffect(() => {
    if (!story || !dialog.current) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!modal.open) modal.showModal();
    return () => {
      if (modal.open) modal.close();
      document.body.style.overflow = overflow;
      opener.current?.focus({preventScroll:true});
    };
  }, [story]);

  function openStory(event: MouseEvent<HTMLDivElement>) {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#demo-story-"]') : null;
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.hash.replace('#demo-story-', '');
    if (!(id in projectStories) && !(id in articleStories)) return;
    event.preventDefault();
    opener.current = link;
    setStory(id);
  }

  return <div className="practical-story-host" onClick={openStory}>{children}<dialog ref={dialog} className="practical-story-dialog" aria-label={project?.title ?? article?.title ?? 'Example story'} onCancel={event=>{event.preventDefault();setStory(null);}} onClose={()=>{if(!dialog.current?.open)setStory(null);}}><header><span>ANTICRAFT / {project ? 'EXAMPLE CASE STUDY' : 'EXAMPLE JOURNAL'}</span><button type="button" onClick={()=>setStory(null)}>Close <span aria-hidden="true">×</span></button></header><div className="practical-story-body">{project && <><span className="practical-story-kicker">{project.category}</span><h2>{project.title}</h2><div className="practical-story-art"><ProjectArt variant={story as ProjectVariant}/></div><h3>The brief</h3><p>{project.overview}</p><h3>The approach</h3><p>{project.approach}</p><ul>{project.details.map(detail=><li key={detail}>{detail}</li>)}</ul></>}{article && <><span className="practical-story-kicker">FIELD NOTES / DESIGN & STRATEGY</span><h2>{article.title}</h2><p>{article.intro}</p><h3>A few places to start</h3><ol>{article.points.map(point=><li key={point}>{point}</li>)}</ol><p>A good component is a useful starting point. The content and the care you bring to it make the experience yours.</p></>}<button className="practical-story-back" type="button" onClick={()=>setStory(null)}>Back to the collection ↗</button></div></dialog></div>;
}
