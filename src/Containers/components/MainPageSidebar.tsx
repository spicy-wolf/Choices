import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Stack } from '@mui/system';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { generateLibraryPath, generateSettingPath } from '@src/Utils';

enum MainPageSidebarButtonEnum {
  Library = 'Library',
  Setting = 'Setting',
}

type MainPageSidebarProps = {
  selected: MainPageSidebarButtonEnum;
};

type MainPageSidebarButtonProps = {
  selected: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
};

const MainPageSidebarButton = (props: MainPageSidebarButtonProps) => {
  return (
    <ListItemButton
      selected={props.selected}
      sx={{
        minHeight: 40,
        justifyContent: 'center',
        px: 2,
      }}
      onClick={props.onClick}
    >
      <ListItemIcon sx={{ justifyContent: 'center' }}>
        <Stack
          sx={{
            alignItems: 'center',
          }}
        >
          {props.children}
        </Stack>
      </ListItemIcon>
    </ListItemButton>
  );
};

const MainPageSidebar = (props: MainPageSidebarProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: '4rem',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '4rem',
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <MainPageSidebarButton
            selected={props.selected === MainPageSidebarButtonEnum.Library}
            onClick={() => navigate(generateLibraryPath())}
          >
            <LibraryBooksIcon />
            <ListItemText primary={t('mainPageSidebar.library.label')} />
          </MainPageSidebarButton>
          <MainPageSidebarButton
            selected={props.selected === MainPageSidebarButtonEnum.Setting}
            onClick={() => navigate(generateSettingPath())}
          >
            <SettingsIcon />
            <ListItemText primary={t('mainPageSidebar.setting.label')} />
          </MainPageSidebarButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export { MainPageSidebarButtonEnum, MainPageSidebar };
