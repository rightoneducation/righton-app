import { createClient } from '@sanity/client'
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { 
  FETCH_ALL_ARTICLES, 
  FETCH_ALL_CORNERSTONES, 
  FETCH_CONTENT_BY_ID, 
  FETCH_ARTICLES_PAGINATED, 
  FETCH_ARTICLES_COUNT, 
  FETCH_RECENT_ARTICLES,
  FETCH_ARTICLES_PAGINATED_BY_TYPE,
  FETCH_ARTICLES_COUNT_BY_TYPE,
  FETCH_ALL_ARTICLES_PAGINATED,
  FETCH_ALL_ARTICLES_COUNT,
  FETCH_RECENT_ARTICLES_FILTERED
} from "./CMSQueries";
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
      data.forEach((article: any) => {
        if (article._type === "rightOnResource") {
          article.author = 'RightOn! Team';
        } 
        else if (article._type === "outsideResource") {
          article.author = 'External Resource';
        }
      });
      
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

  async fetchRecentArticles(excludeId?: string) {
    try {
      let data = [];
      if (excludeId) {
        data = await this.client.fetch(FETCH_RECENT_ARTICLES_FILTERED, { excludeId });
      } else {
        data = await this.client.fetch(FETCH_RECENT_ARTICLES);
      }
      
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
      console.log('cms');
      console.log(article);
      if (article._type === "rightOnResource") {
        article.author = 'RightOn! Team';
      } 
      else if (article._type === "outsideResource") {
        article.author = 'External Resource';
      }
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

  async fetchArticlesPaginatedByType(articleType: string, start: number, limit: number) {
    try {
      const end = start + limit;
      const data = await this.client.fetch(FETCH_ARTICLES_PAGINATED_BY_TYPE, { articleType, start, end });
      
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
      console.error("Error fetching paginated articles by type from CMS:", error);
      throw error;
    }
  }

  async fetchArticlesCountByType(articleType: string): Promise<number> {
    try {
      const count = await this.client.fetch(FETCH_ARTICLES_COUNT_BY_TYPE, { articleType });
      return count;
    } catch (error) {
      console.error("Error fetching articles count by type from CMS:", error);
      throw error;
    }
  }

  async fetchAllArticlesPaginated(start: number, limit: number) {
    try {
      const end = start + limit;
      const data = await this.client.fetch(FETCH_ALL_ARTICLES_PAGINATED, { start, end });
      
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
      console.error("Error fetching all paginated articles from CMS:", error);
      throw error;
    }
  }

  async fetchAllArticlesCount(): Promise<number> {
    try {
      const count = await this.client.fetch(FETCH_ALL_ARTICLES_COUNT);
      return count;
    } catch (error) {
      console.error("Error fetching all articles count from CMS:", error);
      throw error;
    }
  }
}