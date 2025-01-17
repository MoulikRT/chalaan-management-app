import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Bill from "@/types/bills.types";
import { EditBillForm } from "@/components/EditBillForm";
import { Input } from "@/components/ui/input";

const BillsTable = ({
  bills,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
}: {
  bills: Bill[];
  onEdit: (bill: Bill, billToEdit: Bill) => void;
  onDelete: (bill: Bill) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const filteredBills = bills.filter(
    (bill) =>
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.chalaanNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.labourerName?.join().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Input
        className="my-4 p-4 max-w-xs bg"
        placeholder="Search bills/chalaans"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="rounded border border-[#e5e7eb66] bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50">
              <TableHead className="w-[5rem] py-4 text-[#4B5563] font-medium">
                S. No.
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">Date</TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Chalaan Number
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Bill Number
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Labourer(s) Name
              </TableHead>
              <TableHead className="w-[200px] py-4 text-[#4B5563] font-medium">
                Customer Name
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Material(s) Type
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Square Feet(s)
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Rate(s)
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Total
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.map((bill, index) => (
              <TableRow
                key={index}
                className="hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]"
              >
                <TableCell className="text-[#374151]">
                  {bills.indexOf(bill) + 1}
                </TableCell>

                <TableCell className="text-[#374151]">
                  {bill.date?.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-[#374151]">
                  {bill.chalaanNumber}
                </TableCell>

                <TableCell className="text-[#374151]">
                  {bill.billNumber}
                </TableCell>
                <TableCell className="text-[#374151]">
                  <div className="space-y-1">
                    {bill.labourerName.map((name, idx) => (
                      <span
                        key={idx}
                        className="block px-2 py-1 rounded-md bg-slate-50"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-[#374151]">
                  {bill.customerName}
                </TableCell>

                <TableCell className="text-[#374151]">
                  <div className="space-y-1">
                    {bill.materialType.map((material, idx) => (
                      <span
                        key={idx}
                        className="block px-2 py-1 rounded-full bg-gradient-to-r from-slate-100 to-gray-100 text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="text-[#374151]">
                  <div className="space-y-1">
                    {bill.squareFoot.map((sqft, idx) => (
                      <span
                        key={idx}
                        className="block px-2 py-1 rounded-md bg-slate-50"
                      >
                        {sqft}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="text-[#374151]">
                  <div className="space-y-1">
                    {bill.ratePerSqft.map((rate, idx) => (
                      <span
                        key={idx}
                        className="block px-2 py-1 rounded-md bg-slate-50"
                      >
                        {rate}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="text-[#374151]">
                  {bill.total?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <EditBillForm
                    onSubmit={(editedBill) => onEdit(editedBill, bill)}
                    onDelete={onDelete}
                    bills={bills}
                    billToEdit={bill}
                    // setSearchTerm={setSearchTerm}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default BillsTable;
