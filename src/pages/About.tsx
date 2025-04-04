import styled from 'styled-components'
import ReactPlayer from 'react-player'

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`

const Section = styled.section`
  margin-bottom: 3rem;
`

const VideoContainer = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  margin: 2rem 0;
  background: #000;

  .react-player {
    position: absolute;
    top: 0;
    left: 0;
  }
`

export default function About(): JSX.Element {
  return (
    <AboutContainer>
      <h1>Sobre o Eco Parque Lagoa Grande</h1>
      
      <Section>
        <h2>Nossa História</h2>
        <p>
          Localizado no coração da Reserva Natural Santa Izabel, o Eco Parque Lagoa Grande nasceu 
          do sonho de proporcionar uma experiência única de conexão com a natureza sem abrir mão 
          do conforto e aconchego.
        </p>
      </Section>
      
      <Section>
        <h2>Conheça a Proprietária</h2>
        <VideoContainer>
          <ReactPlayer
            url="https://www.youtube.com/watch?v=SEU_VIDEO_AQUI"
            width="100%"
            height="100%"
            controls={true}
          />
        </VideoContainer>
        <p>
          Neste vídeo, Maria (proprietária) conta como surgiu a ideia do empreendimento e 
          compartilha sua visão de sustentabilidade e hospitalidade.
        </p>
      </Section>
      
      <Section>
        <h2>Nossa Filosofia</h2>
        <p>
          Acreditamos que o turismo sustentável é o futuro. Por isso, todas as nossas instalações 
          foram pensadas para minimizar o impacto ambiental enquanto proporcionamos uma experiência 
          memorável aos nossos hóspedes.
        </p>
      </Section>
    </AboutContainer>
  )
}