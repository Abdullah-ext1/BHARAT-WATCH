import Parser from 'rss-parser';
const parser = new Parser();
import NewsArticle from '../models/newsArticle.js';

const TOPICS = [
  { keyword: "rape india", type: "rape" },
  { keyword: "murder india", type: "murder" },
  { keyword: "protest india", type: "protest" },
  { keyword: "riot violent india", type: "riot" }
]

async function fetchNews(keyword) {
  const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${keyword}`);
  return feed.items
}

async function fetchAll() {
  const values = await Promise.all(
    TOPICS.map((topic) => {
      const items = fetchNews(topic.keyword)
      return items;
    }))
  values.forEach((items, i) => {
    // console.log(`${TOPICS[i].type}: ${items.length}`)
    const newsSource = items[i].title;
    const str = newsSource.split("-")
    const source = str[str.length - 1]

    const link = items[i].link
    const pubDate = items[i].pubDate
    const title = items[i].title

    console.log(`${title}: \n${link}, \n${pubDate}`)

  const news = NewsArticle.create({
    source: source.trim(),
    url: link,
    pubDate: pubDate,
    title: title,
    incidentType: TOPICS[i].type
  })
    
  })
  process.exit(1)
}

fetchAll();