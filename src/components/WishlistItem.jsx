import { use, useState, useEffect } from 'react';
import Modal from './Modal';
import '../App.css';
import NotificationComponent from './Notification';

function WishlistItem(payload) {
    let [isModalOpen, setIsModalOpen] = useState(false);
    let [nickname, setNickname] = useState("");
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [color, setColor] = useState('#a4ebb5');
    // payload in form of {id, title, href, reservedBy}
    const pl = payload.payload
    const id = pl.id
    const title = pl.title
    const href = pl.href
    let [reservedBy, setReservedBy] = useState(pl.reservedBy ? pl.reservedBy : "");

    const reserveItem = () => {
        fetch("https://aumvec3uhg.execute-api.eu-north-1.amazonaws.com/default/getWishlist")
            .then((response) => response.json())
            .then((data) => {
            const wishlistItem = Object.values(data).find(item => item.id == id)
            setVisible(true);
            setTimeout(() => setVisible(false), 5000)
            if (wishlistItem.reservedBy == "") {
                setColor("#a4ebb5")
                setMessage("Rezervováno!");
                fetch("https://gjfbb0tle7.execute-api.eu-north-1.amazonaws.com/default/postWishlist", {
                    method: "POST",
                    headers: {"Content-Type" : "text/plain"},
                    body: `${id},${href},${nickname},${title}`
                }).catch((error) => console.error("Error reserving item", error))      
                setReservedBy(nickname);
                setIsModalOpen(false);
            } else {
                setColor("#f5b0b6");
                setMessage("Někdo tě bohužel předběhl.");
                setIsModalOpen(false);
                setReservedBy(wishlistItem.reservedBy);
                return
            }  
        })
    }
    
    const handleChange = (e) => {
      setNickname(e.target.value);
    }

    return (
        <>
        <div className='wishlist-item' id={id}>
            <h3 className='title' style={{fontSize: "1.5rem", marginBottom: "1rem"}}>
                {title}
            </h3>
            <div>
                <a href={href}>
                    <button className="button" style={{background: "#D8E2DC"}}>Odkaz</button>
                </a>
                <button className="button" style={reservedBy ? {background: "#D8E2DC", opacity: "20%"}: {background: "#D8E2DC"}} onClick={reservedBy ? ()=>{} : ()=>setIsModalOpen(true)}>{reservedBy? "Zabráno!" : "Zabírám!"}</button>
                <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}>
                    <h2 className="title">Tvoje jméno</h2>
                    <input className="input" placeholder='např. Zoe a Madlenka' onChange={handleChange}></input>
                    <button className='button' style={{background: "transparent", paddingTop: "0.5rem", paddingBottom:"0.5rem", borderRadius:"0.5rem"}} onClick={reserveItem}>Potvrdit</button>
                </Modal>
                {reservedBy ? <p className='title' style={{fontSize: "1.1rem", margin: 0}}>Kupuje <b style={{marginLeft:"0.25rem"}}>{reservedBy}</b></p> : <></>}
                <NotificationComponent visible={visible} message={message} color={color}/>
            </div>
        </div>
        </>
    )
}

export default WishlistItem;