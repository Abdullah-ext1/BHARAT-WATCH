import Parser from "rss-parser";
import NewsArticle from "../models/newsArticle.js";
import { stringSimilarity } from "string-similarity-js";

const parser = new Parser();


const indianCities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli", "Bareilly", "Moradabad", "Mysuru", "Gurgaon", "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", "Warangal", "Guntur", "Bikaner", "Amravati", "Noida", "Dehradun", "Shimla", "Udaipur"];

const TOPICS = [
  { keyword: "rape sexual assault india", type: "Rape" },
  { keyword: "protest violent india", type: "Protest" },
  { keyword: "violent murder india", type: "Murder" },
  { keyword: "violent riots india", type: "Riot" },
  { keyword: "Rally violent india", type: "Rally" }
]

async function fetchNews(keyword) {
  const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${keyword}`);
  return feed.items
}

async function fetchAllNews() {
  for (const topic of TOPICS) {
    const items = await fetchNews(topic.keyword)
    for (const item of items) {
      const newsSource = item.title;
      const str = newsSource.split("-")
      const source = str[str.length - 1]

      const link = item.link
      const pubDate = item.pubDate
      const title = item.title

      console.log(`Soure: ${source.trim()}\nTitle: ${title}\nLink: ${link}\nPublished On: ${pubDate}\nType: ${topic.type}`)

      const oldTitle = await NewsArticle.find()
      let isDuplicate = false;

      for (const old of oldTitle) {
        if (stringSimilarity(title, old.title) > 0.5) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        const foundCity = indianCities.find(city => title.includes(city))
        if (foundCity == undefined) {
          console.log("No city found in the title, skipping...")
          const newsArticle = new NewsArticle({
              title,
              source: source.trim(),
              url: link,
              pubDate,
              incidentType: topic.type
            })

            try {
              await newsArticle.save()
              console.log("News article saved successfully without the location!")
            } catch (error) {
              console.log("Error saving news article without location:", error)
            }
        } else {
          try {
            const data = await fetch(`https://nominatim.openstreetmap.org/search?q=${foundCity}&format=json`, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
              }
            });

            const jsonData = await data.json()

            const lat = jsonData.length > 0 ? jsonData[0].lat : null
            const lon = jsonData.length > 0 ? jsonData[0].lon : null

            const newsArticle = new NewsArticle({
              title,
              source: source.trim(),
              url: link,
              pubDate,
              incidentType: topic.type,
              location: {
                city: foundCity || "Unknown",
                lat: lat,
                lng: lon,
              }
            })

            await newsArticle.save()
            console.log("News article saved successfully!")
          } catch (error) {
            console.log("Error fetching geolocation data:", error)
          }

        }
      }
    }
  }
}


export {
  fetchAllNews,
}
