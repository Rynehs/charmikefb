import RoleCard from "@/components/ui/Rolecard";
import { useState } from "react";

export default function ComponentPreview() {

  const [role, setRole] = useState("admin");

  return (

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

  );

}