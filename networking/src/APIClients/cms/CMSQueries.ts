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
  details}`;