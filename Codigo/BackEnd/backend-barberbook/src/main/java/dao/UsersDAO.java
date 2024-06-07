package dao;

import model.Users;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

public class UsersDAO extends DAO {

    public UsersDAO() {
        super();
        conectar();
    }

    public void finalize() {
        close();
    }

    public Users insert(Map<String, String> userData) {
        try {
            Users user = new Users();
            String phoneNumberWithHyphen = addHyphenToPhoneNumber(userData.get("phone_number"));

            PreparedStatement stmt = conexao.prepareStatement(
                    "INSERT INTO users (store_id, type, name, phone_number, password_hash) VALUES (?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, Integer.parseInt(userData.get("store_id")));
            stmt.setString(2, userData.get("type"));
            stmt.setString(3, userData.get("name"));
            stmt.setString(4, phoneNumberWithHyphen);
            stmt.setString(5, userData.get("password_hash"));
            stmt.executeUpdate();

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
            PreparedStatement stmt = conexao
                    .prepareStatement("SELECT id, store_id, type, name, phone_number FROM users WHERE id = ?");
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int storeId = rs.getInt("store_id");
                String type = rs.getString("type");
                String name = rs.getString("name");
                String phoneNumber = rs.getString("phone_number");

                user = new Users(id, storeId, type, name, phoneNumber);
            }
            stmt.close();
            return user;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

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
                    "UPDATE users SET store_id = ?, name = ?, type = ?, phone_number = ? WHERE id = ?");
            stmt.setInt(1, user.getStoreId());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getType());
            stmt.setString(4, user.getPhoneNumber());
            stmt.setInt(5, user.getId());
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

    public Users login(String phoneNumber, String passwordHash, int storeId) {
        try {
            Users user = null;
            phoneNumber = addHyphenToPhoneNumber(phoneNumber);

            PreparedStatement stmt = conexao.prepareStatement(
                    "SELECT id, type, name, password_hash FROM users WHERE phone_number = ? AND store_id = ?");
            stmt.setString(1, phoneNumber);
            stmt.setInt(2, storeId);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                String retrievedPasswordHash = rs.getString("password_hash");

                if (passwordHash.equals(retrievedPasswordHash)) {
                    int id = rs.getInt("id");
                    String type = rs.getString("type");
                    String name = rs.getString("name");

                    user = new Users(id, storeId, type, name, phoneNumber);
                }
            }
            stmt.close();
            return user;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
