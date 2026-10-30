import {React, use, useEffect, useRef, useState} from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css'
import WishlistItem from './components/WishlistItem';

function App() {
  const targetDate = new Date("December 29, 2026");
  const targetDateXmas = new Date("December 24, 2026");
  const [displayedGenderRatios, setDisplayedGenderRatios] = useState(["", ""]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const style = {color: "#ff90a1", textAlign:"center", textShadow: "1px  1px 2px black", fontSize:"6rem"};

  useEffect(()=> {
    fetch("https://aumvec3uhg.execute-api.eu-north-1.amazonaws.com/default/getWishlist")
    .then((response) => response.json())
    .then((data) => {
      const sortedArray = Object.values(data).sort((a, b) => a.id - b.id);
      setWishlistItems(sortedArray)
      console.log(data)
    })
  }, [])

  return (
    <div style={{width:"100%"}}>
    <div className='container'>
    <div className='flip-clock'>
          <div style={{display: "flex", flexDirection: "row"}}>
    <p style={{transform: "translateY(-10px)", paddingRight:"5px"}}>🎄</p>
    <FlipClockCountdown to={targetDateXmas}
    labels={['DNÍ', 'HODIN', 'MINUT', 'VTEŘIN']}
    separatorStyle={{color: "rgba(255,255,255,1)", size:"3px"}}
    digitBlockStyle={{width: 28, height: 45, fontSize: 25}}
    labelStyle={{fontSize: 15}}
    />
    </div>
      <div style={{display: "flex", flexDirection: "row"}}>
      <p style={{transform: "translateY(-10px)", paddingRight:"5px"}}>🎂</p>
    <FlipClockCountdown to={targetDate}
    labels={['DNÍ', 'HODIN', 'MINUT', 'VTEŘIN']}
    separatorStyle={{color: "rgba(255,255,255,1)", size:"3px"}}
    digitBlockStyle={{width: 28, height: 45, fontSize: 25}}
    labelStyle={{fontSize: 15}}
    />
    </div>
    </div>
    </div>
    <div className='rest-body'>
    <div className='wishlist'>
      <h2 className='title'>Seznam přání</h2>
      {
        wishlistItems.map((item) => (
            <WishlistItem payload={{id:item.id, title:item.title, href:item.href, reservedBy:item.reservedBy}} key={item.id}></WishlistItem>
        ))
      }
    </div>
    </div>
    </div>
  );
}

export default App;
