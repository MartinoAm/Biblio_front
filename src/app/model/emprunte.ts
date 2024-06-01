import { Livres } from "./livres";
import { Membres } from "./membres";

export interface Empruntes {
    id: string;
    membres: Membres;
    livres: Livres;
    debut: string;
    retour: string
}