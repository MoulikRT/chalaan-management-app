interface Bill {
    customerName?: string
    billNumber: string
    chalaanNumbers: string[]
    date?: Date
    labourerName: string[]
    materialType: string[]
    squareFoot: string[]
    ratePerSqft: string[]
    total?: number
  }

export default Bill
  