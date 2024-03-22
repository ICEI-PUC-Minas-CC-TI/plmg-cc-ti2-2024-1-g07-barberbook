import React, { useState } from "react";
import styled from "styled-components";
import Page from "./Page";
import InputMask from 'react-input-mask';
import { useNavigate } from "react-router-dom";

const Container = styled.div`
      width: 100%;
      display: flex;
      background-color: var(--primary);
      flex-direction: column;
      position: relative;
      min-height: 100vh;
      margin: auto 0;
`;

const Circles = styled.div`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(circle, #eb8b1637 10%, rgba(255,255,255,0) 70%);
      pointer-events: none; 
      z-index: 0;
`;

const Title = styled.h1`
      font-size: 2.3rem;
      font-weight: 800;
      color: var(--secondary);
      font-family: 'Montserrat', sans-serif;
      text-align: center;
      z-index: 1;
      margin: 0;
      padding: 20px;
`;

const FormContainer = styled.form`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
`;

const Input = styled.input`
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid var(--secondary);
      border-radius: 5px;
      color: var(--secondary);
      &::placeholder {
            color: var(--secondary);
            opacity: 0.3;
      }
`;

const Button = styled.button`
      margin-top: 20px;
      width: 100%;
      height: 3rem;
      font-family: Raleway;
      font-size: 1rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      border: none;
      border-radius: 4px;
      color: var(--white);
      background-color: var(--secondary);
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      
      &:hover {
            background-color: var(--light-secondary);
      }
      &:active {
            transform: scale(0.95);
      }
`;

const Label = styled.label`
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--secondary);
      align-self: start;
      margin-bottom: 5px;
`;

function capitalizeFirstLetter(string) {
      let words = string.split(" ");
      for (let i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
      return words.join(" ");
}

function isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
}

function StoreRegister() {
      const navigate = useNavigate();
      const [storeName, setStoreName] = useState("");
      const [storeAddress, setStoreAddress] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [isValidEmailInput, setIsValidEmailInput] = useState(true);
      const [passwordsMatch, setPasswordsMatch] = useState(true);

      const handleStoreNameChange = (event) => {
            setStoreName(capitalizeFirstLetter(event.target.value));
      };

      const handleStoreAddressChange = (event) => {
            setStoreAddress(capitalizeFirstLetter(event.target.value));
      };

      const handleEmailChange = (event) => {
            const newEmail = event.target.value;
            setEmail(newEmail);
            setIsValidEmailInput(newEmail === '' || isValidEmail(newEmail));
      };

      const handlePasswordChange = (event) => {
            const newPassword = event.target.value;
            setPassword(newPassword);
            if (newPassword === '') {
                  setConfirmPassword('');
            }
            setPasswordsMatch(true);
      };

      const handleConfirmPasswordChange = (event) => {
            setConfirmPassword(event.target.value);
      };

      const confirmPasswords = () => {
            return password === confirmPassword;
      };

      const handleSubmit = (event) => {
            event.preventDefault();
            if (!confirmPasswords()) {
                  setPasswordsMatch(false);
                  return;
            }
      };

      const handleExit = () => {
            navigate(-1);
          }

      return (
            <Container>
                  <Circles />
                  <Page style={{zIndex: '2', backgroundColor:'#ffffffc0', margin: 'auto', borderRadius: '10px', padding: '10px', boxSizing: 'border-box', boxShadow:'0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                        <Title>Cadastre sua loja!</Title>
                        <FormContainer onSubmit={handleSubmit}>
                              <Label>Nome da loja</Label>
                              <Input type="text" placeholder="'Barbearia Do João'" value={storeName} onChange={handleStoreNameChange} />
                              <Label>Telefone</Label>
                              <InputMask mask="(99) 99999-9999" maskChar="_">
                                    {() => <Input type="text" placeholder="(99) 99999-9999" />}
                              </InputMask>
                              <Label>Endereço</Label>
                              <Input type="text" placeholder="Ex: Rua das Flores, 123 - Jardim Primavera" value={storeAddress} onChange={handleStoreAddressChange} />
                              <Label>Instagram</Label>
                              <Input type="text" placeholder="Instagram" />
                              <Label>Email</Label>
                              <Input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                              {!isValidEmailInput && <p style={{ color: 'red' }}>Por favor, insira um e-mail válido.</p>}
                              <Label>Senha</Label>
                              <Input type="password" placeholder="Senha" value={password} onChange={handlePasswordChange} />
                              <Label>Confirmar senha</Label>
                              <Input type="password" placeholder="Confirmar senha" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                              {!passwordsMatch && <p style={{ color: 'red' }}>As senhas não coincidem.</p>}
                              <Button type="submit">Registrar Loja</Button>
                              <Button onClick={handleExit}>Voltar para página incial</Button>
                        </FormContainer>
                  </Page>
            </Container>
      );
}

export default StoreRegister;
