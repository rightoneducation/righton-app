/**
 * How many slots the Featured Games carousel reserves while loading.
 *
 * The games themselves are no longer listed here -- membership and order live in
 * the data (featuredGroup / featuredOrder on PublicGameTemplate) and come back
 * from the publicGameTemplatesByFeatured GSI in one query. This constant only
 * controls how many skeleton cards show before that query resolves.
 */
export const FEATURED_GAME_COUNT = 7;

export default FEATURED_GAME_COUNT;
