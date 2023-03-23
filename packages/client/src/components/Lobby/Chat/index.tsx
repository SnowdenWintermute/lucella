/* eslint-disable react/no-array-index-key */
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
import CircularProgress from "../../common-components/CircularProgress";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";
import replaceUrlsWithAnchorTags from "../../../utils/replaceUrlsWithAnchorTags";
import ClientGeneratedChatNotice from "./ClientGeneratedChatNotice";

interface Props {
  socket: Socket;
}

function Chat({ socket }: Props) {
  const [chatInput, setChatInput] = useState("");
  const { data: user } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });
  const chatState = useAppSelector((state) => state.chat);
  const { messages } = chatState;
  const baseDelayMilliseconds = useRef<number>(3000);
  const lastChatSentAt = useRef<number | null>(null);
  const chatDelayInterval = useRef<NodeJS.Timeout | null>(null);
  const [percentageChatDelayRemaining, setPercentageChatDelayRemaining] = useState<number>(0);
  const [waitingToSendMessage, setWaitingToSendMessage] = useState<boolean>(false);
  const sendMessageTimeout = useRef<NodeJS.Timeout | null>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!waitingToSendMessage) chatInputRef.current?.focus();
  }, [waitingToSendMessage]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendNewMessageAfterAnyRemainingDelay(chatInput);
  };

  // can add any message here that the client will show once in chat stream upon page load
  // can't make <li> part of <ClientGenerated... because it will give unique list key prop error
  const messagesToDisplay: JSX.Element[] = [
    <li key={`${Date.now()} ${"1234"}`}>
      <ClientGeneratedChatNotice />
    </li>,
  ];
  if (messages) {
    messages.forEach((message, i) => {
      const textToDisplay = replaceUrlsWithAnchorTags(message.text, `chat__message chat__message--${message.style}`);
      messagesToDisplay.push(
        <li className={`chat__message chat__message--${message.style}`} key={`${message.timeStamp} ${message.text}`}>
          {message.author} : {/* eslint-disable-next-line react/no-danger */}
          <span className={`chat__message chat__message--${message.style}`} dangerouslySetInnerHTML={{ __html: textToDisplay }} />
        </li>
      );
    });
  }

  return (
    <section className="chat">
      <div className="chat__message-stream">
        <ul>{messagesToDisplay}</ul>
      </div>
      <form onSubmit={handleSubmit} className="chat__input-form">
        <input
          ref={chatInputRef}
          className={`input input--transparent ${"chat__input"}`}
          aria-label="chat-input"
          type="text"
          onChange={(e) => onChange(e)}
          value={chatInput}
          placeholder="Enter a message to chat..."
          disabled={waitingToSendMessage}
        />
        <span className="chat__input-delay-circular-progress">
          <CircularProgress percentage={percentageChatDelayRemaining} thickness={6} />
        </span>
      </form>
    </section>
  );
}

export default Chat;
