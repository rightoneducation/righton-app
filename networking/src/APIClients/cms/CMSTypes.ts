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
  resourceLink?: string;
  affiliation?: string;
  contact?: string;
  date?: string;
  monsterSelect: number;
  readingTimeMinutes: number;
  abstract?: Array<{
    _type: 'block';
    children: Array<{
      _type: 'span';
      text: string;
    }>;
    style: string;
  }>;
  summary?: Array<{
    _type: 'block';
    children: Array<{
      _type: 'span';
      text: string;
    }>;
    style: string;
  }>;
  contentHeader?: string;
  content?: Array<{
    _type: 'block';
    children: Array<{
      _type: 'span';
      text: string;
    }>;
    style: string;
  }>;
}