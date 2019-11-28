const formatTime = function(timestamp) {
  let date = timestamp ? new Date(parseInt(timestamp)) : new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

/**
 * 处理数字 单数+0 01 02 03 10 58
 * @param n
 * @returns {*}
 */
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
}

export { formatTime };
