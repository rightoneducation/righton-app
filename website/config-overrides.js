/**
 * `@righton/networking` is consumed via a yarn-link symlink. By default webpack
 * resolves that symlink to its real path under the monorepo root, where
 * networking's React/MUI/styled-components imports bind to the root copies
 * (React 18) — a different instance than this app's React 19. Two React copies
 * break hooks (e.g. "Cannot read properties of null (reading 'useContext')").
 *
 * Setting resolve.symlinks = false keeps the linked package nested under this
 * app, so its React/MUI/styled-components resolve to website's single copies.
 *
 * Temporary: once the React/MUI versions are aligned and website joins the root
 * yarn workspace, this override can be deleted.
 */
module.exports = (config) => {
  config.resolve.symlinks = false;
  return config;
};
