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
import { useState } from "react";

const BillsTable = ({
  bills,
  onEdit,
  onDelete,
}: {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredBills = bills.filter(
    (bill) =>
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.chalaanNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
              <TableHead className="w-[200px] py-4 text-[#4B5563] font-medium">
                Customer Name
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Bill Number
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Chalaan Number
              </TableHead>
              <TableHead className="text-[#4B5563] font-medium">Date</TableHead>
              <TableHead className="text-[#4B5563] font-medium">
                Labourer(s) Name
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
                  {bill.customerName}
                </TableCell>
                <TableCell className="text-[#374151]">
                  {bill.billNumber}
                </TableCell>
                <TableCell className="text-[#374151]">
                  {bill.chalaanNumber}
                </TableCell>
                <TableCell className="text-[#374151]">
                  {bill.date?.toLocaleDateString()}
                </TableCell>

                {/* Labourer Names Cell */}
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

                {/* Material Types Cell */}
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

                {/* Square Feet Cell */}
                <TableCell className="text-[#374151]">
                  <div className="space-y-1">
                    {bill.squareFoot.map((sqft, idx) => (
                      <span
                        key={idx}
                        className="block px-2 py-1 rounded-md bg-slate-50"
                      >
                        {sqft.toLocaleString()}
                      </span>
                    ))}
                  </div>
                </TableCell>

                {/* Rate Per Sqft Cell */}
                <TableCell className="text-[#374151]">
                  <div className="space-y-1">
                    {bill.ratePerSqft.map((rate, idx) => (
                      <span
                        key={idx}
                        className="block px-2 py-1 rounded-md bg-slate-50"
                      >
                        ₹{rate.toLocaleString()}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="text-[#374151]">
                  {bill.total?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <EditBillForm
                    onSubmit={onEdit}
                    onDelete={onDelete}
                    bills={bills}
                    billToEdit={bill}
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
