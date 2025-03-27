import { Button } from "~/components/ui/button";

export default function ProductSidebar() {
  return (
    <div className="hidden space-y-6 md:block">
      <div>
        <h3 className="mb-2 text-sm font-medium">Categories</h3>
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            All Products
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            Necklaces
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            Earrings
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            Bracelets
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            Rings
          </Button>
        </div>
        <div>
          <h3 className="mb-2 font-medium">Price</h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              Under $500
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              $500 - $1000
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              $1000 - $2000
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              Over $2000
            </Button>
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-medium">Material</h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              Gold
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              Silver
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              Rose Gold
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
            >
              Platinum
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
