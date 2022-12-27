import { AuthRoutePaths } from "../../../../../common";

const rootUrl = process.env.NODE_ENV === "development" ? process.env.EMAIL_ROOT_URL_DEV : process.env.EMAIL_ROOT_URL;
const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

export function buildPasswordResetHTML(passwordResetToken: string) {
  const output = `
    <p>Someone (hopefully you) has requested a password reset for your account at Lucella. Follow the link to reset your password.</p>
    <p>
        <a href="${protocol}://${rootUrl}${AuthRoutePaths.CHANGE_PASSWORD}${passwordResetToken}" target="_blank">
            ${protocol}://${rootUrl}${AuthRoutePaths.CHANGE_PASSWORD}${passwordResetToken}
        </a>
    </p>`;
  return output;
}

export function buildPasswordResetText(passwordResetToken: string) {
  const output = `
        Someone (hopefully you) has requested a password reset for your account at Lucella. Follow the link to reset your password: 
        ${protocol}://${rootUrl}${AuthRoutePaths.CHANGE_PASSWORD}${passwordResetToken}`;
  return output;
}
