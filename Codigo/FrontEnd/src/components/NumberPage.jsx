import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";
import InputMask from 'react-input-mask';
import stores from "../assets/js/store";

const Header = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.20));
`;

const H1 = styled.h1`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  color: var(--black);
  margin: 0;
`;

const P = styled.p`
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  color: var(--secondary-light-black);
  padding: 10px;
  margin: 0;  
`;


const Exit = styled.button`
   width: 35px;
   height: 35px;
   font-size: 18px;
   border: none;
   font-weight: 700;
   border-radius: 50%;
   color: var(--secondary);
   background-color: var(--primary);
   display: flex;
   align-items: center;
   justify-content: center;
   &:active{
      color: var(--primary);
      background-color: var(--light-secondary);
      transform: scale(0.95);
   };
   filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
`;

const DivService = styled.div`
  padding: 100px 20px 100px;
  color: var(--black);
  text-decoration: none;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const Service = styled.div`
  align-items: center;
  max-width: 100%;
  border-radius: 5px;
  background: var(--white);
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.20);
  padding: 20px;
  box-sizing: border-box;
`;


const Footer = styled.div`
  width: 100%;
  height: 60px;
  max-width: 420px;
  background-color: var(--secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  position: fixed;
  flex-direction: column;
`;

const Back = styled.button`
  width: 100%;
  height: 40px;
  font-family: Raleway;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  border-radius: 4px;
  color: var(--black);
  background-color: var(--light-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  &:active{
    background-color: var(--light-secondary);
    transform: scale(0.95);
  }
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
`;

const Next = styled(Back)`
  background-color: var(--primary);
`;

const InputNumber = styled(InputMask)`
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: .5px solid var(--light-gray);
  border-radius: 4px;
  color: var(--secondary-light-black);
  background-color: var(--secondary-light-gray);
  padding:10px;
  margin-bottom: 10px;
  box-sizing: border-box;
`;

const InputName = styled(InputNumber)``;

const PasswordDiv = styled(InputNumber)``;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

const ModalDiv = styled.div`
  color: var(--black);
  text-align: center;
  background-color: var(--white);
  border-radius: 5px;
  padding:20px;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif; line-height: 1.125em; 
  width: 100%;
  max-width:350px;
`;

const Adress = styled.div`
  color: var(--white);
  font-family: Raleway;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin: 2px 0;
`;

const AdressBold = styled(Adress)`
  font-weight: 700;
`;


function NumberPage() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [users, setUsers] = useState([]);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [numberSaved, setNumberSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [testedPassword, setTestedPassword] = useState(false);
  const [save, setSave] = useState(true);
  const [next, setNext] = useState(true);
  const store = stores.find(store => store.id === parseInt(storeId));

  useEffect(() => {
    if (store) {
      setUsers(store.users || []);
    }
    if (localStorage.getItem("currentUser")) {
      navigate(`/HomePage/store/${storeId}/MyAccount`);
    }
  }, [store, storeId]);

  const handleNext = () => {
    console.log(store.user)
    if (!number || number.trim() === "") {
      setErrorMessage("Digite um número válido.");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2500);
    } else if (store.users.find(user => user.phoneNumber === number)) {
      const currentUser = store.users.find(user => user.phoneNumber === number);
      if (currentUser) {
        currentUser.logged = true;
      }
      setNumberSaved(true);
      setOk(true);
      setNext(false);
    } else {
      setName("");
      setPassword("");
      setErrorMessage("Número não encontrado. Preencha os campos de nome e idade para cadastrar.");
      setOk(true);
      setSave(false);
      setNext(false);
      setTimeout(() => {
        setShowModal(false);
      }, 2500);
    }
  };

  const handleTestPassword = () => {
    const currentUser = store.users.find(user => user.password === password);
    if (currentUser && password === currentUser.password) {
      currentUser.logged = true;
      setErrorMessage("Seja bem vindo!");
      setShowModal(true);
      setTimeout(() => {
        navigate(`/HomePage/store/${storeId}/MyAccount`);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }, 2000);
    } else {
      setErrorMessage("Senha incorreta ou usuário não encontrado.");
      setTestedPassword(true);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  };

  const handleSave = () => {
    if (password.length < 8) {
      setErrorMessage("A senha deve ter no mínimo 8 caracteres.");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    } else {
      const newUser = { number, name, password, logged: true };
      const updatedUsers = [...store.users, newUser]; // Adiciona o novo usuário à lista de usuários da loja
      store.users = updatedUsers; // Atualiza a lista de usuários da loja
      setUsers(updatedUsers); // Atualiza o estado local de usuários
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // Atualiza os usuários no armazenamento local
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setErrorMessage("Seja bem vindo!");
      setShowModal(true);
      setTimeout(() => {
        navigate(`/HomePage/store/${storeId}/MyAccount`);
      }, 2000);
    }
  };

  return (
    <Page>
      <Header>
        <H1>Cadastro</H1>
        <Exit onClick={() => navigate(`/HomePage/store/${storeId}`)}>X</Exit>
      </Header>
      <DivService>
        <Service>
          <InputNumber
            mask="(99) 9 9999-9999"
            autoComplete="tel"
            placeholder="(xx) x xxxx-xxxx"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          {
            !numberSaved && ok && (
              <>
                <InputName
                  placeholder="Digite seu nome"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <PasswordDiv
                  type="password"
                  autoComplete="password"
                  placeholder="********"
                  minLength="8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )
          }
          {
            numberSaved && ok && (
              <PasswordDiv
                type="password"
                autoComplete="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )
          }
          {numberSaved && save && !next && (
            <Next onClick={handleTestPassword}>Entrar</Next>
          )}
          {!numberSaved && !save && !next && (
            <Next onClick={handleSave}>Criar Conta</Next>
          )}
          {next && (
            <Next onClick={handleNext}>Próximo</Next>
          )}
        </Service>
      </DivService>
      <Footer>
        <AdressBold>©2024. Todos os direitos reservados.​</AdressBold>
        <Adress>Desenvolvido por Guilherme Lana</Adress>

      </Footer>

      {showModal && (
        <ModalBackground onClick={() => setShowModal(false)}>
          <ModalDiv>
            <P>{errorMessage}</P>
          </ModalDiv>
        </ModalBackground>
      )}
    </Page>
  );
}

export default NumberPage;
