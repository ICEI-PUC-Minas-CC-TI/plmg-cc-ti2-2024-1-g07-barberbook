package service;

import com.google.gson.Gson;

import dao.UsersDAO;
import model.Users;
import spark.Request;
import spark.Response;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

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

            // Gera o hash MD5 da senha
            String passwordHash = hashPassword(password);

            // Cria um mapa para armazenar os dados do usuário
            Map<String, String> userData = new HashMap<>();
            userData.put("name", name);
            userData.put("store_id", storeIdParam);
            userData.put("phone_number", phoneNumber);
            userData.put("password_hash", passwordHash);
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
            String passwordHash = hashPassword(password);
            if (passwordHash.equals(user.getPasswordHash())) {
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

    public String getUser(Request request, Response response) {
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
                return "{\"id\": " + user.getId() + ", \"name\": \"" + user.getName() + "\", \"store_id\": "
                        + user.getStoreId() + ", \"phone_number\": \"" + user.getPhoneNumber() + "\"}";
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

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash password", e);
        }
    }
}