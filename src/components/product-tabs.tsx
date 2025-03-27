"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface ProductTabsProps {
  description: string;
  features: string[];
  specifications: Record<string, string>;
}

export default function ProductTabs({
  description,
  features,
  specifications,
}: ProductTabsProps) {
  return (
    <Tabs defaultValue="description">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="pt-4">
        <p className="text-muted-foreground">{description}</p>
      </TabsContent>
      <TabsContent value="features" className="pt-4">
        <ul className="text-muted-foreground list-disc space-y-1 pl-5">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="specifications" className="pt-4">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-1">
              <span className="font-medium">{key}</span>
              <span className="text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
