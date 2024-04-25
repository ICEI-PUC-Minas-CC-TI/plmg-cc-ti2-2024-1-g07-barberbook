package service;

import com.google.gson.Gson;
import dao.UsersDAO;
import model.Users;
import spark.Request;
import spark.Response;

import java.util.List;

public class UsersService {
    private UsersDAO usersDAO = new UsersDAO();
    private Gson gson = new Gson();

    public String insert(Request request, Response response) {
        try {
            Users user = new Users();
            user.setName(request.queryParams("name"));
            user.setStoreId(Integer.parseInt(request.queryParams("store_id")));
            user.setType(request.queryParams("type"));
            user.setPhoneNumber(request.queryParams("phone_number"));
            user.setPassword_hash(request.queryParams("password_hash").getBytes()); 
            Users insertedUser = usersDAO.insert(user);
            response.status(201);
            return toJson(insertedUser);
        } catch (NumberFormatException e) {
            response.status(400);
            return "{\"error\": \"Invalid input data\"}";
        } catch (RuntimeException e) {
            response.status(500);
            return "{\"error\": \"Failed to insert user\"}";
        }
    }

    public String get(Request request, Response response) {
        try {
            int id = Integer.parseInt(request.params(":id"));
            Users user = usersDAO.get(id);
            if (user != null) {
                response.status(200);
                return toJson(user);
            } else {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return "{\"error\": \"Invalid user ID\"}";
        } catch (RuntimeException e) {
            response.status(500);
            return "{\"error\": \"Failed to retrieve user\"}";
        }
    }

    public String getAll(Request request, Response response) {
        try {
            List<Users> userList = usersDAO.getAll();
            if (!userList.isEmpty()) {
                return gson.toJson(userList);
            } else {
                response.status(404);
                return "{\"error\": \"No users found\"}";
            }
        } catch (RuntimeException e) {
            response.status(500);
            return "{\"error\": \"Failed to retrieve users\"}";
        }
    }

    public String delete(Request request, Response response) {
        try {
            int id = Integer.parseInt(request.params(":id"));
            Users deletedUser = usersDAO.delete(id);
            if (deletedUser != null) {
                response.status(200);
                return toJson(deletedUser);
            } else {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return "{\"error\": \"Invalid user ID\"}";
        } catch (RuntimeException e) {
            response.status(500);
            return "{\"error\": \"Failed to delete user\"}";
        }
    }

    public String update(Request request, Response response) {
        try {
            int id = Integer.parseInt(request.params(":id"));
            Users existingUser = usersDAO.get(id);
            if (existingUser == null) {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            } else {
                Users updatedUser = new Users();
                updatedUser.setId(existingUser.getId());
                updatedUser.setName(request.queryParams("name"));
                updatedUser.setStoreId(Integer.parseInt(request.queryParams("store_id")));
                updatedUser.setType(request.queryParams("type"));
                updatedUser.setPhoneNumber(request.queryParams("phone_number"));
                updatedUser.setPassword_hash(request.queryParams("password_hash").getBytes()); 
                                                                                              

                Users result = usersDAO.update(updatedUser);
                if (result != null) {
                    response.status(200);
                    return toJson(result);
                } else {
                    response.status(500);
                    return "{\"error\": \"Failed to update user\"}";
                }
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return "{\"error\": \"Invalid user ID or input data\"}";
        } catch (RuntimeException e) {
            response.status(500);
            return "{\"error\": \"Failed to update user\"}";
        }
    }

    private String toJson(Users user) {
        return gson.toJson(user);
    }
}
