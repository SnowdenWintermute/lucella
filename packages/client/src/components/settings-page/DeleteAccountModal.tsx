import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomErrorDetails, ERROR_MESSAGES, InputFields, SanitizedUser, SUCCESS_ALERTS } from "../../../../common";
import { Alert } from "../../classes/Alert";
import { BUTTON_NAMES } from "../../consts/button-names";
import { AlertType } from "../../enums";
import { authApi, useLogoutUserMutation } from "../../redux/api-slices/auth-api-slice";
import { useDeleteAccountMutation } from "../../redux/api-slices/users-api-slice";
import { useAppDispatch } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";
import { LoginInput } from "../../redux/types";
import LabeledTextInputWithErrorDisplay from "../common-components/inputs/LabeledTextInputWithErrorDisplay";
import Modal from "../common-components/Modal";

export default function DeleteAccountModal({ user, setParentDisplay }: { user: SanitizedUser; setParentDisplay: (modalDisplayed: boolean) => void }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [deleteAccount, { isLoading: deleteAccountIsLoading, isSuccess: deleteAccountIsSuccess, isError: deleteAccountIsError, error: deleteAccountError }] =
    useDeleteAccountMutation();
  const [logoutUser] = useLogoutUserMutation();

  const fields = { email: "", password: "" };
  const [formData, setFormData] = useState<LoginInput>(fields);
  const [fieldErrors, setFieldErrors] = useState(fields);
  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== user?.email) {
      const newFieldErrors = { ...fieldErrors };
      newFieldErrors.email = ERROR_MESSAGES.VALIDATION.AUTH.CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH;
      setFieldErrors(newFieldErrors);
      dispatch(setAlert(new Alert(ERROR_MESSAGES.VALIDATION.AUTH.CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH, AlertType.DANGER)));
    } else await deleteAccount({ email, password });
  };

  useEffect(() => {
    if (deleteAccountIsSuccess) {
      dispatch(setAlert(new Alert(SUCCESS_ALERTS.USERS.ACCOUNT_DELETED, AlertType.SUCCESS)));
      logoutUser();
      dispatch(authApi.util.resetApiState());
      router.push("/register");
    }
    if (deleteAccountIsError && deleteAccountError && "data" in deleteAccountError) {
      const errors: CustomErrorDetails[] = deleteAccountError.data as CustomErrorDetails[];
      const newFieldErrors = { ...fieldErrors };
      errors.forEach((currError) => {
        if (currError.field === InputFields.AUTH.EMAIL) newFieldErrors.email = currError.message;
        if (currError.field === InputFields.AUTH.PASSWORD) newFieldErrors.password = currError.message;
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
      setFieldErrors(newFieldErrors);
    }
  }, [deleteAccountIsSuccess, deleteAccountIsError]);

  return (
    <Modal title="Delete account" setParentDisplay={setParentDisplay}>
      <p className="delete-account-modal__description">
        WARNING: This will delete your account, including all profile and ranking info. If you are certain of your decision, type your email address into the
        input and click Confirm Delete.
      </p>
      <form onSubmit={(e) => handleSubmitDeleteAccount(e)}>
        <LabeledTextInputWithErrorDisplay
          name={InputFields.AUTH.EMAIL}
          type="email"
          label="Email Address"
          placeholder="Email"
          value={email}
          onChange={onChange}
          disabled={deleteAccountIsLoading}
          error={fieldErrors.email}
          autofocus={false}
          extraStyles="delete-account-modal__input"
        />
        <LabeledTextInputWithErrorDisplay
          name={InputFields.AUTH.PASSWORD}
          type="password"
          label="Password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          disabled={deleteAccountIsLoading}
          error={fieldErrors.password}
          autofocus={false}
          extraStyles="delete-account-modal__input"
        />
        <button type="submit" className={`button button--danger ${"delete-account-modal__button"}`} disabled={deleteAccountIsLoading}>
          {deleteAccountIsLoading ? "..." : BUTTON_NAMES.AUTH_FORMS.DELETE_ACCOUNT}
        </button>
      </form>
    </Modal>
  );
}
