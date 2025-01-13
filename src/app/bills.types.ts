interface Bill {
    customerName: string
    billNumber: string
    date: Date | undefined
    labourerName: string[]
    materialType: string[]
    squareFoot: number[]
    ratePerSqft: number[]
    total: number | undefined
  }

export default Bill
  