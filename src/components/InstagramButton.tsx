import styled from 'styled-components'
import { FaInstagram } from 'react-icons/fa'

const Button = styled.a`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 100;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`

interface InstagramButtonProps {
  profile?: string
}

export default function InstagramButton({
  profile = 'ecoparquelagoagrande'
}: InstagramButtonProps): JSX.Element {
  const instagramUrl = `https://instagram.com/${profile}`

  return (
    <Button href={instagramUrl} target="_blank" rel="noopener noreferrer">
      <FaInstagram />
    </Button>
  )
}