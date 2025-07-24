export const FETCH_ALL_ARTICLES = `*[_type == "article"]{
  _id,
  image{
    asset{
      _ref
    }
  },
  title,
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

  export const FETCH_ALL_CORNERSTONES = `*[_type == "article" && isCornerstone == true]{
    _id,
    image{
      asset{
        _ref
      }
    },
    title,
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