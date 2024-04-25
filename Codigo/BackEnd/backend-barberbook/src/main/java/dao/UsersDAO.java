package dao;

import model.Users;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

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
            PreparedStatement stmt = conexao.prepareStatement(
                    "INSERT INTO users (store_id, name, type, phone_number, password_hash) VALUES (?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, user.getStoreId());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getType());
            stmt.setString(4, user.getPhoneNumber());
            stmt.setBytes(5, user.getPassword_hash());
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

    public List<Users> getAll() {
        List<Users> userList = new ArrayList<>();
        try {
            PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM users");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                int storeId = rs.getInt("store_id");
                String name = rs.getString("name");
                String type = rs.getString("type");
                String phone_number = rs.getString("phone_number");
                byte[] password_hash = rs.getBytes("password_hash");
                Users user = new Users(id, storeId, name, type, phone_number, password_hash);
                userList.add(user);
            }
            stmt.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return userList;
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
                    "UPDATE users SET store_id = ?, name = ?, type = ?, phone_number = ?, password_hash = ? WHERE id = ?");
            stmt.setInt(1, user.getStoreId());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getType());
            stmt.setString(4, user.getPhoneNumber());
            stmt.setBytes(5, user.getPassword_hash()); 
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
}
