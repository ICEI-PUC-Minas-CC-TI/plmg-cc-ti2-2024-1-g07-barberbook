import React, { useState, useEffect } from "react";
import Page from "./Page";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import * as tmImage from '@teachablemachine/image';

const H1 = styled.h1`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  color: var(--black);
  margin: 0;
`;

const H2 = styled.h2`
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  color: var(--black);
  margin: 20px 0 0;
`;

const P = styled.p`
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  color: var(--black);
  margin: 10px 0;
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

const Input = styled.input`
  margin: 10px 0;
`;

const LoadingContainerStyles = styled.div`
  width: 100vw;
  margin-top: 50px;
  max-width: 425px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999;
`;

function Visagism() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [currentUser, setCurrentUser] = useState({});
  const [showUploadField, setShowUploadField] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!storedUser || !storedUser.logged) {
      navigate(`/HomePage/store/${storeId}/NumberPage`);
    } else {
      setCurrentUser(storedUser);
    }
  }, [navigate]);

  useEffect(() => {
    const loadModel = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/_tqfIDwLW/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      try {
        const model = await tmImage.load(modelURL, metadataURL);
        console.log("Modelo carregado com sucesso");
        setModel(model);
      } catch (error) {
        console.error("Erro ao carregar o modelo:", error);
      }
    };

    loadModel();
  }, []);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageDataUrl(reader.result);
        setShowButton(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const takePicture = () => {
    setShowUploadField(true);
  };

  const sendPicture = async () => {
    setPrediction(false);
    setLoading(true);
    if (model && imageDataUrl) {
      const image = await createImageBitmap(dataUrlToBlob(imageDataUrl));
      const prediction = await model.predict(image);

      const highestPrediction = getHighestPrediction(prediction);
      setLoading(false);
      setPrediction(highestPrediction);
    }
  };

  const getHighestPrediction = (predictions) => {
    let highestPrediction = null;
    let highestProbability = 0;

    for (const pred of predictions) {
      if (pred.probability > highestProbability) {
        highestPrediction = pred.className;
        highestProbability = pred.probability;
      }
    }

    return highestPrediction;
  };

  const dataUrlToBlob = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const faceShapes = {
    oval: "O formato oval de rosto tem um equilíbrio estético e é bastante flexível, permitindo diversos cortes de cabelo e estilos de barba. É recomendado evitar franjas que cubram a testa. A barba pode ser feita com linhas horizontais e verticais, com um leve volume.",
    redondo: "Para rostos redondos, é importante valorizar o uso de topetes, a fim de alongar visualmente o formato do rosto. Assim como as costeletas, que podem ser um pouco mais longas, mas não muito volumosas.",
    quadrado: "Para este formato anguloso, é ideal optar por cortes de cabelo mais estruturados e com textura. Barbas mais curtas e geométricas tendem a favorecer, assim como franjas laterais para suavizar os traços marcados."
  };

  return (
    <Page>
      <Header>
        <H1>Visagismo</H1>
        <Exit onClick={() => { sessionStorage.clear(); navigate(`/HomePage/store/${storeId}`); }}>X</Exit>
      </Header>
      <DivService>
        <Button onClick={takePicture}>Tirar Foto</Button>
        {showUploadField && (
          <Input type="file" accept="image/*" onChange={handleUpload} />
        )}
        {showButton && <Button onClick={sendPicture}>Enviar foto</Button>}
        {loading && (
          <LoadingContainerStyles>
            <ClipLoader loading={loading} size={80} color={"var(--primary)"} />
          </LoadingContainerStyles>
        )}
        {prediction && (
          <div>
            <H2>Seu formato de rosto é: {prediction}</H2>
            <P>{faceShapes[prediction]}</P>
          </div>
        )}
      </DivService>
    </Page>
  );
}

export default Visagism;