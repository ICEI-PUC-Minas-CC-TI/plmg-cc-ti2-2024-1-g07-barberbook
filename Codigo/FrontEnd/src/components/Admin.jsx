import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from './Page';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
  margin: 100px 20px 100px;
  color: var(--black);
  text-decoration: none;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
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
  background-color: ${(props) =>
            props.available ? 'var(--light-green)' : 'var(--primary)'};
  color: ${(props) =>
            props.available ? 'var(--black)' : 'var(--white)'};
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
  max-width:100%;
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

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const DivDrop = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 100%;
  max-width: 425px;
  height: fit-content;
  justify-content: space-between;
`;

const DivHours = styled.div`
      display: flex;
      box-sizing: border-box;
      text-align: center;
`;

const DurationInput = styled.input`
  width: 100%;
  height: 40px;
  font-size: 16px;
  margin: 10px 0;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
`;

const Text = styled.p`
  font-size: 14px;
  text-align: start;
  margin: 2px;
`;

const OpeningInput = styled.input`
  min-width: 80%;
  height: 40px;
  font-size: 16px;
  margin: 10px 0;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ClosingInput = styled.input`
  min-width: 80%;
  height: 40px;
  font-size: 16px;
  margin: 10px 0;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ButtonSave = styled(Button)`
      background-color: var(--secondary);
      color: var(--white);
      padding: 10px 20px;
      font-size: 16px;
      font-weight: 700;
`;

const DivHeader = styled.div`
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: end;
`;

function AdminPage() {
      const navigate = useNavigate();
      const [maxDailySlots, setMaxDailySlots] = useState(10);
      const [duration, setDuration] = useState(30);
      const [openingTime, setOpeningTime] = useState('09:00');
      const [closingTime, setClosingTime] = useState('18:00');
      const [showModal, setShowModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState("");
      const [selectedDate, setSelectedDate] = useState(new Date());
      const [selectedTime, setSelectedTime] = useState('');
      const [availableTimes, setAvailableTimes] = useState([]);
      const [availablePercentage, setAvailablePercentage] = useState(0);
      const { storeId, userId } = useParams();

      const isAvailableForSelectedDay = () => {
            const selectedDay = getFormattedDate(selectedDate);
            const availableTimesForDayValue = availableTimesForDay[selectedDay] || [];
            const selectedDayAvailableTimes = availableTimes.map(time => time.time);
            const selectedDayAvailableTimesUp = availableTimesForDayValue;
            return JSON.stringify(selectedDayAvailableTimes) === JSON.stringify(selectedDayAvailableTimesUp);
      };


      const generateSchedule = () => {
            const availableTimes = {};
            const daysInWeek = 7;
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + daysInWeek);

            for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
                  const formattedDate = getFormattedDate(d);
                  availableTimes[formattedDate] = generateDailySchedule(openingTime, closingTime, duration);
            }

            localStorage.setItem('availableTimes', JSON.stringify(availableTimes));
            handleButtonClick();
      }

      const generateDailySchedule = (openingTime, closingTime, duration) => {
            const slots = [];
            const openingHours = parseInt(openingTime.split(':')[0]);
            const closingHours = parseInt(closingTime.split(':')[0]);
            const openingMinutes = parseInt(openingTime.split(':')[1]);
            const closingMinutes = parseInt(closingTime.split(':')[1]);

            for (let hour = openingHours; hour <= closingHours; hour++) {
                  for (let minute = 0; minute < 60; minute += duration) {
                        if (hour === openingHours && minute < openingMinutes) continue;
                        if (hour === closingHours && minute + duration > closingMinutes) break;
                        const formattedHour = hour.toString().padStart(2, '0');
                        const formattedMinute = minute.toString().padStart(2, '0');
                        slots.push(`${formattedHour}:${formattedMinute}`);
                  }
            }

            return slots;
      }

      const getFormattedDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
      }

      const availableTimesForDayString = localStorage.getItem('availableTimes');
      const availableTimesForDay = availableTimesForDayString ? JSON.parse(availableTimesForDayString) : {};

      const handleButtonClick = (time) => {
            const updatedAvailableTimes = availableTimes.map((t) =>
                  t.time === time ? { ...t, available: !t.available } : t
            );
            setAvailableTimes(updatedAvailableTimes);
      };

      const handleDayClick = (value) => {
            const selectedDay = value.toISOString().split('T')[0];
            const selectedDayAvailableTimes = availableTimesForDay[selectedDay] || [];
            const availablePercentage = (selectedDayAvailableTimes.length / 24) * 100;
            setAvailableTimes(selectedDayAvailableTimes.map((time) => ({ time, available: false })));
            setAvailablePercentage(availablePercentage);
            setShowModal(true);
      };

      const save = () => {
            const selectedDay = selectedDate.toISOString().split('T')[0];
            const formattedTimes = availableTimes
                  .filter(time => time.available) 
                  .map(time => time.time);

            const updatedAvailableTimesForDay = {
                  [selectedDay]: formattedTimes
            };

            const requestOptions = {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedAvailableTimesForDay) 
            };

            console.log(JSON.stringify(updatedAvailableTimesForDay));

            fetch(`http://localhost:6789/stores/insertTimes?id=${storeId}`, requestOptions)
                  .then(response => {
                        if (!response.ok) {
                              throw new Error('Failed to update available times');
                        }
                        setShowModal(false);
                        alert('Horários disponibilizados com sucesso');
                  })
                  .catch(error => {
                        console.error('Error:', error);
                        setErrorMessage('Failed to update available times');
                  });
      };


      return (
            <Page>
                  <Header>
                        <H1>Selecione os Horários</H1>
                        <Exit onClick={() => { sessionStorage.clear(); navigate(`/HomePage/store/${storeId}`); }}>X</Exit>
                  </Header>

                  <DivService>
                        <DivDrop>
                              <DivHeader>
                                    <Text>Duração dos horários (min)</Text>
                                    <DurationInput
                                          type="number"
                                          min="10"
                                          max="240"
                                          step="10"
                                          value={duration}
                                          onChange={(e) => setDuration(parseInt(e.target.value))}
                                    />
                              </DivHeader>

                              <DivHours>
                                    <DivHeader>
                                          <Text>Horário de abertura</Text>
                                          <OpeningInput
                                                type="time"
                                                value={openingTime}
                                                onChange={(e) => setOpeningTime(e.target.value)}
                                          />
                                    </DivHeader>
                                    <DivHeader>
                                          <Text>Horário de fechamento</Text>
                                          <ClosingInput
                                                type="time"
                                                value={closingTime}
                                                onChange={(e) => setClosingTime(e.target.value)}
                                          />
                                    </DivHeader>
                              </DivHours>
                        </DivDrop>
                        <Div>
                              <ButtonSave style={{ marginBottom: '10px' }} onClick={() => generateSchedule()}>Gerar Horários</ButtonSave>
                        </Div>

                        <Calendar
                              onChange={setSelectedDate}
                              value={selectedDate}
                              showWeekDayNames
                              onClickDay={handleDayClick}
                              tileContent={({ date, view }) => {
                                    if (view === 'month') {
                                          const selectedDay = date.toISOString().split('T')[0];
                                          const availableTimesForDayValue = availableTimesForDay[selectedDay] || [];
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
                                    <HeaderModal>
                                          <H1>Horários</H1>
                                          <Exit onClick={() => setShowModal(false)}>x</Exit>
                                    </HeaderModal>
                                    <Schedules>
                                          {availableTimes.map((time, index) => (
                                                <Button
                                                      key={index}
                                                      onClick={() => handleButtonClick(time.time)}
                                                      available={time.available}
                                                >
                                                      {time.time}
                                                </Button>
                                          ))}
                                          <ButtonSave onClick={() => save()}>Disponibilizar Horários</ButtonSave>
                                    </Schedules>
                              </ModalDiv>
                        </ModalOverlay>
                  )}
            </Page>
      );
}

export default AdminPage;
