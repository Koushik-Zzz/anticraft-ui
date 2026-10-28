import type { ComponentDefinition } from './catalog';

export const faqComponents: ComponentDefinition[] = [{
  slug:'searchable-faq', title:'Searchable FAQ', category:'Sections', tag:'New',
  description:'Filter questions by search or category, then expand an answer.',
  file:'SearchableFAQ.tsx', cssFile:'searchable-faq.css',
  usage:`import { SearchableFAQ } from '@/components/anticraft/SearchableFAQ';

export function Example() {
  return <SearchableFAQ
    title="Customer support"
    items={[
      { id: 'shipping', category: 'Orders', question: 'When will my order arrive?', answer: 'Orders dispatch within two working days. Standard delivery takes another three to five working days.', keywords: ['delivery'] },
      { id: 'returns', category: 'Returns', question: 'Can I return an item?', answer: 'Unused items can be returned within 30 days.' },
    ]}
  />;
}`,
  props:[
    {name:'items',type:'SearchableFAQItem[]',default:'Required',description:'Unique id, question and plain-text answer; optional category and keywords. Search matches question, answer and keywords without case sensitivity. Newlines in answers are preserved.'},
    {name:'title',type:'string',default:"'Questions & answers'",description:'Section heading. An empty string hides it while preserving the accessible section name.'},
    {name:'searchPlaceholder',type:'string',default:"'Search questions…'",description:'Placeholder text. The input retains a separate accessible label.'},
    {name:'defaultOpenId',type:'string',default:'undefined',description:'Initially expanded question. Unknown or removed ids show no open answer. At most one question is open.'},
    {name:'onOpenChange',type:'(id: string | null) => void',default:'undefined',description:'Called for a question toggle or when filtering closes an open answer. Data changes do not notify. Use a Client Component to supply this callback in Next.js.'},
    {name:'className',type:'string',default:"''",description:'Additional classes. Customize --ac-faq-ink, --ac-faq-muted, --ac-faq-line, --ac-faq-surface and --ac-faq-accent.'},
  ],
  motion:'Tab reaches search, category filters and question buttons. Enter or Space toggles an answer; Up/Down and Home/End move between visible question buttons. Filtering closes the open answer and announces the result count. Reduced motion removes entry and icon transitions.',
}];
