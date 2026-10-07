const showLog = (message) => {
  const date = new Date();

  const hour = date.getHours();
  const min = date.getMinutes();
  const seconds = date.getSeconds();

  console.log(`${hour}:${min}:${seconds} - ${message}`);
};

export default showLog;
