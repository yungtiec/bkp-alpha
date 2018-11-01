import React, { Component, Fragment } from "react";
import { keys } from "lodash";

export default ({ formData }) => {
  const headers = keys(formData[0]);
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
              <td style={{ textAlign: "left;" }}>{item[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>none listed</p>
  );
};
