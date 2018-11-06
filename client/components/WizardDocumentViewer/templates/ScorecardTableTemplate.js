import React, { Component, Fragment } from "react";

export default ({
  jsonSchemas,
  formData,
  formDataPath,
  formDataOrder,
  formDataKey
}) => {
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
            <b>9.0</b>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
