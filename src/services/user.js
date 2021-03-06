import http from "./http";

var user = {
  list: () => {
    return http().get("/api/users");
  },
  update: (data) => {
    return http().put("/api/user", data);
  },
  delete: (id) => {
    return http().delete("/api/user/" + id);
  },
};

export default user;
