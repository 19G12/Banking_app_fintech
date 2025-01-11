import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthFormSchema } from "@/lib/utils";
import { FieldPath } from "react-hook-form";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

interface CustomFormElement {
  label: string, 
  placeholder:string, 
  name: FieldPath<z.infer<ReturnType<typeof AuthFormSchema>>>, //To get all names dynamically
  type?: string,
  form: UseFormReturn<z.infer<ReturnType<typeof AuthFormSchema>>>
}

const CustomFormElement = ({form, label, placeholder="", name, type="text"}: CustomFormElement) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input 
                placeholder={placeholder} 
                className="input-class" 
                {...field}
                type={type}
                required
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomFormElement