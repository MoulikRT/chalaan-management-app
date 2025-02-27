import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Pencil, X } from "lucide-react";
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
import { Trash2 } from "lucide-react";
import parseDateString from "@/lib/date";

export function EditBillForm({
  onSubmit,
  onDelete,
  bills,
  billToEdit,
}: // setSearchTerm,
{
  onSubmit: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
  bills: Bill[];
  billToEdit: Bill;
  // setSearchTerm: (term: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [currentInputs, setCurrentInputs] = useState({
    labourerName: "",
    materialType: "",
    squareFoot: "",
    ratePerSqft: "",
    chalaanNumbers: "",
    date: "",
  });
  const [formData, setFormData] = useState<Bill>(billToEdit);

  const [errors, setErrors] = useState({
    billNumber: "",
    chalaanNumbers: "",
    date: "",
  });

  useEffect(() => {
    setFormData(billToEdit);
  }, [billToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "billNumber" || name === "chalaanNumbers" || name === "date") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (["customerName", "billNumber", "total", "date"].includes(name)) {
      if (name === "date") {
        setCurrentInputs((prev) => ({
          ...prev,
          date: value,
        }));

        const dateValue = parseDateString(value);
        if (value && !isNaN(dateValue.getTime())) {
          setFormData((prev) => ({
            ...prev,
            date: dateValue,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            date: "Please enter a valid date (e.g., 1/1/2025)",
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value.trim(),
        }));
      }
      if (name === "billNumber") {
        if (
          bills.some(
            (bill) =>
              bill.billNumber === value.trim() &&
              bill.billNumber !== billToEdit.billNumber
          )
        ) {
          setErrors((prev) => ({
            ...prev,
            billNumber: `This bill number already exists at index ${
              bills.findIndex((bill) => bill.billNumber === value.trim()) + 1
            }.`,
          }));
        }
      }
      if (name === "chalaanNumbers") {
        if (
          bills.some((bill) =>
            bill.chalaanNumbers.some(
              (chalaanNumber) => chalaanNumber === value.trim()
            )
          )
        ) {
          setErrors((prev) => ({
            ...prev,
            chalaanNumbers: `This chalaan number already exists at index ${
              bills.findIndex((bill) =>
                bill.chalaanNumbers.some(
                  (chalaanNumber) => chalaanNumber === value.trim()
                )
              ) + 1
            }.`,
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
    // console.log(formData);

    const billNumberExists = bills.some(
      (bill) =>
        bill.billNumber === formData.billNumber &&
        bill.billNumber !== billToEdit.billNumber
    );
    // const chalaanNumberExists = bills.some(
    //   (bill) =>
    //     bill.chalaanNumber === formData.chalaanNumber &&
    //     bill.chalaanNumber !== billToEdit.chalaanNumber
    // );

    // Fucking monstrosity of a function
    const chalaanNumberExists = bills
      .flatMap((bill) => bill.chalaanNumbers)
      .some(
        (chalaanNumber) =>
          formData.chalaanNumbers.some(
            (formChalaanNumber) => chalaanNumber === formChalaanNumber
          ) &&
          !formData.chalaanNumbers.some((formChalaanNumber) =>
            billToEdit.chalaanNumbers.some(
              (currentBillChalaanNumber) =>
                currentBillChalaanNumber == formChalaanNumber
            )
          )
      );

    if (billNumberExists || chalaanNumberExists) {
      setErrors({
        billNumber: billNumberExists ? "This bill number already exists" : "",
        chalaanNumbers: chalaanNumberExists
          ? "This chalaan number already exists"
          : "",
        date: "",
      });
      return;
    }

    onSubmit(formData);
    setErrors({ billNumber: "", chalaanNumbers: "", date: "" });
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete(billToEdit);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] rounded-2xl border-[#E5E7EB] p-6">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-medium text-[#111827]">
              Edit Bill
            </DialogTitle>
          </div>
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
              <div className="flex gap-2">
                <Input
                  id="date"
                  name="date"
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={currentInputs.date}
                  onChange={handleInputChange}
                  className={cn(
                    "rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400",
                    errors.date && "border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "px-3 bg-slate-800 text-white hover:bg-slate-700",
                        !formData.date && "text-slate-200"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(newDate) => {
                        setFormData((prev) => ({ ...prev, date: newDate }));
                        setCurrentInputs((prev) => ({ ...prev, date: format(newDate!, "dd-MM-yyyy") }))
                        setErrors((prev) => ({
                          ...prev,
                          date: "",
                        }));
                        }
                      }
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">{errors.date}</p>
              )}
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
              </div>
              {errors.chalaanNumbers && (
              <p className="text-sm text-red-500 mt-1">
                {errors.chalaanNumbers}
              </p>
            )}
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
                    ].map((item: string | number, index: number) => (
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
          <div className="flex gap-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" /> Delete Bill
            </Button>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-gray-950 text-white rounded-lg"
            >
              Update Bill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

