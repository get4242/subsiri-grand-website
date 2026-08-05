import { ContactActions } from "@/components/ContactActions";

export function ContactDock() {
  return <aside className="contact-dock" aria-label="ช่องทางติดต่อด่วน"><ContactActions variant="dock" phoneLabel="โทร"/></aside>;
}
