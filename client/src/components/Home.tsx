import { Cursor } from "./Cursor";
import useWebSocket from "react-use-websocket";
import { useEffect, useRef } from "react";
import throttle from "lodash.throttle";

type UserType = {
  username: string,
  state: {
    x: number;
    y: number;
  }
  uuid: string;
}

const renderCursors = (users: UserType[]) => {
  return Object.keys(users).map((uuid: any) => {
    const user = users[uuid]
    return (
      <Cursor 
        key={uuid} 
        userId={uuid}
        point={[user.state.x, user.state.y]}  
      />
    )
  })
}

const renderUsersList = (users: UserType[]) => {
  return (
    <ul>
      {Object.keys(users).map((uuid: any) => {
        return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
      })}
    </ul>
  )
}

export function Home({ username }: { username: string}) {
  // Url of out back-end
  const WS_URL = `ws://127.0.0.1:8000`;
  // Set the webSocket connection
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<UserType[]>(WS_URL, {
    share: true, // Allow use webSocket weherver in this app
    queryParams: { username }, // Give `username` as parameter in the url
  });

  // Throttling of requests
  const THROTTLE = 50;
  // Function with throttling
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  // Connect to the back-end by mounting this page
  useEffect(() => {
    // Send intially corrs of cursor
    sendJsonMessage({
      x: 0,
      y: 0,
    });
    // Add event listener for tracking cursor position
    window.addEventListener("mousemove", (e) => {
      sendJsonMessageThrottled.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, []);

  if (lastJsonMessage) {
    return (
      <>
        <div>
          <h1>Online users:</h1>
          {renderUsersList(lastJsonMessage)}
        </div>
        {renderCursors(lastJsonMessage)}
      </>
    );
  }
};
