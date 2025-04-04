export type RoomType = '3p' | '4p'
export type PetSize = 'P' | 'M' | 'G'

export interface Guest {
  age: number
}

export interface Pet {
  type: string
  size: PetSize
  description: string
}

export interface BookingFormData {
  fullName: string
  rg: string
  cpf: string
  roomType: RoomType
  checkIn: Date
  checkOut: Date
  guests: Guest[]
  hasPet: boolean
  pets?: Pet[]
  extraGuests: number
  extraKit: boolean
  petTerms: boolean
}

export interface PriceCalculationResult {
  basePrice: number
  extraGuestsFee: number
  extraKitFee: number
  total: number
  details: string
}