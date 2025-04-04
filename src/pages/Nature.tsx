import styled from 'styled-components'
import { FaTree, FaWater, FaHiking } from 'react-icons/fa'

const NatureContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/nature-bg.jpg');
  background-size: cover;
  background-position: center;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 1rem;
  margin-bottom: 3rem;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  
  svg {
    font-size: 3rem;
    color: #2E8B57;
    margin-bottom: 1rem;
  }
`

export default function Nature(): JSX.Element {
  return (
    <NatureContainer>
      <HeroSection>
        <h1>Reserva Natural Santa Izabel</h1>
        <p>Um santuário ecológico no coração da natureza</p>
      </HeroSection>
      
      <section>
        <h2>Conheça Nossa Reserva</h2>
        <p>
          A Reserva Natural Santa Izabel é um patrimônio ambiental com mais de 500 hectares 
          de área preservada, abrigando espécies raras da flora e fauna brasileira.
        </p>
      </section>
      
      <FeatureGrid>
        <FeatureCard>
          <FaTree />
          <h3>Floresta Preservada</h3>
          <p>
            Mais de 200 espécies de árvores nativas, algumas com mais de 100 anos de idade, 
            formam nosso bosque protegido.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <FaWater />
          <h3>Lagoa Cristalina</h3>
          <p>
            Nossa lagoa de águas transparentes é alimentada por nascentes naturais e é perfeita 
            para banhos refrescantes.
          </p>
        </FeatureCard>
        
        <FeatureCard>
          <FaHiking />
          <h3>Trilhas Ecológicas</h3>
          <p>
            15km de trilhas sinalizadas com diferentes níveis de dificuldade, ideais para 
            observação de pássaros e contato com a natureza.
          </p>
        </FeatureCard>
      </FeatureGrid>
      
      <section>
        <h2>Regras da Reserva</h2>
        <ul>
          <li>Não é permitida a captura ou perturbação de animais silvestres</li>
          <li>Proibido deixar lixo nas trilhas ou áreas de preservação</li>
          <li>Fogueiras somente em locais autorizados</li>
          <li>Respeite os horários de silêncio (22h às 6h)</li>
        </ul>
      </section>
    </NatureContainer>
  )
}