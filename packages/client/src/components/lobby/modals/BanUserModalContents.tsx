import React, { FormEvent, useEffect, useState } from "react";
import { Ban, CustomErrorDetails, ONE_DAY, SuccessAlerts } from "../../../../../common";
import { Alert } from "../../../classes/Alert";
import { AlertType } from "../../../enums";
import { useBanAccountMutation } from "../../../redux/api-slices/users-api-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setAlert } from "../../../redux/slices/alerts-slice";
import { setShowBanUserModal } from "../../../redux/slices/ui-slice";

function BanUserModalContents() {
  const dispatch = useAppDispatch();
  const [banDuration, setBanDuration] = useState<number | null>(0);
  const [banUser, { isLoading, isError, error, isSuccess }] = useBanAccountMutation();
  const uiState = useAppSelector((state) => state.UI);
  const { username } = uiState.nameplateContextMenuData;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await banUser({ name: username, ban: new Ban("ACCOUNT", banDuration || undefined) });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAlert(new Alert(SuccessAlerts.ADMIN.USER_BANNED(username, banDuration), AlertType.SUCCESS)));
      dispatch(setShowBanUserModal(false));
    }
    if (isError && error && "data" in error) {
      const errors: CustomErrorDetails[] = error.data as CustomErrorDetails[];
      errors.forEach((currError) => {
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
    }
  }, [isSuccess, isError]);

  return (
    <form onSubmit={handleSubmit}>
      <ul style={{ display: "flex", marginBottom: "10px" }}>
        <label className="button button-standard-size button-basic" style={{ marginRight: "10px" }} htmlFor="Two days">
          Two days
          <input
            style={{ marginLeft: "10px", cursor: "pointer", borderRadius: "0px", accentColor: "blue" }}
            type="radio"
            id="Two days"
            name="ban-duration"
            onClick={() => setBanDuration(ONE_DAY * 2)}
          />
        </label>
        <label className="button button-standard-size button-basic" style={{ marginRight: "10px" }} htmlFor="One week">
          One week
          <input
            style={{ marginLeft: "10px", cursor: "pointer", borderRadius: "0px", accentColor: "blue" }}
            type="radio"
            id="One week"
            name="ban-duration"
            onClick={() => setBanDuration(ONE_DAY * 7)}
          />
        </label>
        <label className="button button-standard-size button-basic" htmlFor="Eternity">
          Eternity
          <input
            style={{ marginLeft: "10px", cursor: "pointer", borderRadius: "0px", accentColor: "blue" }}
            type="radio"
            id="Eternity"
            name="ban-duration"
            onClick={() => setBanDuration(null)}
          />
        </label>
      </ul>
      <button className="button button-standard-size button-basic" type="submit" disabled={isLoading || banDuration === 0}>
        Confirm
      </button>
    </form>
  );
}

export default BanUserModalContents;
