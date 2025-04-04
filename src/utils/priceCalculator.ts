import { BookingFormData } from '../types'

interface PriceBreakdown {
  basePrice: number
  extraGuestsFee: number
  extraKitFee: number
  total: number
  details: string[]
}

export function calculatePrice(data: BookingFormData): PriceBreakdown {
  const { roomType, checkIn, checkOut, extraGuests, extraKit } = data
  
  if (!checkIn || !checkOut) {
    throw new Error('Datas de check-in e check-out são necessárias')
  }

  const result: PriceBreakdown = {
    basePrice: 0,
    extraGuestsFee: 0,
    extraKitFee: 0,
    total: 0,
    details: []
  }

  // Calcula número de dias
  const timeDiff = checkOut.getTime() - checkIn.getTime()
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  
  // Preços por tipo de quarto
  const weekdayPrice = roomType === '3p' ? 100 : 150
  const weekendPrice = roomType === '3p' ? 300 : 400

  // Calcula preço por dia
  let basePrice = 0
  const details: string[] = []
  
  for (let i = 0; i < dayDiff; i++) {
    const currentDate = new Date(checkIn)
    currentDate.setDate(checkIn.getDate() + i)
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
    
    const dayPrice = isWeekend ? weekendPrice : weekdayPrice
    basePrice += dayPrice
    
    details.push(
      `${currentDate.toLocaleDateString()}: R$ ${dayPrice.toFixed(2)} (${isWeekend ? 'final de semana' : 'dia útil'})`
    )
  }

  result.basePrice = basePrice
  result.details = details

  // Taxas extras
  result.extraGuestsFee = extraGuests * 70
  if (extraGuests > 0) {
    result.details.push(`Hóspedes extras (${extraGuests}): R$ ${result.extraGuestsFee.toFixed(2)}`)
  }

  result.extraKitFee = extraKit ? 30 : 0
  if (extraKit) {
    result.details.push(`Kit extra: R$ ${result.extraKitFee.toFixed(2)}`)
  }

  // Total
  result.total = result.basePrice + result.extraGuestsFee + result.extraKitFee
  result.details.push(`Total: R$ ${result.total.toFixed(2)}`)

  return result
}