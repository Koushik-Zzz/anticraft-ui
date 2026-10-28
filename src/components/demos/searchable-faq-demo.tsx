'use client';

import { SearchableFAQ } from '@/components/anticraft/SearchableFAQ';
import './searchable-faq-demo.css';

export function SearchableFAQDemo() {
  return <div className="demo practical-demo searchable-faq-demo"><SearchableFAQ title="Customer support" defaultOpenId="dispatch" items={[
    { id:'dispatch', category:'Orders', question:'When will my order arrive?', answer:'Orders dispatch within two working days. Standard delivery takes another three to five working days.', keywords:['shipping','delivery'] },
    { id:'international', category:'Orders', question:'Do you ship internationally?', answer:'Delivery is available within the UK and EU. Shipping costs are shown before checkout.' },
    { id:'returns', category:'Returns', question:'Can I return an item?', answer:'Unused items can be returned within 30 days. Keep the original packaging and your order number.', keywords:['refund'] },
    { id:'care', category:'Care', question:'Are the ceramics dishwasher safe?', answer:'The glazed stoneware is dishwasher safe. Hand-wash pieces with an unglazed finish.' },
  ]}/></div>;
}
