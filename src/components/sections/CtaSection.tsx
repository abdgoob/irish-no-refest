import { CtaScrollScene } from "@/components/sections/CtaScrollScene";

export function CtaSection({
  onConsultationOpen,
}: {
  onConsultationOpen: () => void;
}) {
  return <CtaScrollScene onConsultationOpen={onConsultationOpen} />;
}
