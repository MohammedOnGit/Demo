// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";

// function CommonForm({
//   formControls,
//   formData,
//   setFormData,
//   onSubmit,
//   buttonText,
//   isBtnDisabled,
// }) {
//   const renderInputsByComponentType = (controlItem) => {
//     const value = formData[controlItem.name] || "";

//     switch (controlItem.componentType) {
//       case "input":
//         return (
//           <Input
//             name={controlItem.name}
//             placeholder={controlItem.placeholder}
//             id={controlItem.name}
//             type={controlItem.type}
//             value={value}
//             onChange={(e) =>
//               setFormData({ ...formData, [controlItem.name]: e.target.value })
//             }
//             required={controlItem.required}
//           />
//         );

//       case "select":
//         return (
//           <Select
//             onValueChange={(val) =>
//               setFormData({ ...formData, [controlItem.name]: val })
//             }
//             value={value}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder={controlItem.label} />
//             </SelectTrigger>
//             <SelectContent>
//               {controlItem.options?.map((optionItem) => (
//                 <SelectItem key={optionItem.id} value={optionItem.id}>
//                   {optionItem.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         );

//       case "textarea":
//         return (
//           <Textarea
//             name={controlItem.name}
//             placeholder={controlItem.placeholder}
//             id={controlItem.name}
//             value={value}
//             onChange={(e) =>
//               setFormData({ ...formData, [controlItem.name]: e.target.value })
//             }
//           />
//         );

//       default:
//         return (
//           <Input
//             name={controlItem.name}
//             placeholder={controlItem.placeholder}
//             id={controlItem.name}
//             type={controlItem.type}
//             value={value}
//             onChange={(e) =>
//               setFormData({ ...formData, [controlItem.name]: e.target.value })
//             }
//           />
//         );
//     }
//   };

//   return (
//     <form onSubmit={onSubmit}>
//       <div className="flex flex-col gap-3">
//         {formControls.map((controlItem) => (
//           <div className="grid w-full gap-1.5" key={controlItem.name}>
//             <Label className="mb-1">
//               {controlItem.label}
//               {controlItem.required ? (
//                 <span className="text-red-500 ml-1">*</span>
//               ) : (
//                 <span className="text-muted-foreground ml-1 text-sm">
//                   (optional)
//                 </span>
//               )}
//             </Label>

//             {renderInputsByComponentType(controlItem)}
//           </div>
//         ))}
//       </div>

//       <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
//         {buttonText || "Submit"}
//       </Button>
//     </form>
//   );
// }

// export default CommonForm;



import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  loading = false,
  fieldErrors = {},
}) {
  const renderInputsByComponentType = (controlItem) => {
    const value = formData[controlItem.name] || "";
    const error = fieldErrors[controlItem.name];
    const hasError = !!error;
    const helperText = controlItem.helperText;

    const baseInputClasses = hasError 
      ? "border-red-500 focus-visible:ring-red-500" 
      : "";

    switch (controlItem.componentType) {
      case "input":
        return (
          <div className="space-y-1">
            <Input
              name={controlItem.name}
              placeholder={controlItem.placeholder}
              id={controlItem.name}
              type={controlItem.type}
              value={value}
              onChange={(e) => {
                setFormData({ ...formData, [controlItem.name]: e.target.value });
                // Optional: clear error on change if parent provides onChange handler
                if (controlItem.onChange) {
                  controlItem.onChange(e);
                }
              }}
              required={controlItem.required}
              className={baseInputClasses}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${controlItem.name}-error` : helperText ? `${controlItem.name}-helper` : undefined}
            />
            {hasError && (
              <p id={`${controlItem.name}-error`} className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {!hasError && helperText && (
              <p id={`${controlItem.name}-helper`} className="text-xs text-muted-foreground mt-1">
                {helperText}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div className="space-y-1">
            <Select
              onValueChange={(val) => {
                setFormData({ ...formData, [controlItem.name]: val });
                if (controlItem.onChange) {
                  controlItem.onChange({ target: { value: val } });
                }
              }}
              value={value}
            >
              <SelectTrigger className={hasError ? "border-red-500" : "w-full"}>
                <SelectValue placeholder={controlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {controlItem.options?.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.id}>
                    {optionItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p id={`${controlItem.name}-error`} className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {!hasError && helperText && (
              <p id={`${controlItem.name}-helper`} className="text-xs text-muted-foreground mt-1">
                {helperText}
              </p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-1">
            <Textarea
              name={controlItem.name}
              placeholder={controlItem.placeholder}
              id={controlItem.name}
              value={value}
              onChange={(e) => {
                setFormData({ ...formData, [controlItem.name]: e.target.value });
                if (controlItem.onChange) {
                  controlItem.onChange(e);
                }
              }}
              className={baseInputClasses}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${controlItem.name}-error` : helperText ? `${controlItem.name}-helper` : undefined}
            />
            {hasError && (
              <p id={`${controlItem.name}-error`} className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {!hasError && helperText && (
              <p id={`${controlItem.name}-helper`} className="text-xs text-muted-foreground mt-1">
                {helperText}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <Input
              name={controlItem.name}
              placeholder={controlItem.placeholder}
              id={controlItem.name}
              type={controlItem.type}
              value={value}
              onChange={(e) => {
                setFormData({ ...formData, [controlItem.name]: e.target.value });
                if (controlItem.onChange) {
                  controlItem.onChange(e);
                }
              }}
              className={baseInputClasses}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${controlItem.name}-error` : helperText ? `${controlItem.name}-helper` : undefined}
            />
            {hasError && (
              <p id={`${controlItem.name}-error`} className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {!hasError && helperText && (
              <p id={`${controlItem.name}-helper`} className="text-xs text-muted-foreground mt-1">
                {helperText}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">
              {controlItem.label}
              {controlItem.required ? (
                <span className="text-red-500 ml-1">*</span>
              ) : (
                <span className="text-muted-foreground ml-1 text-sm">
                  (optional)
                </span>
              )}
            </Label>

            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>

      <Button 
        disabled={isBtnDisabled || loading} 
        type="submit" 
        className="mt-2 w-full"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing...
          </span>
        ) : (
          buttonText || "Submit"
        )}
      </Button>
    </form>
  );
}

export default CommonForm;