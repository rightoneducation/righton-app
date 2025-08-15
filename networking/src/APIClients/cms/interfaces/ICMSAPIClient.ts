import { CMSArticleType } from "../CMSTypes";

export interface ICMSAPIClient {
  fetchAllArticles(): Promise<CMSArticleType[]>;
  fetchArticlesPaginated(start: number, limit: number): Promise<CMSArticleType[]>;
  fetchArticlesCount(): Promise<number>;
  fetchRecentArticles(): Promise<CMSArticleType[]>;
  fetchAllCornerstones(): Promise<CMSArticleType[]>;
  fetchArticle(id: string): Promise<CMSArticleType>;
}
