package model;

public class Stores {
      private int id;
      private String title;
      private String location_image_url;
      private String location_url;
      private String address;
      private String phone_number;
      private String whatsapp;
      private String instagram;

      public Stores() {
            id = -1;
            title = "";
            location_image_url = "";
            location_url = "";
            address = "";
            phone_number = "";
            whatsapp = "";
            instagram = "";
      }

      public Stores(int id, String title, String location_image_url, String location_url, String address,
                  String phone_number, String whatsapp, String instagram) {
            setId(id);
            setTitle(title);
            setLocation_image_url(location_image_url);
            setLocation_url(location_url);
            setAddress(address);
            setPhone_number(phone_number);
            setWhatsapp(whatsapp);
            setInstagram(instagram);
      }

      public int getID() {
            return id;
      }

      public void setId(int id) {
            this.id = id;
      }

      public String getTitle() {
            return title;
      }

      public void setTitle(String title) {
            this.title = title;
      }

      public String getLocation_image_url() {
            return location_image_url;
      }

      public void setLocation_image_url(String location_image_url) {
            this.location_image_url = location_image_url;
      }

      public String getLocation_url() {
            return location_url;
      }

      public void setLocation_url(String location_url) {
            this.location_url = location_url;
      }

      public String getAddress() {
            return address;
      }

      public void setAddress(String address) {
            this.address = address;
      }

      public String getPhone_number() {
            return phone_number;
      }

      public void setPhone_number(String phone_number) {
            this.phone_number = phone_number;
      }

      public String getWhatsapp() {
            return whatsapp;
      }

      public void setWhatsapp(String whatsapp) {
            this.whatsapp = whatsapp;
      }

      public String getInstagram() {
            return instagram;
      }

      public void setInstagram(String instagram) {
            this.instagram = instagram;
      }
}