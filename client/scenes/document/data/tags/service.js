import axios from "axios";

export function deleteTag({ commentId, tagId }) {
  return axios.put(`/api/projects/-/documents/-/comments/${commentId}/tags/${tagId}`);
}

export function putTag({ commentId, tagName }) {
  return axios
    .put(`/api/projects/-/documents/-/comments/${commentId}/tags`, { tagName })
    .then(res => res.data);
}

export function getAllTags() {
  return axios.get("/api/tags").then(res => res.data);
}

