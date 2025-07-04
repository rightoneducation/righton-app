import { createClient } from '@sanity/client'
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
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
      
      // Process images to return URLs
      const articlesWithImageUrls = data.map((article: any) => {
        if (article.image && article.image.asset && article.image.asset._ref) {
          const imageUrl = imageUrlBuilder(this.client).image(article.image as SanityImageSource);
          return {
            ...article,
            image: {
              ...article.image,
              url: imageUrl,
            }
          };
        }
        return article;
      });
      return articlesWithImageUrls;
    } catch (error) {
      console.error("Error fetching data from CMS:", error);
      throw error;
    }
  }

}