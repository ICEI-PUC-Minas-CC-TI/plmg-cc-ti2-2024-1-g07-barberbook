import React, { useEffect, useState } from "react";
import Page from "./Page";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom';
import TrashIcon from '@mui/icons-material/Delete';
const H1 = styled.h1`
  font-size: 25px;
  font-weight: 700;
  text-align: center;
  color: var(--black);
  margin: 0;
`;

const P = styled.p`
  margin: 0;
  padding: 0;
  color: var(--black);
  line-height: 1.5;
  font-size: 1rem;
  font-weight: 700;
`;

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
  margin-top: 100px;
  padding: 20px;
  color: var(--black);
`;

const Button = styled.button`
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  border: none;
  color: var(--black);
  background-color: var(--white);
  border-bottom: 1px solid var(--light-gray);
  box-sizing: border-box;
  text-align: left;
  padding: 10px;
  display: grid;
  grid-template-columns: 5fr 1fr;
  &:active {
    border-left: 5px solid var(--primary);
    border-right: 5px solid transparent;
    background-color: var(--secondary-light-gray);
    transform: scale(0.95);
  }
`;

const CancelButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  border: none;
  padding: .5rem;
  border-radius: .5rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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

const ModalButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  border: none;
  padding: .5rem;
  border-radius: .5rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-weight: 700;
  width: 100%;
  &:active {
    background-color: var(--light-secondary);
    transform: scale(0.95);
  }
`;

function MyScheduling() {
  const { storeId, userId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleExit = () => {
    navigate(-1);
  };

  const handleCancel = (id) => {
    setShowModal(true);
  }
  return (
    <Page>
      <Header>
        <H1>Meus Agendamentos</H1>
        <Exit onClick={handleExit}>X</Exit>
      </Header>
      <DivService>
        <Button>
          <P>9:30 | Terca Feira -22/03  <br /> Corte e Barba</P>
          <CancelButton onClick={handleCancel}><TrashIcon /></CancelButton>
        </Button>
        {showModal && (
          <ModalBackground>
            <ModalDiv>
              <P style={{margin:'0 0 1rem'}}>Deseja realmente cancelar o agendamento?</P>
              <div style={{display:'flex', justifyContent:'space-between', gap:'1rem'}}>
                <ModalButton onClick={() => setShowModal(false)}>Não</ModalButton>
                <ModalButton style={{backgroundColor:'var(--light-primary)'}} onClick={() => setShowModal(false)}>Sim</ModalButton>
              </div>
            </ModalDiv>
          </ModalBackground>

        )}
      </DivService>
    </Page>
  );
}

export default MyScheduling;