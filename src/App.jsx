import React from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css'

function App() {
  // Set your target date here:
  const targetDate = new Date("January 8, 2026"); // 1 day + 5 minutes from now

  return (
    <div style={{width:"100%", overflowX: "hidden"}}>
    <div className='container'>
    <FlipClockCountdown to={targetDate}
    labels={['DNÍ', 'HODIN', 'MINUT', 'VTEŘIN']}
    className="flip-clock"
    separatorStyle={{color: "rgba(0,0,0,0)", size:"0px"}}
    />
    </div>
    </div>
  );
}

export default App;
