package model;

public class Service {
      private int id;
      private int storeId;
      private String title;
      private int price;

      public Service() {
            id = -1;
            storeId = -1;
            title = "";
            price = 0;
      }

      public Service(int id, int storeId, String title, int price) {
            setId(id);
            setStoreId(storeId);
            setTitle(title);
            setPrice(price);
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

      public String getTitle() {
            return title;
      }

      public void setTitle(String title) {
            this.title = title;
      }

      public int getPrice() {
            return price;
      }

      public void setPrice(int price) {
            this.price = price;
      }
}