package service;

import java.util.List;
import com.google.gson.Gson;
import java.sql.Date;
import java.sql.Time;
import dao.AppointmentsDAO;
import model.Appointments;
import spark.Request;
import spark.Response;

public class AppointmentsService {
      private AppointmentsDAO appointmentsDAO = new AppointmentsDAO();
      private Gson gson = new Gson();

      public String insert(Request request, Response response) {
            try {
                  Appointments appointments = new Appointments();

                  String storeIdParam = request.queryParams("store_id");
                  if (storeIdParam != null && !storeIdParam.isEmpty()) {
                        appointments.setStoreId(Integer.parseInt(storeIdParam));
                  }

                  String appointmentsDateParam = request.queryParams("appointment_date");
                  if (appointmentsDateParam != null && !appointmentsDateParam.isEmpty()) {
                        if (appointmentsDateParam.matches("\\d{4}-\\d{2}-\\d{2}")) {
                              appointments.setAppointmentsDate(Date.valueOf(appointmentsDateParam));
                        } else {
                              throw new IllegalArgumentException("Invalid date format");
                        }
                  }

                  String userIdParam = request.queryParams("user_id");
                  if (userIdParam != null && !userIdParam.isEmpty()) {
                        appointments.setUserId(Integer.parseInt(userIdParam));
                  }

                  String serviceIdParam = request.queryParams("service_id");
                  if (serviceIdParam != null && !serviceIdParam.isEmpty()) {
                        appointments.setServiceId(Integer.parseInt(serviceIdParam));
                  }

                  String additionalServiceIdParam = request.queryParams("additional_service_id");
                  if (additionalServiceIdParam != null && !additionalServiceIdParam.isEmpty()) {
                        appointments.setAdditionalServiceId(Integer.parseInt(additionalServiceIdParam));
                  } else {
                        appointments.setAdditionalServiceId(1);
                  }

                  String startTimeParam = request.queryParams("start_time");
                  if (startTimeParam != null && !startTimeParam.isEmpty()) {
                        String decodedStartTimeParam = java.net.URLDecoder.decode(startTimeParam, "UTF-8");
                        appointments.setStartTime(Time.valueOf(decodedStartTimeParam));
                  }

                  appointmentsDAO.insert(appointments);

                  response.status(201);
                  return toJson(appointments);
            } catch (NumberFormatException e) {
                  response.status(400);
                  System.out.println(e.getMessage());
                  return "{\"error\": \"Invalid parameter format\"}";
            } catch (IllegalArgumentException e) {
                  response.status(400);
                  System.out.println(e.getMessage());
                  return "{\"error\": \"Invalid date format\"}";
            } catch (Exception e) {
                  response.status(500);
                  return "{\"error\": \"Failed to insert appointment\"}";
            }
      }

      public String get(Request request, Response response) {
            int id = Integer.parseInt(request.params(":id"));
            Appointments appointments = appointmentsDAO.get(id);
            if (appointments != null) {
                  response.status(200);
                  return toJson(appointments);
            } else {
                  response.status(404);
                  return "{\"error\": \"Appointments not found\"}";
            }
      }

      public String getAll(Request request, Response response) {
            List<Appointments> appointmentsList = appointmentsDAO.getAll();
            if (!appointmentsList.isEmpty()) {
                  return gson.toJson(appointmentsList);
            } else {
                  response.status(404);
                  return "{\"error\": \"No appointments found\"}";
            }
      }

      public String delete(Request request, Response response) {
            int id = Integer.parseInt(request.params(":id"));
            Appointments deletedAppointments = appointmentsDAO.delete(id);
            if (deletedAppointments != null) {
                  response.status(200);
                  return toJson(deletedAppointments);
            } else {
                  response.status(404);
                  return "{\"error\": \"Appointments not found\"}";
            }
      }

      public String update(Request request, Response response) {
            int id = Integer.parseInt(request.params(":id"));
            Appointments existingAppointments = appointmentsDAO.get(id);
            if (existingAppointments == null) {
                  response.status(404);
                  return "{\"error\": \"Appointments not found\"}";
            } else {
                  Appointments updatedAppointments = new Appointments();
                  updatedAppointments.setId(existingAppointments.getId());
                  updatedAppointments.setStoreId(Integer.parseInt(request.queryParams("store_id")));
                  updatedAppointments.setAppointmentsDate(Date.valueOf(request.queryParams("appointments_date")));
                  updatedAppointments.setUserId(Integer.parseInt(request.queryParams("user_id")));
                  updatedAppointments.setServiceId(Integer.parseInt(request.queryParams("service_id")));
                  updatedAppointments
                              .setAdditionalServiceId(Integer.parseInt(request.queryParams("additional_service_id")));
                  updatedAppointments.setStartTime(Time.valueOf(request.queryParams("start_time")));

                  Appointments result = appointmentsDAO.update(updatedAppointments);
                  if (result != null) {
                        response.status(200);
                        return toJson(result);
                  } else {
                        response.status(500);
                        return "{\"error\": \"Failed to update appointments\"}";
                  }
            }
      }

      public String getByStoreId(Request request, Response response) {
            int storeId = Integer.parseInt(request.params(":storeId"));
            List<Appointments> appointmentsList = appointmentsDAO.getByStoreId(storeId);
            if (!appointmentsList.isEmpty()) {
                  return gson.toJson(appointmentsList);
            } else {
                  response.status(404);
                  return "{\"error\": \"No appointments found\"}";
            }
      }

      public String getByUserStore(Request request, Response response) {
            int userId = Integer.parseInt(request.params(":userId"));
            int storeId = Integer.parseInt(request.params(":storeId"));
            List<Appointments> appointmentsList = appointmentsDAO.getByUserStore(userId, storeId);
            if (!appointmentsList.isEmpty()) {
                  return gson.toJson(appointmentsList);
            } else {
                  response.status(404);
                  return "{\"error\": \"No appointments found\"}";
            }
      }

      private String toJson(Appointments appointments) {
            return gson.toJson(appointments);
      }
}