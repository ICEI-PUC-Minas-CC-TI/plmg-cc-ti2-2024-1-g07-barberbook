import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";
import { set } from "date-fns";

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

const P = styled.p`
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  color: var(--secondary-light-black);
  padding: 0;
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
  flex-direction: column;
`;

const Service = styled.div`
  text-align: left;
  max-width: 100%;
  border-radius: 5px;
  background: var(--white);
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.20);
  padding: 20px;
  margin: 0 0 20px 0;
  box-sizing: border-box;
`;

const LoadingContainerStyles = styled.div`
  width: 100vw;
  height: 100vh;
  max-width: 425px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999; 
`;

function Activity() {
      const navigate = useNavigate();
      const { storeId } = useParams();
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      const [loading, setLoading] = useState(false);
      const [appointments, setAppointments] = useState([]);
      const [users, setUsers] = useState([]);
      const [services, setServices] = useState([]);
      const [addServices, setAddServices] = useState([]);

      const fetchData = (url, setter) => {
            setLoading(true);
            fetch(url)
                  .then((response) => {
                        if (!response.ok) {
                              throw new Error('Network response was not ok');
                        }
                        return response.json();
                  })
                  .then((data) => {
                        setter(data);
                        setLoading(false);
                  })
                  .catch((error) => {
                        console.error("Error:", error);
                        setLoading(false);
                  });
      };

      useEffect(() => {
            fetchData(`http://localhost:6789/appointments/store/${storeId}`, setAppointments);
      }, [storeId]);

      useEffect(() => {
            if (appointments.length > 0) {
                  const fetchUsers = appointments.map((appointment) =>
                        fetchData(`http://localhost:6789/user/${appointment.userId}`, (data) => {
                              setUsers((prevUsers) => [...prevUsers, data]);
                        })
                  );
                  Promise.all(fetchUsers)
                        .catch((error) => {
                              console.error("Error:", error);
                              setLoading(false);
                        });
            }
      }, [appointments]);

      useEffect(() => {
            if (appointments.length > 0) {
                  const fetchServices = appointments.map((appointment) =>
                        fetchData(`http://localhost:6789/services/${appointment.serviceId}`, (data) => {
                              setServices((prevServices) => [...prevServices, data]);
                        })
                  );
                  Promise.all(fetchServices)
                        .catch((error) => {
                              console.error("Error:", error);
                              setLoading(false);
                        });
            }
      }, [appointments, storeId]);

      useEffect(() => {
            if (appointments.length > 0) {
                  const fetchAddServices = appointments.map((appointment) =>
                        fetchData(`http://localhost:6789/addservice/${appointment.additionalServiceId}`, (data) => {
                              setAddServices((prevAddServices) => [...prevAddServices, data]);
                        })
                  );
                  Promise.all(fetchAddServices)
                        .catch((error) => {
                              console.error("Error:", error);
                              setLoading(false);
                        });
            }
      }, [appointments, storeId]);

      const convertTo24Hour = (time12h) => {
            const [time, modifier] = time12h.split(' ');
            const [hours, minutes, seconds] = time.split(':');
            let hours24h = parseInt(hours, 10);
            if (modifier === 'PM' && hours24h < 12) {
                  hours24h += 12;
            } else if (modifier === 'AM' && hours24h === 12) {
                  hours24h = 0;
            }
            const formattedTime = `${hours24h.toString().padStart(2, '0')}:${minutes}`;
            return formattedTime;
      };

      const formatWeekday = (dateString) => {
            if (!dateString) return "Data não informada";

            const parts = dateString.split(', ');
            const monthName = parts[0].slice(0, 3);
            const day = parseInt(parts[0].slice(4));

            const monthAbbreviations = {
                  jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
                  jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11
            };

            const month = monthAbbreviations[monthName.toLowerCase()];

            const currentYear = (new Date()).getFullYear();
            let date = new Date(currentYear, month, day);

            if (date.getMonth() !== month) {
                  date = new Date(currentYear, month - 1, day);
            }

            const options = { weekday: 'long', day: 'numeric' };
            return `${date.toLocaleDateString('pt-BR', options)}, ${monthName}`;
      };

      return currentUser && currentUser.logged ? (
            <Page>
                  <Header>
                        <H_1>Agendamentos</H_1>
                        <Exit onClick={() => navigate(`/HomePage/store/${storeId}`)}>X</Exit>
                  </Header>
                  {loading ? (
                        <LoadingContainerStyles>
                              <ClipLoader loading={true} size={80} color={"var(--primary)"} />
                        </LoadingContainerStyles>
                  ) : (
                        <DivService>
                              {appointments
                                    // Primeiro, ordenamos os agendamentos por data e hora
                                    .sort((a, b) => {
                                          const dateA = new Date(a.appointmentsDate);
                                          const dateB = new Date(b.appointmentsDate);

                                          // Comparamos as datas
                                          if (dateA < dateB) return -1;
                                          if (dateA > dateB) return 1;

                                          // Se as datas forem iguais, comparamos os horários
                                          const timeA = a.startTime ? convertTo24Hour(a.startTime) : '';
                                          const timeB = b.startTime ? convertTo24Hour(b.startTime) : '';
                                          const timePartsA = timeA.split(':').map(part => parseInt(part));
                                          const timePartsB = timeB.split(':').map(part => parseInt(part));

                                          if (timePartsA[0] < timePartsB[0]) return -1; // Comparação das horas
                                          if (timePartsA[0] > timePartsB[0]) return 1;
                                          if (timePartsA[1] < timePartsB[1]) return -1; // Comparação dos minutos
                                          if (timePartsA[1] > timePartsB[1]) return 1;

                                          return 0; // Caso os horários sejam iguais
                                    })
                                    // Agora que os agendamentos estão ordenados, mapeamos e renderizamos
                                    .map((appointment, index) => {
                                          let totalPrice = 0;
                                          if (services[index]) {
                                                totalPrice += services[index].price;
                                          }
                                          if (addServices[index] && addServices[index].id !== 1) {
                                                totalPrice += addServices[index].price;
                                          }

                                          const formattedTime = appointment.startTime ? convertTo24Hour(appointment.startTime) : null;

                                          return (
                                                <Service key={index}>
                                                      <P>
                                                            <strong>Nome:</strong> {users[index]?.name || "Nome não informado"}<br />
                                                            <strong>Telefone:</strong> {users[index]?.phone_number || "Telefone não informado"} <br />
                                                            <strong>Data:</strong> {formatWeekday(appointment.appointmentsDate) || "Data não informada"} <br />
                                                            <strong>Hora:</strong> {formattedTime || "Hora não informada"} <br />
                                                            <strong>Serviço:</strong> {services[index]?.title || "Serviço não informado"} <br />
                                                            {appointment.additionalServiceId !== 1 && (
                                                                  <React.Fragment>
                                                                        <strong>Adicional:</strong> {addServices[index]?.title} <br />
                                                                  </React.Fragment>
                                                            )}
                                                            <strong>Valor:</strong> {totalPrice.toFixed(2) || "Valor não informado"} <br />
                                                      </P>
                                                </Service>
                                          );
                                    })}
                        </DivService>
                  )}
            </Page>
      ) : null;
}

export default Activity;