import api from "./api"

export const signin = async(username, password) => {
  return api.post("/api/user/token/", {username, password})
}