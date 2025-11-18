import { Metadata } from "next";

import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import type { PageParams } from "@/types/next";

export const metadata: Metadata = {
	title: "Conditions générales d'utilisation",
};

export default async function RoutePage(props: PageParams) {
	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Terms of Service</LayoutTitle>
				<LayoutDescription>
					Please read the following terms of service carefully before
					using our platform.
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent>
				Conditions Générales d’Utilisation — LSTracker Date d’entrée en
				vigueur : 02/11/2025 1. Parties Les présentes Conditions
				Générales d’Utilisation (les « CGU ») régissent l’accès et
				l’utilisation du site LSTracker (le « Service »), exploité par
				ADDevelopment (« nous », « notre », « LSTracker »). En utilisant
				le Service, vous acceptez ces CGU. 2. Définitions Utilisateur :
				toute personne visitant ou utilisant le Service. Contenu
				utilisateur : textes, commentaires, marqueurs, rapports
				d’emplacement, images ou autres données fournis par
				l’Utilisateur. Bot / Application Discord : le robot Discord
				associé à LSTracker (le « Bot »). 3. Accès et inscription
				L’accès au Service peut nécessiter la création d’un compte. Vous
				vous engagez à fournir des informations exactes et à garder vos
				identifiants confidentiels. Vous êtes responsable de toute
				activité réalisée depuis votre compte. 4. Objet du Service
				LSTracker fournit une carte interactive et des fonctionnalités
				associées pour l’univers GTA (mod, serveur ou usage
				communautaire). Le Service n’est pas affilié à Rockstar Games,
				Take-Two Interactive, ou Discord sauf indication contraire. 5.
				Utilisation autorisée et interdite Vous acceptez : d’utiliser le
				Service conformément à la loi et aux présentes CGU ; de ne pas
				publier de contenu illégal, diffamatoire, discriminatoire,
				pornographique ou violant des droits d’un tiers. Est interdit
				(liste non exhaustive) : contourner les protections techniques,
				exploiter des failles ou tenter d’accéder sans autorisation ;
				harceler, menacer ou attaquer d’autres utilisateurs ; utiliser
				des outils automatisés non autorisés pour scrapper massivement
				le Service. 6. Contenu utilisateur Vous conservez la propriété
				de votre Contenu utilisateur mais nous accordez une licence
				mondiale, non-exclusive, gratuite pour héberger, reproduire et
				afficher ce contenu dans le cadre du Service. Nous pouvons
				modérer, supprimer ou refuser tout Contenu utilisateur violant
				ces CGU. 7. Bot Discord et vérification Le Bot peut demander des
				autorisations (scopes OAuth2) pour fonctionner (ex. lecture
				d’identifiant, gestion de messages selon les fonctionnalités).
				Pour des raisons de sécurité et conformité, le Bot pourra être
				soumis au processus de vérification Discord. En utilisant le
				Bot, vous acceptez que : Discord puisse exiger des informations
				et que nous fournissions ce qui est nécessaire à la vérification
				; certaines données basiques d’identification Discord (ex. User
				ID, pseudo, serveur) soient traitées pour fournir les
				fonctionnalités. 8. Propriété intellectuelle Tous les éléments
				du site (design, logos, code, bases de données) sont notre
				propriété ou licenciés. Vous ne pouvez pas reproduire,
				distribuer ou exploiter ces éléments sans autorisation écrite.
				9. Exonération et limitation de responsabilité Le Service est
				fourni « tel quel ». Nous ne garantissons pas l’exactitude,
				l’exhaustivité ou la disponibilité continue. Nous ne serons pas
				responsables des dommages indirects, pertes de données ou
				interruptions de service sauf disposition légale impérative. 10.
				Suspension / Résiliation Nous pouvons suspendre ou résilier
				l’accès en cas de violation des CGU, d’abus, ou pour
				maintenance. Vous pouvez supprimer votre compte à tout moment
				via [lien ou procédure]. 11. Modifications des CGU Nous pouvons
				modifier ces CGU ; la date d’entrée en vigueur sera mise à jour.
				La poursuite de l’utilisation vaut acceptation des
				modifications.
			</LayoutContent>
		</Layout>
	);
}
