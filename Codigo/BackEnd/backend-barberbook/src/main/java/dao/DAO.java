package dao;

import java.sql.*;
import io.github.cdimascio.dotenv.Dotenv;

public class DAO {
	protected Connection conexao;

	public boolean conectar() {
		Dotenv dotenv = Dotenv.load(); // Carregar as variáveis de ambiente do arquivo .env
		conexao = null;
		String driverName = dotenv.get("DRIVERNAME"); // Obter valor da variável de ambiente
		String serverName = dotenv.get("SERVERNAME");
		String mydatabase = dotenv.get("MYDATABASE");
		int porta = 5432;
		String url = "jdbc:postgresql://" + serverName + ":" + porta + "/" + mydatabase;
		String username = dotenv.get("USER_DB");
		String password = dotenv.get("PASSWORD_DB");
		boolean status = false;
		try {
			Class.forName(driverName);
			conexao = DriverManager.getConnection(url, username, password);
			status = (conexao != null);
			System.out.println("Conexão efetuada com o postgres!");
		} catch (ClassNotFoundException e) {
			System.err.println(
					"Conexão NÃO efetuada com o postgres -- Driver não encontrado -- " + e.getMessage());
		} catch (SQLException e) {
			System.err.println("Conexão NÃO efetuada com o postgres -- " + e.getMessage());
		}
		return status;
	}

	public boolean close() {
		boolean status = false;
		try {
			conexao.close();
			status = true;
		} catch (SQLException e) {
			System.err.println(e.getMessage());
		}
		return status;
	}
}