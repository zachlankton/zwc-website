(async function () {
  const textElm = document.getElementById("contact_me_message");
  textElm.addEventListener("keyup", function (ev) {
    const lastEleven = textElm.value.slice(-11);
    if (lastEleven === "SEND EMAIL\n") {
      textElm.setAttribute("disabled", "");
      textElm.value += "\n Sending Email...";
      textElm.scrollTo(0, 999999999);
      send(textElm.value);
    }
  });

  async function send(message) {
    const results = await fetch("/api/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ from_user: "user", message }),
    });
    const jsonData = await results.json();
    const jsonText = JSON.stringify(jsonData, null, "\t");
    textElm.value += `\n\n${jsonText}`;
    if (jsonData.statusText === "Accepted") {
      textElm.value += `\n Email Sent Successfully! I will get back to you as soon as I can!`;
    } else {
      textElm.value += `\n\n Hmmm... something went wrong... if you really need to reach me try my twitter!`;
    }
    textElm.scrollTo(0, 999999999);
  }
})();
