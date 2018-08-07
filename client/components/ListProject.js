import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ListItem } from "./index";

export default ({ projectSymbolArr, projectsBySymbol }) => {
  return projectSymbolArr.length ? (
    <div className="row entity-cards">
      {projectSymbolArr.map(symbol => (
        <ListItem
          cardKey={symbol}
          cardHref={`/project/${projectsBySymbol[symbol].symbol}`}
          mainTitle={projectsBySymbol[symbol].name}
          subtitle={`(${projectsBySymbol[symbol].symbol})`}
          textUpperRight={""}
          mainText={projectsBySymbol[symbol].description || " "}
          tagArray={[
            `documents (${projectsBySymbol[symbol].num_surveys || 0})`,
            `comments (${projectsBySymbol[symbol].num_total_comments || 0})`,
            `issues (${projectsBySymbol[symbol].num_issues || 0})`
          ]}
        />
      ))}
    </div>
  ) : null;
};
