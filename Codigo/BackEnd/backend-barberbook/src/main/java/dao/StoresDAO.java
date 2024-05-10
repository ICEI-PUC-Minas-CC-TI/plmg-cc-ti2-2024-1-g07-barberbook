package dao;

import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import model.Stores;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class StoresDAO extends DAO {

      public StoresDAO() {
            super();
            conectar();
      }

      public void finalize() {
            close();
      }

      public void limparHorariosExpirados() {
            try {
                  LocalDate hoje = LocalDate.now();
                  Date dataAtual = Date.valueOf(hoje);
                  PreparedStatement stmt = conexao.prepareStatement(
                              "SELECT id, available_times_for_day FROM stores");
                  ResultSet rs = stmt.executeQuery();

                  while (rs.next()) {
                        int id = rs.getInt("id");
                        String availableTimesJson = rs.getString("available_times_for_day");

                        JsonObject availableTimesObject = JsonParser.parseString(availableTimesJson).getAsJsonObject();
                        List<String> datesToRemove = new ArrayList<>();

                        for (Map.Entry<String, JsonElement> entry : availableTimesObject.entrySet()) {
                              String date = entry.getKey();
                              LocalDate dateObj = LocalDate.parse(date);

                              if (dateObj.isBefore(hoje)) {
                                    datesToRemove.add(date);
                              }
                        }

                        for (String dateToRemove : datesToRemove) {
                              availableTimesObject.remove(dateToRemove);
                        }
                        PreparedStatement updateStmt = conexao.prepareStatement(
                                    "UPDATE stores SET available_times_for_day = ? WHERE id = ?");
                        updateStmt.setString(1, availableTimesObject.toString());
                        updateStmt.setInt(2, id);
                        updateStmt.executeUpdate();
                        updateStmt.close();
                  }

                  stmt.close();
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
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

      public Stores update(Stores stores) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement(
                              "UPDATE stores SET title = ?, location_image_url = ?, location_url = ?, address = ?, phone_number = ?, whatsapp = ?, instagram = ? WHERE id = ?");
                  stmt.setString(1, stores.getTitle());
                  stmt.setString(2, stores.getLocation_image_url());
                  stmt.setString(3, stores.getLocation_url());
                  stmt.setString(4, stores.getAddress());
                  stmt.setString(5, stores.getPhone_number());
                  stmt.setString(6, stores.getWhatsapp());
                  stmt.setString(7, stores.getInstagram());
                  stmt.setInt(8, stores.getID());
                  stmt.executeUpdate();
                  stmt.close();
                  return stores;
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }

      public String getTimes(int id) {
            String availableTimes = null;
            try {
                  PreparedStatement stmt = conexao
                              .prepareStatement("SELECT available_times_for_day FROM stores WHERE id = ?");
                  stmt.setInt(1, id);
                  ResultSet rs = stmt.executeQuery();
                  if (rs.next()) {
                        availableTimes = rs.getString("available_times_for_day");
                  }
                  stmt.close();
                  return availableTimes;
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }

      public Stores insertTimes(int id, JsonElement newAvailableTimes) {
            try {
                  String existingTimesJson = getTimes(id);
                  JsonObject existingTimesObject = new JsonObject();
                  if (existingTimesJson != null) {
                        existingTimesObject = JsonParser.parseString(existingTimesJson).getAsJsonObject();
                  }
                  JsonObject newAvailableTimesObject = newAvailableTimes.getAsJsonObject();
                  for (Map.Entry<String, JsonElement> entry : newAvailableTimesObject.entrySet()) {
                        String date = entry.getKey();
                        JsonArray timesArray = entry.getValue().getAsJsonArray();
                        existingTimesObject.add(date, timesArray);
                  }

                  PreparedStatement stmt = conexao
                              .prepareStatement("UPDATE stores SET available_times_for_day = ? WHERE id = ?");
                  stmt.setObject(1, existingTimesObject.toString(), Types.OTHER);
                  stmt.setInt(2, id);
                  stmt.executeUpdate();
                  stmt.close();
                  return get(id);
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
                                    rs.getString("whatsapp"), rs.getString("instagram"),
                                    rs.getString("available_times_for_day"));
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
                        String available_times_for_day = rs.getString("available_times_for_day");
                        Stores store = new Stores(id, title, location_image_url, location_url, address, phone_number,
                                    whatsapp, instagram, available_times_for_day);
                        storesList.add(store);
                  }
                  stmt.close();
            } catch (Exception e) {
                  throw new RuntimeException(e);
            }
            return storesList;
      }

      public void updateTimes(int id, JsonObject availableTimesObject, String date) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement(
                              "UPDATE stores SET available_times_for_day = CAST(? AS JSONB) WHERE id = ?");
                  stmt.setString(1, availableTimesObject.toString());
                  stmt.setInt(2, id);
                  stmt.executeUpdate();
                  stmt.close();
            } catch (SQLException e) {
                  System.out.println("Failed to update times for store " + id + " on date " + date);
                  throw new RuntimeException(e);
            }
      }

      public Stores delete(int id) {
            try {
                  PreparedStatement stmt = conexao.prepareStatement("DELETE FROM stores WHERE id = ?");
                  stmt.setInt(1, id);
                  int rowsDeleted = stmt.executeUpdate();
                  stmt.close();
                  if (rowsDeleted > 0) {
                        return new Stores();
                  } else {
                        return null;
                  }
            } catch (SQLException e) {
                  throw new RuntimeException(e);
            }
      }
}
