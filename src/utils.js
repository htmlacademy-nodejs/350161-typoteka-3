'use strict';

module.exports.getRandomInt = (min, max) => {
  const minFixed = Math.ceil(min);
  const maxFixed = Math.floor(max);
  return Math.floor(Math.random() * (maxFixed - minFixed + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.getFormattedDateFromMs = (msValue) => {
  const dateInRange = new Date(msValue);
  return dateInRange.toLocaleDateString(`ru-RU`, {hour: `2-digit`, minute: `2-digit`, second: `2-digit`});
};
