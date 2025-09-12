const API_URL = "https://notes-api-auth.vercel.app/";

// Store token on login
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: { email, password } }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await res.json();
  localStorage.setItem("token", data?.token); // Save JWT
  localStorage.setItem("role", data?.user?.role); // Save user role
  return data;
}

// Sign up new user
export async function signup(email, password, password_confirmation) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: { email, password, password_confirmation } }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Signup failed");
  }

  const data = await res.json();
  localStorage.setItem("token", data.token); // Save JWT
  return data;
}

// Auth headers
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Notes CRUD
export async function getNotes() {
  const res = await fetch(`${API_URL}/notes`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createNote(data) {
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ note: data }),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function updateNote(id, data) {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ note: data }),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(id) {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return true;
}

export async function logout() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/logout", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // must match Devise JWT
    },
  });

  if (!res.ok) throw new Error("Failed to logout");

  localStorage.removeItem("token");
}
