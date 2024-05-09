package service;

import java.util.List;
import com.google.gson.Gson;
import dao.StoresDAO;
import model.Stores;
import spark.Request;
import spark.Response;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

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
                              JsonElement jsonElement = JsonParser.parseString(availableTimesJson);
                              storesDAO.insertTimes(id, jsonElement);
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
                  System.out.println(e.getMessage());
                  return "{\"error\": \"Invalid store ID\"}";
            } catch (Exception e) {
                  e.printStackTrace();
                  System.out.println(e.getMessage());
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
            Stores stores = new Stores();
            stores.setTitle(request.queryParams("title"));
            stores.setLocation_image_url(request.queryParams("location_image_url"));
            stores.setLocation_url(request.queryParams("location_url"));
            stores.setAddress(request.queryParams("address"));
            stores.setPhone_number(request.queryParams("phone_number"));
            stores.setWhatsapp(request.queryParams("whatsapp"));
            stores.setInstagram(request.queryParams("instagram"));
            stores.setAvailable_times_for_day(""); // Set initial value to empty string
            storesDAO.insert(stores);
            response.status(201); // 201 Created
            return toJson(stores);
      }

      public String get(Request request, Response response) {
            int id = Integer.parseInt(request.params(":id"));
            Stores stores = storesDAO.get(id);
            if (stores != null) {
                  response.status(200); // success
                  return toJson(stores);
            } else {
                  response.status(404); // 404 Not found
                  return "{\"error\": \"Store not found\"}";
            }
      }

      public Stores getToUpdate(Request request, Response response) {
            int id = Integer.parseInt(request.params(":id"));
            Stores stores = storesDAO.get(id);
            if (stores != null) {
                  response.status(200); // success
                  return stores;
            } else {
                  response.status(404); // 404 Not found
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
                  throw new RuntimeException(e);
            }
      }

      public String delete(Request request, Response response) {
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
      }

      private String toJson(Stores stores) {
            return gson.toJson(stores);
      }
}
