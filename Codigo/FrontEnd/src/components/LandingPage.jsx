import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import stores from "../assets/js/store";

const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: var(--primary);
  flex-direction: column;
  position: relative;
  min-height: 100vh;
`;

const Circles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, #eb8b1637 10%, rgba(255,255,255,0) 70%);
  pointer-events: none; 
`;

const Header = styled.div`
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10vw;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    height: 7rem;
  }

  @media screen and (max-width: 425px) {
  justify-content: center;
  }
`;

const ImgHeader = styled.img`
  width: 14vw;
  height: auto;
  object-fit: cover;
  object-position: center;
  max-height: 14vh;

  @media screen and (max-width: 768px) {
    width: 12rem;
    height: 8rem;
  }

  @media screen and (max-width: 425px) {
    display: none;
  }
`;

const DivMockUp = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto 0;
  width: 100%;
  background-color: var(--primary);

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const MockUp = styled.img`
  width: 50vw;
  height: auto;
  z-index: 2;

  @media screen and (max-width: 768px) {
    width: 70vw;
  }
  @media screen and (max-width: 425px) {
    width: 100vw;
    margin-top: 2rem; 
    margin-bottom: 2rem;  
  }
`;

const Text = styled.div`
  margin: auto 0;

  @media screen and (max-width: 768px) {
    margin: auto 10vw;
    text-align: center;
  }
`;

const Title = styled.h1`
  font-size: 2.8vw;
  font-weight: 800;
  color: var(--secondary);
  margin: auto auto auto 10vw;
  font-family: 'Montserrat', sans-serif;
  text-align: end;

  @media screen and (max-width: 768px) {
    text-align: start;
    margin: 0;
    font-size: 1.5rem;
  }
`;

const SecondaryTitle = styled.h2`
  font-size: 1.05vw;
  font-weight: 600;
  color: var(--secondary);
  margin: .5vw auto auto 10vw;
  line-height: 1.9;
  font-family: 'Montserrat', sans-serif;
  text-align: end;

  @media screen and (max-width: 768px) {
    text-align: start;
    margin: 10px 0;
    font-size: .8rem;
  }
`;

const DivSearch = styled.div`
  width: 100%;
  max-width: 180px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  color: var(--secondary);
  padding: .5rem .5rem 0 0;

  &:focus-within{
    background-color: var(--secondary);
    border-radius: 4px 4px 0 0;
    color: var(--primary);
  } 

  @media screen and (max-width: 425px) {
    max-width: 100%;
  }  
`;

const DivInput = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Search = styled.input`
  height: 1.5rem; 
  color: var(--secondary);
  border: none;
  background-color: transparent;
  outline: none;  

  &::placeholder {
    color: var(--secondary);
  }

  &:focus {
    color: var(--primary);
    &::placeholder {
      color: var(--primary);
    }
  }

  @media screen and (max-width: 768px) {
    width: 9.4rem;
    height: 1rem; 
    font-size: 0.8rem;
  }
  @media screen and (max-width: 425px) {
    width: 100%;
  }
`;

const SearchResultDropdown = styled.div`
    position: absolute;
    top: 8.5vh;
    max-height: 75px;
    width: 100%;
    max-width: 188px;
    overflow-y: auto;
    background-color: var(--secondary);
    border-radius: 0 0 5px 5px;
    z-index: 999;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

    &::-webkit-scrollbar {
        width: 3.5px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--primary);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: var(--primary-light); 
    }

    @media screen and (max-width: 425px) {
      max-width: 80%;
      top: 11vh;
    }
`;

const stylesDropdown = {
  searchResult: {
    display: 'none',
  },
  searchResultActive: {
    display: 'block',
  },
}

const SearchResultItem = styled.div`
  padding: 10px;
  color: var(--primary);
  background-color: transparent;
  font-weight: 600;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 0.9rem;
  &:active {
    background-color: var(--light-secondary);
  }
`;


const Button = styled.button`
  width: 14vw;
  height: 3vw;
  font-family: Raleway;
  font-size: 1vw;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: none;
  border-radius: 4px;
  color: var(--white);
  background-color: var(--secondary);
  margin: 2vh 0;
  float: right;

  &:active {
    color: var(--white);
    background-color: var(--light-secondary);
    transform: scale(0.95);
  }

  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));

  @media screen and (max-width: 768px) {
    width: 12rem;
    height: 2.5rem;
    font-size: .8rem;
  }

  @media screen and (max-width: 425px) {
    width: 100%;
  }
`;

function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [stores, setStores] = useState([]);

  fetch('http://localhost:6789/stores/list/1')
    .then(response => response.json())
    .then(data => {
      setStores(data);
      console.log("executou");
    })
    .catch(error => {
      console.error('Erro ao buscar as barbearias:', error);
      // Aqui você pode adicionar algum tratamento de erro adicional
    });

  const searchStore = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const filteredStores = stores.filter(store =>
        store.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredStores);
    }
  };

  const handleStoreClick = (store) => {
    navigate(`/HomePage/store/${store.id}`);
    console.log("Loja selecionada:", store);
  };

  return (
    <Container>
      <Circles />
      <Header>
        <ImgHeader src="././public/book.svg" alt="" />
        <DivSearch>
          <DivInput>
            <Search onChange={searchStore} value={searchQuery} placeholder="Pesquise a barbearia" />
            <SearchIcon onClick={() => searchStore(searchQuery)} />
          </DivInput>
          {searchResults.length === 0 && searchQuery.length > 0 && (
            <SearchResultDropdown style={stylesDropdown.searchResultActive}>
              <SearchResultItem>
                Nenhuma barbearia encontrada.
              </SearchResultItem>
            </SearchResultDropdown>
          )}

          {searchResults.length > 0 && searchQuery.length > 0 && (
            <SearchResultDropdown style={stylesDropdown.searchResultActive}>
              {searchResults.map((store, index) => (
                <SearchResultItem key={index} onClick={() => handleStoreClick(store)}>
                  {store.title}
                </SearchResultItem>
              ))}
            </SearchResultDropdown>
          )}
        </DivSearch>

      </Header>
      <DivMockUp>
        <Text>
          <Title>Agendamento de horários e assistente de visagismo com IA.</Title>
          <SecondaryTitle>
            Modernize sua barbearia com nosso sistema de agendamento e assistente de visagismo alimentado por inteligência artificial.
            Permita-nos simplificar sua gestão de horários enquanto oferecemos aos seus clientes uma experiência inovadora e personalizada.
          </SecondaryTitle>
          <Button onClick={() => navigate('/StoreRegister')} >Cadastrar Barbearia</Button>
        </Text>
        <MockUp src="././public/mockup.svg" alt="" />
      </DivMockUp>
    </Container>
  );
}

export default LandingPage;
