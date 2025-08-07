import { CMSArticleType } from "../CMSTypes";

export interface ICMSAPIClient {
  fetchAllArticles(): Promise<CMSArticleType[]>;
  fetchArticlesPaginated(start: number, limit: number): Promise<CMSArticleType[]>;
  fetchArticlesCount(): Promise<number>;
  fetchAllCornerstones(): Promise<CMSArticleType[]>;
  fetchArticle(id: string): Promise<CMSArticleType>;
}
