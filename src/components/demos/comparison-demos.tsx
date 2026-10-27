'use client';

import { FeatureComparison } from '@/components/anticraft/FeatureComparison';
import './comparison-demos.css';

export function FeatureComparisonDemo() {
  return <div className="demo website-demo comparison-demo"><div className="comparison-demo-masthead"><strong>folio<span>®</span></strong><span>A LITTLE MORE ROOM FOR GOOD WORK.</span></div><FeatureComparison
    eyebrow="YOUR TEAM. YOUR PACE."
    title={'Good work.\nRoom to grow.'}
    description="One shared home for your projects, notes, and next steps. Find the right amount of room for the way you work."
    defaultProductIds={['independent','studio']}
    products={[
      {id:'independent',name:'Independent',description:'A focused space for your own practice.',price:'$12',priceNote:'/ person / month',href:'#folio-independent',actionLabel:'Meet Independent'},
      {id:'studio',name:'Studio',description:'Bring the whole team into the picture.',badge:'A little more room',price:'$24',priceNote:'/ person / month',href:'#folio-studio',actionLabel:'Meet Studio'},
      {id:'collective',name:'Collective',description:'A connected home for growing teams.',price:'$40',priceNote:'/ person / month',href:'#folio-collective',actionLabel:'Meet Collective'},
    ]}
    features={[
      {id:'projects',group:'Make room for the work',label:'Active projects',values:{independent:'10 projects',studio:'Unlimited',collective:'Unlimited'}},
      {id:'storage',group:'Make room for the work',label:'File storage',description:'Room for the details that make the difference.',values:{independent:'25 GB',studio:'250 GB',collective:'1 TB'}},
      {id:'notes',group:'Make room for the work',label:'Notes & documents',values:{independent:true,studio:true,collective:true}},
      {id:'guests',group:'Better, together',label:'Client guests',values:{independent:'3 guests',studio:'25 guests',collective:'Unlimited'}},
      {id:'approvals',group:'Better, together',label:'Review & approval',values:{independent:false,studio:true,collective:true}},
      {id:'history',group:'Peace of mind',label:'Version history',values:{independent:'30 days',studio:'1 year',collective:'Unlimited'}},
      {id:'export',group:'Peace of mind',label:'Export your work',values:{independent:true,studio:true,collective:true}},
      {id:'sso',group:'Peace of mind',label:'Single sign-on',values:{independent:false,studio:false,collective:true}},
    ]}
  /><div className="comparison-demo-plan-notes" aria-label="About the example plans"><p>FIND YOUR NEXT CHAPTER <span aria-hidden="true">↙</span></p><div>{[
    {id:'independent',name:'For your own practice.',text:'Independent keeps project notes, files, and a small circle of collaborators together. Designed for freelancers and solo studios.'},
    {id:'studio',name:'For the work you share.',text:'Studio gives your team room to collaborate with clients, review work, and revisit earlier decisions. Built for a growing creative practice.'},
    {id:'collective',name:'For the bigger picture.',text:'Collective brings larger teams together with more storage, unlimited guests, and single sign-on. Built for a shared way of working.'},
  ].map(plan=><section id={`folio-${plan.id}`} key={plan.id} tabIndex={-1}><span>{plan.id}</span><h3>{plan.name}</h3><p>{plan.text}</p></section>)}</div><small>Fictional workspace and example plan data. No signup or payment is collected.</small></div></div>;
}
