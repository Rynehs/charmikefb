import Label from "../Label";

export default function FormField({

  label,

  required,

  children,

  error,

}) {

  return (

    <div className="space-y-2">

      <Label required={required}>

        {label}

      </Label>

      {children}

      {error && (

        <p className="text-sm text-red-500">

          {error}

        </p>

      )}

    </div>

  );

}