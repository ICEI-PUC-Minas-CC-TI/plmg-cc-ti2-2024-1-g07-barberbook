package model;

public class Users {
    private int id;
    private int storeId;
    private String type;
    private String name;
    private String phoneNumber;
    private String passwordHash;

    public Users() {
    }

    public Users(int id, int storeId, String type, String name, String phoneNumber, String passwordHash) {
        setId(id);
        setStoreId(storeId);
        setType(type);
        setName(name);
        setPhoneNumber(phoneNumber);
        setPasswordHash(passwordHash);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        if (id > 0) {
            this.id = id;
        }
    }

    public int getStoreId() {
        return storeId;
    }

    public void setStoreId(int storeId) {
        if (storeId > 0) {
            this.storeId = storeId;
        }
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}
