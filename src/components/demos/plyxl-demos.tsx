'use client';

import type { CSSProperties } from 'react';
import { AppCatalog, type AppCatalogItem } from '@/components/anticraft/AppCatalog';
import { IntegrationMarquee, type IntegrationMarqueeItem } from '@/components/anticraft/IntegrationMarquee';
import { AgentActivityWall, type AgentActivityItem } from '@/components/anticraft/AgentActivityWall';
import sheep from './plyxl-sheep-paths.json';
import './plyxl-demos.css';

const asset='/images/demos/plyxl/';
const logo=(id:string)=><img src={`${asset}${id}.svg`} alt="" width="36" height="36" loading="eager" decoding="async"/>;
const apps:AppCatalogItem[]=[
  ['jobs','Jobs','Plan the week and track work in progress.','board','#87b376','#081f00'],
  ['customers','Customers','Keep contacts, history and details together.','contact','#f4a594','#4c1b11'],
  ['quotes','Quotes','Build an estimate and send it for approval.','document','#e7d39e','#4e3c00'],
  ['invoices','Invoices','Send invoices and track outstanding payments.','invoice','#d5b970','#3a2b00'],
  ['bookkeeping','Bookkeeping','See income, expenses and account balances.','chart','#bda259','#201600'],
  ['bookings','Bookings','Manage appointments and team availability.','calendar','#db8c89','#300005'],
  ['tasks','Tasks','Assign work and see what’s next.','tasks','#89c2f9','#032f53'],
  ['inventory','Inventory','Track stock levels and reorder supplies.','package','#bee0b1','#29471b'],
  ['notes','Notes','Capture meeting notes and decisions.','chat','#a8dcff','#054363'],
].map(([id,title,description,symbol,color,iconColor])=>({id,title,description,color,iconColor,icon:<svg viewBox="0 0 48 48" aria-hidden="true" style={{'--ico-ink':'currentColor','--ico-tint':`color-mix(in srgb,currentColor 44%,${color})`} as CSSProperties}><use href={`${asset}app-icons.svg#${symbol}`}/></svg>}));

export function AppCatalogDemo(){return <div className="demo plyxl-demo plyxl-demo--apps"><AppCatalog items={apps} description="Ready-to-use apps for everyday work. Pick one and make it your own."/></div>;}

const rowData=[
  [['gmail','Gmail'],['googlesheets','Google Sheets'],['slack','Slack'],['quickbooks','QuickBooks'],['shopify','Shopify'],['airtable','Airtable'],['clickup','ClickUp'],['zoom','Zoom'],['excel','Excel'],['calendly','Calendly'],['zendesk','Zendesk'],['facebook','Facebook'],['canva','Canva'],['discord','Discord'],['freshbooks','FreshBooks'],['zoho','Zoho']],
  [['googlecalendar','Google Calendar'],['googledocs','Google Docs'],['hubspot','HubSpot'],['xero','Xero'],['square','Square'],['asana','Asana'],['jira','Jira'],['outlook','Outlook'],['one_drive','OneDrive'],['mailchimp','Mailchimp'],['whatsapp','WhatsApp'],['linkedin','LinkedIn'],['figma','Figma'],['miro','Miro'],['box','Box']],
  [['googledrive','Google Drive'],['googlemeet','Google Meet'],['salesforce','Salesforce'],['stripe','Stripe'],['notion','Notion'],['trello','Trello'],['linear','Linear'],['microsoft_teams','Microsoft Teams'],['dropbox','Dropbox'],['intercom','Intercom'],['instagram','Instagram'],['youtube','YouTube'],['github','GitHub'],['monday','Monday'],['todoist','Todoist']],
];
const rows:IntegrationMarqueeItem[][]=rowData.map(row=>row.map(([id,label])=>({id,label,logo:logo(id)})));
const connections=[
  {id:'quickbooks',name:'QuickBooks',detail:'Ridgeline HVAC Ltd. · 37 things it can do',logo:logo('quickbooks')},
  {id:'gmail',name:'Gmail',detail:'office@ridgeline.example · Inbox connected',logo:logo('gmail')},
  {id:'slack',name:'Slack',detail:'Ridgeline workspace · 12 channels',logo:logo('slack')},
  {id:'googlecalendar',name:'Google Calendar',detail:'Team schedule · 4 calendars',logo:logo('googlecalendar')},
];
export function IntegrationMarqueeDemo({paused=false}:{paused?:boolean}){return <div className="demo plyxl-demo plyxl-demo--integrations"><IntegrationMarquee rows={rows} connections={connections} paused={paused}/></div>;}

function Sheep({color}:{color:string}) {return <svg viewBox="418 206.8 334 334" aria-hidden="true" focusable="false"><path d={sheep.fleece} fill={color}/><g transform="translate(0 -14)"><path d={sheep.face} fill="#161616"/><path d="M531 393.5a14.1 14.1 0 1 0 28.2 0 14.1 14.1 0 1 0-28.2 0" fill="#fff"/><path d={sheep.wink} fill="#fff"/><path d={sheep.mouth} fill="#fff"/><path d={sheep.tongue} fill="#161616"/></g></svg>;}
const tones=[['#89c2f9','#032f53'],['#d5b970','#3a2b00'],['#c0a0df','#2a133d'],['#bee0b1','#29471b'],['#f4a594','#4c1b11']];
function activity(id:string,name:string,role:string,request:string,response:string,tone:number,tools:string[]):AgentActivityItem {const [color,mentionColor]=tones[tone];return {id,name,role,request,response,color,mentionColor,mention:'@Agent',avatar:<Sheep color={color}/>,tools:tools.map(id=>({id,label:rowData.flat().find(item=>item[0]===id)?.[1]??id,logo:logo(id)}))};}
const columns:AgentActivityItem[][]=[
  [activity('invoices','Priya','Office','Every Monday at 8, chase any invoice over 14 days late','Runs every Monday, and asks before sending',0,['quickbooks','gmail']),
   activity('reply','Jordan','Owner','Reply to Cedar Park and offer Thursday or Friday','Checked the calendar and drafted the reply',1,['gmail','googlecalendar']),
   activity('sheet','Priya','Office','Make me a sheet of every job we did for Cedar Park this year','Created the customer’s job history in a sheet',2,['googlesheets']),
   activity('dispatch','Sam','Dispatch','Find an available technician for tomorrow morning','Two technicians are free before 10am',3,['googlecalendar','slack'])],
  [activity('overdue','Jordan','Owner','Who owes us money, and who should I chase first?','Found $9,840 overdue and wrote three reminders',1,['quickbooks','gmail']),
   activity('numbers','Jordan','Owner','Post this week’s numbers in #office on Friday','Sales, costs and cash, posted every Friday at 5',2,['stripe','quickbooks','slack']),
   activity('contacts','Finn','Sales','Add everyone who booked through the website to HubSpot','Added 14 contacts, with their bookings',3,['calendly','hubspot']),
   activity('reschedule','Kayla','Technician','Check whether my afternoon appointment can move to Thursday','Found two open times on Thursday',4,['googlecalendar','gmail'])],
  [activity('quote','Kayla','Technician','What did we quote Harbourview for the rooftop unit?','Q-1031, $14,860. Raj has opened it twice',3,['gmail']),
   activity('arrival','Priya','Office','Email tomorrow’s customers their arrival window','Emailed nine customers, and logged every one',4,['googlecalendar','gmail']),
   activity('inbox','Jordan','Owner','Keep an eye on new enquiries and flag the urgent ones','Watching your inbox from now on',0,['gmail']),
   activity('meeting','Finn','Sales','Get the customer’s recent jobs ready for my next call','The job history and open quote are ready',1,['hubspot','gmail'])],
];
export function AgentActivityWallDemo({paused=false}:{paused?:boolean}){return <div className="demo plyxl-demo plyxl-demo--agents"><AgentActivityWall columns={columns} paused={paused}/></div>;}
