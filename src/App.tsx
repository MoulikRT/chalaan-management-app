import { useState, useEffect } from "react";
import BillsTable from "./app/BillsTable";
import "./App.css";
import { AddBillForm } from "./components/AddBillForm";
import Bill from "./types/bills.types";

// const testValues = [
//   {
//     customerName: "amazing test",
//     billNumber: "BILL-001",
//     chalaanNumber: "CH-001",
//     labourerName: ["your", "mom"],
//     date: new Date("2024-01-15"),
//     materialType: ["Marble"],
//     squareFoot: [100],
//     ratePerSqft: [45.50],
//     total: 4550
//   },
//   {
//     customerName: "test awesome",
//     billNumber: "BILL-002",
//     chalaanNumber: "CH-002",
//     labourerName: ["hello", "world"],
//     date: new Date("2024-01-16"),
//     materialType: ["Granite"],
//     squareFoot: [75],
//     ratePerSqft: [38.25],
//     total: 2868.75
//   }
// ]

const getInitialBills = (): Bill[] => {
  const savedBills = localStorage.getItem("bills");
  if (!savedBills) {
    return [];
  }
  return JSON.parse(savedBills).map((bill: Bill) => {
    if (!bill.date) {
      return bill;
    }
    return {
      ...bill,
      date: new Date(bill.date),
    };
  });
};

function App() {
  const [bills, setBills] = useState<Bill[]>(getInitialBills());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  const handleAddBill = (newBill: Bill) => {
    setBills((prev) => [...prev, newBill]);
  };

  const handleEditBill = (editedBill: Bill, billToEdit: Bill) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.billNumber === billToEdit.billNumber ? editedBill : bill
      )
    );
  };

  const handleDeleteBill = (billToDelete: Bill) => {
    setBills((prev) =>
      prev.filter((bill) => bill.billNumber !== billToDelete.billNumber)
    );
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-gray-50">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[2rem] font-medium text-[#111827]">Chalaans</h1>
            <p className="text-[#6B7280]">Manage and track your chalaans</p>
          </div>
          <AddBillForm
            onSubmit={handleAddBill}
            bills={bills}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <BillsTable
          bills={bills}
          onEdit={handleEditBill}
          onDelete={handleDeleteBill}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </main>
  );
}

export default App;
