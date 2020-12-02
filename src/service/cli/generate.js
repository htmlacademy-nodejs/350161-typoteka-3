'use strict';

const {
  getRandomInt,
  shuffle,
  getFormattedDateFromMs,
} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const DEFAULT_COUNT = 1;
const MAX_OFFERS_VALUE = 1000;
const FILE_NAME = `mocks.json`;

const getThreeMonthRange = () => {
  const dateNowInMs = Date.now();
  const threeMonthInMs = 90 * 24 * 60 * 60 * 1000;
  return dateNowInMs - threeMonthInMs;
};

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getFormattedDateFromMs(getRandomInt(getThreeMonthRange(), Date.now())),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(1, titles.length - 1)).join(` `),
    category: [categories[getRandomInt(0, categories.length - 1)]],
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err.message || err));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));
    try {
      if (countOffer > MAX_OFFERS_VALUE) {
        throw new RangeError(`Не больше 1000 публикаций`);
      }
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      if (err instanceof RangeError) {
        console.error(chalk.red(err.message || err));
      } else {
        console.error(chalk.red(`Can't write data to file...`));
      }
    }
  }
};
