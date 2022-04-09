function connectWS() {
  // just in case we forget to build before pushing to github
  if (location.host !== "localhost:8000") return;
  console.log("Attempting Connection to Websocket Server...");
  const ws = new WebSocket("ws://localhost:8000/");
  setTimeout(() => {
    if (ws.readyState === ws.CONNECTING) {
      // 1 second timeout
      ws.close();
    }
  }, 1000);
  ws.onerror = function (err) {
    console.log("Websocket connection error", err);
  };
  ws.onopen = function () {
    console.log("Websocket connection opened");
  };
  ws.onclose = function () {
    console.log("Websocket connection closed", window.ws_back_off);
    connectWS();
  };
  ws.onmessage = function (event) {
    const msg = event.data;
    if (window.ws_message === undefined) window.ws_message = msg;
    if (msg !== window.ws_message) location.reload();
    console.log("ws heartbeat", msg);
  };
}

connectWS();