import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from './Page';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ClipLoader } from 'react-spinners';

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
  &:active {
    color: var(--primary);
    background-color: var(--light-secondary);
    transform: scale(0.95);
  }
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
  &:active {
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
`;

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
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.125em;
  margin: 0 auto 20px;
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

function SchedulingPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availablePercentage, setAvailablePercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser ? currentUser.id : null;
  const [alertTimeout, setAlertTimeout] = useState(null);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const response = await fetch(`http://192.168.0.63:6789/stores/getTimes/${storeId}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar os horários');
        }
        const data = await response.json();
        setStoreData(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar os horários:', error);
      }
    };
    fetchTimes();
  }, [storeId]);

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
    const availableTimesForDayValue = storeData[selectedDay] || [];
    const currentDate = new Date();
    const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

    const allTimesForDay = availableTimesForDayValue;

    const availableTimesForDay = availableTimesForDayValue.filter(time => {
      if (selectedDay === currentDate.toISOString().split('T')[0]) {
        const [hour, minute] = time.split(':').map(Number);
        const [currentHour, currentMinute] = currentTime.split(':').map(Number);
        if (hour > currentHour || (hour === currentHour && minute >= currentMinute)) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    });

    const availableTimesCount = availableTimesForDay.length;
    const availablePercentage = (availableTimesCount / allTimesForDay.length) * 100;
    setAvailableTimes(availableTimesForDay);
    setAvailablePercentage(availablePercentage);
    setShowModal(true);
    setSelectedDate(value);
    sessionStorage.setItem('selectedDate', value.toISOString().split('T')[0]);
  };

  const createAppointmentObject = () => {
    const selectedAdditionalService = sessionStorage.getItem('SelectedAdditionalService') || null;
    const selectedTime = new Date(parseInt(sessionStorage.getItem('selectedTime')));
    const selectedService = sessionStorage.getItem('SelectedService');
    const selectedDate = sessionStorage.getItem('selectedDate');
    const userId = currentUser ? currentUser.id : null;
    const idService = selectedService ? JSON.parse(selectedService).id : null;
    const idAdditionalService = selectedAdditionalService ? JSON.parse(selectedAdditionalService).id : null;
    const formattedTime = `${selectedTime.getHours()}:${selectedTime.getMinutes()}:${selectedTime.getSeconds()}`;

    return {
      selectedTime: formattedTime,
      selectedDate,
      idService,
      idAdditionalService,
      storeId,
      userId
    };
  };

  const handleButtonClick = async (time) => {
    const formattedTime = `${time}:00`;
    setSelectedTime(formattedTime);
    sessionStorage.setItem('selectedTime', new Date().setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1])));
    setAlert(true);
  
    const timeout = setTimeout(() => {
      setAlert(false);
    }, 3000);
    setAlertTimeout(timeout);
  
    setTimeout(async () => {
      if (currentUser) {
        const appointment = createAppointmentObject();
        sessionStorage.setItem('appointment', JSON.stringify(appointment));
  
        const queryParams = new URLSearchParams({
          store_id: appointment.storeId,
          appointment_date: appointment.selectedDate,
          start_time: encodeURIComponent(formattedTime), // Codificar o horário aqui
          user_id: appointment.userId,
          service_id: appointment.idService
        });
  
        // Verifica se o additional_service_id não é null nem undefined
        if (appointment.idAdditionalService != null) {
          queryParams.append('additional_service_id', appointment.idAdditionalService);
        }
  
        try {
          const response = await fetch(`http://localhost:6789/appointments/insert?${queryParams}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error('Erro ao fazer o agendamento');
          }
  
          setShowModal(false);
          setAlert(false);
          clearTimeout(alertTimeout);
          navigate(`/HomePage/store/${storeId}/MyAccount/${userId}`);
        } catch (error) {
          console.error('Erro ao fazer o agendamento:', error);
        }
      } else {
        setShowModal(false);
        navigate(`/HomePage/store/${storeId}/NumberPage`);
        alert("Para fazer o agendamento, é necessário fazer login.");
      }
    }, 2500);
  };  


  let calendarContent;
  if (loading) {
    calendarContent = (
      <LoadingContainerStyles>
        <ClipLoader loading={true} size={80} color={"var(--primary)"} />
      </LoadingContainerStyles>
    );
  } else {
    calendarContent = (
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
              const availableTimesForDayValue = storeData[selectedDay] || [];
              const totalTimesForDay = availableTimesForDayValue.length;
              const currentDate = new Date();
              const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

              const availableTimesCount = availableTimesForDayValue.filter(time => {
                if (selectedDay === currentDate.toISOString().split('T')[0]) {
                  const [hour, minute] = time.split(':').map(Number);
                  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
                  if (hour > currentHour || (hour === currentHour && minute >= currentMinute)) {
                    return true;
                  }
                  return false;
                } else {
                  return true;
                }
              }).length;

              const availablePercentage = totalTimesForDay > 0 ? (availableTimesCount / totalTimesForDay) * 100 : 0;
              return (
                <AvailabilityBar>
                  <AvailabilityBarFill availablePercentage={availablePercentage} />
                </AvailabilityBar>
              );
            }
          }}
        />
      </DivService>
    );
  }

  return (
    <Page>
      <Header>
        <H_1>Selecione seu Horário</H_1>
        <Exit onClick={() => { sessionStorage.clear(); navigate(-3); }}>X</Exit>
      </Header>

      {calendarContent}

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
                currentUser ? (
                  <P>Horário agendado, aguardamos você!</P>
                ) : (
                  <>
                    <P>Para fazer o agendamento, é necessário fazer login.</P>
                  </>
                )
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
