function connectWS() {
  window.ws_back_off = window.ws_back_off || 1000;
  // just in case we forget to build before pushing to github
  if (location.host !== "localhost:8000") return;
  window.addEventListener("load", (event) => {
    const page = localStorage.getItem("zwc-scroll-path");
    const sTop = localStorage.getItem("zwc-scroll-top");
    if (page === null || sTop === null || page !== location.pathname) return;
    setTimeout(() => {
      location.hash = "";
      document
        .querySelector("#scroll-div")
        .scrollTo({ top: sTop, left: 0, behavior: "instant" });
    }, 100);
  });
  console.log("Attempting Connection to Websocket Server...");
  const ws = new WebSocket("ws://localhost:8000/");
  setTimeout(() => {
    if (ws.readyState === ws.CONNECTING) {
      // 1 second timeout
      ws.close();
    }
  }, window.ws_back_off);

  ws.onerror = function (err) {
    console.log("Websocket connection error", err);
  };

  ws.onopen = function () {
    console.log("Websocket connection opened");
  };

  ws.onclose = function () {
    console.log("Websocket connection closed", window.ws_back_off);
    window.ws_back_off += 1000 * 10; // add 10 seconds
    connectWS();
  };

  ws.onmessage = function (event) {
    const msg = event.data;
    if (window.ws_message === undefined) window.ws_message = msg;
    if (msg !== window.ws_message) {
      localStorage.setItem("zwc-scroll-path", location.pathname);
      localStorage.setItem(
        "zwc-scroll-top",
        document.querySelector("#scroll-div").scrollTop
      );
      location.hash = "";
      setTimeout(() => {
        location.reload();
      }, 100);
    }
    console.log("ws heartbeat", msg);
  };
}

connectWS();
