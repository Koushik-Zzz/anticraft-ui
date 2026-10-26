'use client';

import { useState } from 'react';
import { SplitFlap } from '@/components/anticraft/SplitFlap';
import './flap-demo.css';

const departures = [
  { label: 'Stay curious', text: 'STAY\nCURIOUS', code: 'AC 001' },
  { label: 'Make waves', text: 'MAKE\nWAVES', code: 'AC 002' },
  { label: 'Go explore', text: 'GO\nEXPLORE', code: 'AC 003' },
];

export function SplitFlapDemo() {
  const [selected, setSelected] = useState(0);
  const departure = departures[selected];

  return <div className="demo flap-demo">
    <div className="flap-demo-masthead"><span>ANTICRAFT<br /><strong>DEPARTURES</strong></span><span className="flap-demo-ticket">OPEN TICKETS <i aria-hidden="true" /></span></div>
    <div className="flap-demo-route"><span>HERE</span><span aria-hidden="true">⟶</span><span>SOMEWHERE GOOD</span></div>
    <div className="flap-demo-board"><span className="flap-demo-board-label">NEXT DESTINATION <span>{departure.code}</span></span><SplitFlap text={departure.text} label="Next departure" /><span className="flap-demo-board-foot">ALL GREAT THINGS BEGIN WITH GOING.</span></div>
    <div className="flap-demo-choices" role="group" aria-label="Choose your next departure">{departures.map((item, index) => <button type="button" key={item.code} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}<span aria-hidden="true">↗</span></button>)}</div>
    <span className="flap-demo-footer">NEXT DEPARTURE: WHENEVER YOU’RE READY.</span>
    <span className="flap-demo-status" role="status">Selected departure: {departure.label}.</span>
  </div>;
}
