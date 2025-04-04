import styled from 'styled-components'

const FooterContainer = styled.footer`
  background-color: #8B4513;
  color: white;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
`

const FooterText = styled.p`
  margin: 0.5rem 0;
`

export default function Footer(): JSX.Element {
  return (
    <FooterContainer>
      <FooterText>Eco Parque Lagoa Grande - Reserva Natural Santa Izabel</FooterText>
      <FooterText>Contato: contato@ecoparquelagoagrande.com.br</FooterText>
      <FooterText>© {new Date().getFullYear()} Todos os direitos reservados</FooterText>
    </FooterContainer>
  )
}