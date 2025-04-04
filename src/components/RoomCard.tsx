import styled from 'styled-components'

interface RoomCardProps {
  type: '3p' | '4p'
  image: string
  description: string
  weekdayPrice: number
  weekendPrice: number
  onSelect: () => void
  selected: boolean
}

const Card = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? '#2E8B57' : '#ddd'};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`

const Content = styled.div`
  padding: 1rem;
`

const Title = styled.h3`
  margin: 0 0 0.5rem;
  color: #2E8B57;
`

const Price = styled.div`
  margin: 0.5rem 0;
  font-weight: bold;
`

const SelectButton = styled.button`
  background-color: ${props => props.selected ? '#2E8B57' : '#DAA520'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2E8B57;
  }
`

export default function RoomCard({
  type,
  image,
  description,
  weekdayPrice,
  weekendPrice,
  onSelect,
  selected
}: RoomCardProps): JSX.Element {
  return (
    <Card selected={selected} onClick={onSelect}>
      <Image src={image} alt={`Quarto para ${type === '3p' ? '3 pessoas' : '4 pessoas'}`} />
      <Content>
        <Title>Quarto para {type === '3p' ? 'até 3 pessoas' : 'até 4 pessoas'}</Title>
        <p>{description}</p>
        <Price>
          <div>Seg-Qui: R$ {weekdayPrice.toFixed(2)}</div>
          <div>Sex-Dom: R$ {weekendPrice.toFixed(2)}</div>
        </Price>
        <SelectButton selected={selected}>
          {selected ? 'Selecionado' : 'Selecionar'}
        </SelectButton>
      </Content>
    </Card>
  )
}