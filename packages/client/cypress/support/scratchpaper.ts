const imap = bluebird.promisifyAll(new Imap(imapConfig));

console.log("created new email account %s", testAccount.user);
console.log("for debugging, the password is %s", testAccount.pass);

function processMessage(msg, seqno) {
  return new Promise((resolve, reject) => {
    console.log(`Processing msg #${seqno}`);
    // console.log(msg);

    const parser = new MailParser();
    parser.on("headers", function (headers) {
      console.log(`Header: ${JSON.stringify(headers)}`);
    });
    const parsed = {
      subject: "",
      html: "",
      text: "",
    };
    parser.on("data", (data) => {
      if (data.type === "text") {
        parsed.text = data.text;
        parsed.html = data.html;
        parsed.subject = data.subject || undefined;
        resolve(parsed);
      }

      // if (data.type === 'attachment') {
      //     console.log(data.filename);
      //     data.content.pipe(process.stdout);
      //     // data.content.on('end', () => data.release());
      // }
    });

    msg.on("body", function (stream) {
      stream.on("data", function (chunk) {
        parser.write(chunk.toString("utf8"));
      });
    });
    msg.once("end", function () {
      parser.end();
    });
  });
}

return {
  email: testAccount.user,
  async getLastEmail() {
    let emailToReturn;

    function openInbox(cb) {
      imap.openBox("INBOX", true, cb);
    }

    imap.once("ready", async function () {
      await openInboxAsync(function (err, box) {
        if (err) console.error(err);
        imap.search(["UNSEEN"], function (err, results) {
          if (!results || !results.length) {
            console.log("No unread mails");
            imap.end();
            resolve(undefined);
          }
          // mark as seen
          imap.setFlags(results, ["\\Seen"], function (err) {
            if (!err) console.log("marked as read");
            else console.log(JSON.stringify(err, null, 2));
          });

          const f = imap.fetch(results, { bodies: "" });
          f.on("message", async function (msg, seqno) {
            emailToReturn = await processMessage(msg, seqno);
            // console.log("emailToReturn: ", emailToReturn);
            resolve(emailToReturn);
          });
          f.once("error", function (err) {
            reject(err);
          });
          f.once("end", function () {
            console.log("Done fetching all unseen messages.");
            imap.end();
            resolve(emailToReturn);
          });
        });
      });
    });

    imap.once("error", function (err) {
      console.log(err);
    });

    imap.once("end", function () {
      console.log("Connection ended");
    });

    imap.connect();
  },
};

console.log("getting the last email");

try {
  console.log("connecting to imap");
  const connection = await imaps.connect(imapConfig);
  console.log("connected to imap");
  await connection.openBox("INBOX");
  console.log("inbox connected");
  const searchCriteria = ["1:1"];
  const fetchOptions = {
    bodies: [""],
  };
  const messages = await connection.search(searchCriteria, fetchOptions);
  console.log("messages: ", messages);
  // and close the connection to avoid it hanging
  connection.end();

  if (!messages.length) {
    console.log("cannot find any emails");
    return null;
  }
  console.log("there are %d messages", messages.length);
  // grab the last email
  const mail = await simpleParser(messages[messages.length - 1].parts[0].body);
  console.log(mail.subject);
  console.log(mail.text);

  // and returns the main fields
  return {
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  };
} catch (e) {
  console.error(e);
  return null;
}
