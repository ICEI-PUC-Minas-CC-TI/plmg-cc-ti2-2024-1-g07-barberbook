package service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import dao.UsersDAO;
import model.Users;
import spark.Request;
import spark.Response;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class UsersService {
    private UsersDAO usersDAO = new UsersDAO();
    private Gson gson = new Gson();

    public String insert(Request request, Response response) {
    try {
        // Extrai os dados da requisição
        String name = request.queryParams("name");
        String storeIdParam = request.queryParams("store_id");
        String phoneNumber = request.queryParams("phone_number");
        String password = request.queryParams("password_hash");
        String type = request.queryParams("type");

        // Cria um mapa para armazenar os dados do usuário
        Map<String, String> userData = new HashMap<>();
        userData.put("name", name);
        userData.put("store_id", storeIdParam);
        userData.put("phone_number", phoneNumber);
        userData.put("password_hash", password);
        userData.put("type", type != null ? type : "client");

        // Insere o usuário usando o método insert da classe UsersDAO
        Users insertedUser = usersDAO.insert(userData);

        response.status(201);
        return toJson(insertedUser);
    } catch (NumberFormatException e) {
        response.status(400);
        System.out.println(e);
        return "{\"error\": \"Invalid input data\"}";
    } catch (RuntimeException e) {
        response.status(500);
        System.out.println(e);
        return "{\"error\": \"Failed to insert user\"}";
    }
}


    public String login(Request request, Response response) {
        try {
            String phoneNumber = request.queryParams("phone_number");
            String password = request.queryParams("password_hash");
            String storeIdParam = request.queryParams("store_id");
            int storeId = Integer.parseInt(storeIdParam);
            Users user = usersDAO.login(phoneNumber, password, storeId);
            String pass = user.getPasswordHash();
            System.out.println(password + " " + pass);
            if (password.equals(pass)) {
                response.status(200);
                return "{\"user\": \"Autenticado\", \"id\": " + user.getId() + ", \"type\": \"" + user.getType()
                        + "\", \"name\": \"" + user.getName() + "\"}";
            } else {
                response.status(401);
                return "{\"error\": \"Invalid credentials\"}";
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return "{\"error\": \"Invalid input data\"}";
        } catch (RuntimeException e) {
            System.err.println("Login error: " + e.getMessage());
            response.status(500);
            return "{\"error\": \"Failed to authenticate user\"}";
        }
    }

    public String get(Request request, Response response) {
        try {
            String idParam = request.params(":id");
            if (idParam == null || idParam.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Missing user ID\"}";
            }

            int id = Integer.parseInt(idParam);
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

    public String delete(Request request, Response response) {
        try {
            String idParam = request.params(":id");
            if (idParam == null || idParam.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Missing user ID\"}";
            }

            int id = Integer.parseInt(idParam);
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
            String idParam = request.params(":id");
            if (idParam == null || idParam.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Missing user ID\"}";
            }

            int id = Integer.parseInt(idParam);
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
                updatedUser.setPasswordHash(request.queryParams("password")); // Set password directly

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

    public String test(Request request, Response response) {
        String phoneNumber = request.params(":phoneNumber");
        int storeId = Integer.parseInt(request.params(":storeId"));
        boolean result = usersDAO.phoneNumberExists(phoneNumber, storeId);
        if (result) {
            return "{\"result\": 1}";
        } else {
            return "{\"result\": 0}";
        }
    }

    private String toJson(Users user) {
        return gson.toJson(user);
    }

}
