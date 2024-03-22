import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";

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
  top:0;
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.20));
`;

const H_1 = styled.h1`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  color: var(--black);
  margin: 0;
`;

const H_2 = styled(H_1)`
  margin: 10px 0;
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
   }
   filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
`;

const DivService = styled.div`
  margin: 100px 20px 100px;
  color: var(--black);
  text-decoration: none;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const ImgProfileWrapper = styled.div`
  width: 169px;
  height: 169px;
  border-radius: 50%;
  background-color: var(--light-gray);      
  display: flex;
  margin: 20px auto;
`;

const ImgProfile = styled.img`
  width: 169px;
  height: 169px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #8AC7DE;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const Button = styled.button`
  width: 100%;      
  height: 50px;
  font-size: 18px;
  font-weight: 700;
  border: none;
  color: var(--black);
  background-color: var(--white);
  border-bottom: 1px solid var(--light-gray);
  box-sizing: border-box;
  &:active {
    border-left: 5px solid var(--primary); 
    border-right: 5px solid transparent;
    background-color: var(--secondary-light-gray);
    transform: scale(0.95);
  }
`;

const ExitButton = styled.button`
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
  background-color: var(--primary);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  &:active{
    background-color: var(--light-secondary);
    transform: scale(0.95);
  }
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
`;

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

const Footer = styled.div`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  max-width: 420px;
  background-color: var(--secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  position: fixed;
`;

function MyAcc() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { storeId } = useParams();


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser || !storedUser.logged) {
      navigate(`/HomePage/store/${storeId}/NumberPage`);
    } else {
      setCurrentUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate(`/HomePage/store/${storeId}`);
    localStorage.removeItem("currentUser");
  };

  const handleMyAppointments = () => {
    navigate(`/HomePage/store/${storeId}/MyScheduling`);
  };

  const handleMyIdealCut = () => {
    navigate(`/HomePage/store/${storeId}/VisagismPage`);
  };

  const handleHistory = () => {
    // Lógica para histórico
  };

  const handleAvailableTimes = () => {
    navigate(`/HomePage/store/${storeId}/AdminPage`);
  };

  const handleMonthlyActivity = () => {
    // Lógica para atividade mensal
  };

  const handleAddService = () => {
    navigate(`/HomePage/store/${storeId}/AddService`);
  };

  const handleAddAdditionalService = () => {
    navigate(`/HomePage/store/${storeId}/AddAdditionalService`);
  };

  return (
    <>
      {currentUser && currentUser.logged && (
        <Page>
          <Header>
            <H_1>Minha Conta</H_1>
            <Exit onClick={() => navigate(`/HomePage/store/${storeId}`)}>X</Exit>
          </Header>
          <DivService>
            <H_2>Olá, {currentUser.name}</H_2>
            <ImgProfileWrapper>
              <ImgProfile src={currentUser.photo} alt="Foto do perfil" />
            </ImgProfileWrapper>
            {currentUser.type === "admin" ? (
              <>
                <Button onClick={handleAvailableTimes}>Disponibilizar Horários</Button>
                <Button onClick={handleMonthlyActivity}>Atividade Mensal</Button>
                <Button onClick={handleAddService}>Adicionar Serviços</Button>
                <Button onClick={handleAddAdditionalService}>Adicionar Serviços Adicionais</Button>
              </>
            ) : (
              <>
                <Button onClick={handleMyAppointments}>Meus Agendamentos</Button>
                <Button onClick={handleMyIdealCut}>Meu Corte Ideal</Button>
              </>
            )}
          </DivService>
          <Footer>
            <ExitButton onClick={handleLogout}>Sair</ExitButton>
          </Footer>
          {showModal && (
            <ModalBackground onClick={() => setShowModal(false)}>
              <ModalDiv>
                <P>{errorMessage}</P>
              </ModalDiv>
            </ModalBackground>
          )}
        </Page>
      )}
    </>
  );
}


export default MyAcc;
