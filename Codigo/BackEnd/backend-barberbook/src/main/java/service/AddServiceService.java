package service;
import java.util.List;
import com.google.gson.Gson;

import dao.AddServiceDAO;
import model.AddService;
import spark.Request;
import spark.Response;

public class AddServiceService {
      private AddServiceDAO addServiceDAO = new AddServiceDAO();
      private Gson gson = new Gson();

    public String insert(Request request, Response response) {
        AddService addService = new AddService();
        addService.setTitle(request.queryParams("title"));
        addService.setStoreId(Integer.parseInt(request.queryParams("store_id")));
        addService.setPrice(Integer.parseInt(request.queryParams("price")));
        addServiceDAO.insert(addService);
        response.status(201);
        return toJson(addService);
    }

    public String get(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        AddService addService = addServiceDAO.get(id);
        if (addService != null) {
            response.status(200);
            return toJson(addService);
        } else {
            response.status(404);
            return "{\"error\": \"Service not found\"}";
        }
    }

    public String getAll(Request request, Response response) {
        try {
            List<AddService> serviceList = addServiceDAO.getAll();
            if (!serviceList.isEmpty()) {
                return gson.toJson(serviceList);
            } else {
                response.status(404);
                return "{\"error\": \"No services found\"}";
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public String getByStoreId(Request request, Response response) {
        int storeId = Integer.parseInt(request.params(":storeId"));
        try {
            List<AddService> serviceList = addServiceDAO.getByStoreId(storeId);
            if (!serviceList.isEmpty()) {
                return gson.toJson(serviceList);
            } else {
                response.status(404);
                return "{\"error\": \"No services found for the given store\"}";
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String delete(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        AddService deletedService = addServiceDAO.delete(id);
        if (deletedService != null) {
            response.status(200);
            return toJson(deletedService);
        } else {
            response.status(404);
            return "{\"error\": \"Service not found\"}";
        }
    }
    
    public String update(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        AddService existingService = addServiceDAO.get(id);
        if (existingService == null) {
            response.status(404);
            return "{\"error\": \"Service not found\"}";
        } else {
            AddService updatedService = new AddService();
            updatedService.setId(existingService.getId());
            updatedService.setTitle(request.queryParams("title"));
            updatedService.setStoreId(Integer.parseInt(request.queryParams("store_id")));
            updatedService.setPrice(Integer.parseInt(request.queryParams("price")));

            AddService result = addServiceDAO.update(updatedService);
            if (result != null) {
                response.status(200);
                return toJson(result);
            } else {
                response.status(500);
                return "{\"error\": \"Failed to update service\"}";
            }
        }
    }

    private String toJson(AddService addService) {
        return gson.toJson(addService);
    }
    
}