export default function Label({

  children,

  required = false,

}) {

  return (

    <label className="mb-2 block text-sm font-medium">

      {children}

      {required && (

        <span className="ml-1 text-red-500">*</span>

      )}

    </label>

  );

}