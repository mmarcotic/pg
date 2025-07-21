import {React, use, useEffect, useState} from 'react';
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
  const [displayedGenderRatios, setDisplayedGenderRatios] = useState(["", ""])
  const [wishlistItems, setWishlistItems] = useState([])

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
    </div>
    <div className='rest-body'>
    <div className='guess-gender'>
      <h2 className='title'>
        {hasVoted ? <>
        Myslím, že {hasVotedFor == "boy" ? <span style={{color: "rgb(86, 213, 255)", marginLeft:"0.5rem", marginRight:"0.2rem", textShadow: "1px  1px 2px black"}}>KLUK</span> :
         <div style={{color: "#ff90a1", marginLeft:"0.5rem", marginRight:"0.2rem", textShadow: "1px  1px 2px black"}}>HOLKA</div>}!
        </> : <> Co to bude? </>}
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
