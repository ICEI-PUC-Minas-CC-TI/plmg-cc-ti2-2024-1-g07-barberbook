import React, { useState, useEffect } from "react";
import Page from "./Page";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom';

const H1 = styled.h1`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  color: var(--black);
  margin: 0;
`;

const Header = styled.div`
  width: 100%;
  max-width: 420px;
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
  padding: 100px 20px 100px;
  color: var(--black);
  text-decoration: none;
  justify-content: center;
  display: flex;
  flex-direction: column;
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
  border-radius: 4px;
  color: var(--black);
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  &:active{
    background-color: var(--light-secondary);
    transform: scale(0.95);
  }
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
`;

function MyScheduling() {
      const navigate = useNavigate();
      const { id } = useParams();
      const handleExit = () => {
            navigate(-1);
      }


      return (
            <Page>
                  <Header>
                        <H1>Meus Agendamentos</H1>
                        <Exit onClick={handleExit}>X</Exit>
                  </Header>
                  <DivService>
                  </DivService>
            </Page>
      );
}
export default MyScheduling;