import mongoose from "mongoose";

const newsArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  incidenteType: {
    type: String,
    enum: ["Rape", "Murder", "Kidnapping", "Assault", "Protest", "Riot", "Rally", "Other"],
    default: "Other",
  },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  location: {
    city: {
      type: String,
    }, 
    state: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    }
  }
});

const NewsArticle = mongoose.model("NewsArticle", newsArticleSchema);

export default NewsArticle;