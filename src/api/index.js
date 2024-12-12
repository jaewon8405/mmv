const API_URL = "http://localhost:3001/api";

export const fetchInquiries = async (category) => {
  const response = await fetch(`${API_URL}/inquiries?category=${category}`);
  return response.json();
};

export const fetchInquiry = async (id) => {
  const response = await fetch(`${API_URL}/inquiries/${id}`);
  return response.json();
};

export const createInquiry = async (inquiry) => {
  const response = await fetch(`${API_URL}/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquiry),
  });
  return response.json();
};

export const fetchComments = async (post_id) => {
  const response = await fetch(`${API_URL}/comments/${post_id}`);
  return response.json();
};

export const createComment = async (comment) => {
  const response = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });
  return response.json();
};

export const incrementViews = async (id) => {
  const response = await fetch(`${API_URL}/inquiries/${id}/views`, {
    method: "PATCH",
  });
  return response.json();
};

export const updateInquiry = async (id, updatedPost) => {
  const response = await fetch(`${API_URL}/inquiries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPost),
  });
  if (!response.ok) {
    throw new Error("Failed to update inquiry");
  }
  return response.json();
};


export const deleteInquiry = async (id) => {
  const response = await fetch(`${API_URL}/inquiries/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete inquiry");
  }
  return response.json();
};

export const deleteComment = async (commentId) => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
  return response.json();
};

export const updateComment = async (commentId, updatedComment) => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedComment),
  });
  if (!response.ok) {
    throw new Error("Failed to update comment");
  }
  return response.json();
};
