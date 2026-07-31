import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RoleCard from "@/components/ui/RoleCard";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Submitting login...");
    console.log({ role, phone, password });

    setLoading(true);
    setError("");

    try {
      const result = await login(role, phone, password);

      console.log("Login result:", result);

      if (!result.success) {
        setError(result.message);
      } else {
        switch (result.user.role) {
          case "admin":
            navigate("/admin");
            break;

          case "agent":
            navigate("/agent");
            break;

          case "client":
            navigate("/client");
            break;

          default:
            setError("Unknown user role.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Charmike Investments
          </h1>

          <p className="mt-2 text-text-muted">
            Creating Value Together
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Welcome Back
          </h2>

          <p className="text-text-muted">
            Choose your portal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <RoleCard
            title="Admin"
            description="System administration"
            selected={role === "admin"}
            onClick={() => setRole("admin")}
          />

          <RoleCard
            title="Agent"
            description="Client management"
            selected={role === "agent"}
            onClick={() => setRole("agent")}
          />

          <RoleCard
            title="Client"
            description="Loan account"
            selected={role === "client"}
            onClick={() => setRole("client")}
          />
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <FormField
            label="Mobile Number"
            required
          >
            <Input
              value={phone}
              placeholder="0712345678"
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormField>

          <FormField
            label="Password"
            required
          >
            <PasswordInput
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}