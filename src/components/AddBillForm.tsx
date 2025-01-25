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
  setSearchTerm,
}: {
  onSubmit: (bill: Bill) => void;
  bills: Bill[];
  setSearchTerm: (term: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [currentInputs, setCurrentInputs] = useState({
    labourerName: "",
    materialType: "",
    squareFoot: "",
    ratePerSqft: "",
    chalaanNumbers: "",
  });
  const [formData, setFormData] = useState<Bill>({
    customerName: "",
    billNumber: "",
    chalaanNumbers: [],
    labourerName: [],
    date: undefined,
    materialType: [],
    squareFoot: [],
    ratePerSqft: [],
    total: undefined,
  });

  const [errors, setErrors] = useState({
    billNumber: "",
    chalaanNumbers: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "billNumber" || name === "chalaanNumbers") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (["customerName", "billNumber", "total"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value.trim(),
      }));

      // Validate as user types
      if (name === "billNumber") {
        if (bills.some((bill) => bill.billNumber === value.trim())) {
          setErrors((prev) => ({
            ...prev,
            billNumber: `This bill number already exists at index ${
              bills.findIndex((bill) => bill.billNumber === value.trim()) + 1
            }.`,
          }));
          setSearchTerm(value.trim());
        }
      }
    }
    else {
      setCurrentInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

  };

  const handleAddItem = (field: keyof typeof currentInputs) => {
    if (!currentInputs[field]) return;
    const prevItems = formData[field as keyof Bill] as
      | number[]
      | string[]
      | undefined;
      if (field === "chalaanNumbers") {
        if (formData.chalaanNumbers.includes(currentInputs["chalaanNumbers"].trim())) {
          setErrors((prev) => ({
            ...prev,
            chalaanNumbers: `This chalaan number "${currentInputs["chalaanNumbers"]}" already exists in current items.`,
          }));
          setSearchTerm(currentInputs["chalaanNumbers"].trim());
          return
        }
        if (
          bills.some((bill) =>
            bill.chalaanNumbers.some(
              (chalaanNumber) => {return chalaanNumber === currentInputs["chalaanNumbers"].trim()}
            )
          )
        ) {
          setErrors((prev) => ({
            ...prev,
            chalaanNumbers: `This chalaan number already exists at index ${
              bills.findIndex((bill) =>
                bill.chalaanNumbers.some(
                  (chalaanNumber) => chalaanNumber === currentInputs["chalaanNumbers"].trim()
                )
              ) + 1
            }.`,
          }));
          setSearchTerm(currentInputs["chalaanNumbers"].trim());
          return
        }
      } 
    if (prevItems) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prevItems, currentInputs[field]],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: [currentInputs[field]],
      }));
    }

    // console.log("currentInputs, formdata", currentInputs, formData);
  };

  const handleRemoveItem = (field: keyof Bill, index: number) => {
    const previousItems = formData[field] as number[] | string[] | undefined;
    if (!previousItems) return;
    setFormData((prev) => ({
      ...prev,
      [field]: previousItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    const billNumberExists = bills.some(
      (bill) => bill.billNumber === formData.billNumber
    );
    const chalaanNumberExists = bills
      .flatMap((bill) => bill.chalaanNumbers)
      .some((chalaanNumber) =>
        formData.chalaanNumbers.some(
          (formChalaanNumber) => chalaanNumber === formChalaanNumber
        )
      );

    if (billNumberExists || chalaanNumberExists) {
      setErrors({
        billNumber: billNumberExists ? "This bill number already exists" : "",
        chalaanNumbers: chalaanNumberExists
          ? "This chalaan number already exists"
          : "",
      });
      return;
    }

    onSubmit(formData);
    setFormData({
      customerName: "",
      billNumber: "",
      chalaanNumbers: [],
      date: undefined,
      labourerName: [],
      materialType: [],
      squareFoot: [],
      ratePerSqft: [],
      total: undefined,
    });
    setErrors({ billNumber: "", chalaanNumbers: "" });
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
            <div className="space-y-2">
              <Label
                htmlFor="customerName"
                className="text-[#374151] font-medium"
              >
                Customer Name
              </Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
              />
            </div>

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
                    {formData.date ? (
                      format(formData.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(newDate) =>
                      setFormData((prev) => ({ ...prev, date: newDate }))
                    }
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="billNumber"
                className="text-[#374151] font-medium"
              >
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
                  errors.billNumber &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.billNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.billNumber}</p>
              )}
            </div>

            {/* Chalaan Number with Error */}
            <div className="space-y-2">
              <Label
                htmlFor="chalaanNumbers"
                className="text-[#374151] font-medium"
              >
                Chalaan Number(s)
              </Label>
              <div className="flex gap-2">
                <Input
                  id={"chalaanNumbers"}
                  name={"chalaanNumbers"}
                  value={
                    currentInputs[
                      "chalaanNumbers" as keyof typeof currentInputs
                    ]
                  }
                  onChange={handleInputChange}
                  className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
                />
                <Button
                  type="button"
                  onClick={() =>
                    handleAddItem(
                      "chalaanNumbers" as keyof typeof currentInputs
                    )
                  }
                  className="px-3 bg-slate-800"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.chalaanNumbers?.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem("chalaanNumbers" as keyof Bill, index)
                      }
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              {errors.chalaanNumbers && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.chalaanNumbers}
                </p>
              )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["labourerName", "materialType", "squareFoot", "ratePerSqft"].map(
              (field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-[#374151] font-medium">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={field}
                      name={field}
                      value={currentInputs[field as keyof typeof currentInputs]}
                      onChange={handleInputChange}
                      className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        handleAddItem(field as keyof typeof currentInputs)
                      }
                      className="px-3 bg-slate-800"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData[
                      field as
                        | "labourerName"
                        | "materialType"
                        | "squareFoot"
                        | "ratePerSqft"
                    ]?.map((item: string | number, index: number) => (
                      <span
                        key={index}
                        className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(field as keyof Bill, index)
                          }
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="total" className="text-[#374151] font-medium">
              Total
            </Label>
            <Input
              id="total"
              name="total"
              value={formData.total}
              onChange={handleInputChange}
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
