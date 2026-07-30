import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import useAuth from "@/hooks/useAuth";

export default function ApiTest() {
  const { login, logout, user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  async function handleLogin() {
    setLoading(true);

    const result = await login("admin", "0700000000", "password123");

    setResponse(result);
    setLoading(false);
  }

  function handleLogout() {
    logout();

    setResponse({
      success: true,
      message: "Logged out.",
    });
  }

  return (

    <div className="min-h-screen bg-background p-10">

      <div className="mx-auto max-w-5xl space-y-6">

        <h1 className="text-3xl font-bold">
          Developer API Console
        </h1>

        <Card className="space-y-4">

          <div className="flex gap-4">

            <Button
              onClick={handleLogin}
              loading={loading}
            >
              Login Test
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>

          </div>

        </Card>

        <Card>

          <h2 className="text-xl font-semibold mb-4">
            Session
          </h2>

          <p>

            <strong>Authenticated:</strong>{" "}

            {isAuthenticated ? "Yes" : "No"}

          </p>

          <p className="mt-4">

            <strong>User</strong>

          </p>

          <pre className="rounded-xl bg-gray-100 p-4 overflow-auto">

{JSON.stringify(user, null, 2) || "No User"}

          </pre>

        </Card>

        <Card>

          <h2 className="text-xl font-semibold mb-4">
            API Response
          </h2>

          <pre className="rounded-xl bg-gray-100 p-4 overflow-auto">

{JSON.stringify(response, null, 2)}

          </pre>

        </Card>

      </div>

    </div>

  );

}