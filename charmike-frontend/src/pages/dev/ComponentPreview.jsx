import {
  Button,
  Card,
  Badge,
  Spinner,
} from "@/components/ui";

export default function ComponentPreview() {
  return (
    <div className="min-h-screen bg-background p-10">
      <Card className="space-y-6">

        <h1 className="text-2xl font-bold">
          UI Preview
        </h1>

        <div className="flex gap-3 flex-wrap">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </div>

        <div className="flex gap-3">
          <Badge status="approved" />
          <Badge status="pending" />
        </div>

        <Spinner />

      </Card>
    </div>
  );
}