import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ISidebarItem } from '../lib/PipelineModels';

// The three sidebar screens, in sidebar order. The active tab is read off the
// URL, so each page renders the same sidebar without saying which one it is.
const SIDEBAR_DESTINATIONS = [
  { id: 'home', labelKey: 'home.sidebar.home', path: '/dashboard' },
  { id: 'this-week', labelKey: 'home.sidebar.thisWeek', path: '/this-week' },
  {
    id: 'past-activities',
    labelKey: 'home.sidebar.pastActivities',
    path: '/past-activities',
  },
];

export interface ISidebarNav {
  items: ISidebarItem[];
  onSelect: (itemId: string) => void;
}

export function useSidebarNav(): ISidebarNav {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const items = SIDEBAR_DESTINATIONS.map((destination) => ({
    id: destination.id,
    label: t(destination.labelKey),
    isActive: pathname === destination.path,
  }));

  const onSelect = (itemId: string) => {
    const destination = SIDEBAR_DESTINATIONS.find((d) => d.id === itemId);
    if (destination && destination.path !== pathname) {
      navigate(destination.path);
    }
  };

  return { items, onSelect };
}
