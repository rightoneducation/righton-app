import monsterIcon0 from './MonsterIcon0.svg';
import monsterIcon1 from './MonsterIcon1.svg';
import monsterIcon2 from './MonsterIcon2.svg';
import monsterIcon3 from './MonsterIcon3.svg';
import monsterIcon4 from './MonsterIcon4.svg';
import monsterIcon5 from './MonsterIcon5.svg';

/*
 * The play app's avatar set, copied across unchanged (play/src/img). Each icon
 * carries its own 86x106 rectangular background, so whatever renders one has to
 * clip the corners itself — the same arrangement play uses in
 * play/src/lib/styledcomponents/AvatarIconStyled.tsx.
 */
export const avatarIcons = [
  monsterIcon0,
  monsterIcon1,
  monsterIcon2,
  monsterIcon3,
  monsterIcon4,
  monsterIcon5,
];

/**
 * The one the profile frame draws. Its background is #1F81B3 — the value
 * `surface.avatarPlate` already holds, which is where that token came from.
 *
 * A constant rather than a stored preference because nothing picks an avatar
 * yet; the array is exported so a picker can be added without moving assets.
 */
export const DEFAULT_AVATAR_INDEX = 5;
