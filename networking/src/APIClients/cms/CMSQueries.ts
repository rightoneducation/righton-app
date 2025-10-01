export const FETCH_ALL_ARTICLES = `*[_type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research"]{
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  category,
  date,
  caption,
  author,
  affiliation,
  contact,
  contentHeader,
  content,
  monsterSelect,
  readingTimeMinutes
  }`;

export const FETCH_ARTICLES_PAGINATED = `*[_type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research"] | order(date desc) [$start...$end] {
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  category,
  date,
  caption,
  author,
  affiliation,
  contact,
  contentHeader,
  content,
  monsterSelect,
  readingTimeMinutes
}`;

export const FETCH_ARTICLES_COUNT = `count(*[_type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research"])`;

export const FETCH_RECENT_ARTICLES = `*[_type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research"] | order(date desc) [0...3] {
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  category,
  date,
  caption,
  author,
  affiliation,
  contact,
  contentHeader,
  content,
  monsterSelect,
  readingTimeMinutes
}`;

export const FETCH_RECENT_ARTICLES_FILTERED = `*[
  (_type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research") && 
  _id != $excludeId
] | order(date desc) [0...3] {
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  category,
  date,
  caption,
  author,
  affiliation,
  contact,
  contentHeader,
  content,
  monsterSelect,
  readingTimeMinutes
}`;

  export const FETCH_ALL_CORNERSTONES = `*[(_type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research") && isCornerstone == true]{
    _id,
    _type,
    image{
      asset{
        _ref
      }
    },
    title,
    youtubeLink,
    category,
    date,
    caption,
    author,
    affiliation,
    contact,
    monsterSelect,
    readingTimeMinutes,
    category,
    apaCitation,
    abstract,
    summary,
    resourceLink,
    minutesToRead,
    contentHeader,
    content,
  }`;

  export const FETCH_CONTENT_BY_ID = `
  *[
    _id == $id
  ][0]{
    _id,
    _type,
    image{
      asset{
        _ref
      }
    },
     title,
    youtubeLink,
    category,
    date,
    caption,
    author,
    affiliation,
    contact,
    contentHeader,
    content,
    monsterSelect,
    readingTimeMinutes,
    category,
    apaCitation,
    abstract,
    summary,
    resourceLink,
    minutesToRead,
  }
`

// Specific queries for each article type
export const FETCH_ARTICLES_PAGINATED_BY_TYPE = `*[
  (_type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research") && 
  $articleType in category
] | order(date desc) [$start...$end] {
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  category,
  date,
  caption,
  author,
  affiliation,
  contact,
  contentHeader,
  content,
  monsterSelect,
  readingTimeMinutes
}`;

export const FETCH_ARTICLES_COUNT_BY_TYPE = `count(*[
  (_type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research") && 
  $articleType in category
])`;

// Query for all articles (no type filter)
export const FETCH_ALL_ARTICLES_PAGINATED = `*[
  _type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research"
] | order(date desc) [$start...$end] {
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
  youtubeLink,
  category,
  date,
  caption,
  author,
  affiliation,
  contact,
  contentHeader,
  content,
  monsterSelect,
  readingTimeMinutes
}`;

export const FETCH_ALL_ARTICLES_COUNT = `count(*[
  _type == "article" || _type == "rightOnResource" || _type == "outsideResource" || _type == "research"
])`;