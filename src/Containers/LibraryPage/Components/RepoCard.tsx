import React from 'react';
import * as Database from '@src/Database';
import * as Utils from '@src/Utils';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card/Card';
import CardContent from '@mui/material/CardContent/CardContent';
import Typography from '@mui/material/Typography/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { Trans } from 'react-i18next';
import Menu from '@mui/material/Menu';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

type RepoCardProps = {
  item: Database.Types.RepoMetadataType;
  deleteMetadata: (metaDataId: string) => Promise<void>;
};

export const RepoCard = (props: RepoCardProps) => {
  let navigate = useNavigate();

  const [openThreeDotMenu, setOpenThreeDotMenu] = React.useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const thumbnailBgColor = React.useMemo(() => {
    return Utils.generateColorFromStr(
      props.item?.author + props.item?.repoName
    );
  }, [props.item?.author, props.item?.repoName]);

  const onClick = () => {
    if (props.item?.author && props.item?.repoName) {
      const url = Utils.generateReadPath(
        props.item?.repoName,
        props.item?.author
      );
      if (history) {
        navigate(url);
      }
    }
  };

  const menu = (
    <Menu
      anchorEl={anchorRef.current}
      open={openThreeDotMenu}
      onClose={() => setOpenThreeDotMenu(false)}
    >
      <MenuItem
        onClick={async () => {
          setOpenThreeDotMenu(false);
          setOpenDeleteConfirmationModal(true);
        }}
      >
        <DeleteIcon />
        <Trans i18nKey="repoCard.deleteBtn.label" />
      </MenuItem>
    </Menu>
  );

  const deleteConfirmationModal = (
    <Dialog
      open={openDeleteConfirmationModal}
      onClose={() => setOpenDeleteConfirmationModal(false)}
    >
      <DialogContent>
        <DialogContentText>
          <Trans i18nKey="repoCard.deleteConfirmationMsg" />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setOpenDeleteConfirmationModal(false)}>
          <Trans i18nKey="repoCard.deleteCancelBtn.label" />
        </Button>
        <Button
          onClick={async () => {
            const metadataId = props.item?.id;
            if (!metadataId) return;
            props.deleteMetadata && (await props.deleteMetadata(metadataId));
          }}
          color="error"
        >
          <Trans i18nKey="repoCard.deleteConfirmationBtn.label" />
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
          <CardActionArea onClick={onClick}>
            <CardHeader
              sx={{
                paddingBottom: 0,
                paddingTop: '0.5rem',
                '& span': {
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                },
              }}
              title={props.item.repoName}
              subheader={props.item.author}
            />
            <CardContent>
              <Typography
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                }}
                variant="body2"
                color="text.secondary"
              >
                {props.item.description}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions disableSpacing sx={{ flexDirection: 'column' }}>
            <IconButton
              ref={anchorRef}
              onClick={() => setOpenThreeDotMenu(true)}
            >
              <MoreVertIcon />
            </IconButton>
          </CardActions>
        </Box>
      </Card>
      {menu}
      {deleteConfirmationModal}
    </>
  );
};
