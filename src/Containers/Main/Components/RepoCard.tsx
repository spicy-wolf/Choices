import React from 'react';
import { Card, Col } from 'react-bootstrap';
import * as Database from '@src/Database';
import * as Utils from '@src/Utils';
import './RepoCard.scss';
import { useNavigate } from 'react-router-dom';

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
    <Col
      lg={4}
      md={6}
      sm={12}
      key={props.item.id}
      className="p-3 d-flex repo-card"
    >
      <Card className="w-100 bg-light" onClick={onClick}>
        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
        <Card.Body className="d-flex align-items-center">
          <div
            className="rounded cover-thumbnail"
            style={{
              backgroundColor: thumbnailBgColor,
            }}
          ></div>
          {/* https://getbootstrap.com/docs/5.0/utilities/spacing/ */}
          <div className="ms-2">
            <Card.Title className="mb-4 max-two-lines">
              {props.item.repoName}
            </Card.Title>
            <Card.Subtitle className="max-two-lines">
              {props.item.author}
            </Card.Subtitle>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};
