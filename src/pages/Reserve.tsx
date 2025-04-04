import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray, SubmitHandler, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

// Tipos
type Pet = {
  id: string;
  type: string;
  size: 'P' | 'M' | 'G';
  description: string;
};

type FormData = {
  fullName: string;
  rg: string;
  cpf: string;
  roomType: '3p' | '4p';
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  hasPet: boolean;
  pets?: Pet[];
  extraGuests: number;
  extraKitQuantity: number;
  petTerms: boolean;
};

// Schema de validação
const schema = yup.object().shape({
  fullName: yup.string().required('Nome completo é obrigatório'),
  rg: yup.string().required('RG é obrigatório'),
  cpf: yup.string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (use o formato 000.000.000-00)'),
  roomType: yup.string().oneOf(['3p', '4p'] as const).required('Tipo de quarto é obrigatório'),
  checkIn: yup.date()
    .required('Data de entrada é obrigatória')
    .min(new Date(), 'Não é possível reservar para datas passadas'),
  checkOut: yup.date()
    .required('Data de saída é obrigatória')
    .min(yup.ref('checkIn'), 'Data de saída deve ser após a entrada')
    .test(
      'min-stay',
      'Reserva mínima de 1 noite',
      function(value) {
        const checkIn = this.parent.checkIn;
        if (!checkIn || !value) return true;
        return value.getTime() > checkIn.getTime();
      }
    ),
  guestCount: yup.number()
    .min(1, 'Mínimo 1 hóspede')
    .max(4, 'Máximo 4 hóspedes')
    .required('Número de hóspedes é obrigatório'),
  hasPet: yup.boolean().required(),
  pets: yup.array().when('hasPet', {
    is: true,
    then: (schema) => schema.of(
      yup.object().shape({
        id: yup.string().required(),
        type: yup.string().required('Tipo do pet é obrigatório'),
        size: yup.string().oneOf(['P', 'M', 'G'] as const).required('Porte é obrigatório'),
        description: yup.string().required('Descrição é obrigatória')
      })
    ).min(1, 'Pelo menos um pet deve ser informado')
  }),
  extraGuests: yup.number()
    .min(0, 'Número de hóspedes extras não pode ser negativo')
    .required(),
  extraKitQuantity: yup.number()
    .min(0, 'Quantidade não pode ser negativa')
    .required(),
  petTerms: yup.boolean().when('hasPet', {
    is: true,
    then: (schema) => schema
      .oneOf([true], 'Você deve aceitar os termos para pets')
      .required('Você deve aceitar os termos para pets')
  })
});

export default function Reserve(): JSX.Element {
  const { 
    register, 
    handleSubmit, 
    watch, 
    control, 
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      guestCount: 1,
      extraGuests: 0,
      extraKitQuantity: 0,
      hasPet: false,
      petTerms: false,
      pets: []
    }
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [priceDetails, setPriceDetails] = useState<string[]>([]);
  const [showPetSection, setShowPetSection] = useState(false);
  const [showExtrasSection, setShowExtrasSection] = useState(false);

  const { fields: petFields, append: appendPet, remove: removePet } = useFieldArray({ 
    control, 
    name: 'pets' 
  });

  const roomType = watch('roomType');
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const guestCount = watch('guestCount', 1);
  const extraGuests = watch('extraGuests', 0);
  const extraKitQuantity = watch('extraKitQuantity', 0);
  const hasPet = watch('hasPet', false);

  useEffect(() => {
    if (checkIn && checkOut && roomType) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Preços base
      const roomPrices = {
        '3p': 250,
        '4p': 320
      };
      
      // Cálculos
      const basePrice = roomPrices[roomType] * diffDays;
      const extraGuestsPrice = extraGuests * 70 * diffDays;
      const extraKitPrice = extraKitQuantity * 30 * diffDays;
      const petFee = hasPet && petFields.length > 0 ? 50 * petFields.length * diffDays : 0;
      
      const subtotal = basePrice + extraGuestsPrice + extraKitPrice + petFee;
      
      setTotalPrice(subtotal);
      
      // Detalhes do preço
      const details = [
        `Diária do quarto (${roomType === '3p' ? '3 pessoas' : '4 pessoas'}): R$ ${roomPrices[roomType].toFixed(2)} x ${diffDays} noites = R$ ${basePrice.toFixed(2)}`,
        extraGuests > 0 && `Hóspedes extras: ${extraGuests} x R$ 70,00 x ${diffDays} noites = R$ ${extraGuestsPrice.toFixed(2)}`,
        extraKitQuantity > 0 && `Kits extras: ${extraKitQuantity} x R$ 30,00 x ${diffDays} noites = R$ ${extraKitPrice.toFixed(2)}`,
        hasPet && petFields.length > 0 && `Taxa para ${petFields.length} pet(s): R$ ${(50 * petFields.length).toFixed(2)} x ${diffDays} noites = R$ ${petFee.toFixed(2)}`
      ].filter(Boolean) as string[];
      
      setPriceDetails(details);
    }
  }, [roomType, checkIn, checkOut, guestCount, extraGuests, extraKitQuantity, hasPet, petFields.length]);

  const togglePetSection = () => {
    setShowPetSection(!showPetSection);
    setValue('hasPet', !showPetSection);
    if (!showPetSection) {
      appendPet({ id: `${petFields.length}`, type: '', size: 'M', description: '' });
    }
  };

  const toggleExtrasSection = () => {
    setShowExtrasSection(!showExtrasSection);
    if (!showExtrasSection) {
      setValue('extraGuests', 1);
      setValue('extraKitQuantity', 1);
    } else {
      setValue('extraGuests', 0);
      setValue('extraKitQuantity', 0);
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    let message = `*NOVA RESERVA - Eco Parque Lagoa Grande*%0A%0A`;
    message += `*Nome:* ${data.fullName}%0A`;
    message += `*RG:* ${data.rg}%0A`;
    message += `*CPF:* ${data.cpf}%0A%0A`;
    message += `*Quarto:* ${data.roomType === '3p' ? 'Standard (até 3 pessoas)' : 'Família (até 4 pessoas)'}%0A`;
    message += `*Check-in:* ${formatDate(data.checkIn)}%0A`;
    message += `*Check-out:* ${formatDate(data.checkOut)}%0A`;
    message += `*Nº de Hóspedes:* ${data.guestCount}%0A`;

    if (data.extraGuests > 0) {
      message += `*Hóspedes Extras:* ${data.extraGuests}%0A`;
      message += `*Kits Extras:* ${data.extraKitQuantity}%0A%0A`;
    }

    if (data.hasPet && data.pets) {
      message += `*Pets:*%0A`;
      data.pets.forEach(pet => {
        message += `- ${pet.type} (${pet.size}), ${pet.description}%0A`;
      });
      message += `%0A`;
    }

    message += `*Valor Total:* R$ ${totalPrice.toFixed(2)}%0A%0A`;
    message += `*Detalhes do Cálculo:*%0A${priceDetails.join('%0A')}`;

    window.open(`https://wa.me/5579998807035?text=${message}`, '_blank');
  };

  const renderError = (error: FieldError | undefined) => {
    if (!error) return null;
    return <ErrorText>{error.message}</ErrorText>;
  };

  return (
    <ReserveContainer>
      <h1>Faça sua Reserva</h1>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Seção de Dados Pessoais */}
        <FormSection>
          <h2>Dados Pessoais</h2>
          
          <FormGroup>
            <label>Nome Completo*</label>
            <input {...register('fullName')} />
            {renderError(errors.fullName)}
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <label>RG*</label>
              <input {...register('rg')} />
              {renderError(errors.rg)}
            </FormGroup>
            
            <FormGroup>
              <label>CPF*</label>
              <input {...register('cpf')} placeholder="000.000.000-00" />
              {renderError(errors.cpf)}
            </FormGroup>
          </FormRow>
        </FormSection>
        
        {/* Seção de Reserva */}
        <FormSection>
          <h2>Detalhes da Reserva</h2>
          
          <FormGroup>
            <label>Tipo de Quarto*</label>
            <select {...register('roomType')}>
              <option value="3p">Quarto para até 3 pessoas</option>
              <option value="4p">Quarto para até 4 pessoas</option>
            </select>
            {renderError(errors.roomType)}
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <label>Check-in*</label>
              <Controller
                control={control}
                name="checkIn"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione a data"
                    className="date-picker"
                  />
                )}
              />
              {renderError(errors.checkIn)}
            </FormGroup>
            
            <FormGroup>
              <label>Check-out*</label>
              <Controller
                control={control}
                name="checkOut"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    minDate={watch('checkIn') || new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione a data"
                    className="date-picker"
                  />
                )}
              />
              {renderError(errors.checkOut)}
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <label>Número de Hóspedes*</label>
            <select {...register('guestCount', { valueAsNumber: true })}>
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'pessoa' : 'pessoas'}
                </option>
              ))}
            </select>
            {renderError(errors.guestCount)}
          </FormGroup>
        </FormSection>
        
        {/* Seção de Pets (Opcional) */}
        <ToggleSection>
          <ToggleHeader onClick={togglePetSection}>
            <h3>Seu pet vem? {showPetSection ? '▼' : '►'}</h3>
          </ToggleHeader>
          
          {showPetSection && (
            <ToggleContent>
              {petFields.map((field, index) => (
                <PetInputGroup key={field.id}>
                  <h4>Pet #{index + 1}</h4>
                  
                  <input
                    {...register(`pets.${index}.type` as const)}
                    placeholder="Tipo (ex: cachorro, gato)"
                  />
                  {renderError(errors.pets?.[index]?.type)}
                  
                  <select {...register(`pets.${index}.size` as const)}>
                    <option value="P">Pequeno</option>
                    <option value="M">Médio</option>
                    <option value="G">Grande</option>
                  </select>
                  {renderError(errors.pets?.[index]?.size)}
                  
                  <textarea
                    {...register(`pets.${index}.description` as const)}
                    placeholder="Descrição do pet"
                  />
                  {renderError(errors.pets?.[index]?.description)}
                  
                  <RemoveButton 
                    type="button" 
                    onClick={() => removePet(index)}
                  >
                    Remover pet
                  </RemoveButton>
                </PetInputGroup>
              ))}
              
              <AddButton 
                type="button" 
                onClick={() => appendPet({ id: `${petFields.length}`, type: '', size: 'M', description: '' })}
              >
                + Adicionar pet
              </AddButton>
              
              <TermsGroup>
                <TermsLabel>
                  <input type="checkbox" {...register('petTerms')} />
                  <span>
                    Eu concordo com os termos para pets
                    <Tooltip>ℹ️
                      <TooltipContent>
                        <h4>Regras para Hospedagem com Pets</h4>
                        <p>Nosso hotel é pet friendly e ficamos felizes em receber você e seu animal de estimação. Para garantir uma estadia agradável para todos, pedimos que os tutores sigam as regras abaixo:</p>
                        <ul>
                          <li><strong>Responsabilidade Total:</strong> O tutor é totalmente responsável pelo comportamento e bem-estar do seu pet durante toda a estadia.</li>
                          <li><strong>Higiene:</strong> Todos os dejetos devem ser recolhidos e descartados corretamente pelo responsável.</li>
                          <li><strong>Áreas Comuns:</strong> Os pets não podem circular soltos nas áreas comuns do hotel; é obrigatório o uso de guia ou caixa de transporte.</li>
                          <li><strong>Danos e Ocorrências:</strong> Qualquer dano causado pelo animal ao patrimônio do hotel ou a terceiros será de total responsabilidade do tutor.</li>
                        </ul>
                        <p>O não cumprimento dessas regras pode resultar em penalidades e cobrança de taxas adicionais. Agradecemos sua compreensão e colaboração para manter um ambiente seguro e agradável para todos!</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </TermsLabel>
                {renderError(errors.petTerms)}
              </TermsGroup>
            </ToggleContent>
          )}
        </ToggleSection>
        
        {/* Seção de Extras (Opcional) */}
        <ToggleSection>
          <ToggleHeader onClick={toggleExtrasSection}>
            <h3>Hóspedes Extras? {showExtrasSection ? '▼' : '►'}</h3>
          </ToggleHeader>
          
          {showExtrasSection && (
            <ToggleContent>
              <FormGroup>
                <label>Quantos hóspedes extras? (R$ 70/pessoa)</label>
                <input
                  type="number"
                  min="0"
                  {...register('extraGuests', { valueAsNumber: true })}
                />
                <small>Você precisará trazer seu próprio colchão</small>
                {renderError(errors.extraGuests)}
              </FormGroup>

              <FormGroup>
                <label>Quantos kits extras? (R$ 30/unidade)</label>
                <select {...register('extraKitQuantity', { valueAsNumber: true })}>
                  {[...Array(extraGuests + 1).keys()].map(num => (
                    <option key={num} value={num}>{num} kit(s)</option>
                  ))}
                </select>
                <small>Cada kit inclui: Colchonete, toalha, lençol e travesseiro</small>
                {renderError(errors.extraKitQuantity)}
              </FormGroup>
            </ToggleContent>
          )}
        </ToggleSection>
        
        {/* Resumo e Submissão */}
        <PriceSummary>
          <h3>Resumo de Valores</h3>
          {priceDetails.map((detail, index) => (
            <PriceDetailItem key={index}>
              <span>{detail.split('=')[0]}</span>
              <span>{detail.split('=')[1]}</span>
            </PriceDetailItem>
          ))}
          <TotalPrice>
            <span>Total:</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </TotalPrice>
        </PriceSummary>
        
        <SubmitButton type="submit">Reservar Agora</SubmitButton>
      </Form>
    </ReserveContainer>
  );
}

// Estilos (mantidos iguais)
const ReserveContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  h1 {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  padding: 1.5rem;
  border-radius: 10px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  
  h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
    border-bottom: 2px solid #DAA520;
    padding-bottom: 0.5rem;
  }
`;

const ToggleSection = styled.div`
  margin-bottom: 1rem;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e9ecef;
`;

const ToggleHeader = styled.div`
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  cursor: pointer;
  
  h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.2rem;
    display: flex;
    justify-content: space-between;
  }
  
  &:hover {
    background: #e9ecef;
  }
`;

const ToggleContent = styled.div`
  padding: 1.5rem;
  background: white;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #495057;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 1rem;
    transition: border 0.3s;
    
    &:focus {
      outline: none;
      border-color: #DAA520;
      box-shadow: 0 0 0 2px rgba(218, 165, 32, 0.2);
    }
  }
  
  textarea {
    min-height: 100px;
  }

  small {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.8rem;
    color: #6c757d;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const AddButton = styled.button`
  background-color: #f8f9fa;
  color: #495057;
  padding: 0.7rem 1rem;
  border: 1px dashed #adb5bd;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  margin-top: 0.5rem;

  &:hover {
    background-color: #e9ecef;
    border-color: #6c757d;
    border-style: solid;
  }
`;

const RemoveButton = styled.button`
  background-color: #fff;
  color: #dc3545;
  padding: 0.5rem 1rem;
  border: 1px solid #dc3545;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8d7da;
  }
`;

const PetInputGroup = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #eee;
  
  h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #495057;
  }

  input, select, textarea {
    margin-bottom: 0.8rem;
  }
`;

const TermsGroup = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f0f7ff;
  border-radius: 8px;
  border: 1px solid #d0e3ff;
`;

const TermsLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
`;

const Tooltip = styled.span`
  position: relative;
  display: inline-block;
  margin-left: 0.5rem;
  cursor: pointer;

  &:hover > span {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipContent = styled.span`
  visibility: hidden;
  width: 300px;
  background-color: #fff;
  color: #495057;
  border: 1px solid #DAA520;
  border-radius: 6px;
  padding: 1rem;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-size: 0.9rem;
  text-align: left;

  h4 {
    color: #DAA520;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  ul {
    padding-left: 1.2rem;
    margin: 0.5rem 0;
  }

  li {
    margin-bottom: 0.3rem;
  }

  @media (max-width: 768px) {
    width: 250px;
    left: 100%;
    transform: translateX(-100%);
  }
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const PriceSummary = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  
  h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
`;

const PriceDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px dashed #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2E8B57;
  margin: 1rem 0;
  padding-top: 1rem;
  border-top: 2px solid #eee;
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled.button`
  background-color: #DAA520;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #c1911d;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(218, 165, 32, 0.3);
  }
`;