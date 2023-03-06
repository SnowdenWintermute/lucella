import * as DOMPurify from "dompurify";

export default function replaceUrlsWithAnchorTags(string: string, className: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g; // Matches any URL starting with http:// or https://
  const sanitized = DOMPurify.sanitize(string, { ALLOWED_TAGS: ["#text"] });
  return sanitized.replace(urlRegex, (url) => `<a style="text-decoration: underline;" class="${className}" href="${url}" target="_blank">${url}</a>`);
}
