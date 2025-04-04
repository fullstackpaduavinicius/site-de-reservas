import styled from 'styled-components'
import { FaLeaf } from 'react-icons/fa'
import { motion } from 'framer-motion'

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
`

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #2E8B57;
  font-size: 1.2rem;
`

const spinTransition = {
  loop: Infinity,
  duration: 1,
  ease: "linear"
}

export default function Loading(): JSX.Element {
  return (
    <LoadingContainer>
      <motion.div
        animate={{ rotate: 360 }}
        transition={spinTransition}
      >
        <FaLeaf size={48} color="#2E8B57" />
      </motion.div>
      <LoadingText>Carregando...</LoadingText>
    </LoadingContainer>
  )
}