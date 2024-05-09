package model;

import java.sql.Date;
import java.sql.Time;

public class Appointments {
      private int id;
      private int storeId;
      private Date appointmentsDate;
      private int userId;
      private int serviceId;
      private int additionalServiceId;
      private Time startTime;

      public Appointments() {
            id = -1;
            storeId = -1;
            appointmentsDate = null;
            userId = -1;
            serviceId = -1;
            additionalServiceId = -1;
            startTime = null;
      }

      public Appointments(int id, int storeId, Date appointmentsDate, int userId, int serviceId,
                  int additionalServiceId, Time startTime) {
            setId(id);
            setStoreId(storeId);
            setAppointmentsDate(appointmentsDate);
            setUserId(userId);
            setServiceId(serviceId);
            setAdditionalServiceId(additionalServiceId);
            setStartTime(startTime);
      }

      public int getId() {
            return id;
      }

      public void setId(int id) {
            this.id = id;
      }

      public int getStoreId() {
            return storeId;
      }

      public void setStoreId(int storeId) {
            this.storeId = storeId;
      }

      public Date getAppointmentsDate() {
            return appointmentsDate;
      }

      public void setAppointmentsDate(Date date) {
            this.appointmentsDate = date;
      }

      public int getUserId() {
            return userId;
      }

      public void setUserId(int userId) {
            this.userId = userId;
      }

      public int getServiceId() {
            return serviceId;
      }

      public void setServiceId(int serviceId) {
            this.serviceId = serviceId;
      }

      public int getAdditionalServiceId() {
            return additionalServiceId;
      }

      public void setAdditionalServiceId(int additionalServiceId) {
            this.additionalServiceId = additionalServiceId;
      }

      public Time getStartTime() {
            return startTime;
      }

      public void setStartTime(Time startTime) {
            this.startTime = startTime;
      }

}