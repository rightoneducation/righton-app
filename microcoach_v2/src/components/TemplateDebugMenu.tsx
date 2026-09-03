import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ActivityType } from '../lib/PipelineModels';
import { useMisconceptions } from '../hooks/useMisconceptions';

/**
 * Review scaffolding: jumps straight to any activity template while the
 * prototype is still running on mock data.
 *
 * Deliberately not translated. Every other visible string in the app goes
 * through the catalogue, but this is a reviewer affordance rather than product
 * copy — Spanish keys for it would be noise that later has to be hunted down
 * and deleted along with the component.
 *
 * Not gated on NODE_ENV either: it has to survive into the build being handed
 * round for review. Gating it, or deleting it, is a one-line change in
 * AppSwitch when the real data lands.
 */

// The design's own names for the templates, taken from the Figma frames. The
// content `type` is the real identity here — an activity's routine name can
// disagree with the body it actually carries.
const TEMPLATE_NAMES: Record<ActivityType, string> = {
  INCORRECT_WORKED_EXAMPLES: 'Spot the Slip',
  FAVORITE_NO: 'My Favorite No',
  COMPARE_THE_THINKING: 'Compare the Thinking',
  MULTIPLE_REPRESENTATIONS: 'Make the Connections',
  MATH_HOSPITAL: 'Math Hospital',
};

// Mirrors NeedHelpButton's floating treatment, but anchored bottom-left so the
// two FABs can't collide. Navy rather than sky so it reads as tooling.
const DebugFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.sizing.space6,
  left: theme.sizing.space5,
  zIndex: theme.zIndex.fab,
  gap: theme.sizing.space1,
  paddingLeft: theme.sizing.space4,
  paddingRight: theme.sizing.space4,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
}));

export default function TemplateDebugMenu() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const { activityId } = useParams();
  const { misconceptions } = useMisconceptions();
  const navigate = useNavigate();

  // Derived rather than listed, so the menu keeps up with the mock.
  const templates = React.useMemo(
    () =>
      misconceptions.flatMap((misconception) =>
        misconception.nextStepActivities.flatMap((activity) => {
          const content = activity.phases?.activity;
          if (!content) return [];

          return [
            {
              id: activity.id,
              type: content.type,
              detail: misconception.titleCased,
            },
          ];
        }),
      ),
    [misconceptions],
  );

  const close = () => setAnchorEl(null);

  const handleSelect = (id: string) => {
    navigate(`/activity/${id}`);
    close();
  };

  return (
    <>
      <DebugFab
        variant="extended"
        aria-label="Jump to an activity template"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Templates
        <ExpandLessIcon fontSize="small" />
      </DebugFab>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        // Pops upward out of the button rather than down off the viewport.
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {templates.map((template) => (
          <MenuItem
            key={template.id}
            selected={template.id === activityId}
            onClick={() => handleSelect(template.id)}
          >
            <ListItemText
              primary={TEMPLATE_NAMES[template.type]}
              secondary={template.detail}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
