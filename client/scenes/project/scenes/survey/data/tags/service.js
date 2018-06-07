import axios from "axios";

export function deleteTag({ commentId, tagId }) {
  return axios.put("/api/comment/tag/remove", { commentId, tagId });
}

export function putTag({ commentId, tagName }) {
  return axios
    .put("/api/comment/tag/add", { commentId, tagName })
    .then(res => res.data);
}

export function getAllTags() {
  return axios.get("/api/tag").then(res => res.data);
}

