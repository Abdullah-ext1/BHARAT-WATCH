import cron from "node-cron";
import { fetchAllNews } from "./scrapper.js";

const cronScheule = cron.schedule('*/30 * * * *', fetchAllNews);

console.log("Cron job scheduled to run every 30 minutes");


export {
  cronScheule
}