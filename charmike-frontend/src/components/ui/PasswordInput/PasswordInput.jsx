import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Input from "../Input";

export default function PasswordInput(props) {

  const [show, setShow] = useState(false);

  return (

    <div className="relative">

      <Input
        {...props}
        type={show ? "text" : "password"}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >

        {show ? <EyeOff size={18}/> : <Eye size={18}/>}

      </button>

    </div>

  );

}