interface Bill {
    customerName?: string
    billNumber: string
    chalaanNumber: string
    date?: Date
    labourerName: string[]
    materialType: string[]
    squareFoot: string[]
    ratePerSqft: string[]
    total?: number
  }

export default Bill
  