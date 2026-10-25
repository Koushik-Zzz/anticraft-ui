import Link from 'next/link';
import { Icon } from '@/components/site/icon';

export default function NotFound() {
  return <main id="main-content" className="not-found"><span className="eyebrow">404 / A LITTLE OFF COURSE</span><h1>This piece<br/><em>isn’t here.</em></h1><p>Let’s get you back to the good ingredients.</p><Link href="/components" className="primary-button">Explore the collection <Icon name="arrow" size={18}/></Link></main>;
}
