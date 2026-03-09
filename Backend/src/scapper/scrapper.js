import Parser from "rss-parser";
import NewsArticle from "../models/newsArticle.js";
import connectDB from "../db/db.js";
import { stringSimilarity } from "string-similarity-js";

const parser = new Parser();

const TOPICS = [
  {keyword: "rape sexual assault india", type: "Rape"}, 
  {keyword: "protest violent india", type: "Protest"},
  {keyword: "violent murder india", type: "Murder"},
  {keyword: "violent riots india", type: "Riot"},
  {keyword: "Rally rally india", type: "Rally"}
]

async function fetchNews (keyword) {
  const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${keyword}`);
  return feed.items
}

async function fetchAllNews(){
  for(const topic of TOPICS){
    const items = await fetchNews(topic.keyword)
    for (const item of items){
      const newsSource = item.title;
      const str = newsSource.split("-")
      const source = str[str.length - 1]

      const link = item.link
      const pubDate = item.pubDate
      const title = item.title

      console.log(`Soure: ${source.trim()}\nTitle: ${title}\nLink: ${link}\nPublished On: ${pubDate}\nType: ${topic.type}`)

      const oldTitle = await NewsArticle.find()
      let isDuplicate = false;

      for( const old of oldTitle){
        if(stringSimilarity(title, old.title) > 0.5){
          isDuplicate = true;
          break;
        } 
      }
      if(!isDuplicate){
        const newsArticle = new NewsArticle({
          title,
          source: source.trim(),
          url: link,
          pubDate,
          incidentType: topic.type,
        })
        
        try {
          await newsArticle.save()
          console.log(`Saved: ${title}`)
        } catch(err) {
          console.log(`Error: ${err.message}`)
        }
      }
    }
  }
}

export {
  fetchAllNews,
}
