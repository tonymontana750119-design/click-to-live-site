import guiaMant from "@/assets/guias/mantenimiento-computadores.pdf.asset.json";
import guiaVhs from "@/assets/guias/digitalizacion-vhs.pdf.asset.json";
import guiaSonido from "@/assets/guias/sonido-profesional.pdf.asset.json";

export const GUIDES: Record<string, string> = {
  "mantenimiento-computadores": guiaMant.url,
  "digitalizacion-vhs": guiaVhs.url,
  "sonido-profesional": guiaSonido.url,
};
