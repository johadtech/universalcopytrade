export function getTime(milliSeconds) {
  const seconds = milliSeconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;

  if (seconds > 60 && minutes < 60) {
    return (
      Math.floor(minutes) +
      (Math.floor(minutes) > 1 ? " minutes ago" : " minute ago")
    );
  }

  if (seconds > 60 && minutes > 60 && hours < 24) {
    return (
      Math.floor(hours) + (Math.floor(hours) > 1 ? " hours ago" : " hour ago")
    );
  }

  if (seconds > 60 && minutes > 60 && hours > 24 && days < 7) {
    return Math.floor(days) + (Math.floor(days) > 1 ? " days ago" : " day ago");
  }

  if (seconds > 60 && minutes > 60 && hours > 24 && days > 7) {
    return (
      Math.floor(weeks) + (Math.floor(weeks) > 1 ? " weeks ago" : " week ago")
    );
  }

  return (
    Math.floor(seconds) +
    (Math.floor(seconds) > 1 ? " seconds ago" : " seconds ago")
  );
}

export function formatFileSize(bytes, decimalPoint) {
  if (bytes == 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});

export const formatterZero = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

var unitlist = ["", "K", "M", "G"];

export function formatnumber(number) {
  let sign = Math.sign(number);
  let unit = 0;

  while (Math.abs(number) >= 1000) {
    unit = unit + 1;
    number = Math.floor(Math.abs(number) / 100) / 10;
  }
  return sign * Math.abs(number) + unitlist[unit];
}

export const tabMobileCheck = function () {
  let check = false;
  (function (a) {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      check = true;
    } else {
      check = false;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export function getTimeNoti(milliSeconds) {
  const seconds = milliSeconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;

  if (seconds > 60 && minutes < 60) {
    return Math.floor(minutes) + (Math.floor(minutes) > 1 ? "m" : "m");
  }

  if (seconds > 60 && minutes > 60 && hours < 24) {
    return Math.floor(hours) + (Math.floor(hours) > 1 ? "h" : "h");
  }

  if (seconds > 60 && minutes > 60 && hours > 24 && days < 7) {
    return Math.floor(days) + (Math.floor(days) > 1 ? "d" : " d");
  }

  if (seconds > 60 && minutes > 60 && hours > 24 && days > 7) {
    return Math.floor(weeks) + (Math.floor(weeks) > 1 ? "w" : "w");
  }

  return Math.floor(seconds) + (Math.floor(seconds) > 1 ? "s" : "s");
}

export function toFixedIfNecessary(value, dp) {
  return +parseFloat(value).toFixed(dp);
}
