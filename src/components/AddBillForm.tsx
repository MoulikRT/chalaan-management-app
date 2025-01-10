import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon } from "lucide-react";
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
import Bill from "@/app/bills.types";

export function AddBillForm({
  onSubmit,
  bills,
}: {
  onSubmit: (bill: any) => void;
  bills: Bill[];
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    customerName: "",
    billNumber: "",
    materialType: "",
    squareFoot: "",
    ratePerSqft: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(bills, formData);
    if (bills.some((bill) => bill.billNumber === formData.billNumber)) {
      alert("Bill with the same number already exists");
      return;
    }
    onSubmit({ ...formData, date });
    setFormData({
      customerName: "",
      billNumber: "",
      materialType: "",
      squareFoot: "",
      ratePerSqft: "",
    });
    setDate(undefined);
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
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-[#E5E7EB] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-[#111827]">
            Add New Bill
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
              required
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
                    !date && "text-[#9CA3AF]"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="rounded-xl"
                />
              </PopoverContent>
            </Popover>
          </div>
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
              className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="materialType"
              className="text-[#374151] font-medium"
            >
              Type of Material
            </Label>
            <Input
              id="materialType"
              name="materialType"
              value={formData.materialType}
              onChange={handleInputChange}
              required
              className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="squareFoot"
                className="text-[#374151] font-medium"
              >
                Square Foot
              </Label>
              <Input
                id="squareFoot"
                name="squareFoot"
                type="number"
                value={formData.squareFoot}
                onChange={handleInputChange}
                required
                className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="ratePerSqft"
                className="text-[#374151] font-medium"
              >
                Rate per Sq.ft
              </Label>
              <Input
                id="ratePerSqft"
                name="ratePerSqft"
                type="number"
                step="0.01"
                value={formData.ratePerSqft}
                onChange={handleInputChange}
                required
                className="rounded-lg border-[#E5E7EB] focus:border-slate-400 focus:ring-slate-400"
              />
            </div>
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
