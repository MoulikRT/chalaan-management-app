import { useState } from "react";
import BillsTable from "./app/BillsTable";
import "./App.css";
import { AddBillForm } from "./components/AddBillForm";
;

function App() {
  
  const [bills, setBills] = useState([
    {
      customerName: "John Doe",
      billNumber: "BILL-001",
      date: new Date("2024-01-15"),
      materialType: "Marble",
      squareFoot: 100,
      ratePerSqft: 45.50
    },
    {
      customerName: "Jane Smith",
      billNumber: "BILL-002",
      date: new Date("2024-01-16"),
      materialType: "Granite",
      squareFoot: 75,
      ratePerSqft: 38.25
    }
  ])

  const handleAddBill = (newBill: any) => {
    setBills(prev => [...prev, {
      ...newBill,
      squareFoot: Number(newBill.squareFoot),
      ratePerSqft: Number(newBill.ratePerSqft),
    }])
    
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-gray-50">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[2rem] font-medium text-[#111827]">Chalaans</h1>
            <p className="text-[#6B7280]">Manage and track your chalaans</p>
          </div>
          <AddBillForm onSubmit={handleAddBill} bills={bills}/>
        </div>
        <BillsTable bills={bills} />
      </div>
    </main>
  );
}

export default App;
