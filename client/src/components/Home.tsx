import useWebSocket from "react-use-websocket";
import React, { useEffect, useRef } from "react";
import throttle from "lodash.throttle"

interface HomeProps {
  username: string;
}

export const Home = ({ username }: HomeProps) => {
  // Url to the web socket connection on our back-end
  const WS_URL = "ws://127.0.0.1:8000"; 

  // * Function for connection to the back-end nad and login
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
    share: true, // Allow us to use useWebSocket wherever in out app
  });

  // ms for sending cursor cors 
  const THROTTLE = 50 
  
  // * Function with throttling for optimization performance of our app
  const sendJsonMessageThrottle = useRef(throttle(sendJsonMessage, THROTTLE))

  // Start the next function as this page is rendered
  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y: 0,
    });

    // * add event listener for tracking cursor position 
    // * and send it to the back-end 
    window.addEventListener('mousemove', (e: MouseEvent) => {
      sendJsonMessageThrottle.current({
        x: e.clientX,
        y: e.clientY,
      })
    })
  }, []);

  return <div></div>;
};
