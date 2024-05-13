import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";
import "../assets/css/index.css";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FaceIcon from '@mui/icons-material/Face'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ClipLoader from "react-spinners/ClipLoader";

const Capa = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
  max-width:425px;
  max-height: 220px;
`;

const Content = styled.div`
  max-width: 425px;
  min-width: 320px;
  min-height: 100svh;
  background-color: var(--primary);
  display: flex;
  flex-direction: column;
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
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
  padding: 0 10px;
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
  width: 425px;
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

function Home() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [stores, setStores] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorStore, setErrorStore] = useState(null);
  const [errorServices, setErrorServices] = useState(null);
  const storedUser = JSON.parse(sessionStorage.getItem('currentUser'));

  useEffect(() => {
    setLoading(true);
    setErrorStore(null);
    setErrorServices(null);

    const fetchStoreDetails = async () => {
      try {
        const response = await fetch(`http://localhost:6789/stores/${storeId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching store details:', error);
        setErrorStore('Error fetching store details');
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`http://localhost:6789/services/store/${storeId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServices(data);
        setFilteredServices(data.filter(service => service.storeId === parseInt(storeId)));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setErrorServices('Error fetching services');
        setLoading(false);
      }
    };

    fetchStoreDetails();
    fetchServices();
  }, [storeId]);

  const handleServiceClick = (serviceId) => {
    if (!storedUser) {
      alert('Por favor, faça login para agendar um serviço.');
    } else {
      navigate(`/HomePage/store/${storeId}/ServicePage/${serviceId}`);
    }
  };
  
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    servicesSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Page style={{ height: 'auto' }}>
      {loading ? (
        <LoadingContainerStyles>
          <ClipLoader loading={true} size={80} color={"var(--primary)"} />
        </LoadingContainerStyles>
      ) : (
        <Content>
          {errorStore ? (
            <div>Error: {errorStore}</div>
          ) : (
            <>
              <Capa src="/capa.jpg" alt="Barber Book Capa" />
              <Content>
                <ImgProfileWrapper>
                  <ImgProfile src="/profile.svg" alt="Barber Book Logo" />
                </ImgProfileWrapper>
                <Title>{stores ? stores.title : ''}</Title>
                <SecondTitle>BARBERSHOP</SecondTitle>
                <BtnSchedule onClick={scrollToServices}>AGENDAR HORÁRIO</BtnSchedule>
                <DivService id="services">
                  <H_1>Selecione o Serviço</H_1>
                  {errorServices ? (
                    <SecondTitle>Serviços não disponíveis</SecondTitle>
                  ) : (
                    filteredServices.map(service => (
                      <Service key={service.id} onClick={() => handleServiceClick(service.id)}>
                        <ServiceText>{service.title}</ServiceText>
                        <ServicePrice>R$ {service.price.toFixed(2)}</ServicePrice>
                      </Service>
                    ))
                  )}
                </DivService>

                <H_1>Localização</H_1>
                <Location>
                  <a href={stores ? stores.locationUrl : ''} target="_blank" rel="noopener noreferrer">
                    <LocationImage src="/location.png" alt="Location" />
                  </a>
                </Location>
                <Adress style={adressStyle}>{stores ? stores.address : ''}</Adress>
                <Number>{stores ? stores.phoneNumber : ''}</Number>

                <SocialContainer>
                  <H_1>Redes Sociais</H_1>
                  <SocialMedia>
                    <WhatsAppIcon />
                    <Adress>{stores ? stores.whatsapp : ''}</Adress>
                  </SocialMedia>
                  <SocialMedia style={{ marginBottom: "100px" }}>
                    <InstagramIcon />
                    <Adress>@{stores ? stores.instagram : ''}</Adress>
                  </SocialMedia>
                </SocialContainer>

              </Content>

              <FooterFixed>
                <Button>
                  <FaceIcon style={{ width: '1.4em', height: '1.4em' }} onClick={() => navigate(`/HomePage/store/${stores.id}/VisagismPage/${storedUser.id}`)} />
                </Button>
                <PaddingButton>
                  <Button style={{ color: 'var(--secondary)' }} onClick={scrollToServices}>
                    <CalendarMonthIcon style={{ width: '1.4em', height: '1.4em' }} />
                  </Button>
                </PaddingButton>
                <Button>
                  <PermIdentityIcon style={{ width: '1.4em', height: '1.4em' }} onClick={() => storedUser ? navigate(`/HomePage/store/${stores.id}/MyAccount/${storedUser.id}`) : navigate(`/HomePage/store/${stores.id}/NumberPage`)} />
                </Button>
              </FooterFixed>
            </>
          )}
        </Content>
      )}
    </Page>
  );
}

export default Home;
