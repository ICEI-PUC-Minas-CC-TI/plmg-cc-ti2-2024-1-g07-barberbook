package App;

import static spark.Spark.*;
import service.StoresService;
import service.ServiceService;
import service.UsersService;
import service.AddServiceService;
import service.AppointmentsService;
import dao.StoresDAO;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Application {
    private static StoresService storesService = new StoresService();
    private static ServiceService serviceService = new ServiceService();
    private static UsersService usersService = new UsersService();
    private static AddServiceService addServiceService = new AddServiceService();
    private static AppointmentsService appointmentsService = new AppointmentsService();

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

        // Agendamento da execução automática da limpeza de horários expirados
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            StoresDAO storesDAO = new StoresDAO();
            storesDAO.limparHorariosExpirados();
        }, 0, 24, TimeUnit.HOURS);

        // Definição dos endpoints
        post("/stores/insert", (request, response) -> storesService.insert(request, response));
        get("/stores/:id", (request, response) -> storesService.get(request, response));
        get("/stores/list/:orderby", (request, response) -> storesService.getAll(request, response));
        delete("/stores/delete/:id", (request, response) -> storesService.delete(request, response));
        put("/stores/insertTimes/:storeId", (request, response) -> storesService.insertTimes(request, response));
        get("/stores/getTimes/:id", (request, response) -> storesService.getTimes(request, response));

        post("/services/insert", (request, response) -> serviceService.insert(request, response));
        get("/services/:id", (request, response) -> serviceService.get(request, response));
        get("/services/list/:orderby", (request, response) -> serviceService.getAll(request, response));
        get("/services/store/:storeId", (request, response) -> serviceService.getByStoreId(request, response));
        delete("/services/delete/:id", (request, response) -> serviceService.delete(request, response));
        put("/services/update/:id", (request, response) -> serviceService.update(request, response));

        post("/addservice/insert", (request, response) -> addServiceService.insert(request, response));
        get("/addservice/:id", (request, response) -> addServiceService.get(request, response));
        get("/addservice/list/:orderby", (request, response) -> addServiceService.getAll(request, response));
        get("/addservice/store/:storeId", (request, response) -> addServiceService.getByStoreId(request, response));
        delete("/addservice/delete/:id", (request, response) -> addServiceService.delete(request, response));
        put("/addservice/update/:id", (request, response) -> addServiceService.update(request, response));

        post("/users/insert", (request, response) -> usersService.insert(request, response));
        get("/users/:id", (request, response) -> usersService.get(request, response));
        // put("/users/update/:id", (request, response) -> usersService.update(request,
        // response));
        delete("/users/delete/:id", (request, response) -> usersService.delete(request, response));
        get("/users/test/:phoneNumber/:storeId", (request, response) -> usersService.test(request, response));
        post("/users/login", (request, response) -> usersService.login(request, response));

        post("/appointments/insert", (request, response) -> appointmentsService.insert(request, response));
        get("/appointments/:id", (request, response) -> appointmentsService.get(request, response));
        get("/appointments/list/:orderby", (request, response) -> appointmentsService.getAll(request, response));
        get("/appointments/store/:storeId", (request, response) -> appointmentsService.getByStoreId(request, response));
        delete("/appointments/delete/:id", (request, response) -> appointmentsService.delete(request, response));
        put("/appointments/update/:id", (request, response) -> appointmentsService.update(request, response));
        get("/appointments/user/:userId/store/:storeId", (request, response) -> appointmentsService.getByUserStore(request, response));
    }
}
