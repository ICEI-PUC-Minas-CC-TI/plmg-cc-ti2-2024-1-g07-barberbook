import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

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
  top:0;
  z-index: 999;
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
  z-index: 1;
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

const Footer = styled.div`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  max-width: 425px;
  background-color: var(--secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  position: fixed;
`;

const ModalDiv = styled.div`
  color: var(--black);
  text-align: center;
  background-color: var(--white);
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.125em;
  width: 100%;
  max-width: 350px;
  overflow-y: auto;
`;

const ModalServiceList = styled.div`
  max-height: 300px;
  text-align: left;
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid var(--light-gray);
`;

const ServiceName = styled.span`
  color: var(--black);
  flex: 1;
`;

const DeleteIcon = styled.span`
  cursor: pointer;
`;

const LoadingContainerStyles = styled.div`
  width: 100svw;
  height: 100svh;
  max-width: 425px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999; 
`;


function MyAcc() {
  const navigate = useNavigate();
  const { userId, storeId } = useParams();
  const [fetchedUser, setFetchedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [services, setServices] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [viewingAdditionalServices, setViewingAdditionalServices] = useState(false);
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:6789/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setFetchedUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to fetch user data. Please try again later.');
        setShowModal(true);
        setLoading(false);
        setTimeout(() => {
          setShowModal(false);
          setErrorMessage("");
        }, 2500);
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    navigate(`/HomePage/store/${storeId}`);
    sessionStorage.removeItem("currentUser");
  };

  const handleMyAppointments = () => {
    navigate(`/HomePage/store/${storeId}/MyScheduling/${userId}`);
  };

  const handleMyIdealCut = () => {
    navigate(`/HomePage/store/${storeId}/VisagismPage/${userId}`);
  };

  const handleAvailableTimes = () => {
    navigate(`/HomePage/store/${storeId}/AdminPage/${userId}`);
  };

  const handleMonthlyActivity = () => {
    navigate(`/HomePage/store/${storeId}/Activity/${userId}`);
  };

  const handleAddService = () => {
    navigate(`/HomePage/store/${storeId}/AddService/${userId}`);
  };

  const handleAddAdditionalService = () => {
    navigate(`/HomePage/store/${storeId}/AddAdditionalService/${userId}`);
  };

  const handleViewServices = async () => {
    try {
      const response = await fetch(`http://localhost:6789/services/store/${storeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services data');
      }
      const serviceData = await response.json();
      setServices(serviceData);
      setShowModal(true);
      setViewingAdditionalServices(false);
    } catch (error) {
      console.error('Error fetching services data:', error);
      setErrorMessage('Failed to fetch services data. Please try again later.');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setErrorMessage("");
      }, 2500);
    }
  };

  const handleViewAdditionalServices = async () => {
    try {
      const response = await fetch(`http://localhost:6789/addservice/store/${storeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch additional services data');
      }
      const serviceData = await response.json();
      setAdditionalServices(serviceData);
      setShowModal(true);
      setViewingAdditionalServices(true);
    } catch (error) {
      console.error('Error fetching additional services data:', error);
      setErrorMessage('Failed to fetch additional services data. Please try again later.');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setErrorMessage("");
      }, 2500);
    }
  }

  const handleDeleteService = async (serviceId) => {
    try {
      await fetch(`http://localhost:6789/services/delete/${serviceId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      setErrorMessage("Falha ao deletar serviço. Tente novamente mais tarde.");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setErrorMessage("");
      }, 2500);
    }
  }

  const handleDeleteAd = async (serviceId) => {
    try {
      await fetch(`http://localhost:6789/addservice/delete/${serviceId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting additional service:', error);
      setErrorMessage("Falha ao deletar serviço adicional. Tente novamente mais tarde.");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setErrorMessage("");
      }, 2500);
    }
  }

  return (
    <>
      {currentUser && currentUser.logged ? (
        <Page>
          <Header>
            <H_1>Minha Conta</H_1>
            <Exit onClick={() => navigate(`/HomePage/store/${storeId}`)}>X</Exit>
          </Header>
          {loading ? (
            <LoadingContainerStyles>
              <ClipLoader loading={true} size={80} color={"var(--primary)"} />
            </LoadingContainerStyles>
          ) : (
            fetchedUser ? (
              <DivService>
                <H_2>Olá, {fetchedUser.name}</H_2>
                <ImgProfileWrapper>
                  <ImgProfile src="/profile.svg" alt="Foto de Perfil" />
                </ImgProfileWrapper>
                {fetchedUser.type === "admin" ? (
                  <>
                    <Button onClick={handleAvailableTimes}>Disponibilizar Horários</Button>
                    <Button onClick={handleMonthlyActivity}>Atividade Mensal</Button>
                    <Button onClick={handleAddService}>Adicionar Serviços</Button>
                    <Button onClick={handleViewServices}>Visualizar Serviços</Button>
                    <Button onClick={handleAddAdditionalService}>Adicionar Serviços Adicionais</Button>
                    <Button onClick={handleViewAdditionalServices}>Visualizar Serviços Adicionais</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleMyAppointments}>Meus Agendamentos</Button>
                    <Button onClick={handleMyIdealCut}>Meu Corte Ideal</Button>
                  </>
                )}
              </DivService>
            ) : (
              <p>Usuário não encontrado.</p>
            )
          )}
          <Footer>
            <ExitButton onClick={handleLogout}>Sair</ExitButton>
          </Footer>
          {showModal && (
            <ModalBackground onClick={() => setShowModal(false)}>
              <ModalDiv>
                <H_2>{viewingAdditionalServices ? "Serviços Adicionais" : "Serviços"}</H_2>
                <ModalServiceList>
                  {viewingAdditionalServices ? (
                    additionalServices.map(service => (
                      <ServiceItem key={service.id}>
                        <ServiceName>{service.title}</ServiceName>
                        <DeleteIcon onClick={() => handleDeleteAd(service.id)}>❌</DeleteIcon>
                      </ServiceItem>
                    ))
                  ) : (
                    services.map(service => (
                      <ServiceItem key={service.id}>
                        <ServiceName>{service.title}</ServiceName>
                        <DeleteIcon onClick={() => handleDeleteService(service.id)}>❌</DeleteIcon>
                      </ServiceItem>
                    ))
                  )}
                </ModalServiceList>
              </ModalDiv>
            </ModalBackground>
          )}
        </Page>
      ) : null}
    </>
  );
}

export default MyAcc;
