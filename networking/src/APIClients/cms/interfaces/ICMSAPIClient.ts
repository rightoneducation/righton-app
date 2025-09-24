import { CMSArticleType } from "../CMSTypes";

export interface ICMSAPIClient {
  fetchAllArticles(): Promise<CMSArticleType[]>;
  fetchArticlesPaginated(start: number, limit: number): Promise<CMSArticleType[]>;
  fetchArticlesCount(): Promise<number>;
  fetchRecentArticles(excludeId?: string): Promise<CMSArticleType[]>;
  fetchAllCornerstones(): Promise<CMSArticleType[]>;
  fetchArticle(id: string): Promise<CMSArticleType>;
  fetchArticlesPaginatedByType(articleType: string, start: number, limit: number): Promise<CMSArticleType[]>;
  fetchArticlesCountByType(articleType: string): Promise<number>;
  fetchAllArticlesPaginated(start: number, limit: number): Promise<CMSArticleType[]>;
  fetchAllArticlesCount(): Promise<number>;
}
