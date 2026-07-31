import { useState } from "react";

import RoleCard from "@/components/ui/RoleCard";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";

export default function ComponentPreview() {

  const [role, setRole] = useState("admin");

  return (

    <div className="space-y-10 p-10">

      {/* Role Cards */}

      <div className="grid gap-6 md:grid-cols-3">

        <RoleCard
          title="Administrator"
          description="Manage the entire lending system."
          selected={role === "admin"}
          onClick={() => setRole("admin")}
        />

        <RoleCard
          title="Agent"
          description="Register clients and manage loans."
          selected={role === "agent"}
          onClick={() => setRole("agent")}
        />

        <RoleCard
          title="Client"
          description="Access your account and loan information."
          selected={role === "client"}
          onClick={() => setRole("client")}
        />

      </div>

      {/* Login Fields */}

      <div className="max-w-md space-y-6">

        <FormField
          label="Phone Number"
          required
        >
          <Input
            placeholder="0712345678"
          />
        </FormField>

        <FormField
          label="Password"
          required
        >
          <PasswordInput
            placeholder="Enter password"
          />
        </FormField>

      </div>

    </div>

  );

}