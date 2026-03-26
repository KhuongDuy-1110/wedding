import React, { useState, useEffect } from "react";
import RSVPModal from "./RSVPModal";

const RSVPTrigger = ({ guestName, side, shortId, isOpened }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only show if it's a guest, invitation is opened, and has NOT been shown in this session
    const hasBeenShown = sessionStorage.getItem("rsvp_popup_shown");
    const isRSVPDone = sessionStorage.getItem("rsvp_done");
    
    // Check if we have guest identifying info
    const isGuest = !!(guestName || shortId);

    if (isGuest && isOpened && !hasBeenShown && !isRSVPDone) {
      const delay = Math.floor(Math.random() * 5000) + 5000;
      
      const timer = setTimeout(() => {
        setShowModal(true);
        sessionStorage.setItem("rsvp_popup_shown", "true");
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [guestName, shortId, isOpened]);

  return (
    <RSVPModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)} 
      guestName={guestName} 
      side={side}
      shortId={shortId}
    />
  );
};

export default RSVPTrigger;
