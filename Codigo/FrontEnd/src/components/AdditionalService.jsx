import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";
import "../assets/css/index.css";
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

const H_1 = styled.h1`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  color: var(--black);
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
  &:active {
    color: var(--primary);
    background-color: var(--light-secondary);
    transform: scale(0.95);
  };
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
`;

const DivService = styled.div`
  padding: 100px 0;
  background-color: var(--white);
`;

const Service = styled.div`
  display: grid;
  grid-template-columns: 4fr 2fr;
  align-items: center;
  max-width: 100%;
  padding: 0 10px;
  height: 70px;
  border-radius: 5px;
  background: var(--white);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.20);
  border: 1px solid var(--light-black);
  margin: 0 20px 20px;
  box-sizing: border-box;
  cursor: pointer;
  &:active {
    background: var(--light-gray);
    transform: scale(0.95);
  }
`;

const ServiceText = styled.div`
  flex-grow: 1;
  padding: 0 10px;
  font-size: 16px; 
  font-weight: 700;
  color: var(--black);
`;

const ServicePrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  width: 100%;
  max-width: 75.5px;
  justify-self: end;
  justify-content: end;
  color: var(--black);
  padding: 0 10px;
  border-left: 2px solid var(--light-black);
  height: 53px;
  display: flex;
  align-items: center;
`;

const Footer = styled.div`
  width: 100%;
  height: 60px;
  max-width: 420px;
  background-color: var(--secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  position: fixed;
`;

const Back = styled.button`
  width: 100px;
  height: 30px;
  font-family: Raleway;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  border-radius: 4px;
  color: var(--black);
  background-color: var(--light-primary);
  margin: 0 20px;
  &:active {
    color: var(--white);
    background-color: var(--light-secondary);
    transform: scale(0.95);
  }
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
`;

const Next = styled(Back)`
  background-color: var(--primary);
`;

function AdditionalService() {
  const { storeId, serviceId } = useParams(); // Obter serviceId da URL
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [additionalServices, setAdditionalServices] = useState([]);

  useEffect(() => {
    const foundStore = stores.find(store => store.id === parseInt(storeId));
    if (foundStore) {
      setStore(foundStore);
      const storeServices = foundStore.additionalServices;
      setAdditionalServices(storeServices);
    } else {
      console.error('Loja não encontrada');
      navigate(`/HomePage/store/${storeId}`);
    }
  }, [storeId]);

  const handleServiceSelection = (service) => {
    sessionStorage.setItem('SelectedAdditionalService', JSON.stringify(service));
    navigate(`/HomePage/store/${storeId}/ServicePage/${serviceId}/AdditionalService/SchedulingPage`);
  };

  const handleNoSelection = () => {
    sessionStorage.setItem('SelectedAdditionalService', JSON.stringify("Sem Serviço Adicional"));
    navigate(`/HomePage/store/${storeId}/ServicePage/${serviceId}/AdditionalService/SchedulingPage`);
  };

  return (
    <Page>
      <Header>
        <H_1>Serviços Adicionais</H_1>
        <Exit onClick={() => { sessionStorage.clear(); navigate(-2); }}>X</Exit>
      </Header>

      <DivService>
        {additionalServices.map(service => (
          <Service key={service.id} onClick={() => handleServiceSelection(service)}>
            <ServiceText>{service.title}</ServiceText>
            <ServicePrice>R$ {service.price.toFixed(2)}</ServicePrice>
          </Service>
        ))}
      </DivService>

      <Footer>
        <Back onClick={() => navigate(-1)}>Voltar</Back>
        <Next onClick={handleNoSelection}>Próximo</Next>
      </Footer>
    </Page>
  );
}

export default AdditionalService;
