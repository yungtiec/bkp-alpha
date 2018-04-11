import axios from "axios";

export function deleteTag({ annotationId, tagId }) {
  return axios.put("/api/annotation/tag/remove", { annotationId, tagId });
}

export function putTag({ annotationId, tagName }) {
  console.log(tagName)
  return axios
    .put("/api/annotation/tag/add", { annotationId, tagName })
    .then(res => res.data);
}

export function getAllTags() {
  return axios.get("/api/tag").then(res => res.data);
}

