import { useState } from 'react'
import styled from 'styled-components'
import RoomCard from '../components/RoomCard'
import { Link } from 'react-router-dom'

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 1rem;
`

const RoomsContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

const CtaButton = styled(Link)`
  background-color: #DAA520;
  color: white;
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1.2rem;
  margin-top: 2rem;
  display: inline-block;
  transition: background-color 0.3s;

  &:hover {
    background-color: #F4A460;
  }
`

export default function Home(): JSX.Element {
  const [selectedRoom, setSelectedRoom] = useState<'3p' | '4p' | null>(null)

  return (
    <div>
      <HeroSection>
        <h1>Bem-vindo ao Eco Parque Lagoa Grande</h1>
        <p>Conforto e natureza em perfeita harmonia</p>
        <CtaButton to="/reserva">Reserve Agora</CtaButton>
      </HeroSection>

      <RoomsContainer>
        <h2>Nossos Quartos</h2>
        <RoomsGrid>
          <RoomCard
            type="3p"
            image="/room-3p.jpg"
            description="Confortável quarto com vista para a natureza, ideal para até 3 pessoas."
            weekdayPrice={100}
            weekendPrice={300}
            onSelect={() => setSelectedRoom('3p')}
            selected={selectedRoom === '3p'}
          />
          <RoomCard
            type="4p"
            image="/room-4p.jpg"
            description="Amplo quarto com varanda, acomodando confortavelmente até 4 pessoas."
            weekdayPrice={150}
            weekendPrice={400}
            onSelect={() => setSelectedRoom('4p')}
            selected={selectedRoom === '4p'}
          />
        </RoomsGrid>
      </RoomsContainer>
    </div>
  )
}