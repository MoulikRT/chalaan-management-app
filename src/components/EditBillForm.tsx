import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Bill from "@/app/bills.types";
import { PlusIcon } from "lucide-react";

interface EditBillFormProps {
  bill: Bill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bill: Bill) => void;
}

export function EditBillForm({ bill, open, onOpenChange, onSave }: EditBillFormProps) {
  const [formData, setFormData] = useState<Bill>(bill);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    if (["materialType", "squareFoot", "ratePerSqft"].includes(name)) {
      setFormData((prev) => {
        const newArray = [...prev[name]];
        newArray[index] = name === "materialType" ? value : Number(value);
        return { ...prev, [name]: newArray };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addNewItem = () => {
    setFormData((prev) => ({
      ...prev,
      materialType: [...prev.materialType, ""],
      squareFoot: [...prev.squareFoot, 0],
      ratePerSqft: [...prev.ratePerSqft, 0],
      total: [...prev.total, 0],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.materialType.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      materialType: prev.materialType.filter((_, i) => i !== index),
      squareFoot: prev.squareFoot.filter((_, i) => i !== index),
      ratePerSqft: prev.ratePerSqft.filter((_, i) => i !== index),
      total: prev.total.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] rounded-2xl border-[#E5E7EB] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-[#111827]">
            Edit Bill Items
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {formData.materialType.map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Item {index + 1}</span>
                {formData.materialType.length > 1 && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => removeItem(index)}
                    className="h-8 px-3"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`materialType-${index}`}>Material Type</Label>
                  <Input
                    id={`materialType-${index}`}
                    name="materialType"
                    value={formData.materialType[index]}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`squareFoot-${index}`}>Square Foot</Label>
                  <Input
                    id={`squareFoot-${index}`}
                    name="squareFoot"
                    type="number"
                    value={formData.squareFoot[index]}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`ratePerSqft-${index}`}>Rate per Sq.ft</Label>
                  <Input
                    id={`ratePerSqft-${index}`}
                    name="ratePerSqft"
                    type="number"
                    value={formData.ratePerSqft[index]}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Total</Label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
                    {(formData.squareFoot[index] * formData.ratePerSqft[index]).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addNewItem}
            className="w-full"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Another Item
          </Button>
          
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-gray-950 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
