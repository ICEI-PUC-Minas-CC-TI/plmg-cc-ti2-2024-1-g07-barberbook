package service;
import java.util.List;
import com.google.gson.Gson;
import dao.serviceDAO;
import model.Service;
import spark.Request;
import spark.Response;

public class ServiceService {
    private serviceDAO serviceDAO = new serviceDAO();
    private Gson gson = new Gson();

    public String insert(Request request, Response response) {
        Service service = new Service();
        service.setTitle(request.queryParams("title"));
        service.setStoreId(Integer.parseInt(request.queryParams("store_id")));
        service.setPrice(Integer.parseInt(request.queryParams("price")));
        serviceDAO.insert(service);
        response.status(201);
        return toJson(service);
    }

    public String get(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        Service service = serviceDAO.get(id);
        if (service != null) {
            response.status(200);
            return toJson(service);
        } else {
            response.status(404);
            return "{\"error\": \"Service not found\"}";
        }
    }

    public String getAll(Request request, Response response) {
        try {
            List<Service> serviceList = serviceDAO.getAll();
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

    public String delete(Request request, Response response) {
        int id = Integer.parseInt(request.params(":id"));
        Service deletedService = serviceDAO.delete(id);
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
        Service existingService = serviceDAO.get(id);
        if (existingService == null) {
            response.status(404);
            return "{\"error\": \"Service not found\"}";
        } else {
            Service updatedService = new Service();
            updatedService.setId(existingService.getId());
            updatedService.setTitle(request.queryParams("title"));
            updatedService.setStoreId(Integer.parseInt(request.queryParams("store_id")));
            updatedService.setPrice(Integer.parseInt(request.queryParams("price")));

            Service result = serviceDAO.update(updatedService);
            if (result != null) {
                response.status(200);
                return toJson(result);
            } else {
                response.status(500);
                return "{\"error\": \"Failed to update service\"}";
            }
        }
    }

    private String toJson(Service service) {
        return gson.toJson(service);
    }
    
}