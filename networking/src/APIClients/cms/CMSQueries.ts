export const FETCH_ALL_ARTICLES = `*[_type == "article"]{
  _id,
  image{asset->{_ref}},
  title,
  author,
  affiliation,
  contact,
  details`;