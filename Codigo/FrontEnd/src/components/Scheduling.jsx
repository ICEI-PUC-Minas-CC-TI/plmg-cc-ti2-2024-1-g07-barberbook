import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from './Page';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import stores from '../assets/js/store';

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

const H_1 = styled.h1`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  color: var(--black);
  margin: 0;
`;

const H_2 = styled.h2`
  font-size: 18px;
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
`;

const Footer = styled.div`
  width: 100%;
  height: 60px;
  max-width: 425px;
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
  &:active{
    color: var(--white);
    background-color: var(--light-secondary);
    transform: scale(0.95);
  }
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
`;

const ModalDiv = styled.div`
  color: var(--black);
  text-align: center;
  background-color: var(--white);
  border-radius: 5px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background-color: var(--light-green);
  color: var(--black);
`;

const ModalOverlay = styled.div`
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
`;

const AvailabilityBar = styled.div`
  height: 5px;
  background-color: var(--light-gray);
  border-radius: 1px;
  width: 100%;
`;

const AvailabilityBarFill = styled.div`
  height: 5px;
  background-color: var(--light-green);
  border-radius: 1px;
  width: ${(props) => props.availablePercentage}%;
`

const HeaderModal = styled.div` 
  width: 350px;
  max-width: 100%; 
  display: flex; 
  justify-content: space-between; 
  padding: 20px; 
  box-sizing: border-box; 
  background-color: var(--white); 
  align-items: center; 
  border-radius: 5px;
`;
const Schedules = styled.div` 
  width: 350px; 
  max-width: 100%; 
  background-color: var(--white); 
  font-family: Arial, Helvetica, sans-serif; line-height: 1.125em; 
  margin: 0 auto 20px; 
`;

function SchedulingPage() {
  const { storeId, serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availablePercentage, setAvailablePercentage] = useState(0);
  const [alert, setAlert] = useState(false);
  const store = stores.find(store => store.id === parseInt(storeId));
  const availableTimesForDay = store ? store.availableTimesForDay : [];
  console.log(availableTimesForDay);

  const minDate = new Date();
  minDate.setDate(1);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);
  maxDate.setDate(0);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDayClick = (value) => {
    const selectedDay = value.toISOString().split('T')[0];
    // Encontrar a loja correspondente com base no storeId
    const selectedStore = stores.find(store => store.id === parseInt(storeId));
    if (selectedStore) {
      const availableTimesForDayValue = selectedStore.availableTimesForDay[selectedDay] || [];
      const availableTimesCount = availableTimesForDayValue.length;
      const availablePercentage = (availableTimesCount / 24) * 100;
      setAvailableTimes(availableTimesForDayValue);
      setAvailablePercentage(availablePercentage);
      setShowModal(true);
    } else {
      console.log('Loja não encontrada para o storeId:', storeId);
    }
  };

  const handleButtonClick = (time) => {
    setSelectedTime(time);
    setAlert(true);
    setTimeout(() => {
      sessionStorage.setItem('selectedTime', time);
      setShowModal(false);
      setAlert(false);
      navigate(`/HomePage/store/${storeId}/NumberPage`);
    }, 2500);
  };

  return (
    <Page>
      <Header>
        <H_1>Selecione seu Horário</H_1>
        <Exit onClick={() => { sessionStorage.clear(); navigate(-3); }}>X</Exit>
      </Header>

      <DivService>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          showWeekDayNames
          minDate={minDate}
          maxDate={maxDate}
          onClickDay={handleDayClick}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const selectedDay = date.toISOString().split('T')[0];
              const selectedStore = stores.find(store => store.id === parseInt(storeId));
              const availableTimesForDayValue = selectedStore?.availableTimesForDay[selectedDay] || [];
              const availableTimesCount = availableTimesForDayValue.length;
              const availablePercentage = (availableTimesCount / 24) * 100;
              return (
                <AvailabilityBar>
                  <AvailabilityBarFill availablePercentage={availablePercentage} />
                </AvailabilityBar>
              );
            }
          }}
        />
      </DivService>

      <Footer>
        <Back onClick={() => navigate(-1)}>Voltar</Back>
      </Footer>

      {showModal && (
        <ModalOverlay>
          <ModalDiv>
            {alert ? null : (
              <HeaderModal>
                <H_2>Horários Disponíveis</H_2>
                <Exit onClick={() => setShowModal(false)}>x</Exit>
              </HeaderModal>
            )}
            <Schedules>
              {alert ? (
                <P>Estamos quase lá! Para concluir o agendamento, faça seu cadastro.</P>
              ) : (
                availableTimes.length === 0 ? (
                  <p>Sem horários disponíveis.</p>
                ) : (
                  availableTimes.map((time, index) => (
                    <Button key={index} onClick={() => handleButtonClick(time)}>
                      {time}
                    </Button>
                  ))
                )
              )}
            </Schedules>
          </ModalDiv>
        </ModalOverlay>
      )}
    </Page>
  );
}

export default SchedulingPage;
