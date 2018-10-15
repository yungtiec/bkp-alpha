import React from "react";
import { InputText } from "../../../components";

export default props => (
  <div>
    <label htmlFor="project">
      <small>Project</small>
    </label>
    <input name="project" required />
  </div>
);
