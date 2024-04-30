package service;

import com.google.gson.Gson;
import dao.UsersDAO;
import model.Users;
import spark.Request;
import spark.Response;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class UsersService {
    private UsersDAO usersDAO = new UsersDAO();
    private Gson gson = new Gson();

   public String insert(Request request, Response response) throws NoSuchAlgorithmException, InvalidKeySpecException {
    try {
        String name = request.queryParams("name");
        String storeIdParam = request.queryParams("store_id");
        String phoneNumber = request.queryParams("phone_number");
        String passwordHash = request.queryParams("password_hash");

        if (name == null) {
            response.status(400);
            System.out.println("Name is null");
            return "{\"error\": \"Name is null\"}";
        }
        if (storeIdParam == null) {
            response.status(400);
            System.out.println("Store ID is null");
            return "{\"error\": \"Store ID is null\"}";
        }
        if (phoneNumber == null) {
            response.status(400);
            System.out.println("Phone number is null");
            return "{\"error\": \"Phone number is null\"}";
        }
        if (passwordHash == null) {
            response.status(400);
            System.out.println("Password hash is null");
            return "{\"error\": \"Password hash is null\"}";
        }

        Users user = new Users();
        user.setName(name);
        user.setStoreId(Integer.parseInt(storeIdParam));
        user.setPhoneNumber(phoneNumber);
        String type = request.queryParams("type");
        if (type != null) {
            user.setType(type);
        } else {
            user.setType("client");
        }

        byte[] passwordHashBytes = toByteArray(passwordHash);
        user.setPasswordHash(passwordHashBytes);

        Users insertedUser = usersDAO.insert(user);
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

    
    
    // Helper method to convert Uint8Array to byte array
    private byte[] toByteArray(String uint8Array) {
        String[] tokens = uint8Array.substring(1, uint8Array.length() - 1).split(",");
        byte[] byteArray = new byte[tokens.length];
        for (int i = 0; i < tokens.length; i++) {
            byteArray[i] = Byte.parseByte(tokens[i].trim());
        }
        return byteArray;
    }
    

    public byte[] hashPassword(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
        int iterations = 1000;
        char[] chars = password.toCharArray();
        byte[] salt = getSalt();
        PBEKeySpec spec = new PBEKeySpec(chars, salt, iterations, 64 * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] hash = skf.generateSecret(spec).getEncoded();
        return hash;
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
                String password = request.queryParams("password");
                byte[] hashedPassword = hashPassword(password);
                updatedUser.setPasswordHash(hashedPassword);

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
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            response.status(500);
            return "{\"error\": \"Failed to hash password\"}";
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

    private byte[] getSalt() throws NoSuchAlgorithmException {
        SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[16];
        sr.nextBytes(salt);
        return salt;
    }
}
