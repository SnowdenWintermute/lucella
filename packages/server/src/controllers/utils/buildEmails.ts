import { FrontendRoutes, websiteName } from "../../../../common/dist";

const rootUrl = process.env.NODE_ENV === "development" ? process.env.EMAIL_ROOT_URL_DEV : process.env.EMAIL_ROOT_URL;
const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

export const RESET_PASSWORD_SUBJECT = "Reset your password";

export function buildPasswordResetHTML(passwordResetToken: string) {
  const output = `
    <p>Someone (hopefully you) has requested a password reset for your account at ${websiteName}. Follow the link to reset your password.</p>
    <p>
        <a href="${protocol}://${rootUrl}${FrontendRoutes.CHANGE_PASSWORD}/${passwordResetToken}" target="_blank">
            ${protocol}://${rootUrl}${FrontendRoutes.CHANGE_PASSWORD}/${passwordResetToken}
        </a>
    </p>`;
  return output;
}

export function buildPasswordResetText(passwordResetToken: string) {
  const output = `
        Someone (hopefully you) has requested a password reset for your account at ${websiteName}. Follow the link to reset your password:
        \n \n
        ${protocol}://${rootUrl}${FrontendRoutes.CHANGE_PASSWORD}/${passwordResetToken}`;
  return output;
}

export const ACCOUNT_ACTIVATION_SUBJECT = "Activate your account";

export function buildAccountActivationHTML(name: string, token: string) {
  const output = `
  <p>Account creation was initiated for user ${name} with at ${websiteName}. Follow the link to activate your acconut.</p>
  <p>
      <a href="${protocol}://${rootUrl}${FrontendRoutes.ACCOUNT_ACTIVATION}/${token}" target="_blank">
          ${protocol}://${rootUrl}${FrontendRoutes.ACCOUNT_ACTIVATION}/${token}
      </a>
  </p>
  `;
  return output;
}
export function buildAccountActivationText(name: string, token: string) {
  const output = `
  Account creation was initiated for user ${name} with at ${websiteName}. Follow the link to activate your acconut.
  \n \n
  ${protocol}://${rootUrl}${FrontendRoutes.ACCOUNT_ACTIVATION}/${token}  
  `;
  return output;
}
