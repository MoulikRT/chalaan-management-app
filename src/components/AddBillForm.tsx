import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Bill from "@/types/bills.types";

export function AddBillForm({
  onSubmit,
  bills,
}: {
  onSubmit: (bill: Bill) => void;
  bills: Bill[];
}) {
  const [open, setOpen] = useState(false);
  const [currentInputs, setCurrentInputs] = useState({
    labourerName: "",
    materialType: "",
    squareFoot: "",
    ratePerSqft: "",
  });
  const [formData, setFormData] = useState<Bill>({
    customerName: "",
    billNumber: "",
    chalaanNumber: "",
    labourerName: [],
    date: undefined,
    materialType: [],
    squareFoot: [],
    ratePerSqft: [],
    total: undefined,
  });

  const [errors, setErrors] = useState({
    billNumber: "",
    chalaanNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear errors when user starts typing
    if (name === "billNumber" || name === "chalaanNumber") {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }

    if (["customerName", "billNumber", "chalaanNumber", "total"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value.trim(),
      }));

      // Validate as user types
      if (name === "billNumber") {
        if (bills.some((bill) => bill.billNumber === value.trim())) {
          setErrors(prev => ({
            ...prev,
            billNumber: "This bill number already exists",
          }));
        }
      }
      if (name === "chalaanNumber") {
        if (bills.some((bill) => bill.chalaanNumber === value.trim())) {
          setErrors(prev => ({
            ...prev,
            chalaanNumber: "This chalaan number already exists",
          }));
        }
      }
    } else {
      setCurrentInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleAddItem = (field: keyof typeof currentInputs) => {
    if (!currentInputs[field]) return;

    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field as keyof Bill], 
        field === "squareFoot" || field === "ratePerSqft" 
          ? Number(currentInputs[field]) 
          : currentInputs[field]
      ],
    }));
    console.log("currentInputs, formdata", currentInputs, formData)

    setCurrentInputs((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleRemoveItem = (field: keyof Bill, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submission
    const billNumberExists = bills.some((bill) => bill.billNumber === formData.billNumber);
    const chalaanNumberExists = bills.some((bill) => bill.chalaanNumber === formData.chalaanNumber);
    
    if (billNumberExists || chalaanNumberExists) {
      setErrors({
        billNumber: billNumberExists ? "This bill number already exists" : "",
        chalaanNumber: chalaanNumberExists ? "This chalaan number already exists" : "",
      });
      return;
    }

    onSubmit(formData);
    setFormData({
      customerName: "",
      billNumber: "",
      chalaanNumber: "",
      date: undefined,
      labourerName: [],
      materialType: [],
      squareFoot: [],
      ratePerSqft: [],
      total: undefined,
    });
    setErrors({ billNumber: "", chalaanNumber: "" });
    setOpen(false);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-gray-950 text-white rounded-full px-6">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Bill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] rounded-2xl border-[#E5E7EB] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-[#111827]">
            Add New Bill
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            {/* First Column */}
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-[#374151] font-medium">
                Customer Name
              </Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
              />
            </div>

            {/* Second Column */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-[#374151] font-medium">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg border-[#E5E7EB]",
                      !formData.date && "text-[#9CA3AF]"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(newDate) => setFormData((prev) => ({ ...prev, date: newDate }))}
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Bill Number and Chalaan Number */}
            {/* Bill Number with Error */}
            <div className="space-y-2">
              <Label htmlFor="billNumber" className="text-[#374151] font-medium">
                Bill Number
              </Label>
              <Input
                id="billNumber"
                name="billNumber"
                value={formData.billNumber}
                onChange={handleInputChange}
                required
                className={cn(
                  "rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400",
                  errors.billNumber && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.billNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.billNumber}</p>
              )}
            </div>

            {/* Chalaan Number with Error */}
            <div className="space-y-2">
              <Label htmlFor="chalaanNumber" className="text-[#374151] font-medium">
                Chalaan Number
              </Label>
              <Input
                id="chalaanNumber"
                name="chalaanNumber"
                value={formData.chalaanNumber}
                onChange={handleInputChange}
                required
                className={cn(
                  "rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400",
                  errors.chalaanNumber && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.chalaanNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.chalaanNumber}</p>
              )}
            </div>

          </div>

          {/* Dynamic Fields Grid */}
          <div className="grid grid-cols-2 gap-4">
            {["labourerName", "materialType", "squareFoot", "ratePerSqft"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-[#374151] font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={field}
                    name={field}
                    type={field === "squareFoot" || field === "ratePerSqft" ? "number" : "text"}
                    value={currentInputs[field as keyof typeof currentInputs]}
                    onChange={handleInputChange}
                    className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddItem(field as keyof typeof currentInputs)}
                    className="px-3 bg-slate-800"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData[field as keyof Bill].map((item: string | number, index: number) => (
                    <span
                      key={index}
                      className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(field as keyof Bill, index)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="w-full">
            <Label htmlFor="total" className="text-[#374151] font-medium">
              Total
            </Label>
            <Input
              id="total"
              name="total"
              value={formData.total}
              onChange={handleInputChange}
              required
              className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-gray-950 text-white rounded-lg mt-6"
          >
            Submit Bill
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}