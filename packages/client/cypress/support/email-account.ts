/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable func-names */
// @ts-nocheck
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
    authTimeout: 60000,
  };

  const userEmail = {
    email: testAccount.user,
    async getLastEmail() {
      return new Promise<undefined | { from: string; subject: string; textAsHtml: string; text: string }>((resolve, reject) => {
        try {
          const imap = new Imap(imapConfig);
          imap.once("ready", () => {
            imap.openBox("INBOX", false, () => {
              imap.search(["UNSEEN", ["SINCE", new Date()]], (err: any, results: any) => {
                if (err) {
                  resolve(null);
                  return null;
                }
                if (!results || !results.length) {
                  resolve(null);
                  return null;
                }
                const f = imap.fetch(results, { bodies: "" });
                f.on("message", (msg) => {
                  msg.on("body", (stream) => {
                    simpleParser(stream, async (err, parsed) => {
                      if (err) {
                        resolve(null);
                        return null;
                      }
                      console.log("parsed subject: ", parsed.subject);
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
                  resolve(null);
                  return null;
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
            resolve(null);
            return null;
          });

          imap.once("end", () => {
            console.log("Connection ended");
            resolve(null);
            return null;
          });

          imap.connect();
        } catch (ex) {
          console.log("an error occurred");
          resolve(null);
          // eslint-disable-next-line no-promise-executor-return
          return null;
        }
      });
    },
  };

  return userEmail;
}
