import { Livres } from "./livres";
import { Membres } from "./membres";

export interface Historique {
    id: string;
    membres: Membres;
    livres: Livres;
    debut: string;
    retour: string
}