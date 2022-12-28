import React from 'react';
import * as Database from '@src/Database';
import * as Utils from '@src/Utils';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card/Card';
import CardContent from '@mui/material/CardContent/CardContent';
import Typography from '@mui/material/Typography/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export const RepoCard = (props: { item: Database.Types.RepoMetadataType }) => {
  let navigate = useNavigate();

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

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent>
          <Typography
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
            }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {props.item.repoName}
          </Typography>
          <Typography gutterBottom variant="subtitle1" component="div">
            {props.item.author}
          </Typography>
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
    </Card>
  );
};
