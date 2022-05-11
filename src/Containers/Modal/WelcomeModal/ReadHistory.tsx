import React from "react";
import { useDbContext } from "@src/Context/DbContext";
import * as Types from "@src/Types";
import { useEffect, useState } from "react";
import { Button, Card, Spinner, ListGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { generateMainPath } from "@src/Utils";

export const ReadHistory = () => {
  let history = useHistory();

  const { dbContext } = useDbContext();
  const [metadataList, setMetadataList] = useState<Types.RepoMetadataType[]>();
  const [selectedMetadataIndex, setSelectedMetadataIndex] = useState<number>();

  useEffect(() => {
    loadDb();
  }, [dbContext]);

  const loadDb = async () => {
    if (dbContext) {
      const _metadataList = await dbContext.getAllMetadata();
      setMetadataList(_metadataList);
    }
  }

  return (<>
    <div>
      <ListGroup className="my-2 overflow-auto" as="ul" style={{ "maxHeight": '50vh' }}>
        {metadataList?.map((item, i) => (
          <ListGroup.Item key={i} as="li"
            onClick={() => setSelectedMetadataIndex(i)}
            active={selectedMetadataIndex === i}
          >
            <p className="fw-bold mb-1">{item.repoName}</p>
            <p className="mb-0">{item.author}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
    <Button variant="primary" type="submit"
      disabled={selectedMetadataIndex === undefined}
      onClick={() => {
        const selected = metadataList[selectedMetadataIndex];
        if (selected?.repoName && selected?.author) {
          history?.push(generateMainPath(undefined, selected?.repoName, selected?.author));
        }
      }}
    >
      Go
    </Button>
  </>);
}