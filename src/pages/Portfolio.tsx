import { useState } from 'react'
import styled from 'styled-components'
import ImageGallery from 'react-image-gallery';


const images = [
  {
    original: '/gallery/room1.jpg',
    thumbnail: '/gallery/room1-thumb.jpg',
    description: 'Quarto Standard - Vista para a floresta'
  },
  {
    original: '/gallery/room2.jpg',
    thumbnail: '/gallery/room2-thumb.jpg',
    description: 'Quarto Premium - Varanda privativa'
  },
  {
    original: '/gallery/common1.jpg',
    thumbnail: '/gallery/common1-thumb.jpg',
    description: 'Área comum - Deck com vista para o lago'
  },
  {
    original: '/gallery/common2.jpg',
    thumbnail: '/gallery/common2-thumb.jpg',
    description: 'Restaurante - Café da manhã orgânico'
  },
  {
    original: '/gallery/nature1.jpg',
    thumbnail: '/gallery/nature1-thumb.jpg',
    description: 'Trilha da Cachoeira - Manhã de verão'
  }
]

const PortfolioContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`

const GalleryContainer = styled.div`
  margin: 3rem 0;
  
  .image-gallery-description {
    background: rgba(0, 0, 0, 0.7);
    bottom: 70px;
    color: white;
    left: 0;
    line-height: 1.5;
    padding: 10px 20px;
    position: absolute;
    white-space: normal;
  }
`

export default function Portfolio(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <PortfolioContainer>
      <h1>Nosso Espaço</h1>
      <p>Conheça através de imagens nossa estrutura e as belezas naturais que nos cercam</p>
      
      <GalleryContainer>
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={true}
          onSlide={setCurrentIndex}
          additionalClass="custom-gallery"
        />
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          {images[currentIndex]?.description}
        </p>
      </GalleryContainer>
      
      <section>
        <h2>Nossas Instalações</h2>
        <ul>
          <li>12 quartos standard (até 3 pessoas)</li>
          <li>6 quartos premium (até 4 pessoas)</li>
          <li>Restaurante com comida regional</li>
          <li>Piscina natural</li>
          <li>Área de convivência com lareira</li>
          <li>Estacionamento privativo</li>
        </ul>
      </section>
    </PortfolioContainer>
  )
}