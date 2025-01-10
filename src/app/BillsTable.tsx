import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BillsTable = ({ bills }: { bills: Bill[] }) => {
  return (
    <div className="rounded border border-[#e5e7eb66] bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50">
            <TableHead className="w-[200px] py-4 text-[#4B5563 font-medium">
              {" "}
              Customer Name{" "}
            </TableHead>
            <TableHead className="text-[#4B5563 font-medium">
              {" "}
              Bill Number{" "}
            </TableHead>
            <TableHead className="text-[#4B5563 font-medium"> Date </TableHead>
            <TableHead className="text-[#4B5563 font-medium">
              {" "}
              Material{" "}
            </TableHead>
            <TableHead className="text-[#4B5563 font-medium">
              {" "}
              Square Feet{" "}
            </TableHead>
            <TableHead className="text-[#4B5563 font-medium"> Rate </TableHead>
            <TableHead className="text-[#4B5563 font-medium"> Total </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill, index) => (
            <TableRow
              key={index}
              className="hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]"
            >
              <TableCell className="text-[#374151]">
                {" "}
                {bill.customerName}{" "}
              </TableCell>
              <TableCell className="text-[#374151]">
                {" "}
                {bill.billNumber}{" "}
              </TableCell>
              <TableCell className="text-[#374151]">
                {" "}
                {bill.date.toLocaleDateString()}{" "}
              </TableCell>
              <TableCell className="text-[#374151]">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-slate-100 to-gray-100 px-3 py-1 text-sm font-medium text-[#374151]">
                  {bill.materialType}
                </span>
              </TableCell>
              <TableCell className="text-[#374151]">
                {" "}
                {bill.ratePerSqft}{" "}
              </TableCell>
              <TableCell className="text-[#374151]">
                {" "}
                {bill.squareFoot}{" "}
              </TableCell>
              <TableCell className="text-[#374151]">
                {" "}
                {bill.squareFoot * bill.ratePerSqft}{" "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BillsTable;
