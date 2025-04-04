import { useState } from 'react'
import styled from 'styled-components'
import { useForm, FieldError } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface ErrorTextProps {
  children?: React.ReactNode
}

const ErrorText = styled.span<ErrorTextProps>`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`

// Tipos para o formulário de visitantes
type VisitorFormData = {
  name: string
  email: string
  message: string
}

// Tipos para o formulário de empresas
type BusinessFormData = {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  businessType: string
  message: string
}

// Schemas de validação
const visitorSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  message: yup.string().required('Mensagem é obrigatória')
})

const businessSchema = yup.object().shape({
  companyName: yup.string().required('Nome da empresa é obrigatório'),
  contactPerson: yup.string().required('Pessoa de contato é obrigatória'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  businessType: yup.string().required('Tipo de negócio é obrigatório'),
  message: yup.string().required('Mensagem é obrigatória')
})

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`

const TabButton = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#2E8B57' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#2E8B57' : '#555'};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #2E8B57;
  }
`

const FormSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  textarea {
    min-height: 150px;
  }
`

const SubmitButton = styled.button`
  background-color: #2E8B57;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3CB371;
  }
`

export default function Contact(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'visitor' | 'business'>('visitor')

  // Formulário para visitantes
  const { 
    register: registerVisitor, 
    handleSubmit: handleSubmitVisitor,
    formState: { errors: visitorErrors }
  } = useForm<VisitorFormData>({
    resolver: yupResolver(visitorSchema)
  })

  // Formulário para empresas
  const { 
    register: registerBusiness, 
    handleSubmit: handleSubmitBusiness,
    formState: { errors: businessErrors }
  } = useForm<BusinessFormData>({
    resolver: yupResolver(businessSchema)
  })

  const onSubmitVisitor = (data: VisitorFormData) => {
    console.log('Dados do visitante:', data)
    alert('Mensagem enviada com sucesso!')
  }

  const onSubmitBusiness = (data: BusinessFormData) => {
    console.log('Dados da empresa:', data)
    alert('Solicitação de parceria enviada!')
  }

  const renderError = (error?: FieldError) => {
    return error && <ErrorText>{error.message}</ErrorText>
  }

  return (
    <ContactContainer>
      <h1>Contato</h1>
      
      <TabContainer>
        <TabButton 
          active={activeTab === 'visitor'}
          onClick={() => setActiveTab('visitor')}
        >
          Visitantes
        </TabButton>
        <TabButton 
          active={activeTab === 'business'}
          onClick={() => setActiveTab('business')}
        >
          Empresas de Turismo
        </TabButton>
      </TabContainer>
      
      {activeTab === 'visitor' ? (
        <FormSection>
          <h2>Fale Conosco</h2>
          <form onSubmit={handleSubmitVisitor(onSubmitVisitor)}>
            <FormGroup>
              <label>Nome</label>
              <input {...registerVisitor('name')} />
              {renderError(visitorErrors.name)}
            </FormGroup>
            
            <FormGroup>
              <label>E-mail</label>
              <input type="email" {...registerVisitor('email')} />
              {renderError(visitorErrors.email)}
            </FormGroup>
            
            <FormGroup>
              <label>Mensagem</label>
              <textarea {...registerVisitor('message')} />
              {renderError(visitorErrors.message)}
            </FormGroup>
            
            <SubmitButton type="submit">Enviar Mensagem</SubmitButton>
          </form>
          
          <div style={{ marginTop: '2rem' }}>
            <h3>Outras Formas de Contato</h3>
            <p>E-mail: contato@ecoparquelagoagrande.com.br</p>
            <p>Telefone: (XX) XXXX-XXXX</p>
            <p>Endereço: Estrada da Reserva, KM 5 - Santa Izabel</p>
          </div>
        </FormSection>
      ) : (
        <FormSection>
          <h2>Parcerias para Empresas de Turismo</h2>
          <p>
            Oferecemos condições especiais para agências de turismo e operadoras. 
            Preencha o formulário abaixo e nossa equipe comercial entrará em contato.
          </p>
          
          <form onSubmit={handleSubmitBusiness(onSubmitBusiness)}>
            <FormGroup>
              <label>Nome da Empresa</label>
              <input {...registerBusiness('companyName')} />
              {renderError(businessErrors.companyName)}
            </FormGroup>
            
            <FormGroup>
              <label>Pessoa de Contato</label>
              <input {...registerBusiness('contactPerson')} />
              {renderError(businessErrors.contactPerson)}
            </FormGroup>
            
            <FormGroup>
              <label>E-mail</label>
              <input type="email" {...registerBusiness('email')} />
              {renderError(businessErrors.email)}
            </FormGroup>
            
            <FormGroup>
              <label>Telefone</label>
              <input {...registerBusiness('phone')} />
              {renderError(businessErrors.phone)}
            </FormGroup>
            
            <FormGroup>
              <label>Tipo de Negócio</label>
              <select {...registerBusiness('businessType')}>
                <option value="">Selecione...</option>
                <option value="agency">Agência de Turismo</option>
                <option value="operator">Operadora de Turismo</option>
                <option value="guide">Guia de Turismo</option>
                <option value="other">Outro</option>
              </select>
              {renderError(businessErrors.businessType)}
            </FormGroup>
            
            <FormGroup>
              <label>Mensagem</label>
              <textarea 
                {...registerBusiness('message')} 
                placeholder="Informe suas necessidades, pacotes de interesse, etc."
              />
              {renderError(businessErrors.message)}
            </FormGroup>
            
            <SubmitButton type="submit">Solicitar Parceria</SubmitButton>
          </form>
          
          <div style={{ marginTop: '2rem' }}>
            <h3>Vantagens para Parceiros</h3>
            <ul>
              <li>Tarifas especiais para grupos</li>
              <li>Prioridade nas reservas em alta temporada</li>
              <li>Comissão para agentes credenciados</li>
              <li>Material promocional personalizado</li>
            </ul>
          </div>
        </FormSection>
      )}
    </ContactContainer>
  )
}