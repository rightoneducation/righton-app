import { createClient } from '@sanity/client'
import { FETCH_ALL_ARTICLES } from "./CMSQueries";

// id from sanity.config.ts
const client = createClient({
  projectId: "qfq09qhf",
  dataset: "production",
  apiVersion: "2024-11-01",
  useCdn: false,
});

export class CMSAPIClient {
  protected client;

  constructor() {
    this.client = client;
  }

  async fetchAllArticles() {
    try {
      const data = await this.client.fetch(FETCH_ALL_ARTICLES);
      console.log("Fetched articles:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data from CMS:", error);
      throw error;
    }
  }

}