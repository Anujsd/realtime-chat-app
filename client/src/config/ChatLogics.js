export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messsages, msg, index, userId) => {
  return (
    index < messsages.length - 1 &&
    (messsages[index + 1].sender._id !== msg.sender._id ||
      messsages[index + 1].sender._id === undefined) &&
    messsages[index].sender._id !== userId
  );
};

export const isLastMessage = (messsages, index, userId) => {
  return (
    index === messsages.length - 1 &&
    messsages[messsages.length - 1].sender._id !== userId &&
    messsages[messsages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return 'auto';
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
