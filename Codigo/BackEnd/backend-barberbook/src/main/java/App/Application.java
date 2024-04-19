package App;

import static spark.Spark.*;
import service.StoresService;

public class Application {
    private static StoresService storesService = new StoresService();

    public static void main(String[] args) {
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
