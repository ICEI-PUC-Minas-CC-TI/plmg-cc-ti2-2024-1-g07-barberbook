package service;

import java.sql.Time;
import java.util.List;
import java.util.Map;
import java.sql.Date;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.google.gson.JsonParser;
import dao.StoresDAO;
import model.Stores;
import spark.Request;
import spark.Response;

public class StoresService {
      private StoresDAO storesDAO = new StoresDAO();
      private Gson gson = new Gson();

      public String insertTimes(Request request, Response response) {
            try {
                  int id = Integer.parseInt(request.queryParams("id"));
                  Stores stores = storesDAO.get(id);
                  if (stores != null) {
                        String availableTimesJson = request.body();
                        if (availableTimesJson != null && !availableTimesJson.isEmpty()) {
                              stores.setAvailable_times_for_day(availableTimesJson);
                              storesDAO.update(stores);
                              response.status(200);
                              return "{\"message\": \"Available times updated successfully\"}";
                        } else {
                              response.status(400);
                              return "{\"error\": \"Request body is empty or null\"}";
                        }
                  } else {
                        response.status(404);
                        return "{\"error\": \"Store not found\"}";
                  }
            } catch (NumberFormatException e) {
                  response.status(400);
                  return "{\"error\": \"Invalid store ID\"}";
            } catch (Exception e) {
                  response.status(500);
                  return "{\"error\": \"An error occurred while processing the request\"}";
            }
      }

      public String getTimes(Request request, Response response) {
            int id = Integer.parseInt(request.params(":id"));
            String availableTimes = storesDAO.getTimes(id);
            if (availableTimes != null) {
                  response.status(200); // success
                  return availableTimes;
            } else {
                  response.status(404); // 404 Not found
                  return "{\"error\": \"Store not found\"}";
            }
      }

      public String insert(Request request, Response response) {
            try {
                  Stores stores = new Stores();
                  stores.setTitle(request.queryParams("title"));
                  stores.setAddress(request.queryParams("address"));
                  stores.setPhone_number(request.queryParams("phone_number"));
                  stores.setWhatsapp(request.queryParams("whatsapp"));
                  stores.setInstagram(request.queryParams("instagram"));
                  stores.setAvailable_times_for_day(""); // Set initial value to empty string
                  storesDAO.insert(stores);
                  response.status(201); // 201 Created
                  return toJson(stores);
            } catch (Exception e) {
                  response.status(500);
                  return "{\"error\": \"An error occurred while processing the request\"}";
            }
      }

      public String get(Request request, Response response) {
            try {
                  int id = Integer.parseInt(request.params(":id"));
                  Stores stores = storesDAO.get(id);
                  if (stores != null) {
                        response.status(200); // success
                        return toJson(stores);
                  } else {
                        response.status(404); // 404 Not found
                        return "{\"error\": \"Store not found\"}";
                  }
            } catch (NumberFormatException e) {
                  response.status(400);
                  return "{\"error\": \"Invalid store ID\"}";
            } catch (Exception e) {
                  response.status(500);
                  return "{\"error\": \"An error occurred while processing the request\"}";
            }
      }

      public Stores getToUpdate(Request request, Response response) {
            try {
                  int id = Integer.parseInt(request.params(":id"));
                  Stores stores = storesDAO.get(id);
                  if (stores != null) {
                        response.status(200); // success
                        return stores;
                  } else {
                        response.status(404); // 404 Not found
                        return null;
                  }
            } catch (NumberFormatException e) {
                  response.status(400);
                  return null;
            } catch (Exception e) {
                  response.status(500);
                  return null;
            }
      }

      public String getAll(Request request, Response response) {
            try {
                  List<Stores> storeList = storesDAO.getAll();
                  if (!storeList.isEmpty()) {
                        return gson.toJson(storeList);
                  } else {
                        response.status(404);
                        return "{\"error\": \"No stores found\"}";
                  }
            } catch (Exception e) {
                  response.status(500);
                  return "{\"error\": \"An error occurred while processing the request\"}";
            }
      }

      public String delete(Request request, Response response) {
            try {
                  int id = Integer.parseInt(request.params(":id"));
                  Stores deletedStore = storesDAO.get(id);
                  if (deletedStore != null) {
                        storesDAO.delete(id);
                        response.status(200); // success
                        return toJson(deletedStore);
                  } else {
                        response.status(404); // 404 Not found
                        return "{\"error\": \"Store not found\"}";
                  }
            } catch (NumberFormatException e) {
                  response.status(400);
                  return "{\"error\": \"Invalid store ID\"}";
            } catch (Exception e) {
                  response.status(500);
                  return "{\"error\": \"An error occurred while processing the request\"}";
            }
      }

      public void removeAvailableTime(int storeId, Date date, Time timeToRemove) {
            try {
                  Stores stores = storesDAO.get(storeId);
                  if (stores != null) {
                        String availableTimesJson = stores.getAvailable_times_for_day();
                        System.out.println("Available times JSON: " + availableTimesJson);

                        JsonObject availableTimesObject = JsonParser.parseString(availableTimesJson).getAsJsonObject();
                        String dateString = date.toString();
                        JsonArray availableTimesForDate = availableTimesObject.getAsJsonArray(dateString);
                        if (availableTimesForDate != null) {
                              for (int i = 0; i < availableTimesForDate.size(); i++) {
                                    String timeString = availableTimesForDate.get(i).getAsString();
                                    // Remover os segundos do horário
                                    String timeToRemoveWithoutSeconds = timeToRemove.toString().substring(0, 5);
                                    if (timeString.equals(timeToRemoveWithoutSeconds)) {
                                          availableTimesForDate.remove(i);
                                          break;
                                    }
                              }

                              storesDAO.updateTimes(storeId, availableTimesObject, dateString);
                              System.out.println("Store ID: " + storeId + ", Date: " + date + ", Time to remove: "
                                          + timeToRemove);
                              System.out.println("Updated available times: " + availableTimesObject.toString());
                              System.out.println("Available time removed successfully");
                        } else {
                              System.out.println("No available times found for the specified date: " + dateString);
                        }

                  } else {
                        System.out.println("No store found with ID: " + storeId);
                  }
            } catch (Exception e) {
                  System.out.println("An error occurred while removing available time");
                  System.out.println("Store ID: " + storeId + ", Date: " + date + ", Time to remove: " + timeToRemove);
                  System.out.println(e.getMessage());
                  throw new RuntimeException("An error occurred while processing the request", e);
            }
      }

      private String toJson(Stores stores) {
            return gson.toJson(stores);
      }
}
