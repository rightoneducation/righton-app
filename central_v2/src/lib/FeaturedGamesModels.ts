/**
 * Curated set of games shown in the "Featured Games" carousel on the explore
 * landing page. Order is intentional -- it drives the order of the carousel.
 *
 * CURRENT (interim): these ids are fetched as individual point reads by id.
 * A filtered list query is NOT usable here -- AppSync applies `filter` AFTER
 * DynamoDB has read `limit` items, so it can silently under-return.
 *
 * PLANNED: once the publicGameTemplatesByFeatured GSI is deployed and the games
 * below are flagged, this array becomes redundant -- the single GSI query returns
 * the set already ordered, and this file can be deleted.
 */

/** Partition-key value for the featured GSI. Must match what is written to the data. */
export const FEATURED_GROUP = 'FEATURED';

export const featuredGameIds: string[] = [
  '4e529df7-6125-4032-b568-2c3a182849db',
  'c1e00479-2d93-41f4-8844-265c3acf6354',
  '8e49193d-7667-4e02-ac1a-120def64496a',
  'b060f21c-bd7d-4211-9180-e848c1dbaf23',
  '3644d8d0-3772-449d-8500-864df6a40129',
  '52e39fa3-29a0-4a2e-a3f8-a22eba169e2c',
  'ee81c907-1896-41ea-bec1-54ba23c56086',
];

export default featuredGameIds;
