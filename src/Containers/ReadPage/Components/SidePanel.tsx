import React, { Dispatch, useState } from 'react';
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
import { SaveAndLoad } from './SaveAndLoad';
import * as Database from '@src/Database';

enum SidePanelOptions {
  Branch = 'branch',
  SaveAndLoad = 'saveAndLoad',
  Setting = 'setting',
}

type SidePanelProps = {
  defaultSaveData: Database.Types.SaveDataType;
  loadSaveData: (saveDataId: string) => Promise<void>;
  createSaveData: (saveDataDescription: string) => Promise<string>;
  deleteSaveData: (saveDataId: string) => Promise<void>;
  saveDataList: Database.Types.SaveDataType[];
  setLoadingMsg: (loadingMsg: string) => void;
};

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
          wrap="nowrap"
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
          <Grid
            item
            xs
            hidden={selectedPanel !== SidePanelOptions.SaveAndLoad}
            overflow="auto"
          >
            <SaveAndLoad
              defaultSaveData={props.defaultSaveData}
              loadSaveData={props.loadSaveData}
              createSaveData={props.createSaveData}
              deleteSaveData={props.deleteSaveData}
              saveDataList={props.saveDataList}
              setLoadingMsg={props.setLoadingMsg}
            />
          </Grid>
          <Grid
            item
            xs
            hidden={selectedPanel !== SidePanelOptions.Setting}
            overflow="auto"
          >
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
                value={SidePanelOptions.SaveAndLoad}
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
