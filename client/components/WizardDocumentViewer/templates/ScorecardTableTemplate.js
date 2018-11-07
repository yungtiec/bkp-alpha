import React, { Component, Fragment } from "react";

export default ({
  jsonSchemas,
  formData,
  formDataPath,
  formDataOrder,
  formDataKey
}) => {
  var averageScore =
    jsonSchemas[formDataOrder].reduce((sum, principle) => {
      var cur = formData[principle][formDataKey] || 0;
      return cur + sum;
    }, 0) /
    jsonSchemas[formDataOrder].filter(
      principle => formData[principle][formDataKey]
    ).length;
  return (
    <table>
      <thead>
        <tr>
          <th className="text-left">principle</th>
          <th className="text-left">score</th>
        </tr>
      </thead>
      <tbody>
        {jsonSchemas[formDataOrder].map(principle => (
          <tr>
            <td className="text-left">{jsonSchemas[principle].schema.title}</td>
            <td className="text-left">{formData[principle][formDataKey]}</td>
          </tr>
        ))}
        <tr>
          <td className="text-left">
            <b>OVERALL TRANSPARENCY SCORE</b>
          </td>
          <td className="text-left">
            <b>{averageScore}</b>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
