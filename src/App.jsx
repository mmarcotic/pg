import {React, use, useEffect, useRef, useState} from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css'
import WishlistItem from './components/WishlistItem';

function App() {
  const hasVotedFor = localStorage.getItem("hasVotedFor");
  const targetDate = new Date("January 9, 2026");
  const [hasVoted, setHasVoted] = useState(hasVotedFor ? true : false);
  const [currentVotes, setCurrentVotes] = useState([]);
  const [genderRatios, setGenderRatios] = useState([0, 0]);
  const [votersStr, setVotersStr] = useState("");
  const [displayedGenderRatios, setDisplayedGenderRatios] = useState(["", ""]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [treatsAte, setTreatsAte] = useState(0);
  const [moveByPerc, setMoveByPerc] = useState(11);
  const finalGender = "HOLKA!";
  const style = {color: "#ff90a1", textAlign:"center", textShadow: "1px  1px 2px black", fontSize:"6rem"};
  const buttonRef = useRef(null);
  const zoeRef = useRef(null);
  const [flyStyle, setFlyStyle] = useState(null);
  const [hearts, setHearts] = useState(false);
  const [heartsPos, setHeartsPos] = useState([]);

  const handleBoneClick = () => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const zoeRect = zoeRef.current.getBoundingClientRect();

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const endX = zoeRect.left + zoeRect.width / 2;
    const endY = zoeRect.top + zoeRect.height / 2;

    setHeartsPos([endX, endY])

    const style = {
      position: "fixed",
      left: startX + "px",
      top: startY + "px",
      transform: "translate(-50%, -50%)",
    };

    setFlyStyle(style);

    requestAnimationFrame(() => {
      setFlyStyle(prev => ({
        ...prev,
        transition: "all 0.8s ease-in-out",
        left: endX + "px",
        top: endY + "px",
        fontSize: "3rem"
      }));
    });

    setTimeout(() => {
      setFlyStyle(null);   
      setHearts(true);     
      setTimeout(() => setHearts(false), 1200); 
    }, 850);
  };

  const feedZoe = () => {
    handleBoneClick();
    setTimeout(() => {
      setTreatsAte(treatsAte + 1)
      if (treatsAte == 0) {
        setMoveByPerc(10);
      }
      else if (treatsAte < 4) {
        setMoveByPerc(10 - 2*treatsAte)
      } else {
        setMoveByPerc(0)
      }
    }, 850)
  }

  const vote = (gender) => {
    fetch("https://zgnui5vhq7.execute-api.eu-north-1.amazonaws.com/default/postBabyGender", {
      method: "POST",
      headers: {"Content-Type" : "text/plain"},
      body: gender
    }).catch((error) => console.error("Error incrementing votes", error))
    const ratios = calculatePercentage(currentVotes, gender)
    setDisplayedGenderRatios([`${Math.round(100*ratios[0])} %`,`${Math.round(100*ratios[1])} %`])
    localStorage.setItem("hasVotedFor", gender)
    setHasVoted(true)
  }

  useEffect(()=> {
    fetch("https://x5niwmx8d2.execute-api.eu-north-1.amazonaws.com/default/getBabyGenders")
    .then((response) => response.json())
    .then((data) => {
      setCurrentVotes(data.babyGenders)
      const ratios = calculatePercentage(data.babyGenders, null)
      if (hasVoted) {
        setDisplayedGenderRatios([`${Math.round(100*ratios[0])} %`,`${Math.round(100*ratios[1])} %`])
      }
    })
    .catch((error) => console.error('Error fetching baby genders:', error))
  }, [])

  useEffect(()=> {
    fetch("https://aumvec3uhg.execute-api.eu-north-1.amazonaws.com/default/getWishlist")
    .then((response) => response.json())
    .then((data) => {
      const sortedArray = Object.values(data).sort((a, b) => a.id - b.id);
      setWishlistItems(sortedArray)
      console.log(data)
    })
  }, [])

  const calculatePercentage = (babyGendersData, gender) => {
    const combinedVotes = babyGendersData[0].count + babyGendersData[1].count + (gender ? 1 : 0)
    var ratios = []
    if (gender == "girl") {
      ratios = combinedVotes == 0 ? [0,0] : [(babyGendersData[0].count + 1) / combinedVotes, babyGendersData[1].count / combinedVotes]
    } else if (gender == "boy") {
      ratios = combinedVotes == 0 ? [0,0] : [babyGendersData[0].count / combinedVotes, (babyGendersData[1].count + 1) / combinedVotes]
    } else {
      ratios = combinedVotes == 0 ? [0,0] : [babyGendersData[0].count / combinedVotes, babyGendersData[1].count / combinedVotes]
    }
    setGenderRatios(ratios)
    voters(combinedVotes)
    return ratios
  }

  const voters = (curVotesCnt) => {
    var myStr = ""
    if (curVotesCnt == 1) {
      myStr = "Hlasoval 1 člověk."
    } else if ([2, 3, 4].includes(curVotesCnt)) {
      myStr = `Hlasovali ${curVotesCnt} lidi.`
    } else {
      myStr = `Hlasovalo ${curVotesCnt} lidí.`
    }
    setVotersStr(myStr)
  }

  return (
    <div style={{width:"100%"}}>
    <div className='container'>
    <FlipClockCountdown to={targetDate}
    labels={['DNÍ', 'HODIN', 'MINUT', 'VTEŘIN']}
    className="flip-clock"
    separatorStyle={{color: "rgba(255,255,255,1)", size:"3px"}}
    digitBlockStyle={{width: 30, height: 45, fontSize: 25}}
    labelStyle={{fontSize: 15}}
    />
    <button ref={buttonRef} className='button reveal-button'onClick={() => feedZoe()}>🦴</button>
    {flyStyle && (
      <div style={flyStyle}>🦴</div>
    )}
    {hearts && (
      <div 
        className="hearts-container"
        style={{
          position: "fixed",
          left: heartsPos[0] + "px",
          top: heartsPos[1] - 50 + "px",
          transform: "translate(-50%, -50%)"
        }}
      >
        <span className="heart heart1">💙</span>
        <span className="heart heart2">🤍</span>
        <span className="heart heart3">❤️</span>
      </div>
    )}
    </div>
    <div className='rest-body' style={{transform: `translateY(-${moveByPerc}%)`}}>
    <div className='reveal'>
        <div className='reveal-card'>
          <p style={style}>{finalGender}</p>
          <p>...</p>
          <p>...</p>
          <p>TO</p>
          <p>JE</p>
        </div>
        <img ref={zoeRef} src="/zoe.png" className='reveal-img'></img>
        <p>Chceš konečně vědět, co to bude?</p>
        <p>Tak dej Zoince kost!</p>
        <p>Stačí párkrát stisknout tlačítko dole.</p>
        <br></br>
    </div>
    <div className='guess-gender'>
      <h2 className='title'>
        {hasVoted ? <div>
        Myslím, že {hasVotedFor == "boy" ? <span style={{color: "rgb(86, 213, 255)", textAlign:"center", textShadow: "1px  1px 2px black"}}>KLUK!</span> :
         <div style={{color: "#ff90a1", textAlign:"center", textShadow: "1px  1px 2px black"}}>HOLKA!</div>}
        </div> : <> Co to bude? </> }
      </h2>
      <div className='button-container'>
        <span className='button-span'>
          <button className='button' style={{
            background:hasVoted?`linear-gradient(to right, #a2e8ff ${100*genderRatios[1]}%,rgba(255, 255, 255, 0) ${100*genderRatios[1]}%)`:"#a2e8ff",
            opacity:hasVotedFor=="girl"? "20%" : "100%"
            }} onClick={() => {!hasVoted? vote("boy") : ()=>{}}}>
            {hasVoted ? <>
              {displayedGenderRatios[1]}
            </>:<>
              Kluk
            </>}
          </button>
        </span>
        <span className='button-span'>
          <button className='button' style={{
            background:hasVoted?`linear-gradient(to right, #ff90a1 ${100*genderRatios[0]}%,rgba(255, 255, 255, 0) ${100*genderRatios[0]}%)`:"#ff90a1",
            opacity:hasVotedFor=="boy"? "20%" : "100%"
            }} onClick={() => {!hasVoted? vote("girl"): ()=>{}}}>
            {hasVoted ? <>
              {displayedGenderRatios[0]}
            </>:<>
              Holka
            </>}
          </button>
        </span>
      </div>
      <h3 className='title' style={{fontSize: "1.5rem", margin: 0}}>
          {votersStr ? votersStr : ""}
      </h3>
    </div>
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
