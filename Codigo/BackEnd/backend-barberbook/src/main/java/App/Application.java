package App;

import static spark.Spark.*;
import service.StoresService;

public class Application {
    private static StoresService storesService = new StoresService();

    public static void main(String[] args) {
        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*"); // Permitir requisições de qualquer origem
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });

        // Configurar rota para permitir requisições OPTIONS para preflight
        options("/*", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*"); // Permitir requisições de qualquer origem
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            return "OK";
        });

        port(6789);
        staticFiles.location("/public");
        post("/stores/insert", (request, response) -> storesService.insert(request, response));
        get("/stores/:id", (request, response) -> storesService.get(request, response));
        get("/stores/list/:orderby", (request, response) -> storesService.getAll(request, response));
        // get("/stores/update/:id", (request, response) -> //
        // storesService.getToUpdate(request, response));
        // post("/stores/update/:id", (request, response) -> //
        // storesService.update(request, response));
        get("/stores/delete/:id", (request, response) -> storesService.delete(request, response));
    }
}