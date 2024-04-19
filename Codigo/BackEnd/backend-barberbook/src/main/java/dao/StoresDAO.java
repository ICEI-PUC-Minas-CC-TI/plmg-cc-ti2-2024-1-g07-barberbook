package dao;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import model.Stores;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StoresDAO extends DAO {

      public StoresDAO() {
            super();
            conectar();
      }

      public void finalize() {
            close();
      }

      public Stores insert(Stores stores) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement(
                              "INSERT INTO stores (title, location_image_url, location_url, address, phone_number, whatsapp, instagram) VALUES (?, ?, ?, ?, ?, ?, ?)",
                              Statement.RETURN_GENERATED_KEYS);
                  stmt.setString(1, stores.getTitle());
                  stmt.setString(2, stores.getLocation_image_url());
                  stmt.setString(3, stores.getLocation_url());
                  stmt.setString(4, stores.getAddress());
                  stmt.setString(5, stores.getPhone_number());
                  stmt.setString(6, stores.getWhatsapp());
                  stmt.setString(7, stores.getInstagram());
                  stmt.executeUpdate();

                  ResultSet rs = stmt.getGeneratedKeys();
                  int generatedId = -1;
                  if (rs.next()) {
                        generatedId = rs.getInt(1);
                  }
                  stmt.close();

                  stores.setId(generatedId);
                  return stores;
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }

      public Stores get(int id) {
            Stores stores = null;
            try {
                  PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM stores WHERE id = ?");
                  stmt.setInt(1, id);
                  ResultSet rs = stmt.executeQuery();
                  if (rs.next()) {
                        stores = new Stores(rs.getInt("id"), rs.getString("title"), rs.getString("location_image_url"),
                                    rs.getString("location_url"), rs.getString("address"), rs.getString("phone_number"),
                                    rs.getString("whatsapp"), rs.getString("instagram"));
                  }
                  stmt.close();
                  return stores;
            } catch (Exception e) {
                  throw new RuntimeException(e);
            }
      }

      public List<Stores> getAll() {
            List<Stores> storesList = new ArrayList<>();
            try {
                  PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM stores");
                  ResultSet rs = stmt.executeQuery();
                  while (rs.next()) {
                        int id = rs.getInt("id");
                        String title = rs.getString("title");
                        String location_image_url = rs.getString("location_image_url");
                        String location_url = rs.getString("location_url");
                        String address = rs.getString("address");
                        String phone_number = rs.getString("phone_number");
                        String whatsapp = rs.getString("whatsapp");
                        String instagram = rs.getString("instagram");
                        Stores store = new Stores(id, title, location_image_url, location_url, address, phone_number,
                                    whatsapp, instagram);
                        storesList.add(store);
                  }
                  stmt.close();
            } catch (Exception e) {
                  throw new RuntimeException(e);
            }
            return storesList;
      }

      public Stores delete(int id) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement("DELETE FROM stores WHERE id = ?");
                  stmt.setInt(1, id);
                  int rowsDeleted = stmt.executeUpdate();
                  stmt.close();
                  if (rowsDeleted > 0) {
                        return new Stores(); // Return an empty Stores object to indicate success
                  } else {
                        return null; // Return null to indicate failure or store not found
                  }
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }
}
