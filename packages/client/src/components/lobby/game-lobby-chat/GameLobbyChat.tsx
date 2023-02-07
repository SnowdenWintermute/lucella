/* eslint-disable consistent-return */
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../../../redux/hooks";
import {
  ChatMessage,
  SocketEventsFromClient,
  chatDelayLoggedInUser,
  chatDelayUnregisteredUser,
  percentNumberIsOfAnotherNumber,
  positiveNumberOrZero,
} from "../../../../../common";
import styles from "./game-lobby-chat.module.scss";
import CircularProgress from "../../common-components/CircularProgress";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";

interface Props {
  socket: Socket;
}

function GameLobbyChat({ socket }: Props) {
  const [chatInput, setChatInput] = useState("");
  const [chatClass, setChatClass] = useState("");
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const { data: user } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });
  const gameListIsOpen = lobbyUiState.gameList.isOpen;
  const preGameScreenIsOpen = lobbyUiState.preGameScreen.isOpen;
  const matchmakingScreenIsOpen = lobbyUiState.matchmakingScreen.isOpen;
  const chatState = useAppSelector((state) => state.chat);
  const { messages } = chatState;
  const baseDelayMilliseconds = useRef<number>(3000);
  const lastChatSentAt = useRef<number | null>(null);
  const chatDelayInterval = useRef<NodeJS.Timeout | null>(null);
  const [percentageChatDelayRemaining, setPercentageChatDelayRemaining] = useState<number>(0);
  const [waitingToSendMessage, setWaitingToSendMessage] = useState<boolean>(false);
  const sendMessageTimeout = useRef<NodeJS.Timeout | null>(null);

  function setPercentage() {
    if (!lastChatSentAt.current || Date.now() >= lastChatSentAt.current + baseDelayMilliseconds.current) return setPercentageChatDelayRemaining(0);
    const newPercentage = percentNumberIsOfAnotherNumber(Date.now() - lastChatSentAt.current, baseDelayMilliseconds.current);
    if (newPercentage <= 100) setPercentageChatDelayRemaining(newPercentage);
  }

  function determineDelay() {
    if (user) baseDelayMilliseconds.current = chatDelayLoggedInUser;
    else baseDelayMilliseconds.current = chatDelayUnregisteredUser;
  }

  useEffect(() => {
    determineDelay();
    if (waitingToSendMessage) chatDelayInterval.current = setInterval(setPercentage, 25);
    if (!waitingToSendMessage && chatDelayInterval.current) clearInterval(chatDelayInterval.current);
    return () => {
      if (chatDelayInterval.current) clearInterval(chatDelayInterval.current);
    };
  }, [percentageChatDelayRemaining, waitingToSendMessage]);

  useEffect(() => {
    return () => {
      if (sendMessageTimeout.current) clearTimeout(sendMessageTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (gameListIsOpen || preGameScreenIsOpen || matchmakingScreenIsOpen) setChatClass("chat-stream-top-border");
    else setChatClass("");
  }, [gameListIsOpen, preGameScreenIsOpen, matchmakingScreenIsOpen]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const sendNewMessageAfterAnyRemainingDelay = (message: string) => {
    if (message === "") return;
    function handleSendMessage() {
      socket.emit(SocketEventsFromClient.NEW_CHAT_MESSAGE, new ChatMessage(message));
      setWaitingToSendMessage(false);
      lastChatSentAt.current = Date.now();
      setChatInput("");
    }
    if (!lastChatSentAt.current || Date.now() >= lastChatSentAt.current + baseDelayMilliseconds.current) handleSendMessage();
    else {
      setWaitingToSendMessage(true);
      determineDelay();
      setTimeout(() => {
        handleSendMessage();
        if (chatDelayInterval.current) clearInterval(chatDelayInterval.current);
        setPercentageChatDelayRemaining(0);
      }, positiveNumberOrZero(baseDelayMilliseconds.current - (Date.now() - lastChatSentAt.current)));
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendNewMessageAfterAnyRemainingDelay(chatInput);
  };

  let messagesToDisplay;
  if (messages) {
    messagesToDisplay = messages.map((message) => {
      return (
        <li className={styles[`chat-message-${message.style}`]} key={`${message.timeStamp} ${message.text}`}>
          {message.author} : {message.text}
        </li>
      );
    });
  }

  return (
    <>
      <div className={`game-lobby-chat-stream ${chatClass}`}>
        <ul>{messagesToDisplay}</ul>
      </div>
      <div className={styles["game-lobby-chat-input-holder"]}>
        <form onSubmit={handleSubmit}>
          <input
            aria-label="chat-input"
            type="text"
            className="text-input-transparent game-lobby-chat-input"
            onChange={(e) => onChange(e)}
            value={chatInput}
            placeholder="Enter a message to chat..."
            disabled={waitingToSendMessage}
          />
        </form>
        <CircularProgress percentage={percentageChatDelayRemaining} />
      </div>
    </>
  );
}

export default GameLobbyChat;
