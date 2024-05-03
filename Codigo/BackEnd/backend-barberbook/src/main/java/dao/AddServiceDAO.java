package dao;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import model.AddService;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AddServiceDAO extends DAO {

      public AddServiceDAO() {
            super();
            conectar();
      }

      public void finalize() {
            close();
      }

      public AddService insert(AddService addService) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement(
                              "INSERT INTO additional_services (store_id, title, price) VALUES (?, ?, ?)",
                              Statement.RETURN_GENERATED_KEYS);
                  stmt.setInt(1, addService.getStoreId());
                  stmt.setString(2, addService.getTitle());
                  stmt.setInt(3, addService.getPrice());
                  stmt.executeUpdate();

                  ResultSet rs = stmt.getGeneratedKeys();
                  int generatedId = -1;
                  if (rs.next()) {
                        generatedId = rs.getInt(1);
                  }
                  stmt.close();

                  addService.setId(generatedId);
                  return addService;
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }

      public AddService get(int id) {
            AddService service = null;
            try {
                  PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM additional_services WHERE id = ?");
                  stmt.setInt(1, id);
                  ResultSet rs = stmt.executeQuery();
                  if (rs.next()) {
                        service = new AddService(rs.getInt("id"), rs.getInt("store_id"), rs.getString("title"),
                                    rs.getInt("price"));
                  }
                  stmt.close();
                  return service;
            } catch (Exception e) {
                  throw new RuntimeException(e);
            }
      }

      public List<AddService> getAll() {
            List<AddService> serviceList = new ArrayList<>();
            try {
                  PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM additional_services");
                  ResultSet rs = stmt.executeQuery();
                  while (rs.next()) {
                        int id = rs.getInt("id");
                        int storeId = rs.getInt("store_id");
                        String title = rs.getString("title");
                        int price = rs.getInt("price");
                        AddService service = new AddService(id, storeId, title, price);
                        serviceList.add(service);
                  }
                  stmt.close();
            } catch (Exception e) {
                  throw new RuntimeException(e);
            }
            return serviceList;
      }

      public List<AddService> getByStoreId(int storeId) {
            List<AddService> serviceList = new ArrayList<>();
            try {
                PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM additional_services WHERE store_id = ?");
                stmt.setInt(1, storeId);
                ResultSet rs = stmt.executeQuery();
                while (rs.next()) {
                    int id = rs.getInt("id");
                    int serviceStoreId = rs.getInt("store_id");
                    String title = rs.getString("title");
                    int price = rs.getInt("price");
                    AddService addService = new AddService(id, serviceStoreId, title, price);
                    serviceList.add(addService);
                }
                stmt.close();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            return serviceList;
        }

      public AddService delete(int id) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement("DELETE FROM additional_services WHERE id = ?");
                  stmt.setInt(1, id);
                  int rowsDeleted = stmt.executeUpdate();
                  stmt.close();
                  if (rowsDeleted > 0) {
                        return new AddService(); // Return an empty Service object to indicate success
                  } else {
                        return null; // Return null to indicate failure or service not found
                  }
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }
      
      public AddService update(AddService addService) {
          try {
              PreparedStatement stmt = conexao.prepareStatement(
                      "UPDATE additional_services SET store_id = ?, title = ?, price = ? WHERE id = ?");
              stmt.setInt(1, addService.getStoreId());
              stmt.setString(2, addService.getTitle());
              stmt.setInt(3, addService.getPrice());
              stmt.setInt(4, addService.getId());
              int rowsUpdated = stmt.executeUpdate();
              stmt.close();
              if (rowsUpdated > 0) {
                  return addService;
              } else {
                  return null;
              }
          } catch (SQLException e) {
              throw new RuntimeException(e);
          }
      }
}