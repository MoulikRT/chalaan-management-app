import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const BillsTable = ({ bills }: { bills: Bill[] }) => {
  return (
    <div>
        BillsTable
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead> Customer Name </TableHead>
                    <TableHead> Bill Number </TableHead>
                    <TableHead> Date </TableHead>
                    <TableHead> Material </TableHead>
                    <TableHead> Square Feet</TableHead>
                    <TableHead> Rate </TableHead>
                    <TableHead> Total </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bills.map((bill, index) => (
                    <TableRow key={index}>
                        <TableCell> {bill.billNumber} </TableCell>
                        <TableCell> {bill.customerName} </TableCell>
                        <TableCell> {bill.date.toLocaleDateString()} </TableCell>
                        <TableCell> {bill.materialType} </TableCell>
                        <TableCell> {bill.ratePerSqft} </TableCell>
                        <TableCell> {bill.squareFoot} </TableCell>
                        <TableCell> {bill.squareFoot * bill. ratePerSqft} </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default BillsTable