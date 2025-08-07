export const FETCH_ALL_ARTICLES = `*[_type == "article" || _type == "videoArticle"]{
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  tags,
  date,
  caption,
  author,
  affiliation,
  contact,
  details,
  monsterSelect,
  readingTimeMinutes
  }`;

export const FETCH_ARTICLES_PAGINATED = `*[_type == "article" || _type == "videoArticle"] | order(date desc) [$start...$end] {
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  tags,
  date,
  caption,
  author,
  affiliation,
  contact,
  details,
  monsterSelect,
  readingTimeMinutes
}`;

export const FETCH_ARTICLES_COUNT = `count(*[_type == "article" || _type == "videoArticle"])`;

export const FETCH_RECENT_ARTICLES = `*[_type == "article" || _type == "videoArticle"] | order(date desc) [0...3] {
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  tags,
  date,
  caption,
  author,
  affiliation,
  contact,
  details,
  monsterSelect,
  readingTimeMinutes
}`;

  export const FETCH_ALL_CORNERSTONES = `*[(_type == "article" || _type == "videoArticle") && isCornerstone == true]{
    _id,
    image{
      asset{
        _ref
      }
    },
    title,
    youtubeLink,
    tags,
    date,
    caption,
    author,
    affiliation,
    contact,
    details,
    monsterSelect,
    readingTimeMinutes
  }`;

  export const FETCH_CONTENT_BY_ID = `
  *[
    _id == $id
  ][0]{
    _id,
    image{
      asset{
        _ref
      }
    },
    title,
    youtubeLink,
    tags,
    date,
    caption,
    author,
    affiliation,
    contact,
    details,
    monsterSelect,
    readingTimeMinutes
  }
`