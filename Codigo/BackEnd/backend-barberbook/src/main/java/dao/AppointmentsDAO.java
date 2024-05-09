package dao;

import model.Appointments; 
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AppointmentsDAO extends DAO { 

    public AppointmentsDAO() {
        super();
        conectar();
    }

    public void finalize() {
        close();
    }

    public Appointments insert(Appointments appointments) {
        try {
            PreparedStatement stmt = conexao.prepareStatement(
                    "INSERT INTO appointments (store_id, appointment_date, user_id, service_id, additional_service_id, start_time) VALUES (?, ?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, appointments.getStoreId());
            stmt.setDate(2, appointments.getAppointmentsDate());
            stmt.setInt(3, appointments.getUserId());
            stmt.setInt(4, appointments.getServiceId());
            stmt.setInt(5, appointments.getAdditionalServiceId());
            stmt.setTime(6, appointments.getStartTime());
            stmt.executeUpdate();

            ResultSet rs = stmt.getGeneratedKeys();
            int generatedId = -1;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            stmt.close();

            appointments.setId(generatedId);
            System.out.println("Appointments inserted");
            return appointments;
        } catch (SQLException e) {
            System.out.println("Appointments not inserted");
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
    }

    public Appointments get(int id) { 
        Appointments appointments = null;
        try {
            PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM appointments WHERE id = ?");
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                appointments = new Appointments(rs.getInt("id"), rs.getInt("store_id"), rs.getDate("appointment_date"),
                        rs.getInt("user_id"), rs.getInt("service_id"), rs.getInt("additional_service_id"), rs.getTime("start_time"));
            }
            stmt.close();
            return appointments;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

   public List<Appointments> getAll() { 
        List<Appointments> appointmentsList = new ArrayList<>();
        try {
            PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM appointments");
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                int storeId = rs.getInt("store_id");
                Date appointmentsDate = rs.getDate("appointment_date");
                int userId = rs.getInt("user_id");
                int serviceId = rs.getInt("service_id");
                int additionalServiceId = rs.getInt("additional_service_id");
                Time startTime = rs.getTime("start_time");
                Appointments appointments = new Appointments(id, storeId, appointmentsDate, userId, serviceId, additionalServiceId, startTime);
                appointmentsList.add(appointments);
            }
            stmt.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return appointmentsList;
    }

    public List<Appointments> getByStoreId(int storeId) { 
        List<Appointments> appointmentsList = new ArrayList<>();
        try {
            PreparedStatement stmt = conexao.prepareStatement("SELECT * FROM appointments WHERE store_id = ?");
            stmt.setInt(1, storeId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                Date appointmentsDate = rs.getDate("appointment_date");
                int userId = rs.getInt("user_id");
                int serviceId = rs.getInt("service_id");
                int additionalServiceId = rs.getInt("additional_service_id");
                Time startTime = rs.getTime("start_time");
                Appointments appointments = new Appointments(id, storeId, appointmentsDate, userId, serviceId, additionalServiceId, startTime);
                appointmentsList.add(appointments);
            }
            stmt.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return appointmentsList;
    }

    public Appointments delete(int id) { 
        try {
            PreparedStatement stmt = conexao.prepareStatement("DELETE FROM appointments WHERE id = ?");
            stmt.setInt(1, id);
            int rowsDeleted = stmt.executeUpdate();
            stmt.close();
            if (rowsDeleted > 0) {
                return new Appointments();
            } else {
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public Appointments update(Appointments appointments) { 
        try {
            PreparedStatement stmt = conexao.prepareStatement(
                    "UPDATE appointments SET store_id = ?, appointment_date = ?, user_id = ?, service_id = ?, additional_service_id = ? WHERE id = ?, start_time = ?");
            stmt.setInt(1, appointments.getStoreId());
            stmt.setDate(2, appointments.getAppointmentsDate());
            stmt.setInt(3, appointments.getUserId());
            stmt.setInt(4, appointments.getServiceId());
            stmt.setInt(5, appointments.getAdditionalServiceId());
            stmt.setInt(6, appointments.getId());
            stmt.setTime(7, appointments.getStartTime());
            int rowsUpdated = stmt.executeUpdate();
            stmt.close();
            if (rowsUpdated > 0) {
                return appointments;
            } else {
                return null;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}