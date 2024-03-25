import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";
import "../assets/css/index.css";
import stores from "../assets/js/store";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FaceIcon from '@mui/icons-material/Face'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

const Capa = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
  max-width:420px;
  max-height: 220px;
`;

const Content = styled.div`
  max-width: 420px;
  min-width: 320px;
  min-height: 100%;
  background-color: var(--primary);
  display: flex;
  flex-direction: column;
  border-radius: 30px 30px 0 0;
  position: relative;
`;

const ImgProfileWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ImgProfile = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--secondary);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const Title = styled.h1`
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 120px 0 0 0;
  text-align: center;
  color: var(--black);
`;

const SecondTitle = styled.h2`
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  color: var(--black);
`;

const H_1 = styled.h3`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  color: var(--black);
  margin: 30px 0 20px 0;
`;

const BtnSchedule = styled.button`
  margin: 20px auto 5px;
  text-align: center;
  color: var(--white);
  background-color: var(--secondary);
  width: 213px;
  height: 45px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  &:active{
    background-color: var(--light-secondary);
    color: var(--black);
    transform: scale(0.95);
  }
`;

const DivService = styled.div`
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
  };
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

const Location = styled.div`
  width: 169px;
  height: 123px;
  border-radius: 5px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin: 0 auto 14px;
`;

const LocationImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  object-fit: cover;
  &:active{
    opacity: 0.5;
  }
`;

const Adress = styled.div`
  color: var(--black);
  font-family: Raleway;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`;

const Number = styled.div`
  color: var(--black);
  font-family: "Readex Pro";
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-align:center;
  margin: 6px 0;
`;

const SocialContainer = styled.div`
  margin: 0 auto 30px;
`;

const SocialMedia = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  text-align: center;
  margin: 0 auto 1rem;
  color: var(--black);
  justify-content: start;
  gap: 0.5rem;
`;

const FooterFixed = styled.div`
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  background-color: var(--secondary);
  height: 72px;
  width: 420px;
  max-width: 100%;
  z-index: 999;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  color: var(--white);
  &:active{
    color: var(--primary);
    transform: scale(0.95);
  }
`;

const adressStyle = {
  marginTop: '10px'
}

const PaddingButton = styled.div`
  padding: 10px;
  background-color: var(--white);
  border-radius: 5px;
  position: relative;
  top: -20px;
  border: 1px solid var(--light-black);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.20);
  &:active{ 
    background-color: var(--light-gray);
    transform: scale(0.95);
  }
`;

function Home() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { userId } = useParams();

  // Encontrar a loja com o ID correspondente ao fornecido na URL
  const store = stores.find(store => store.id === parseInt(storeId));

  if (!store) {
    return <Page>
      <Title>Loja não encontrada!</Title>
    </Page>;
  }

  const handleServiceClick = (serviceId) => {
    navigate(`/HomePage/store/${storeId}/ServicePage/${serviceId}`);
  };
  

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    servicesSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Page style={{ height: 'auto' }}>
      <Capa src="/capa.jpg" alt="Barber Book Capa" />
      <Content key={store.id}>
        <ImgProfileWrapper>
          <ImgProfile src="/profile.svg" alt="Barber Book Logo" />
        </ImgProfileWrapper>
        <Title>{store.title}</Title>
        <SecondTitle>BARBERSHOP</SecondTitle>
        <BtnSchedule onClick={scrollToServices}>AGENDAR HORÁRIO</BtnSchedule>
        <DivService id="services">
          <H_1>Selecione o Serviço</H_1>
          {store.services.map(service => (
            <Service key={service.id} onClick={() => handleServiceClick(service.id)}>
              <ServiceText>{service.title}</ServiceText>
              <ServicePrice>R$ {service.price.toFixed(2)}</ServicePrice>
            </Service>
          ))}
        </DivService>

        <H_1>Localização</H_1>
        <Location>
          <a href={store.locationUrl} target="_blank"><LocationImage src="/location.png" alt="Location" /></a>
        </Location>
        <Adress style={adressStyle}>{store.address}</Adress>
        <Number>{store.phoneNumber}</Number>

        <SocialContainer>
          <H_1>Redes Sociais</H_1>
          <SocialMedia>
            <WhatsAppIcon />
            <Adress>{store.whatsapp}</Adress>
          </SocialMedia>
          <SocialMedia style={{ marginBottom: "100px" }}>
            <InstagramIcon />
            <Adress>{store.instagram}</Adress>
          </SocialMedia>
        </SocialContainer>

      </Content>

      <FooterFixed>
        <Button>
          <FaceIcon style={{ width: '1.4em', height: '1.4em' }} onClick={() => navigate(`/HomePage/store/${store.id}/VisagismPage/${userId}`)} />
        </Button>
        <PaddingButton>
          <Button style={{ color: 'var(--secondary)' }} onClick={scrollToServices}>
            <CalendarMonthIcon style={{ width: '1.4em', height: '1.4em' }} />
          </Button>
        </PaddingButton>
        <Button>
          <PermIdentityIcon style={{ width: '1.4em', height: '1.4em' }} onClick={() => navigate(`/HomePage/store/${store.id}/MyAccount/${userId}`)} />
        </Button>
      </FooterFixed>
    </Page>
  );
}

export default Home;
