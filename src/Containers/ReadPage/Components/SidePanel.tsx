import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useWindowSize } from '@src/Context/WindowSizeContext';
import Grid from '@mui/material/Grid';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import { Setting } from '@src/Containers/components';

enum SidePanelOptions {
  Branch = 'branch',
  Save = 'save',
  Setting = 'setting',
}

type SidePanelProps = {};

const SidePanel = (props: SidePanelProps) => {
  const windowSize = useWindowSize();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [selectedPanel, setSelectedPanel] = useState<SidePanelOptions>(
    SidePanelOptions.Branch
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Grid
          container
          direction="column"
          sx={{
            '@media (orientation: portrait)': {
              width: '80vw',
              height: windowSize.innerHeight,
            },
            '@media (orientation: landscape)': {
              width: '500px',
              height: windowSize.innerHeight,
            },
          }}
        >
          <Grid item xs hidden={selectedPanel !== SidePanelOptions.Branch}>
            Branch
          </Grid>
          <Grid item xs hidden={selectedPanel !== SidePanelOptions.Save}>
            Save
          </Grid>
          <Grid item xs hidden={selectedPanel !== SidePanelOptions.Setting}>
            <Setting
              showLanguageSelector
              showDarkModeSwitch
              showUiThemeSelector
              showContentThemeSelector
              showFontSizeSlider
              showLineHeightSlider
            />
          </Grid>

          <Grid item xs="auto" sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Tabs
              centered
              value={selectedPanel}
              onChange={(event, newValue) => setSelectedPanel(newValue)}
            >
              <Tab
                label={<AltRouteIcon />}
                value={SidePanelOptions.Branch}
                aria-label="branch"
              />
              <Tab
                label={<SaveIcon />}
                value={SidePanelOptions.Save}
                aria-label="save"
              />
              <Tab
                label={<SettingsIcon />}
                value={SidePanelOptions.Setting}
                aria-label="setting"
              />
            </Tabs>
          </Grid>
        </Grid>
      </Drawer>
      <Box
        sx={{
          zIndex: 100,
          position: 'absolute',
          width: '1.5rem',
          height: '3rem',
          left: 0,
          top: `calc(${windowSize.innerHeight}px - 3rem)`,
          bgcolor: '#00000017',
          lineHeight: 0,
        }}
        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
      >
        <ChevronRightIcon
          sx={{ ml: '-4px', fontSize: '2rem', height: '100%', marginY: 'auto' }}
        />
      </Box>
    </>
  );
};

export default SidePanel;
