export async function onRequest(context) {
  const { request } = context;
  const jsonData = {};

  if (request.method == "POST") {
    const jData = await request.json();
    jsonData.from_user = jData.from_user;
    jsonData.message = jData.message;
  }
  console.log(jsonData);

  let send_request = new Request("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",

    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: process.env.to_email,
              name: process.env.to_email_name,
            },
          ],
        },
      ],
      from: {
        email: process.env.from_email,
        name: process.env.from_email_name,
      },
      subject: "A MESSAGE FROM " + jsonData.from_user,
      content: [
        {
          type: "text/plain",
          value: jsonData.message,
        },
      ],
    }),
  });

  let respContent = "";

  // only send the mail on "POST", to avoid spiders, etc.

  if (request.method == "POST") {
    const resp = await fetch(send_request);
    const respText = await resp.text();
    respContent = JSON.stringify({
      statusCode: resp.status,
      statusText: resp.statusText,
    });
  }

  let jsonContent = respContent || `{"err": "Error/Unknown"}`;

  return new Response(jsonContent, {
    headers: { "content-type": "application/json" },
  });
}
