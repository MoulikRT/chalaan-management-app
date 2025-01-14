interface Bill {
    customerName?: string
    billNumber: string
    chalaanNumber: string
    date?: Date
    labourerName: string[]
    materialType: string[]
    squareFoot: number[]
    ratePerSqft: number[]
    total?: number
  }

export default Bill
  