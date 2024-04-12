package service;

import java.util.List;
import com.google.gson.Gson;
import dao.StoresDAO;
import model.Stores;
import spark.Request;
import spark.Response;

public class StoresService {

      private StoresDAO storesDAO = new StoresDAO();
      private Gson gson = new Gson();

      public String insert(Request request, Response response) {
            Stores stores = new Stores();
            stores.setTitle(request.queryParams("title"));
            stores.setLocation_image_url(request.queryParams("location_image_url"));
            stores.setLocation_url(request.queryParams("location_url"));
            stores.setAddress(request.queryParams("address"));
            stores.setPhone_number(request.queryParams("phone_number"));
            stores.setWhatsapp(request.queryParams("whatsapp"));
            stores.setInstagram(request.queryParams("instagram"));
            storesDAO.insert(stores);
            response.status(201); // 201 Created
            return toJson(stores);
      }

      public String get(Request request, Response response) {
            int id = Integer.parseInt(request.params(":id"));
            Stores stores = storesDAO.get(id);
            if (stores != null) {
                  response.status(200); // success
                  return toJson(stores); // Corrigido aqui
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
                        response.status(404); // Not found
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
