package dao;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import model.Service;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ServiceDAO extends DAO {

      public ServiceDAO() {
            super();
            conectar();
      }

      public void finalize() {
            close();
      }

      public Service insert(Service service) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement(
                              "INSERT INTO services (store_id, title, price) VALUES (?, ?, ?)",
                              Statement.RETURN_GENERATED_KEYS);
                  stmt.setInt(1, service.getStoreId());
                  stmt.setString(2, service.getTitle());
                  stmt.setInt(3, service.getPrice());
                  stmt.executeUpdate();

                  ResultSet rs = stmt.getGeneratedKeys();
                  int generatedId = -1;
                  if (rs.next()) {
                        generatedId = rs.getInt(1);
                  }
                  stmt.close();

                  service.setId(generatedId);
                  return service;
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }

      public Service get(int id) {
            Service service = null;
            try {
                  PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM services WHERE id = ?");
                  stmt.setInt(1, id);
                  ResultSet rs = stmt.executeQuery();
                  if (rs.next()) {
                        service = new Service(rs.getInt("id"), rs.getInt("store_id"), rs.getString("title"),
                                    rs.getInt("price"));
                  }
                  stmt.close();
                  return service;
            } catch (Exception e) {
                  throw new RuntimeException(e);
            }
      }

      public List<Service> getAll() {
            List<Service> serviceList = new ArrayList<>();
            try {
                  PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM services");
                  ResultSet rs = stmt.executeQuery();
                  while (rs.next()) {
                        int id = rs.getInt("id");
                        int storeId = rs.getInt("store_id");
                        String title = rs.getString("title");
                        int price = rs.getInt("price");
                        Service service = new Service(id, storeId, title, price);
                        serviceList.add(service);
                  }
                  stmt.close();
            } catch (Exception e) {
                  throw new RuntimeException(e);
            }
            return serviceList;
      }

      public List<Service> getByStoreId(int storeId) {
            List<Service> serviceList = new ArrayList<>();
            try {
                PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM services WHERE store_id = ?");
                stmt.setInt(1, storeId);
                ResultSet rs = stmt.executeQuery();
                while (rs.next()) {
                    int id = rs.getInt("id");
                    int serviceStoreId = rs.getInt("store_id");
                    String title = rs.getString("title");
                    int price = rs.getInt("price");
                    Service service = new Service(id, serviceStoreId, title, price);
                    serviceList.add(service);
                }
                stmt.close();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            return serviceList;
        }

      public Service delete(int id) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement("DELETE FROM services WHERE id = ?");
                  stmt.setInt(1, id);
                  int rowsDeleted = stmt.executeUpdate();
                  stmt.close();
                  if (rowsDeleted > 0) {
                        return new Service(); // Return an empty Service object to indicate success
                  } else {
                        return null; // Return null to indicate failure or service not found
                  }
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }
      
      public Service update(Service service) {
          try {
              PreparedStatement stmt = conexao.prepareStatement(
                      "UPDATE services SET store_id = ?, title = ?, price = ? WHERE id = ?");
              stmt.setInt(1, service.getStoreId());
              stmt.setString(2, service.getTitle());
              stmt.setInt(3, service.getPrice());
              stmt.setInt(4, service.getId());
              int rowsUpdated = stmt.executeUpdate();
              stmt.close();
              if (rowsUpdated > 0) {
                  return service;
              } else {
                  return null;
              }
          } catch (SQLException e) {
              throw new RuntimeException(e);
          }
      }
}