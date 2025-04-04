import styled from 'styled-components'
import { FaWhatsapp } from 'react-icons/fa'

const Button = styled.a`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #25D366;
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

interface WhatsappButtonProps {
  phone?: string
  message?: string
}

export default function WhatsappButton({
  phone = '5511999999999',
  message = 'Olá, gostaria de fazer uma reserva no Eco Parque Lagoa Grande'
}: WhatsappButtonProps): JSX.Element {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <Button href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <FaWhatsapp />
    </Button>
  )
}