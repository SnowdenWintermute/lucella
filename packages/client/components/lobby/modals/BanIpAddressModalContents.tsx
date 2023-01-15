import React, { FormEvent, useEffect, useState } from "react";
import { CustomErrorDetails, IPBanReason, ONE_DAY, SuccessAlerts } from "../../../../common";
import { Alert } from "../../../classes/Alert";
import { AlertType } from "../../../enums";
import { useBanIpAddressMutation } from "../../../redux/api-slices/moderation-api-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setAlert } from "../../../redux/slices/alerts-slice";
import { setShowBanIpAddressModal } from "../../../redux/slices/ui-slice";

function BanIpAddressModalContents() {
  const dispatch = useAppDispatch();
  const [banDuration, setBanDuration] = useState<number | null>(0);
  const [banIpAddress, { isLoading, isError, error, isSuccess }] = useBanIpAddressMutation();
  const uiState = useAppSelector((state) => state.UI);
  const { username } = uiState.nameplateContextMenuData;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await banIpAddress({ name: username, duration: banDuration || undefined, reason: IPBanReason.CHAT });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAlert(new Alert(SuccessAlerts.ADMIN.USER_BANNED(username, banDuration), AlertType.SUCCESS)));
      dispatch(setShowBanIpAddressModal(false));
    }
    if (isError && error && "data" in error) {
      console.log(error);
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

export default BanIpAddressModalContents;
