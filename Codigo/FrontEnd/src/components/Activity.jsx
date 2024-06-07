import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Page from "./Page";
import styled from "styled-components";
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
      font-size: 20px;
      font-style: normal;
      margin: 1rem;
`

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
  padding: 100px 20px 20px;
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
      }, [storeId]); // Only fetch appointments when storeId changes

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

      function traduzMesParaNumero(mesNome) {
            const meses = {
                  "jan.": 0, "fev.": 1, "mar.": 2, "abr.": 3, "mai.": 4, "jun.": 5,
                  "jul.": 6, "ago.": 7, "set.": 8, "out.": 9, "nov.": 10, "dez.": 11
            };
            return meses[mesNome.toLowerCase()];
      }

      function formatDate(dataString) {
            // Verificar se a data já está no formato correto
            if (/\d{4}\/\d{2}\/\d{2}/.test(dataString)) {
                  return dataString;
            }

            // Dividir a string de data em partes
            const partesData = dataString.split(' ');
            if (partesData.length !== 3) {
                  throw new Error('Formato de data inválido: ' + dataString);
            }

            // Extrair dia, mês e ano
            const dia = parseInt(partesData[1], 10);
            const mesNome = partesData[0];
            const ano = parseInt(partesData[2], 10);

            // Converter mês de nome para número
            const mesNumero = traduzMesParaNumero(mesNome);

            // Formar a string no formato yyyy-mm-dd
            const dataFormatada = `${ano}-${(mesNumero + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

            // Retornar data no formato yyyy/mm/dd
            return dataFormatada.replace(/-/g, '/');
      }


      const convertTo24Hour = (time12h) => {
            if (!time12h) return "";
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

            const [year, month, day] = dateString.split("/");
            const monthAbbreviations = {
                  "01": "jan", "02": "fev", "03": "mar", "04": "abr",
                  "05": "mai", "06": "jun", "07": "jul", "08": "ago",
                  "09": "set", "10": "out", "11": "nov", "12": "dez"
            };

            const monthName = monthAbbreviations[month];
            const dateObj = new Date(year, parseInt(month) - 1, day);

            const options = { weekday: 'long', day: 'numeric' };
            return `${dateObj.toLocaleDateString('pt-BR', options)}, ${monthName}`;
      };

      const sortAppointments = useCallback(() => {
            const sortedAppointments = [...appointments].sort((a, b) => {
                  const formattedDateA = formatDate(a.appointmentsDate);
                  const formattedDateB = formatDate(b.appointmentsDate);
                  const formattedTimeA = convertTo24Hour(a.startTime);
                  const formattedTimeB = convertTo24Hour(b.startTime);

                  if (formattedDateA !== formattedDateB) {
                        return formattedDateA.localeCompare(formattedDateB);
                  } else {
                        return formattedTimeA.localeCompare(formattedTimeB);
                  }
            });

            return sortedAppointments;
      }, [appointments]);

      const categorizeAppointments = useCallback(() => {
            const today = new Date();
            const currentHour = today.getHours(); // Horário atual em número
            const currentMinute = today.getMinutes(); // Minutos atuais em número

            const todayAppointments = [];
            const futureAppointments = [];
            const pastAppointments = [];

            const sortedAppointments = sortAppointments();

            sortedAppointments.forEach((appointment) => {
                  const formattedDate = formatDate(appointment.appointmentsDate);
                  const appointmentDate = new Date(formattedDate);
                  const startTime = convertTo24Hour(appointment.startTime); // Horário do compromisso em string
                  const [appointmentHour, appointmentMinute] = startTime.split(':').map(Number); // Convertendo o horário do compromisso para número

                  if (appointmentDate.getFullYear() === today.getFullYear() &&
                        appointmentDate.getMonth() === today.getMonth() &&
                        appointmentDate.getDate() === today.getDate()) {
                        if (appointmentHour > currentHour || (appointmentHour === currentHour && appointmentMinute >= currentMinute)) {
                              todayAppointments.push(appointment);
                        } else {
                              pastAppointments.push(appointment);
                        }
                  } else if (appointmentDate > today) {
                        futureAppointments.push(appointment);
                  } else {
                        pastAppointments.push(appointment);
                  }
            });

            return { todayAppointments, futureAppointments, pastAppointments };
      }, [sortAppointments]);



      const renderAppointmentsByCategory = useCallback(() => {
            const { todayAppointments, futureAppointments, pastAppointments } = categorizeAppointments();

            const renderCategory = (category, categoryName) => {
                  if (category.length === 0) {

                        return (
                              <>
                                    <H_2>{categoryName}({category.length})</H_2>
                                    <p>Sem agendamentos</p>
                              </>
                        );
                  }

                  return (
                        <React.Fragment key={categoryName}>
                              <H_2>{categoryName}({category.length})</H_2>
                              {category.map((appointment, index) => {
                                    const formattedTime = convertTo24Hour(appointment.startTime);
                                    const totalPrice = (services[index]?.price || 0) + (addServices[index]?.price || 0);
                                    const formattedDate = formatDate(appointment.appointmentsDate);
                                    const formattedWeekday = formatWeekday(formattedDate);

                                    return (
                                          <Service key={index}>
                                                <P>
                                                      <strong>Nome:</strong> {users[index]?.name || "Nome não informado"}<br />
                                                      <strong>Telefone:</strong> {users[index]?.phone_number || "Telefone não informado"} <br />
                                                      <strong>Data:</strong> {formattedWeekday || "Data não informada"} <br />
                                                      <strong>Horário:</strong> {formattedTime || "Hora não informada"} <br />
                                                      <strong>Serviço:</strong> {services[index]?.title || "Serviço não informado"} <br />
                                                      {appointment.additionalServiceId !== 1 && (
                                                            <React.Fragment>
                                                                  <strong>Adicional:</strong> {addServices[index]?.title} <br />
                                                            </React.Fragment>
                                                      )}
                                                      <strong>Valor:</strong> R$ {totalPrice.toFixed(2) || "Valor não informado"} <br />
                                                </P>
                                          </Service>
                                    );
                              })}
                        </React.Fragment>
                  );
            };

            return (
                  <React.Fragment>
                        {renderCategory(todayAppointments, "Agendamentos de hoje")}
                        {renderCategory(futureAppointments, "Agendamentos futuros")}
                        {renderCategory(pastAppointments, "Agendamentos passados")}
                        <P>Total de agendamentos: {appointments.length} <br /> Valor total: R$ {appointments.reduce((total, appointment, index) => {
                              const totalPrice = (services[index]?.price || 0) + (addServices[index]?.price || 0);
                              return total + totalPrice;
                        }, 0).toFixed(2)}</P>
                  </React.Fragment>
            );
      }, [categorizeAppointments, users, services, addServices, appointments]);

      return currentUser && currentUser.logged ? (
            <Page>
                  <Header>
                        <H_1>Agendamentos</H_1>
                        <Exit onClick={() => navigate(-1)}>X</Exit>
                  </Header>
                  <DivService>
                        {loading ? (
                              <LoadingContainerStyles>
                                    <ClipLoader loading={true} size={80} color={"var(--primary)"} />
                              </LoadingContainerStyles>
                        ) : (
                              renderAppointmentsByCategory()
                        )}
                  </DivService>
            </Page>
      ) : null;
}

export default Activity;
