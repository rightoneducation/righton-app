import { createClient } from '@sanity/client'
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { FETCH_ALL_ARTICLES, FETCH_ALL_CORNERSTONES, FETCH_CONTENT_BY_ID, FETCH_ARTICLES_PAGINATED, FETCH_ARTICLES_COUNT, FETCH_RECENT_ARTICLES } from "./CMSQueries";
import { CMSArticleType } from "./CMSTypes";
import { ICMSAPIClient } from "./interfaces/ICMSAPIClient";

// id from sanity.config.ts
const client = createClient({
  projectId: "qfq09qhf",
  dataset: "production",
  apiVersion: "2024-11-01",
  useCdn: false,
});

export class CMSAPIClient implements ICMSAPIClient {
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

  async fetchArticlesPaginated(start: number, limit: number) {
    try {
      const end = start + limit;
      const data = await this.client.fetch(FETCH_ARTICLES_PAGINATED, { start, end });
      
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
      console.error("Error fetching paginated data from CMS:", error);
      throw error;
    }
  }

  async fetchArticlesCount(): Promise<number> {
    try {
      const count = await this.client.fetch(FETCH_ARTICLES_COUNT);
      return count;
    } catch (error) {
      console.error("Error fetching articles count from CMS:", error);
      throw error;
    }
  }

  async fetchAllCornerstones() {
    try {
      const data = await this.client.fetch(FETCH_ALL_CORNERSTONES);
      
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

  async fetchRecentArticles() {
    try {
      const data = await this.client.fetch(FETCH_RECENT_ARTICLES);
      
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
      console.error("Error fetching recent articles from CMS:", error);
      throw error;
    }
  }

  async fetchArticle(id: string): Promise<CMSArticleType> {
    try {
      const article = await this.client.fetch(FETCH_CONTENT_BY_ID , { id });
      
      // Process images to return URLs
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
    } catch (error) {
      console.error("Error fetching data from CMS:", error);
      throw error;
    }
  }
}