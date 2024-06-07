import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";
import InputMask from 'react-input-mask';

const Header = styled.div`
  width: 100%;
  max-width: 425px;
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
  max-width: 425px;
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



function NumberPage() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const parsedStoreId = parseInt(storeId);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [numberSaved, setNumberSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [save, setSave] = useState(true);
  const [next, setNext] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  const handleNext = () => {
    fetch(`http://localhost:6789/users/test/${number}/${parsedStoreId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result === 1) {
          setNumberSaved(true);
          setSave(true);
          setOk(true);
          setNext(false);
        } else if (data.result === 0) {
          setNumberSaved(false);
          setSave(false);
          setOk(true);
          setNext(false);
        } else {
          setErrorMessage('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
          setShowModal(true);
        }
      })
      .catch(error => {
        setErrorMessage('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
        setShowModal(true);
      });
  };

  const handleTestPassword = () => {
    const userData = {
      store_id: parsedStoreId,
      phone_number: number,
      password_hash: password
    };

    const queryParams = new URLSearchParams(userData).toString();
    fetch(`http://localhost:6789/users/login?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          setErrorMessage('Senha incorreta');
          setShowModal(true);
          throw new Error('Senha incorreta');
        }
      })
      .then(data => {
        if (data.user === "Autenticado") {
          data.logged = true; 
          const userId = data.id;
          sessionStorage.setItem("currentUser", JSON.stringify(data));
          navigate(`/HomePage/store/${parsedStoreId}/MyAccount/${userId}`);
        } else {
          setErrorMessage('Senha incorreta');
          setShowModal(true);
        }
      })
      
      .catch(error => {
        console.error('Erro ao enviar solicitação:', error);
      });
  };

  const handleSave = () => {
    const userData = {
      store_id: parsedStoreId,
      name: name,
      phone_number: number,
      password_hash: password
    };
    console.log(userData);
    const queryParams = new URLSearchParams(userData).toString();
    fetch(`http://localhost:6789/users/insert?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error('Erro ao salvar usuário');
        }
      })
      .then(data => {
        data.logged = true;
        sessionStorage.setItem('currentUser', JSON.stringify(data));

        setErrorMessage('Usuário salvo com sucesso');
        setShowModal(true);
        navigate(`/HomePage/store/${parsedStoreId}/MyAccount/${data.id}`);
      })
      .catch(error => {
        console.error('Erro ao salvar usuário:', error);
        setErrorMessage('Erro ao salvar usuário. Por favor, tente novamente mais tarde.');
        setShowModal(true);
      });
  };

  return (
    <Page>
      <Header>
        <H1>Cadastro</H1>
        <Exit onClick={() => navigate(`/HomePage/store/${parsedStoreId}`)}>X</Exit>
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
