/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable func-names */
const nodemailer = require("nodemailer");
const Imap = require("imap");
const simpleParser = require("mailparser").simpleParser;

export async function makeEmailAccount() {
  const testAccount = await nodemailer.createTestAccount();
  // use testAccount.user and testAccount.pass
  // to log in into the email inbox
  const imapConfig = {
    user: testAccount.user,
    password: testAccount.pass,
    host: "imap.ethereal.email",
    port: 993,
    tls: true,
    authTimeout: 10000,
  };

  const userEmail = {
    email: testAccount.user,
    async getLastEmail() {
      return new Promise<undefined | { from: string; subject: string; textAsHtml: string; text: string }>((resolve, reject) => {
        console.log("line 25");
        try {
          const imap = new Imap(imapConfig);
          imap.once("ready", () => {
            imap.openBox("INBOX", false, () => {
              imap.search(["UNSEEN", ["SINCE", new Date()]], (err, results) => {
                if (!results || !results.length) resolve(null);
                if (err) resolve(null);
                if (!results || !results.length) return null;
                const f = imap.fetch(results, { bodies: "" });
                f.on("message", (msg) => {
                  console.log("line42", f);
                  msg.on("body", (stream) => {
                    simpleParser(stream, async (err, parsed) => {
                      if (err) resolve(null);
                      resolve(parsed); // const {from, subject, textAsHtml, text} = parsed;
                    });
                  });
                  msg.once("attributes", (attrs) => {
                    const { uid } = attrs;
                    imap.addFlags(uid, ["\\Seen"], () => {
                      console.log("Marked as read!");
                    });
                  });
                });
                f.once("error", (error) => {
                  console.error(error);
                  return resolve(null);
                });
                f.once("end", () => {
                  console.log("Done fetching all messages!");
                  imap.end();
                });
              });
            });
          });

          imap.once("error", (err) => {
            console.error(err);
            return resolve(null);
          });

          imap.once("end", () => console.log("Connection ended"));

          imap.connect();
        } catch (ex) {
          console.log("an error occurred");
          resolve(null);
          // return null;
        }
      });
    },
  };

  return userEmail;
}
