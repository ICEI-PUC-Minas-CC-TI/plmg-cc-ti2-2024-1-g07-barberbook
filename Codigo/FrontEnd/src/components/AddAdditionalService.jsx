import React, { useState } from "react";
import Page from "./Page";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';


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
  color: var(--black);
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
  padding: 100px 0;
  background-color: var(--white);
`;

const Service = styled.div`
  align-items: center;
  max-width: 100%;
  padding: 0 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: 0.5px solid var(--light-gray);
  border-radius: 4px;
  color: var(--secondary-light-black);
  background-color: var(--secondary-light-gray);
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
`;


const Button = styled.button`
  width: 100%;
  height: 40px;
  font-family: Raleway;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  margin-top: 10px;
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

const P = styled.p`
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  color: var(--secondary-light-black);
  padding: 10px;
  margin: 0;  
`

function capitalizeFirstLetter(string) {
      let words = string.split(" ");
      for (let i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
      return words.join(" ");
}


function AddAdditionalService() {
      const navigate = useNavigate();
      const [serviceName, setServiceName] = useState('');
      const [serviceValue, setServiceValue] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [errorMessage, setErrorMessage] = useState('');
      const storeId = useParams();

      const handleServiceNameChange = (e) => {
            setServiceName(capitalizeFirstLetter(e.target.value));
      };

      const handleServiceValueChange = (value) => {
            setServiceValue(value);
      };

      const handleCloseModal = () => {
            setShowModal(false);
      };

      const handleAddAdditionalService = async () => {
            if (!serviceName || !serviceValue) {
                  setErrorMessage('Preencha todos os campos.');
                  setShowModal(true);
                  setTimeout(() => {
                        setShowModal(false)
                  }, 2500);
                  return;
            }

            try {
                  const formData = new URLSearchParams();
                  formData.append('title', serviceName);
                  formData.append('price', serviceValue);
                  formData.append('store_id', storeId.storeId);

                  const response = await fetch('http://localhost:6789/addservice/insert', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: formData.toString()
                  });

                  if (!response.ok) {
                        throw new Error('Erro ao adicionar serviço');
                  }

                  setServiceName('');
                  setServiceValue('');
                  setErrorMessage('Serviço adicionado com sucesso!');
                  setShowModal(true);
            } catch (error) {
                  console.error('Erro ao adicionar serviço adicionar:', error);
                  setErrorMessage('Erro ao adicionar serviço adicionar. Por favor, tente novamente mais tarde.');
                  setShowModal(true);
                  setTimeout(() => {
                        setShowModal(false)
                  }, 2500);
            }
      };

      return (
            <Page>
                  <Header>
                        <H_1>Serviços Adicionais</H_1>
                        <Exit onClick={() => navigate(-1)}>X</Exit>
                  </Header>

                  <DivService>
                        <Service>
                              <H_2>Nome do Serviço</H_2>
                              <Input type="text" value={serviceName} onChange={handleServiceNameChange} placeholder="'Barba'" />
                              <H_2>Valor do Serviço</H_2>
                              <CurrencyInput
                                    intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                                    value={serviceValue}
                                    onValueChange={handleServiceValueChange}
                                    placeholder="R$ 0,00"
                              />
                              <Button onClick={handleAddAdditionalService}>Adicionar</Button>
                        </Service>
                  </DivService>

                  {showModal && (
                        <ModalBackground onClick={handleCloseModal}>
                              <ModalDiv>
                                    <P>{errorMessage}</P>
                              </ModalDiv>
                        </ModalBackground>
                  )}
            </Page>
      );
}

export default AddAdditionalService;