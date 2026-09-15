import { MotionFooter } from "@/components/ui/motion-footer";

export function SiteFooter({ onReserveClick }: { onReserveClick: () => void }) {
  return <MotionFooter onReserveClick={onReserveClick} />;
}
