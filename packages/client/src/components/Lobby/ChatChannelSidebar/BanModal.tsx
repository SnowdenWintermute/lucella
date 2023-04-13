import React, { FormEvent, useEffect, useState } from "react";
import { Ban, CustomErrorDetails, IPBanReason, ONE_DAY, SuccessAlerts } from "../../../../../common";
import { Alert } from "../../../classes/Alert";
import { AlertType } from "../../../enums";
import { useBanIpAddressMutation } from "../../../redux/api-slices/moderation-api-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setAlert } from "../../../redux/slices/alerts-slice";
import Modal from "../../common-components/Modal";
import { BanDurationRadioListItem } from "./BanDurationRadioListItem";
import { useBanAccountMutation } from "../../../redux/api-slices/users-api-slice";

export enum BanMode {
  USER,
  IP_ADDRESS,
}

export default function BanModal({ banMode, setParentDisplay }: { banMode: BanMode; setParentDisplay: (modalDisplayed: boolean) => void }) {
  const dispatch = useAppDispatch();
  const [banDuration, setBanDuration] = useState<number | null>(0);
  const [banIpAddress, { isLoading: banIpIsLoading, isError: banIpIsError, error: banIpError, isSuccess: banIpIsSuccess }] = useBanIpAddressMutation();
  const [banUser, { isLoading: banUserIsLoading, isError: banUserIsError, error: banUserError, isSuccess: banUserIsSuccess }] = useBanAccountMutation();

  const uiState = useAppSelector((state) => state.UI);
  const { username } = uiState.nameplateContextMenuData;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(banMode);
    if (banMode === BanMode.IP_ADDRESS) await banIpAddress({ name: username, duration: banDuration || undefined, reason: IPBanReason.CHAT });
    else if (banMode === BanMode.USER) await banUser({ name: username, ban: new Ban("ACCOUNT", banDuration || undefined) });
  };

  useEffect(() => {
    if (banIpIsSuccess || banUserIsSuccess) {
      dispatch(setAlert(new Alert(SuccessAlerts.ADMIN.USER_BANNED(username, banDuration), AlertType.SUCCESS)));
      setParentDisplay(false);
    }
    if (banIpIsError && banIpError && "data" in banIpError) {
      console.log(banIpError);
      const errors: CustomErrorDetails[] = banIpError.data as CustomErrorDetails[];
      errors.forEach((currError) => {
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
    }
    if (banUserIsError && banUserError && "data" in banUserError) {
      console.log(banUserError);
      const errors: CustomErrorDetails[] = banUserError.data as CustomErrorDetails[];
      errors.forEach((currError) => {
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
    }
  }, [banIpIsSuccess, banIpIsError, banUserIsSuccess, banUserIsError]);

  return (
    <Modal
      title={`Ban ${banMode === BanMode.IP_ADDRESS ? "Ip Address" : "User Account"} (${username})`}
      setParentDisplay={setParentDisplay}
      backdropStyle="ban-modal"
      extraStyles="ban-modal"
    >
      <form className="ban-modal__contents">
        <ul className="ban-modal__options-list">
          <BanDurationRadioListItem title="Two Days" duration={ONE_DAY * 2} setBanDuration={setBanDuration} checked={banDuration === ONE_DAY * 2} />
          <BanDurationRadioListItem title="One Week" duration={ONE_DAY * 7} setBanDuration={setBanDuration} checked={banDuration === ONE_DAY * 7} />
          <BanDurationRadioListItem title="Eternity" duration={null} setBanDuration={setBanDuration} checked={banDuration === null} />
        </ul>
        <button
          className="button button--danger ban-modal__confirm-button"
          type="submit"
          onClick={handleSubmit}
          disabled={banIpIsLoading || banUserIsLoading || banDuration === 0}
        >
          Confirm
        </button>
      </form>
    </Modal>
  );
}
