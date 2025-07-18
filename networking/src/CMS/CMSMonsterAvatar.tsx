import { CMSArticleType } from '../APIClients/cms/CMSTypes';
import monster0 from './monsterAvatars/monster0.png';
import monster1 from './monsterAvatars/monster1.png';
import monster2 from './monsterAvatars/monster2.png';
import monster3 from './monsterAvatars/monster3.png';
import monster4 from './monsterAvatars/monster4.png';
import monster5 from './monsterAvatars/monster5.png';

export function CMSMonsterAvatar( // eslint-disable-line
  selectedArticle  : CMSArticleType
) {  

  const monsterAvatarMap: { [key: number]: string } = {
    0 : monster0,
    1 : monster1,
    2 : monster2,
    3 : monster3,
    4 : monster4,
    5 : monster5
  }

  // Ensure the monsterSelect is within valid range
  const monsterIndex = selectedArticle.monsterSelect;
  const avatarSrc = monsterAvatarMap[monsterIndex] || monster0; // fallback to monster0

  return (
    <div>
      <img src={avatarSrc} alt="Monster Avatar" />
    </div>
  )
}