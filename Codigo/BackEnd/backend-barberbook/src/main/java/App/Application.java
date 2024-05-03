package App;

import static spark.Spark.*;
import service.StoresService;
import service.ServiceService;
import service.UsersService;

public class Application {
    private static StoresService storesService = new StoresService();
    private static ServiceService serviceService = new ServiceService();
    private static UsersService usersService = new UsersService();

    public static void main(String[] args) {
        port(6789);
        staticFiles.location("/public");

        // Configuração do CORS
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Request-Method", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        });

        // Definição dos endpoints
        post("/stores/insert", (request, response) -> storesService.insert(request, response));
        get("/stores/:id", (request, response) -> storesService.get(request, response));
        get("/stores/list/:orderby", (request, response) -> storesService.getAll(request, response));
        delete("/stores/delete/:id", (request, response) -> storesService.delete(request, response));

        post("/services/insert", (request, response) -> serviceService.insert(request, response));
        get("/services/:id", (request, response) -> serviceService.get(request, response));
        get("/services/list/:orderby", (request, response) -> serviceService.getAll(request, response));
        get("/services/store/:storeId", (request, response) -> serviceService.getByStoreId(request, response));
        delete("/services/delete/:id", (request, response) -> serviceService.delete(request, response));
        put("/services/update/:id", (request, response) -> serviceService.update(request, response));

        post("/users/insert", (request, response) -> usersService.insert(request, response));
        get("/users/:id", (request, response) -> usersService.get(request, response));
        // put("/users/update/:id", (request, response) -> usersService.update(request,
        // response));
        delete("/users/delete/:id", (request, response) -> usersService.delete(request, response));
        get("/users/test/:phoneNumber/:storeId", (request, response) -> usersService.test(request, response));
        post("/users/login", (request, response) -> usersService.login(request, response));
    }

}
