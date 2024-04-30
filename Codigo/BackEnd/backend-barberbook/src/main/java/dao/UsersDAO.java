package dao;

import model.Users;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt;

public class UsersDAO extends DAO {
    public UsersDAO() {
        super();
        conectar();
    }

    public void finalize() {
        close();
    }

    public Users insert(Users user) {
        try {
            String phoneNumberWithHyphen = addHyphenToPhoneNumber(user.getPhoneNumber());

            PreparedStatement stmt = conexao.prepareStatement(
                    "INSERT INTO users (store_id, name, type, phone_number, password_hash) VALUES (?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, user.getStoreId());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getType());
            stmt.setString(4, phoneNumberWithHyphen);
            stmt.setBytes(5, user.getPasswordHash());
            stmt.executeUpdate();

            System.out.println(stmt.toString());
            ResultSet rs = stmt.getGeneratedKeys();
            int generatedId = -1;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            stmt.close();
            user.setId(generatedId);
            return user;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public Users get(int id) {
        Users user = null;
        try {
            PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM users WHERE id = ?");
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int storeId = rs.getInt("store_id");
                String name = rs.getString("name");
                String type = rs.getString("type");
                String phone_number = rs.getString("phone_number");
                byte[] password_hash = rs.getBytes("password_hash");
                user = new Users(id, storeId, name, type, phone_number, password_hash);
            }
            stmt.close();
            return user;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    /*
     * public List<Users> getAll() {
     * List<Users> userList = new ArrayList<>();
     * try {
     * PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM users");
     * ResultSet rs = stmt.executeQuery();
     * while (rs.next()) {
     * int id = rs.getInt("id");
     * int storeId = rs.getInt("store_id");
     * String name = rs.getString("name");
     * String type = rs.getString("type");
     * String phone_number = rs.getString("phone_number");
     * byte[] password_hash = rs.getBytes("password_hash");
     * Users user = new Users(id, storeId, name, type, phone_number, password_hash);
     * userList.add(user);
     * }
     * stmt.close();
     * } catch (Exception e) {
     * throw new RuntimeException(e);
     * }
     * return userList;
     * }
     */

    public Users delete(int id) {
        try {
            PreparedStatement stmt = conexao.prepareStatement("DELETE FROM users WHERE id = ?");
            stmt.setInt(1, id);
            int rowsDeleted = stmt.executeUpdate();
            stmt.close();
            if (rowsDeleted > 0) {
                return new Users();
            } else {
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public Users update(Users user) {
        try {
            PreparedStatement stmt = conexao.prepareStatement(
                    "UPDATE users SET store_id = ?, name = ?, type = ?, phone_number = ?, password_hash = ?::bytea WHERE id = ?");
            stmt.setInt(1, user.getStoreId());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getType());
            stmt.setString(4, user.getPhoneNumber());
            stmt.setBytes(5, user.getPasswordHash());
            stmt.setInt(6, user.getId());
            int rowsUpdated = stmt.executeUpdate();
            stmt.close();
            if (rowsUpdated > 0) {
                return user;
            } else {
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean phoneNumberExists(String phoneNumber, int storeId) {
        PreparedStatement stmt = null;
        try {
            phoneNumber = addHyphenToPhoneNumber(phoneNumber);

            stmt = conexao.prepareStatement("SELECT 1 FROM users WHERE phone_number LIKE ? AND store_id = ? LIMIT 1");
            stmt.setString(1, phoneNumber);
            stmt.setInt(2, storeId);

            ResultSet rs = stmt.executeQuery();

            boolean exists = rs.next();
            System.out.println(stmt.toString());
            System.out.println(exists);
            return exists;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private String addHyphenToPhoneNumber(String phoneNumber) {
        phoneNumber = phoneNumber.replaceAll("\\D", "");

        if (phoneNumber.matches("\\d{11}")) {
            return "(" + phoneNumber.substring(0, 2) + ") " + phoneNumber.substring(2, 3) + " " +
                    phoneNumber.substring(3, 7) + "-" + phoneNumber.substring(7);
        }
        return phoneNumber;
    }

}