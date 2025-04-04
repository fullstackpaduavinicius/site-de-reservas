import styled from 'styled-components'
import { Link } from 'react-router-dom'

const HeaderContainer = styled.header`
  background-color: #2E8B57;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`

const Logo = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #F4A460;
  }
`

export default function Header(): JSX.Element {
  return (
    <HeaderContainer>
      <Logo>Eco Parque Lagoa Grande</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/sobre">Sobre</NavLink>
        <NavLink to="/reserva">Reservas</NavLink>
        <NavLink to="/natureza">Natureza</NavLink>
        <NavLink to="/portfolio">Portfólio</NavLink>
        <NavLink to="/contato">Contato</NavLink>
      </Nav>
    </HeaderContainer>
  )
}