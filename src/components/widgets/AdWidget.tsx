import AdBanner from "@/components/AdBanner";

interface AdWidgetProps {
  slot: string;
}

export default function AdWidget({ slot }: AdWidgetProps) {
  return (
    <div className="my-12">
      <AdBanner slot={slot} format="horizontal" className="h-[90px] md:h-[120px]" />
    </div>
  );
}
