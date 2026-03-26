import React, { useState, useEffect } from "react";
import RSVPModal from "./RSVPModal";
import { rsvpApi } from "../api/rsvp-api";

const RSVPTrigger = ({ guestName, side, shortId, isOpened }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isGuest = !!(guestName || shortId);
    if (!isGuest || !isOpened) return;

    const sessionShown = sessionStorage.getItem("rsvp_popup_shown");
    const sessionDone = sessionStorage.getItem("rsvp_done");
    if (sessionShown || sessionDone) return;

    let cancelled = false;

    const checkAndShow = async () => {
      if (shortId) {
        try {
          const result = await rsvpApi.checkStatus(shortId);
          if (result.hasResponded) return;
        } catch (e) {
          // If API fails, fall through and show popup
        }
      }

      if (cancelled) return;

      const delay = Math.floor(Math.random() * 5000) + 5000;
      setTimeout(() => {
        if (!cancelled) {
          setShowModal(true);
          sessionStorage.setItem("rsvp_popup_shown", "true");
        }
      }, delay);
    };

    checkAndShow();
    return () => { cancelled = true; };
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
