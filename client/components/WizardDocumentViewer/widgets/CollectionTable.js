import React, { Component, Fragment } from "react";
import { keys, isArray, has } from "lodash";

export default ({ formData, headers }) => {
  headers = headers || keys(formData[0]);
  const isNotEmpty =
    formData.length > 1 ||
    headers.reduce(
      (isNotEmpty, header) => formData[0][header] || isNotEmpty,
      false
    );

  return isNotEmpty ? (
    <table>
      <thead>
        <tr>
          {headers.map(header => (
            <th style={{ textAlign: "left;" }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {formData.map(item => (
          <tr>
            {headers.map(header => (
              <td style={{ textAlign: "left;" }}>
                {!isArray(item[header])
                  ? item[header]
                  : // TODO: figure out API in schema for rendering array of array
                    // breaking generalization here by directly referencing data using specific keys, e.g. title, link...etc
                    header === "sources" && (
                      <span>
                        {item[header].map((subitem, i) => (
                          <Fragment>
                            <a
                              href={subitem.value.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {subitem.value.title}
                            </a>
                            {i !== item[header].length - 1 && "; "}
                          </Fragment>
                        ))}
                      </span>
                    )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>none listed</p>
  );
};
