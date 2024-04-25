package model;

public class Users {
    private int id;
    private int storeId;
    private String type;
    private String name;
    private String phone_number;
    private byte[] password_hash;

    public Users() {
        id = -1;
        storeId = -1;
        type = "";
        name = "";
        phone_number = "";
        password_hash = new byte[0];
    }

    public Users(int id, int storeId, String type, String name, String phone_number, byte[] password_hash) {
        setId(id);
        setStoreId(storeId);
        setType(type);
        setName(name);
        setPhoneNumber(phone_number);
        setPassword_hash(password_hash);
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
        return phone_number;
    }

    public void setPhoneNumber(String phone_number) {
        this.phone_number = phone_number;
    }

    public byte[] getPassword_hash() {
        return password_hash;
    }

    public void setPassword_hash(byte[] password_hash) {
        this.password_hash = password_hash;
    }
}
