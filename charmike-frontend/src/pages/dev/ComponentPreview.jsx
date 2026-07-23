import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";

export default function ComponentPreview() {
  return (
    <div className="min-h-screen bg-[#F5F7F9] p-10">

      <h1 className="text-3xl font-bold mb-8">
        Charmike UI Components
      </h1>

      <Card className="space-y-6">

        <div className="flex gap-4 flex-wrap">

          <Button>
            Primary
          </Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="ghost">
            Ghost
          </Button>

          <Button variant="danger">
            Danger
          </Button>

          <Button loading>
            Loading
          </Button>

        </div>

        <div className="flex gap-3">

          <Badge status="pending" />
          <Badge status="approved" />
          <Badge status="rejected" />
          <Badge status="active" />
          <Badge status="completed" />

        </div>

        <Spinner />

      </Card>

    </div>
  );
}