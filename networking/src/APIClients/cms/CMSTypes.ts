export type CMSArticleType = {
  _id: string;
  image?: {
    asset?: {
      _ref?: string;
    };
    url?: string;
  };
  category?: string[];
  title: string;
  youtubeLink?: string;
  caption?: string;
  author?: string;
  apaCitation?: string;
  abstract?: string;
  summary?: string;
  resourceLink?: string;
  affiliation?: string;
  contact?: string;
  date?: string;
  monsterSelect: number;
  readingTimeMinutes: number;
  details: Array<{
    _type: 'block';
    children: Array<{
      _type: 'span';
      text: string;
    }>;
    style: string;
  }>;
}